import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.apis.base import api_router
from app.core.config import settings
from app.db.base_class import Base
from app.db.init_data import init_db
from app.db.session import SessionLocal, engine


def include_router(app):
    app.include_router(api_router)


def create_tables():  # new
    print("create_tables")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    init_db(db)


def start_application():
    app = FastAPI(
        title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION, docs_url="/api/docs", openapi_url="/api"
    )
    app.add_middleware(SessionMiddleware, secret_key="!secret")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    include_router(app)
    create_tables()
    return app


app = start_application()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888)
