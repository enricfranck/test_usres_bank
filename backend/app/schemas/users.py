from uuid import UUID

from pydantic import BaseModel, EmailStr
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr
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


class UserUpdate(BaseModel):
    email: Optional[EmailStr]
    is_admin: Optional[bool] = False
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = None

    class Config:
        orm_mode = True


class ShowUser(UserBase):
    id: Optional[str]

    class Config:
        orm_mode = True
