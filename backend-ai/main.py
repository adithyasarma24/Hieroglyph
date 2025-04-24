from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import summarize, bulletify, paraphrase, proofread

api = FastAPI()

api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputText(BaseModel):
  text: str

@api.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI application!"}

@api.post("/summarize/")
def call_summarize(input_data: InputText):
  text = input_data.text
  output_data = summarize(text)
  return {"text": output_data}

@api.post("/bulletify/")
def call_bulletify(input_data: InputText):
  text = input_data.text
  output_data = bulletify(text)
  return {"text": output_data}

@api.post("/paraphrase/")
def call_paraphrase(input_data: InputText):
  text = input_data.text
  output_data = paraphrase(text)
  return {"text": output_data}

@api.post("/proofread/")
def call_proofread(input_data: InputText):
  text = input_data.text
  output_data = proofread(text)
  return {"text": output_data}