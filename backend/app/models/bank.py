import uuid

from app.db.base_class import Base
from sqlalchemy import Boolean, Numeric, Integer
from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy.orm import relationship


class Bank(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    location = Column(String)
    user = relationship("User", back_populates="bank")
