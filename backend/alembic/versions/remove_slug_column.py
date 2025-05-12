"""remove_slug_column

Revision ID: remove_slug_column
Revises: f75fe85495ed
Create Date: 2024-03-26 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'remove_slug_column'
down_revision: Union[str, None] = 'f75fe85495ed'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Drop the index first
    op.drop_index(op.f('ix_posts_slug'), table_name='posts')
    
    # Drop the column
    op.drop_column('posts', 'slug')

def downgrade() -> None:
    # Add slug column
    op.add_column('posts', sa.Column('slug', sa.String(), nullable=True))
    
    # Create index on slug column
    op.create_index(op.f('ix_posts_slug'), 'posts', ['slug'], unique=True) 