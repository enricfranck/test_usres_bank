import numbers
from pydantic import BaseModel, EmailStr
from typing import Optional

from sqlalchemy import Numeric


class UserBase(BaseModel):
    email: EmailStr
    account_number: str
    is_active: bool = True
    is_admin: bool = False
    first_name: str = ""
    last_name: str = ""


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
    first_name: Optional[str]
    last_name: Optional[str]
    id: Optional[str]

    class Config:
        orm_mode = True
