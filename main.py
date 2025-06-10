from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="Simple Chat API")

# Request model
class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

# Initialize LangChain components
llm = ChatGroq(
    model="mistral-saba-24b",
    temperature=0.7,
)

# Store conversation memory for different sessions
memory_store = {}

def get_conversation(session_id: str) -> ConversationChain:
    if session_id not in memory_store:
        memory = ConversationBufferMemory()
        memory_store[session_id] = ConversationChain(
            llm=llm,
            memory=memory,
            verbose=False
        )
    return memory_store[session_id]

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        conversation = get_conversation(request.session_id)
        response = conversation.predict(input=request.message)
        return JSONResponse({
            "response": response,
            "session_id": request.session_id
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}