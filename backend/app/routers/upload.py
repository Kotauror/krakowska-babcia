from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import cloudinary
import cloudinary.uploader
from ..core.config import settings
from ..core.database import get_db

router = APIRouter()

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload an image to Cloudinary.
    """
    try:
        # Read the file content
        contents = await file.read()
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            contents,
            upload_preset=settings.CLOUDINARY_UPLOAD_PRESET,
            resource_type="image",
            use_filename=True,
            unique_filename=True
        )
        
        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
            "filename": file.filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not upload image: {str(e)}") 