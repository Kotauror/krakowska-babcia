"""recreate featured_posts table (final fix)

Revision ID: c253b5671a0b
Revises: c7a50cd3e22f
Create Date: 2025-06-08 14:19:07.175432

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c253b5671a0b'
down_revision: Union[str, None] = 'c7a50cd3e22f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'featured_posts',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('post_id', sa.Integer, sa.ForeignKey('posts.id'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('featured_posts')
