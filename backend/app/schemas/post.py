from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict
from .user import UserBase

class PostImageBase(BaseModel):
    filename: str
    file_path: str
    alt_text: Optional[str] = None
    caption: Optional[str] = None
    metadata: Optional[Dict] = None

class PostImageCreate(PostImageBase):
    pass

class PostImage(PostImageBase):
    id: int
    post_id: int

    class Config:
        from_attributes = True

class PostBase(BaseModel):
    title: str
    content: str  # Markdown content with image references

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: int
    created_at: datetime
    updated_at: datetime
    author_id: int
    author: UserBase
    images: List[PostImage] = []
    content_images: List[Dict] = []  # List of image references in content

    class Config:
        from_attributes = True

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    content_images: Optional[List[Dict]] = None 