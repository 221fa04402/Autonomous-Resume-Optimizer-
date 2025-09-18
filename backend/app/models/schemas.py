# backend/app/models/schemas.py
from pydantic import BaseModel
from typing import List, Dict, Any

class ParsedResume(BaseModel):
    full_text: str
    sections: Dict[str, str]

class AnalyzeResponse(BaseModel):
    resume_parsed: ParsedResume
    resume_keywords: List[str]
    jd_keywords: List[str]
    overlap_score: float
    suggested_keywords: List[str]
    skill_gaps: List[str]
    optimized_text: str
