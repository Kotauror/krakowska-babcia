"""add zabawa to posttype enum

Revision ID: bd19058cba3b
Revises: 00868b8174d8
Create Date: 2025-06-08 14:03:37.601454

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'bd19058cba3b'
down_revision: Union[str, None] = '00868b8174d8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add 'zabawa' to the posttype enum
    op.execute("ALTER TYPE posttype ADD VALUE IF NOT EXISTS 'zabawa'")


def downgrade() -> None:
    # No downgrade for removing enum values in PostgreSQL
    pass
