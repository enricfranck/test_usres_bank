import numbers
from pydantic import BaseModel, EmailStr
from typing import Optional

from sqlalchemy import Numeric


class BankBase(BaseModel):
    name: Optional[str]
    location: Optional[str] 


class BankCreate(BankBase):
    name: str
    location: str


class BankUpdate(BaseModel):
    name: Optional[str]
    location: Optional[str]


class ShowBank(BankBase):
    name: str
    location: str
    id: int

    class Config:
        orm_mode = True
