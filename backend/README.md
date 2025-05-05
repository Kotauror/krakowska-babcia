# Travel Blog Backend

This is the backend API for the Travel Blog application, built with FastAPI and SQLAlchemy.

## Features

- User authentication and authorization
- Blog post management with markdown support
- Image upload and management
- RESTful API endpoints

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=sqlite:///./travel_blog.db
SECRET_KEY=your-secret-key-here
```

4. Initialize the database:
```bash
alembic upgrade head
```

5. Connect to the DB via terminal 
```bash
psql travel_blog
```

## Running the Application

To run the development server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

API documentation will be available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- POST `/api/v1/auth/token` - Get access token
- POST `/api/v1/auth/register` - Register new user

### Users
- GET `/api/v1/users/me` - Get current user
- PUT `/api/v1/users/me` - Update current user

### Posts
- GET `/api/v1/posts` - List all posts
- POST `/api/v1/posts` - Create new post
- GET `/api/v1/posts/{post_id}` - Get post details
- PUT `/api/v1/posts/{post_id}` - Update post
- DELETE `/api/v1/posts/{post_id}` - Delete post
- POST `/api/v1/posts/{post_id}/images` - Upload image to post 