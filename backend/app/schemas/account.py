import numbers
from pydantic import BaseModel, EmailStr
from typing import Optional

from sqlalchemy import Numeric


class AccountBase(BaseModel):
    account_type: Optional[str]
    created_at: Optional[str]


class AccountCreate(AccountBase):
    account_type: str
    created_at: str


class AccountUpdate(BaseModel):
    pass


class ShowAccount(AccountBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
