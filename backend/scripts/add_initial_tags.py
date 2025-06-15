from sqlalchemy.orm import Session
from app.models.post import Tag
from app.core.database import SessionLocal

def add_initial_tags():
    db = SessionLocal()
    try:
        new_tag = "dzieciaczkowy raj"
        
        # Check if tag already exists
        existing_tag = db.query(Tag).filter(Tag.name == new_tag).first()
        if not existing_tag:
            tag = Tag(name=new_tag)
            db.add(tag)
            db.commit()
            print(f"Tag '{new_tag}' added successfully!")
        else:
            print(f"Tag '{new_tag}' already exists.")
    except Exception as e:
        print(f"Error adding tag: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_initial_tags() 