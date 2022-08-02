from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True
    is_admin: bool = False
    first_name: str = ""
    last_name: str = ""
    address: str


class UserCreate(UserBase):
    password: str


class UserDelete(BaseModel):
    is_active: bool = True

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    email: Optional[EmailStr]
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = None
    address: Optional[str] = None

    class Config:
        orm_mode = True


class ShowUser(UserBase):
    first_name: Optional[str]
    last_name: Optional[str]
    bank_id: int
    id: Optional[str]

    class Config:
        orm_mode = True
