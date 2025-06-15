from sqlalchemy.orm import Session
from ..models.post import Tag
from ..core.database import SessionLocal

def add_initial_tags():
    db = SessionLocal()
    try:
        initial_tags = [
            "w góry",
            "nad wodę",
            "regionalna kultura",
            "w niepogodę",
            "budżetowo",
            "z nocowankiem",
            "dzieciaczkowy raj"
        ]
        
        for tag_name in initial_tags:
            tag = Tag(name=tag_name)
            db.add(tag)
        
        db.commit()
        print("Initial tags added successfully!")
    except Exception as e:
        print(f"Error adding initial tags: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_initial_tags() 