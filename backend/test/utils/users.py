from app import crud
from fastapi.testclient import TestClient
from app.schemas import UserCreate
from sqlalchemy.orm import Session


def user_authentication_headers(client: TestClient, email: str, password: str):
    data = {"username": email, "password": password}
    r = client.post("/login/token", data=data)
    response = r.json()
    auth_token = response["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}
    return headers


def authentication_token_from_email(client: TestClient, email: str, db: Session):
    """
    Return a valid token for the user with given email.
    If the user doesn't exist it is created first.
    """
    password = "random-passW0rd"
    user = crud.user.get_user_by_email(email=email, db=db)
    if not user:
        user_in_create = UserCreate(account_number="0012",
                                    email=email,
                                    is_admin=True,
                                    is_active=True,
                                    first_name="test",
                                    last_name="test",
                                    password=password)
        crud.user.create_user(obj_in=user_in_create, db=db)
    return user_authentication_headers(client=client, email=email, password=password)
