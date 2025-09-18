# backend/app/services/optimizer.py
import os
import textwrap
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def make_prompt(parsed, jd_text=None):
    # Build a concise instruction prompt for the LLM that asks for:
    # - Improve bullet phrasing (action verbs, metrics)
    # - Add missing keywords from JD
    # - Keep truthful to original content
    prompt = "You are an assistant that rewrites and optimizes student resumes for ATS and recruiters.\n"
    prompt += "Resume text:\n"
    prompt += parsed["full_text"][:4000] + "\n\n"
    if jd_text:
        prompt += "Target job description:\n" + jd_text[:2000] + "\n\n"
    prompt += (
        "Produce an optimized resume text focusing on clear achievements, action verbs, quantification, "
        "ATS-friendly keywords, and student-centric order (Education, Projects, Skills, Experience). "
        "Output JSON with keys: 'optimized_text' and 'highlights' (a list of suggested edits)."
    )
    return prompt

def optimize_resume(parsed, jd_text=None, auto_optimize=False):
    # Simple local fallback if no API key: make small deterministic edits
    if not OPENAI_API_KEY:
        # fallback: return the original text with basic bullet conversion
        text = parsed["full_text"]
        # naive: make sentences with "worked on" replaced
        text = text.replace("was responsible for", "led")
        text = text.replace("worked on", "developed")
        return text[:10000]
    # If OPENAI_API_KEY present, call OpenAI ChatCompletion
    try:
        import openai
        openai.api_key = OPENAI_API_KEY
        prompt = make_prompt(parsed, jd_text)
        resp = openai.ChatCompletion.create(
            model="gpt-4o-mini", # update to the model you have access to
            messages=[{"role":"user","content":prompt}],
            max_tokens=1500,
            temperature=0.2
        )
        out = resp["choices"][0]["message"]["content"]
        # attempt to parse JSON out of output
        import json, re
        m = re.search(r"\{.*\}", out, flags=re.DOTALL)
        if m:
            j = json.loads(m.group())
            return j.get("optimized_text", out)
        return out
    except Exception as e:
        print("LLM call failed:", e)
        return parsed["full_text"]
