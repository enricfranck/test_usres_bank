from sqlalchemy import Column, Integer, Float
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Transaction(Base):
    id = Column(Integer, primary_key=True, index=True)
    transaction_reference = Column(String, nullable=False)
    transaction_type = Column(String)
    amount = Column(Float, nullable=False)
    account_id = Column(Integer, ForeignKey("account.id"))
    account = relationship("Account", back_populates="transaction")
