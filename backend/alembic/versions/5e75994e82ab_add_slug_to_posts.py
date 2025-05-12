"""add_slug_to_posts

Revision ID: 5e75994e82ab
Revises: remove_slug_column
Create Date: 2024-03-21 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import re

# revision identifiers, used by Alembic.
revision: str = '5e75994e82ab'
down_revision: Union[str, None] = 'remove_slug_column'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

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

def upgrade() -> None:
    # Add slug column
    op.add_column('posts', sa.Column('slug', sa.String(), nullable=True))
    
    # Create index on slug
    op.create_index(op.f('ix_posts_slug'), 'posts', ['slug'], unique=True)
    
    # Get all posts
    connection = op.get_bind()
    posts = connection.execute(sa.text('SELECT id, title FROM posts')).fetchall()
    
    # Update each post with a slug
    for post in posts:
        slug = slugify(post.title)
        # Ensure uniqueness by adding a number if needed
        base_slug = slug
        counter = 1
        while connection.execute(
            sa.text('SELECT COUNT(*) FROM posts WHERE slug = :slug'),
            {'slug': slug}
        ).scalar() > 0:
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        connection.execute(
            sa.text('UPDATE posts SET slug = :slug WHERE id = :id'),
            {'slug': slug, 'id': post.id}
        )
    
    # Make slug column non-nullable after populating it
    op.alter_column('posts', 'slug',
               existing_type=sa.String(),
               nullable=False)

def downgrade() -> None:
    # Drop the index
    op.drop_index(op.f('ix_posts_slug'), table_name='posts')
    # Drop the column
    op.drop_column('posts', 'slug')
