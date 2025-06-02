from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Union
import re

def slugify(text: str) -> str:
    # Convert to lowercase
    text = text.lower()
    # Replace spaces with hyphens
    text = text.replace(' ', '-')
    # Remove special characters
    text = re.sub(r'[^a-z0-9-]', '', text)
    # Remove multiple hyphens
    text = re.sub(r'-+', '-', text)
    # Remove leading and trailing hyphens
    text = text.strip('-')
    return text

class PostBase(BaseModel):
    title: str
    content: str
    destination: str

class PostCreate(PostBase):
    def generate_slug(self) -> str:
        return slugify(self.title)

class PostUpdate(PostBase):
    def generate_slug(self) -> str:
        return slugify(self.title)

class Post(PostBase):
    id: int
    slug: str
    author_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_featured: bool = False

    
    class Config:
        from_attributes = True 