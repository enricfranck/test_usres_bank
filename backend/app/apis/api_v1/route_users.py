from typing import List

from fastapi import APIRouter, HTTPException
from fastapi import Depends, Response
from sqlalchemy.orm import Session

from app import crud, schemas
from app.db.session import get_db
from app.schemas.users import ShowUser

router = APIRouter()


@router.post("/", response_model=schemas.ShowUser, response_model_exclude_none=True)
async def user_create(
        user_in: schemas.UserCreate,
        db=Depends(get_db),
):
    """
    Create a new user
    """
    user = crud.user.get_user_by_email(db=db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = crud.user.create_user(db=db, obj_in=user_in)

    return user


@router.get("/", response_model=List[schemas.ShowUser], response_model_exclude_none=True, )
async def users_list(
        response: Response,
        db=Depends(get_db),
):
    """
    Get all users
    """
    users = crud.user.get_all_user(db=db)

    # This is necessary for react-admin to work
    response.headers["Content-Range"] = f"0-9/{len(users)}"
    return users


@router.get(
    "/{user_id}",
    response_model=schemas.ShowUser,
    response_model_exclude_none=True,
)
async def user_details(
        user_id: str,
        db=Depends(get_db),
):
    """
    Get any user details
    """
    user = crud.user.get(db=db, id=user_id)
    return user
    # return encoders.jsonable_encoder(
    #     user, skip_defaults=True, exclude_none=True,
    # )


@router.put(
    "/{user_id}", response_model=schemas.ShowUser, response_model_exclude_none=True
)
async def user_edit(
        user_id: str,
        user_in: schemas.UserUpdate,
        db=Depends(get_db),
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
    user = crud.user.update(db=db, db_obj=user, obj_in=user_in)

    return user


@router.delete("/{user_id}", response_model=ShowUser)
def delete_user(
        user_id: str,
        db: Session = Depends(get_db), ):
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=400,
            detail="User not found.",
        )
    user = crud.user.remove(db=db, id=user_id)
    return user
