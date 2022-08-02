import json


def test_create_transaction(client, normal_user_token_headers):
    data = {
        "debit": 23,
        "credit": 0,
        "description": "transfer",
        "date": "2022-03-20",
    }
    response = client.post(
        "/transactions/", data=json.dumps(data), headers=normal_user_token_headers
    )
    assert response.status_code == 200
    assert response.json()["debit"] == '23.0'
    assert response.json()["description"] == "transfer"


def test_read_transactions(client, normal_user_token_headers):
    data = {
        "debit": 0,
        "credit": 14,
        "description": "python",
        "date": "2022-03-20",
    }
    client.post(
        "/transactions/", data=json.dumps(data), headers=normal_user_token_headers
    )
    response = client.get("/transactions/")
    assert response.status_code == 200
    assert response.json()[0]