from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


# shared properties
class TransactionBase(BaseModel):
    transaction_reference: Optional[str]
    transaction_type: Optional[str]
    amount: Optional[float]


# this will be used to validate data while creating a Transaction
class TransactionCreate(TransactionBase):
    transaction_reference: str
    transaction_type: str
    amount: float


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
