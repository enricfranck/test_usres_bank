import os

from sqlalchemy.orm import Session

from app import crud
from app.schemas.users import UserCreate

MY_BANK = {"name": "BNI", "location": "France"}


def init_db(db: Session) -> None:
    bank = crud.bank.red_bank_by_name(db=db, name=MY_BANK['name'])
    if not bank:
        bank = crud.bank.create(db=db, obj_in=MY_BANK)
        if bank:
            user = crud.user.get_user_by_email(db=db, email=os.getenv("ADMIN_EMAIL"))
            if not user:
                user_in = UserCreate(
                    address="Admin",
                    first_name="Admin",
                    last_name="Admin",
                    email=os.getenv("ADMIN_EMAIL"),
                    password=os.getenv("ADMIN_PASSWORD"),
                    is_active=True,
                    is_admin=True,
                )
                user = crud.user.create_user(db=db, obj_in=user_in, bank_id=bank.id)  # noqa: F841
