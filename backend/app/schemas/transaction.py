from datetime import date
from typing import Optional

from pydantic import BaseModel


# shared properties
class TransactionBase(BaseModel):
    debit: Optional[float] = None
    credit: Optional[float] = None
    description: Optional[str] = None


# this will be used to validate data while creating a Transaction
class TransactionCreate(TransactionBase):
    debit: Optional[str]
    credit: Optional[str]
    description: Optional[str]


class TransactionUpdate(BaseModel):
    debit: Optional[str]
    credit: Optional[str]
    description: Optional[str]


# this will be used to format the response to not have id,owner_id etc
class ShowTransaction(TransactionBase):
    id: Optional[str]
    debit: Optional[str]
    credit: Optional[str]
    date: Optional[date]
    description: Optional[str]
    owner_id: str

    class Config():  # to convert non dict obj to json
        orm_mode = True
