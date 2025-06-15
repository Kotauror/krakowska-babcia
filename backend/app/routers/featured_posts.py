from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.models.post import Post
from app.models.featured_post import FeaturedPost
from app.schemas.featured_post import FeaturedPost as FeaturedPostSchema, FeaturedPostCreate

import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/featured-posts", response_model=List[FeaturedPostSchema])
def list_featured_posts(
    db: Session = Depends(get_db)
):
    """List all featured posts"""
    logger.info("Fetching all featured posts")
    featured_posts = (
        db.query(FeaturedPost)
        .options(joinedload(FeaturedPost.post))
        .all()
    )
    return featured_posts 

@router.post("/featured-posts", response_model=FeaturedPostSchema)
def create_featured_post(
    featured_post: FeaturedPostCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new featured post (admin only)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    logger.info(f"Creating featured post for post_id: {featured_post.post_id} by user: {current_user.username}")
    
    # Check if post exists
    post = db.query(Post).filter(Post.id == featured_post.post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Check if post is already featured
    existing = db.query(FeaturedPost).filter(
        FeaturedPost.post_id == featured_post.post_id,
        FeaturedPost.is_active == True
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Post is already featured")
    
    db_featured_post = FeaturedPost(**featured_post.dict())
    db.add(db_featured_post)
    db.commit()
    db.refresh(db_featured_post)
    return db_featured_post

@router.delete("/featured-posts/{featured_post_id}")
def remove_featured_post(
    featured_post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Remove a post from featured (admin only)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    featured_post = db.query(FeaturedPost).filter(FeaturedPost.id == featured_post_id).first()
    if not featured_post:
        raise HTTPException(status_code=404, detail="Featured post not found")
    
    featured_post.is_active = False
    db.commit()
    return {"message": "Post removed from featured"} 