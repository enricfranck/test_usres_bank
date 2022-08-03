from datetime import date, datetime
from typing import Optional
from .users import UserBase
from pydantic import BaseModel


# shared properties
class TransactionBase(BaseModel):
    transaction_reference: Optional[str]
    transaction_type: Optional[str]
    amount: Optional[float]


class Balance(BaseModel):
    transaction_reference: Optional[str]
    transaction_type: Optional[str]
    transaction_date: Optional[datetime]
    amount: Optional[float]
    id: Optional[int]
    debit: Optional[int]
    credit: Optional[int]

    class Config():  # to convert non dict obj to json
        orm_mode = True

# this will be used to validate data while creating a Transaction
class TransactionCreate(TransactionBase):
    transaction_reference: str
    transaction_type: str
    amount: float


class TransactionDetails(TransactionBase):
    transaction_date: datetime
    transaction_reference: str
    transaction_type: str
    amount: float
    account_id: int
    user: UserBase


class TransactionUpdate(BaseModel):
    pass


# this will be used to format the response to not have id,owner_id etc
class ShowTransaction(TransactionBase):
    id: int
    transaction_reference: Optional[str]
    transaction_type: str
    amount: float
    transaction_date: datetime
    account_id: int

    class Config():  # to convert non dict obj to json
        orm_mode = True
