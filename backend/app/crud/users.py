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

    def create_user(self, obj_in: UserCreate, db: Session) -> User:
        hashed_password = get_password_hash(obj_in.password)
        db_user = User(
            id=str(uuid.uuid4()),
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            email=obj_in.email,
            is_active=obj_in.is_active,
            is_admin=obj_in.is_admin,
            hashed_password=hashed_password,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def get_user_by_email(self, email: str, db: Session):  # new
        user = db.query(User).filter(User.email == email).first()
        return user

    def update_user(
            self, db: Session, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)

        if "password" in update_data:
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password

        if "reset_password" in update_data:
            hashed_password = get_password_hash(update_data["reset_password"])
            del update_data["reset_password"]
            update_data["hashed_reset_password"] = hashed_password

        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def get_all_user(self, db: Session, skip: int = 0, limit: int = 100) -> List[ShowUser]:  # new
        user = db.query(User).offset(skip).limit(limit).all()
        return user


user = CRUDUsers(User)
