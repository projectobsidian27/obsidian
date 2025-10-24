from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import scan, enforce, auth

app = FastAPI(
    title="Obsidian API",
    description="Pipeline Discipline Platform API",
    version="0.1.0"
)

# CORS middleware for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(scan.router)
app.include_router(enforce.router)
app.include_router(auth.router)


@app.get("/health")
def health():
    return {
        "ok": True,
        "service": "Obsidian API",
        "version": "0.1.0"
    }
