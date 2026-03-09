"""BNB Chain Skills API — FastAPI application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.bnbchain import router

app = FastAPI(
    title="BNB Chain Skills API",
    description="28 on-chain analysis tools for BNB Smart Chain",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/mefai")
