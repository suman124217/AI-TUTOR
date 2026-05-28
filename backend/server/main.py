from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import router as chat_router
from routes.roadmap import router as roadmap_router

app = FastAPI(
    title="AI Career Tutor API",
    description="Backend for the AI Career Tutor & Roadmap Generator",
    version="1.0.0"
)

# CORS call
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#routes
app.include_router(chat_router,    prefix="/api", tags=["Chat"])
app.include_router(roadmap_router, prefix="/api", tags=["Roadmap"])


#calling
@app.get("/")
def root():
    return {"status": "ok", "message": "AI Career Tutor API is running"}