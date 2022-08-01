from typing import List
from typing import Optional

from app.core.auth import get_current_user, get_current_active_admin
from app.models.users import User
from app.crud import transaction
from app.db.session import get_db
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from fastapi.templating import Jinja2Templates
from app import schemas, models, crud
from sqlalchemy.orm import Session

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.post("/create-Transaction/", response_model=schemas.ShowTransaction)
def create_Transaction(
        transactions: schemas.TransactionCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
):
    Transactions = crud.transaction.create(obj_in=transactions, db=db, owner_id=current_user.id)
    return Transactions


@router.get(
    "/me", response_model=List[schemas.ShowTransaction]
)
def read_Transaction( db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_user)):
    transactions = crud.transaction.red_transaction_by_owner(owner_id=current_user.id, db=db)
    if not transactions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction with this id {id} does not exist",
        )
    return transactions


@router.get(
    "/{id}", response_model=schemas.ShowTransaction
)  # if we keep just "{id}" . it would stat catching all routes
def read_Transaction(id: str, db: Session = Depends(get_db),
                     current_user=Depends(get_current_active_admin)):
    transactions = crud.transaction.get(id=id, db=db)
    if not transactions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction with this id {id} does not exist",
        )
    return transactions


@router.get("/", response_model=List[schemas.ShowTransaction])
def read_Transactions(db: Session = Depends(get_db),
                      current_user=Depends(get_current_active_admin)):
    transactions = crud.transaction.get_multi(db=db)
    return transactions
