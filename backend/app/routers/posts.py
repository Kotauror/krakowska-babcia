from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.post import Post
from app.schemas.post import Post as PostSchema, PostCreate, PostUpdate

router = APIRouter()

def ensure_unique_slug(db: Session, slug: str, exclude_id: int = None) -> str:
    base_slug = slug
    counter = 1
    while True:
        query = db.query(Post).filter(Post.slug == slug)
        if exclude_id is not None:
            query = query.filter(Post.id != exclude_id)
        if not query.first():
            return slug
        slug = f"{base_slug}-{counter}"
        counter += 1

@router.get("/posts", response_model=List[PostSchema])
def list_posts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    posts = db.query(Post).offset(skip).limit(limit).all()
    return posts

@router.post("/posts", response_model=PostSchema, status_code=status.HTTP_201_CREATED)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db)
):
    slug = ensure_unique_slug(db, post.generate_slug())
    db_post = Post(
        title=post.title,
        slug=slug,
        content=post.content,
        author_id=1  # Hardcoded for now
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.get("/posts/{post_id_or_slug}", response_model=PostSchema)
def get_post(
    post_id_or_slug: str,
    db: Session = Depends(get_db)
):
    if post_id_or_slug.isdigit():
        post = db.query(Post).filter(Post.id == int(post_id_or_slug)).first()
        if post:
            return post
    post = db.query(Post).filter(Post.slug == post_id_or_slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.put("/posts/{post_id}", response_model=PostSchema)
def update_post(
    post_id: int,
    post: PostUpdate,
    db: Session = Depends(get_db)
):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    # Generate new slug if title has changed
    if post.title != db_post.title:
        slug = ensure_unique_slug(db, post.generate_slug(), exclude_id=post_id)
        db_post.slug = slug
    db_post.title = post.title
    db_post.content = post.content
    db.commit()
    db.refresh(db_post)
    return db_post

@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db)
):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(db_post)
    db.commit()
    return None 