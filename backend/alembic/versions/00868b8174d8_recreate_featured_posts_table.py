"""recreate featured_posts table

Revision ID: 00868b8174d8
Revises: 8935d67ce0e2
Create Date: 2025-06-08 13:42:47.876199

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '00868b8174d8'
down_revision: Union[str, None] = '8935d67ce0e2'
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
