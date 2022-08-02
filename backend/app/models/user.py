import uuid

from app.db.base_class import Base
from sqlalchemy import Boolean, Numeric, ForeignKey, Integer
from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy.orm import relationship


class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    address = Column(String)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    bank_id = Column(Integer, ForeignKey("bank.id"))
    account = relationship("Account", back_populates="user")
    bank = relationship("Bank", back_populates="user")
