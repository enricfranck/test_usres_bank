import uuid
from datetime import datetime

from app.models import Account
from app.schemas import AccountCreate, AccountUpdate
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase


class CRUDAccounts(CRUDBase[Account, AccountCreate, AccountUpdate]):
    """
    this class extends the CRUDBase for not create all action of the crud
    """

    def create(self, obj_in: AccountCreate, db: Session, user_id: int):
        """
        Create Account
        :param obj_in:
        :param db:
        :param owner_id:
        :return:
        """
        account_object = Account(**obj_in.dict(), user_id=user_id)
        db.add(account_object)
        db.commit()
        db.refresh(account_object)
        return account_object

    def read_account_by_user_id(self, user_id: int, db: Session):
        """
        read Account by owner
        :param user_id:
        :param db:
        :return:
        """
        account = db.query(Account).filter(Account.user_id == user_id).first()
        return account


account = CRUDAccounts(Account)
