import numbers
from datetime import datetime

from pydantic import BaseModel, EmailStr
from typing import Optional

from sqlalchemy import Numeric


class AccountBase(BaseModel):
    account_type: Optional[str]
    created_at: Optional[datetime]


class AccountCreate(AccountBase):
    account_type: str
    created_at: datetime


class AccountUpdate(BaseModel):
    account_type: Optional[str]


class ShowAccount(AccountBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
