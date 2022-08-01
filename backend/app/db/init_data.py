import os

from sqlalchemy.orm import Session

from app import crud
from app.schemas.users import UserCreate


def init_db(db: Session) -> None:

    user = crud.user.get_user_by_email(db=db, email=os.getenv("ADMIN_EMAIL"))
    if not user:
        user_in = UserCreate(
            username=os.getenv("ADMIN_EMAIL"),
            email=os.getenv("ADMIN_EMAIL"),
            password=os.getenv("ADMIN_PASSWORD"),
            is_active=True,
            is_admin=True
        )
        user = crud.user.create_user(db=db, obj_in=user_in)  # noqa: F841
