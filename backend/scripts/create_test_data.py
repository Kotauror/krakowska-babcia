from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.security import get_password_hash
from app.models.user import User
from app.models.post import Post
from app.core.database import Base

# Create database connection
DATABASE_URL = "postgresql://justynazygmunt@localhost/travel_blog"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_test_data():
    db = SessionLocal()
    try:
        # Create test user
        test_user = User(
            email="zygmunt.justyna@gmail.com",
            username="justyna",
            full_name="Justyna Jurkowska",
            hashed_password=get_password_hash("testpassword123"),  # You'll need to change this password
            bio="Travel enthusiast and photographer, sharing stories from around the world.",
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)

        # Create test post
        test_post = Post(
            title="A Weekend in Kraków: Discovering the Royal City",
            content="""
# A Weekend in Kraków: Discovering the Royal City

Kraków, the former capital of Poland, is a city where history comes alive at every corner. From the majestic Wawel Castle to the charming streets of the Old Town, this city offers an unforgettable journey through time.

## The Heart of the Old Town

The Main Market Square (Rynek Główny) is the perfect starting point for any exploration of Kraków. As Europe's largest medieval town square, it's home to the iconic Cloth Hall (Sukiennice) and St. Mary's Basilica. The hourly trumpet call (hejnał) from the basilica's tower is a tradition that dates back to the 13th century.

## Wawel Castle: A Symbol of Polish Royalty

Perched on Wawel Hill, overlooking the Vistula River, Wawel Castle represents the height of Polish royal architecture. The castle's stunning Renaissance courtyard and the cathedral's golden dome are must-see attractions.

## Local Flavors

No visit to Kraków is complete without trying traditional Polish cuisine. From pierogi to żurek, the local restaurants around Kazimierz offer authentic flavors that have been preserved through generations.

## Hidden Gems

While the main attractions are impressive, don't forget to explore the quieter streets of Kazimierz, the historic Jewish quarter. Here, you'll find unique cafes, vintage shops, and beautiful synagogues that tell the story of Kraków's rich Jewish heritage.
            """,
            author_id=test_user.id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(test_post)
        db.commit()
        db.refresh(test_post)

        print("Test user and post created successfully!")
        print(f"User ID: {test_user.id}")
        print(f"Post ID: {test_post.id}")

    except Exception as e:
        print(f"Error creating test data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_data() 