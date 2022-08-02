import uuid
from datetime import datetime

from app.models import Bank
from app.schemas import BankCreate, BankUpdate
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase


class CRUDBanks(CRUDBase[Bank, BankCreate, BankUpdate]):
    """
    this class extends the CRUDBase for not create all action of the crud
    """
    def create(self, obj_in: BankCreate, db: Session):
        """
        Create Bank
        :param obj_in:
        :param db:
        :param owner_id:
        :return:
        """
        bank_object = Bank(**obj_in)
        db.add(bank_object)
        db.commit()
        db.refresh(bank_object)
        return bank_object

    def red_bank_by_name(self, name: str, db: Session):
        """
        read Bank by owner
        :param name:
        :param db:
        :return:
        """
        bank = db.query(Bank).filter(Bank.name == name).first()
        return bank

    def red_bank_by_id(self, id: int, db: Session):
        """
        read Bank by owner
        :param name:
        :param db:
        :return:
        """
        bank = db.query(Bank).filter(Bank.id == id).first()
        return bank

bank = CRUDBanks(Bank)
