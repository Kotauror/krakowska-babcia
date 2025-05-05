"""add_slug_to_posts

Revision ID: f75fe85495ed
Revises: create_featured_posts_table
Create Date: 2025-05-05 16:21:47.115223

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f75fe85495ed'
down_revision: Union[str, None] = 'create_featured_posts_table'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
