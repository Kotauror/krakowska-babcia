from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.models.user import User
from app.models.post import Post
from app.models.featured_post import FeaturedPost
from app.schemas.post import Post as PostSchema, PostCreate, PostUpdate
from pydantic import BaseModel

router = APIRouter()

class FeaturedPostUpdate(BaseModel):
    is_featured: bool

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
    posts = db.query(Post).options(joinedload(Post.featured_status)).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
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
        author_id=1,  # Hardcoded for now
        destination=post.destination
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.get("/posts/latest", response_model=PostSchema)
def get_latest_post(db: Session = Depends(get_db)):
      post = (
          db.query(Post)
          .order_by(Post.updated_at.desc())
          .options(joinedload(Post.featured_status))
          .first()
      )
      if not post:
          raise HTTPException(status_code=404, detail="No posts found")
      return post

@router.get("/posts/{post_id_or_slug}", response_model=PostSchema)
def get_post(
    post_id_or_slug: str,
    db: Session = Depends(get_db)
):
    query = db.query(Post).options(joinedload(Post.featured_status))
    if post_id_or_slug.isdigit():
        post = query.filter(Post.id == int(post_id_or_slug)).first()
        if post:
            return post
    post = query.filter(Post.slug == post_id_or_slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.put("/posts/{post_id}", response_model=PostSchema)
def update_post(
    post_id: int,
    post: PostUpdate,
    db: Session = Depends(get_db)
):
    db_post = db.query(Post).options(joinedload(Post.featured_status)).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    # Generate new slug if title has changed
    if post.title != db_post.title:
        slug = ensure_unique_slug(db, post.generate_slug(), exclude_id=post_id)
        db_post.slug = slug
    db_post.title = post.title
    db_post.content = post.content
    db_post.destination = post.destination
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


@router.post("/posts/{post_id}/feature", response_model=PostSchema)
def toggle_featured_post(
    post_id: int,
    update: FeaturedPostUpdate,
    db: Session = Depends(get_db)
):
    db_post = db.query(Post).options(joinedload(Post.featured_status)).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Get existing featured post entry if any
    featured_post = db.query(FeaturedPost).filter(
        FeaturedPost.post_id == post_id
    ).first()

    if update.is_featured:
        # Check if we already have 5 featured posts
        featured_count = db.query(FeaturedPost).count()
        if featured_count >= 5 and not featured_post:
            raise HTTPException(
                status_code=400,
                detail="Maximum number of featured posts (5) reached"
            )
        
        if not featured_post:
            # Create new featured post entry
            featured_post = FeaturedPost(
                post_id=post_id
            )
            db.add(featured_post)
    else:
        # Remove the featured post entry if it exists
        if featured_post:
            db.delete(featured_post)

    db.commit()
    db.refresh(db_post)
    return db_post 