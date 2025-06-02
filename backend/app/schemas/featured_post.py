from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .post import Post

class FeaturedPostBase(BaseModel):
    post_id: int
    is_active: bool = True

class FeaturedPostCreate(FeaturedPostBase):
    pass

class FeaturedPost(FeaturedPostBase):
    id: int
    created_at: datetime
    post: Post

    class Config:
        from_attributes = True 