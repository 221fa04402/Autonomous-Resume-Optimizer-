# backend/app/services/parser.py
from io import BytesIO
import docx2txt
import pdfminer.high_level
import os
import re

def parse_pdf(path):
    try:
        text = pdfminer.high_level.extract_text(path)
    except Exception:
        text = ""
    return text

def parse_docx(path):
    try:
        text = docx2txt.process(path)
    except Exception:
        text = ""
    return text

def split_into_sections(text):
    # Very simple heuristics to split into common sections
    sections = {}
    patterns = {
        "education": r"(education|academics|academic background)",
        "skills": r"(skills|technical skills|programming skills)",
        "projects": r"(projects|academic projects|project experience)",
        "experience": r"(experience|work experience|internship)",
    }
    lowered = text.lower()
    for name, pat in patterns.items():
        m = re.search(pat, lowered)
        if m:
            # crude: capture 2000 chars after section header
            idx = lowered.find(m.group())
            sections[name] = text[idx: idx + 2000]
        else:
            sections[name] = ""
    return sections

def parse_resume(path):
    ext = os.path.splitext(path)[1].lower()
    if ext in [".pdf"]:
        text = parse_pdf(path)
    elif ext in [".docx", ".doc"]:
        text = parse_docx(path)
    else:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
    sections = split_into_sections(text)
    return {"full_text": text, "sections": sections}
