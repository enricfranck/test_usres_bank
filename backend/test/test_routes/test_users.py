import json

from fastapi import status

from app.core.config import settings


def test_create_user(client):
    data = {
        "email": "testuser@nofoobar.com",
        "account_number": "00001",
        "is_active": True,
        "is_admin": True,
        "first_name": "test",
        "last_name": "test",
        "password": "testing",
    }
    response = client.post("/users/", json.dumps(data))
    assert response.status_code == 200
    assert response.json()["email"] == "testuser@nofoobar.com"
    assert response.json()["is_active"] == True


def test_get_user(client):
    response = client.get("/users/")
    assert response.status_code == 200
    assert response.json()[0]