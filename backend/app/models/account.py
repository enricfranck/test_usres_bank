import uuid

from app.db.base_class import Base
from sqlalchemy import Boolean, Numeric, Date, ForeignKey, Integer
from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy.orm import relationship


class Account(Base):
    id = Column(Integer, primary_key=True, index=True)
    account_type = Column(String, nullable=False)
    created_at = Column(Date)
    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship("User", back_populates="account")
    transaction = relationship("Transaction", back_populates="account")
