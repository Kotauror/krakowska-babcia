import os
import shutil
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Response
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.models.post import Post
from app.models.post_image import PostImage
from app.schemas.post import Post as PostSchema, PostCreate, PostUpdate, PostImage as PostImageSchema
from PIL import Image
from datetime import datetime
import uuid
import base64

router = APIRouter()

@router.get("/images/{image_id}")
async def get_image(
    image_id: int,
    db: Session = Depends(get_db)
):
    """
    Get an image by ID.
    """
    db_image = db.query(PostImage).filter(PostImage.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Decode the base64 image data
    image_data = base64.b64decode(db_image.file_path)
    
    # Return the image with the correct content type
    return Response(
        content=image_data,
        media_type=db_image.image_metadata.get("content_type", "image/jpeg")
    )

def process_image(file_path: str) -> dict:
    """Extract metadata from uploaded image."""
    with Image.open(file_path) as img:
        return {
            "width": img.width,
            "height": img.height,
            "format": img.format,
            "mode": img.mode
        }

@router.get("/posts", response_model=List[PostSchema])
def list_posts(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    posts = db.query(Post).offset(skip).limit(limit).all()
    
    # Convert string URLs to dictionaries in content_images
    for post in posts:
        if isinstance(post.content_images, list):
            post.content_images = [
                {"url": img} if isinstance(img, str) else img
                for img in post.content_images
            ]
    
    return posts

@router.post("/posts", response_model=PostSchema)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db)
):
    # Create post with empty content_images list
    db_post = Post(
        **post.model_dump(),
        author_id=1,  # Hardcode author_id for now
        content_images=[]
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.get("/posts/{post_id}", response_model=PostSchema)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.put("/posts/{post_id}", response_model=PostSchema)
def update_post(
    post_id: int,
    post_update: PostUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_data = post_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(post, field, value)
    
    db.commit()
    db.refresh(post)
    return post

@router.delete("/posts/{post_id}")
def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Delete associated images from filesystem
    for image in post.images:
        if os.path.exists(image.file_path):
            os.remove(image.file_path)
    
    db.delete(post)
    db.commit()
    return {"message": "Post deleted"}

@router.post("/posts/{post_id}/images", response_model=PostImageSchema)
async def upload_post_image(
    post_id: int,
    file: UploadFile = File(...),
    alt_text: str = None,
    caption: str = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Create uploads directory if it doesn't exist
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    # Save file
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Process image metadata
    metadata = process_image(file_path)
    
    # Create image record
    db_image = PostImage(
        filename=file.filename,
        file_path=file_path,
        alt_text=alt_text,
        caption=caption,
        image_metadata=metadata,
        post_id=post_id
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    
    # Add image reference to post's content_images
    image_ref = {
        "id": db_image.id,
        "filename": db_image.filename,
        "alt_text": db_image.alt_text,
        "caption": db_image.caption
    }
    if not post.content_images:
        post.content_images = []
    post.content_images.append(image_ref)
    db.commit()
    
    return db_image

@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload an image for a post.
    """
    try:
        # Read the file content
        contents = await file.read()
        
        # Create a new PostImage record
        db_image = PostImage(
            filename=file.filename,
            file_path=file.content_type,  # Store the content type
            image_metadata={
                "content_type": file.content_type,
                "size": len(contents)
            }
        )
        db.add(db_image)
        db.commit()
        db.refresh(db_image)
        
        # Store the image data in the database
        # Note: In a real application, you might want to use a blob column or a separate table for the actual image data
        # For now, we'll store it as base64 in the file_path field
        encoded_image = base64.b64encode(contents).decode('utf-8')
        db_image.file_path = encoded_image
        db.commit()
        
        # Return the image ID and metadata
        return {
            "id": db_image.id,
            "filename": db_image.filename,
            "content_type": file.content_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save image: {str(e)}") 