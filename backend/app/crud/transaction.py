import uuid
from datetime import datetime

from app.models import Transaction
from app.schemas import TransactionCreate, TransactionUpdate
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase


class CRUDTransactions(CRUDBase[Transaction, TransactionCreate, TransactionUpdate]):
    """
    this class extends the CRUDBase for not create all action of the crud
    """
    def create(self, obj_in: TransactionCreate, db: Session, account_id: int):
        """
        Create transaction
        :param obj_in:
        :param db:
        :param owner_id:
        :return:
        """
        transaction_object = Transaction(**obj_in.dict(), account_id=account_id, transaction_date=datetime.now())
        db.add(transaction_object)
        db.commit()
        db.refresh(transaction_object)
        return transaction_object

    def red_transaction_by_owner(self, account_id: str, db: Session):
        """
        read transaction by owner
        :param account_id:
        :param db:
        :return:
        """
        item = db.query(Transaction).filter(Transaction.account_id == account_id).all()
        return item

    def list_transactions(self, db: Session):
        """
        get all list of the transaction
        :param db:
        :return:
        """
        Transactions = db.query(Transaction).all()
        return Transactions


transaction = CRUDTransactions(Transaction)
