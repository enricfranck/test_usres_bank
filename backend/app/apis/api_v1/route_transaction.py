from typing import List

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from fastapi.encoders import jsonable_encoder
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app import schemas, crud
from app.core.auth import get_current_user, get_current_active_admin
from app.db.session import get_db
from app.models.user import User

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.post("/", response_model=schemas.ShowTransaction)
def create_Transaction(
        transactions: schemas.TransactionCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
):
    user = crud.user.get_user_by_email(db=db, email=current_user.email)
    user = schemas.ShowUser(**jsonable_encoder(user))
    account = crud.account.read_account_by_user_id(db=db, user_id=user.id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"this user don't have account",
        )
    transactions = crud.transaction.create(obj_in=transactions, db=db, account_id=current_user.id)
    return transactions


@router.post("/{email}", response_model=schemas.ShowTransaction)
def create_Transaction(
        transactions: schemas.TransactionCreate,
        db: Session = Depends(get_db),
        email: str = "current",
        current_user: User = Depends(get_current_user),
):
    if email == "current":
        user = crud.user.get_user_by_email(db=db, email=current_user.email)
    else:
        user = crud.user.get_user_by_email(db=db, email=email)
    user = schemas.ShowUser(**jsonable_encoder(user))
    account = crud.account.read_account_by_user_id(db=db, user_id=user.id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"this user don't have account",
        )
    transactions = crud.transaction.create(obj_in=transactions, db=db, account_id=account.id)
    return transactions


@router.get(
    "/me", response_model=List[schemas.ShowTransaction]
)
def read_Transaction(db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_user)):
    user = crud.user.get_user_by_email(db=db, email=current_user.email)
    user = schemas.ShowUser(**jsonable_encoder(user))
    account = crud.account.read_account_by_user_id(db=db, user_id=user.id)
    transactions = []
    if account:
        transactions = crud.transaction.red_transaction_by_owner(account_id=account.id, db=db)
    return transactions


@router.get(
    "/balance", response_model=List[schemas.Balance]
)
def read_Transaction(db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_user)):
    user = crud.user.get_user_by_email(db=db, email=current_user.email)
    account = crud.account.read_account_by_user_id(db=db, user_id=user.id)
    transactions_ = []
    if account:
        transactions = crud.transaction.red_transaction_by_owner(account_id=account.id, db=db)
        for transaction in transactions:
            transaction = schemas.Balance(**jsonable_encoder(transaction))
            if transaction.transaction_type == "Deposit":
                transaction.debit = transaction.amount
            else:
                transaction.credit = transaction.amount
            transactions_.append(transaction)
    return transactions_


@router.get(
    "/{id}", response_model=schemas.TransactionDetails
)  # if we keep just "{id}" . it would stat catching all routes
def read_Transaction(id: str, db: Session = Depends(get_db),
                     current_user=Depends(get_current_active_admin)):
    transaction = crud.transaction.get(id=id, db=db)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction with this id {id} does not exist",
        )

    account = crud.account.get(db=db, id=transaction.account_id)
    if account:
        user = crud.user.get(db=db, id=account.user_id)

        transaction = schemas.TransactionDetails(**jsonable_encoder(transaction), user=jsonable_encoder(user))
    return transaction


@router.get("/", response_model=List[schemas.ShowTransaction])
def read_Transactions(db: Session = Depends(get_db),
                      current_user=Depends(get_current_active_admin)):
    transactions = crud.transaction.get_multi(db=db)
    return transactions
