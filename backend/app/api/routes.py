# backend/app/api/routes.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from app.services import parser, nlp_utils, optimizer, exporter
import uuid, os

router = APIRouter()

UPLOAD_DIR = "tmp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/analyze")
async def analyze_resume(
    resume_file: UploadFile = File(...),
    job_description: str = Form(None),
    auto_optimize: bool = Form(False),
):
    # save file
    uid = str(uuid.uuid4())
    saved_path = os.path.join(UPLOAD_DIR, f"{uid}_{resume_file.filename}")
    with open(saved_path, "wb") as f:
        f.write(await resume_file.read())

    # Parse resume into structured text
    parsed = parser.parse_resume(saved_path)

    # Extract keywords from job description (if provided)
    jd_keywords = []
    if job_description:
        jd_keywords = nlp_utils.extract_keywords(job_description)

    # Extract keywords from resume
    resume_keywords = nlp_utils.extract_keywords(parsed["full_text"])

    # Basic ATS score: overlap
    overlap = nlp_utils.keyword_overlap(resume_keywords, jd_keywords)
    suggestions = nlp_utils.suggest_keywords(jd_keywords, resume_keywords)

    # Skill gap analysis
    skill_gaps = nlp_utils.identify_skill_gaps(jd_keywords, resume_keywords)

    # Grammar + rewrite suggestions & Auto-optimized draft (calls LLM)
    optimized = optimizer.optimize_resume(parsed, job_description, auto_optimize=auto_optimize)

    # Export optimized resume to docx
    export_path = exporter.make_docx(optimized, uid)
    pdf_path = exporter.docx_to_pdf(export_path)  # optional, may require libreoffice

    return JSONResponse({
        "resume_parsed": parsed,
        "resume_keywords": resume_keywords,
        "jd_keywords": jd_keywords,
        "overlap_score": overlap,
        "suggested_keywords": suggestions,
        "skill_gaps": skill_gaps,
        "optimized_text": optimized,
        "download_docx": f"/api/download/{os.path.basename(export_path)}",
        "download_pdf": f"/api/download/{os.path.basename(pdf_path) if pdf_path else ''}",
    })


@router.get("/download/{filename}")
def download_file(filename: str):
    path = os.path.join("tmp_uploads", filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Not found")
    return FileResponse(path, filename=filename)
