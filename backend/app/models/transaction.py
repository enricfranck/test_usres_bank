import uuid

from sqlalchemy import Boolean, Float
from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class Transaction(Base):
    id = Column(String, primary_key=True, default=str(uuid.uuid4()))
    debit = Column(Float, nullable=False)
    credit = Column(String, nullable=False)
    date = Column(Date)
    description = Column(String, nullable=False)
    owner_id = Column(String, ForeignKey("user.id"))
    owner = relationship("User", back_populates="transaction")
