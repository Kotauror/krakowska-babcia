from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.models.post import Post
from app.schemas.post import Post as PostSchema, PostCreate, PostUpdate

router = APIRouter()

@router.get("/posts", response_model=List[PostSchema])
def list_posts(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    posts = db.query(Post).offset(skip).limit(limit).all()
    return posts

@router.post("/posts", response_model=PostSchema)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db)
):
    db_post = Post(
        **post.model_dump(),
        author_id=1  # Hardcode author_id for now
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
    
    db.delete(post)
    db.commit()
    return {"message": "Post deleted"} 