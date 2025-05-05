"""create featured posts table

Revision ID: create_featured_posts_table
Revises: 3d578483e183
Create Date: 2024-03-19

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'create_featured_posts_table'
down_revision = '3d578483e183'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'featured_posts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('post_id', sa.Integer(), nullable=False),
        sa.Column('featured_at', sa.DateTime(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_featured_posts_id'), 'featured_posts', ['id'], unique=False)

def downgrade():
    op.drop_index(op.f('ix_featured_posts_id'), table_name='featured_posts')
    op.drop_table('featured_posts') 