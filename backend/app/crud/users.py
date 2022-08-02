import os
import uuid
from typing import List, Union, Dict, Any

from fastapi.encoders import jsonable_encoder

from app.core.security import get_password_hash
from app.models import User
from app.schemas import UserCreate, ShowUser, UserUpdate
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase


class CRUDUsers(CRUDBase[User, UserCreate, UserUpdate]):
    """
    this class extends the CRUDBase for not create all action of the crud
    """
    def create_user(self, obj_in: UserCreate, db: Session, bank_id: int) -> User:
        """
        create User
        :param obj_in:
        :param db:
        :return:
        """
        hashed_password = get_password_hash(obj_in.password)
        db_user = User(
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            email=obj_in.email,
            is_active=obj_in.is_active,
            is_admin=obj_in.is_admin,
            address=obj_in.address,
            hashed_password=hashed_password,
            bank_id=bank_id,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def get_user_by_email(self, email: str, db: Session):
        """
        Read user by email
        :param email:
        :param db:
        :return:
        """
        user = db.query(User).filter(User.email == email).first()
        return user

    def update_user(
            self, db: Session, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        """
        Update user
        :param db:
        :param db_obj:
        :param obj_in:
        :return:
        """
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)

        # if the admin update the password
        if "password" in update_data:
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password

        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def get_all_user(self, db: Session, skip: int = 0, limit: int = 100) -> List[ShowUser]:
        """
        Read all users, from skip with limit user
        :param db:
        :param skip:
        :param limit:
        :return:
        """
        user = db.query(User).offset(skip).limit(limit).all()
        return user


user = CRUDUsers(User)
