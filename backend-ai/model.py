from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, BitsAndBytesConfig
from peft import PeftModel
import torch
from utils import long_segment, segment, stitch, strip, fix_bullets

model_name = "google/flan-t5-base"

tokenizer = AutoTokenizer.from_pretrained(model_name)
device = "cpu"
base_model = AutoModelForSeq2SeqLM.from_pretrained(model_name, device_map="auto")
base_model = PeftModel.from_pretrained(base_model, "./adaptors/summarize", adapter_name="summarize")
base_model.load_adapter("./adaptors/bulletify", adapter_name="bulletify")
base_model.load_adapter("./adaptors/paraphrase", adapter_name="paraphrase")
base_model.load_adapter("./adaptors/proofread", adapter_name="proofread")
base_model.eval()

def summarize(prompt: str) -> str:
  print(prompt)
  base_model.set_adapter("summarize")
  output_list = []
  small_prompts = long_segment(prompt)
  for thingy in small_prompts:
    formatted_prompt = "summarize: " + thingy
    input_tokens = tokenizer(formatted_prompt, return_tensors="pt").input_ids.to(base_model.device)
    output_tokens = base_model.generate(input_ids=input_tokens, max_length=5000, num_beams=1)
    output_text = tokenizer.decode(output_tokens[0], skip_special_tokens=True)
    output_list.append(output_text)
  return stitch(output_list)

def bulletify(prompt: str) -> str:
  print(prompt)
  base_model.set_adapter("bulletify")
  output_list = []
  small_prompts = long_segment(prompt)
  for thingy in small_prompts:
    formatted_prompt = "bulletify: " + thingy
    input_tokens = tokenizer(formatted_prompt, return_tensors="pt").input_ids.to(base_model.device)
    output_tokens = base_model.generate(input_ids=input_tokens, max_length=5000, num_beams=1)
    output_text = tokenizer.decode(output_tokens[0], skip_special_tokens=True)
    output_text = fix_bullets(output_text)
    output_list.append(output_text)
  return stitch(output_list)

def paraphrase(prompt: str) -> str:
  print(prompt)
  base_model.set_adapter("paraphrase")
  prompt_list = segment(prompt)
  output_list = []
  for prompt_element in prompt_list:
    formatted_prompt = "paraphrase: " + prompt_element
    input_tokens = tokenizer(formatted_prompt, return_tensors="pt").input_ids.to(base_model.device)
    output_tokens = base_model.generate(input_ids=input_tokens, max_length=5000, num_beams=1)
    output_element = tokenizer.decode(output_tokens[0], skip_special_tokens=True)
    output_list.append(output_element)

  return stitch(output_list)

def proofread(prompt: str) -> str:
  print(prompt)
  base_model.set_adapter("proofread")
  prompt_list = segment(prompt)
  output_list = []
  for prompt_element in prompt_list:
    formatted_prompt = "fix grammar: " + prompt_element
    input_tokens = tokenizer(formatted_prompt, return_tensors="pt").input_ids.to(base_model.device)
    output_tokens = base_model.generate(input_ids=input_tokens, max_length=5000, num_beams=1)
    output_element = tokenizer.decode(output_tokens[0], skip_special_tokens=True)
    output_list.append(output_element)

  return stitch(output_list)