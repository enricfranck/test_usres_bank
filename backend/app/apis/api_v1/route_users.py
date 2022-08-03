import datetime
from typing import List

from fastapi import APIRouter, HTTPException
from fastapi import Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from starlette import status

from app import crud, schemas
from app.core.auth import get_current_active_admin, get_current_user
from app.db.session import get_db
from app.models import User
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
    account_in = schemas.AccountCreate(account_type=account_type, created_at=datetime.datetime.now())
    account = crud.account.create(db=db, obj_in=account_in, user_id=user_.id)
    user.account_id = account.id
    user.account_type = account.account_type
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
        if user.is_active:
            account = crud.account.read_account_by_user_id(db=db, user_id=user.id)
            if account:
                user.account_id = account.id
                user.account_type = account.account_type
                print(user)
                list_user.append(user)
    return list_user


@router.get("/user", response_model=List[schemas.UserLogin], response_model_exclude_none=True, )
async def users_list(
        db=Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    Get all for free
    """
    users = crud.user.get_all_user(db=db)
    list_user = []
    for user in users:
        user = schemas.ShowUser(**jsonable_encoder(user))
        if user.is_active and not user.is_admin and user.email != current_user.email:
            list_user.append(user)
    return list_user


@router.get("/{type_}", response_model=List[schemas.UserLogin], response_model_exclude_none=True, )
async def users_list(
        db=Depends(get_db),
        type_: str = "login",

):
    """
    Get all for free
    """
    users = crud.user.get_all_user(db=db)
    list_user = []
    if type_ == "login":
        for user in users:
            user = schemas.ShowUser(**jsonable_encoder(user))
            if user.is_active:
                list_user.append(user)
    return list_user

@router.get(
    "/get_by_id",
    response_model=schemas.ShowUser,
)
def user_details(
        id: int,
        db=Depends(get_db),
        current_user=Depends(get_current_active_admin),
):
    """
    Get any user details
    """
    user = crud.user.get_user_by_id(db=db, user_id=id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction with this id {id} does not exist",
        )
    if user.is_active:
        account = crud.account.read_account_by_user_id(db=db, user_id=user.id)
        user = schemas.ShowUser(**jsonable_encoder(user))
        if account:
            user.account_id = account.id
            user.account_type = account.account_type
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


@router.delete("/{user_id}", response_model=List[schemas.ShowUser])
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
    users = crud.user.get_all_user(db=db)
    list_user = []
    for user in users:
        user = schemas.ShowUser(**jsonable_encoder(user))
        if user.is_active:
            account = crud.account.read_account_by_user_id(db=db, user_id=user.id)
            if account:
                user.account_id = account.id
                list_user.append(user)
    return list_user
