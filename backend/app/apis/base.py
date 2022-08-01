from app.apis.api_v1 import route_users, route_login, route_transaction
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(route_users.router, prefix="/users", tags=["users"])
api_router.include_router(route_login.router, prefix="/login", tags=["Login"])
api_router.include_router(route_transaction.router, prefix="/transaction", tags=["Transaction"])
