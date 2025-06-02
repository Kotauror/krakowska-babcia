"""recreate featured posts table

Revision ID: recreate_featured_posts
Revises: 5e75994e82ab
Create Date: 2024-03-21

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime

# revision identifiers, used by Alembic.
revision = 'recreate_featured_posts'
down_revision = '5e75994e82ab'
branch_labels = None
depends_on = None

def upgrade():
    # Drop existing table if it exists
    op.drop_table('featured_posts')
    
    # Create new table with correct schema
    op.create_table(
        'featured_posts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('post_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_featured_posts_id'), 'featured_posts', ['id'], unique=False)

def downgrade():
    op.drop_index(op.f('ix_featured_posts_id'), table_name='featured_posts')
    op.drop_table('featured_posts') 