from pydantic import BaseModel
import typing as t
from typing import Optional


class UserBase(BaseModel):
    email: str
    is_active: bool = True
    is_admin: bool = False
    first_name: str = None
    last_name: str = None


class UserOut(UserBase):
    pass


class UserCreate(UserBase):
    password: str

    class Config:
        orm_mode = True


class UserUpdate(UserBase):
    password: t.Optional[str] = None

    class Config:
        orm_mode = True


class ShowUser(UserBase):
    id: Optional[str]

    class Config:
        orm_mode = True
