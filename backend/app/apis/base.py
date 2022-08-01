from app.apis.api_v1 import route_users
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(route_users.router, prefix="/users", tags=["users"])
