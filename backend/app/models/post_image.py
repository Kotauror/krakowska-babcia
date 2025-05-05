from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class PostImage(Base):
    __tablename__ = "post_images"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    alt_text = Column(String(255))  # Alt text for accessibility
    caption = Column(String(512))   # Optional caption
    image_metadata = Column(JSON)  # Store image dimensions, format, etc.
    post_id = Column(Integer, ForeignKey("posts.id"))
    
    # Relationships
    post = relationship("Post", back_populates="images") 