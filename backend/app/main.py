from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.routers import posts, users, auth, featured_posts
import os

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create static directory if it doesn't exist
os.makedirs(settings.STATIC_DIR, exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory=settings.STATIC_DIR), name="static")

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["auth"])
app.include_router(users.router, prefix=settings.API_V1_STR, tags=["users"])
app.include_router(posts.router, prefix=settings.API_V1_STR, tags=["posts"])
app.include_router(featured_posts.router, prefix=settings.API_V1_STR, tags=["featured-posts"])

@app.get("/")
async def root():
    return {"message": "Welcome to Travel Blog API"} 