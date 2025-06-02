"""recreate featured_posts table

Revision ID: 1a31d7abbe68
Revises: fcbe67281d01
Create Date: 2025-06-02 11:48:59.927689

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1a31d7abbe68'
down_revision: Union[str, None] = 'fcbe67281d01'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'featured_posts',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('post_id', sa.Integer(), sa.ForeignKey('posts.id'), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('featured_posts')
