import datetime
from typing import List

from fastapi import APIRouter, HTTPException
from fastapi import Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app import crud, schemas
from app.core.auth import get_current_active_admin
from app.db.session import get_db
from app.schemas.users import ShowUser

router = APIRouter()


@router.post("/{bank_id}", response_model=schemas.ShowUser, response_model_exclude_none=True)
async def user_create(
        bank_id: int,
        account_type: str,
        user_in: schemas.UserCreate,
        db=Depends(get_db),
        current_user=Depends(get_current_active_admin),
):
    """
    Create a new user
    """
    bank = crud.bank.red_bank_by_id(db=db, id=bank_id)
    if not bank:
        raise HTTPException(
            status_code=400,
            detail="Bank not found.",
        )
    user = crud.user.get_user_by_email(db=db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user_ = crud.user.create_user(db=db, obj_in=user_in, bank_id=bank.id)
    user = schemas.ShowUser(**jsonable_encoder(user_))
    print(jsonable_encoder(user_))
    account_in = schemas.AccountCreate(account_type=account_type, created_at=datetime.datetime.now())
    account = crud.account.create(db=db, obj_in=account_in, user_id=user_.id)
    user.account_id = account.id
    return user


@router.get("/", response_model=List[schemas.ShowUser], response_model_exclude_none=True, )
async def users_list(
        db=Depends(get_db),
        current_user=Depends(get_current_active_admin),
):
    """
    Get all users
    """
    users = crud.user.get_all_user(db=db)
    list_user = []
    for user in users:
        user = schemas.ShowUser(**jsonable_encoder(user))
        account = crud.account.read_account_by_user_id(db=db, user_id=user.id)
        if account:
            user.account_id = account.id
            list_user.append(user)
    return list_user


@router.get(
    "/{user_id}",
    response_model=schemas.ShowUser,
    response_model_exclude_none=True,
)
async def user_details(
        user_id: str,
        db=Depends(get_db),
        current_user=Depends(get_current_active_admin),
):
    """
    Get any user details
    """
    user = crud.user.get(db=db, id=user_id)
    return user


@router.put(
    "/{user_id}", response_model=schemas.ShowUser, response_model_exclude_none=True
)
async def user_edit(
        user_id: str,
        user_in: schemas.UserUpdate,
        db=Depends(get_db),
        current_user=Depends(get_current_active_admin)
):
    """
    Update existing user
    """
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=400,
            detail="User not found.",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=400,
            detail="Inactive user.",
        )
    user = crud.user.update(db=db, db_obj=user, obj_in=user_in)

    return user


@router.delete("/{user_id}", response_model=ShowUser)
def delete_user(
        user_id: str,
        db: Session = Depends(get_db),
        current_user=Depends(get_current_active_admin)
):
    """
    Delete the user
    :param user_id:
    :param db:
    :param current_user:
    :return: user
    """
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=400,
            detail="User not found.",
        )
    user_in = schemas.UserDelete(**{"is_active": False})
    user = crud.user.update(db=db, db_obj=user, obj_in=user_in)
    return user
