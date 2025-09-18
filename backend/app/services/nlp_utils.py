# backend/app/services/nlp_utils.py
import spacy, re
from collections import Counter

# Note: download en_core_web_sm before running: python -m spacy download en_core_web_sm
nlp = spacy.load("en_core_web_sm")

def extract_keywords(text, top_k=40):
    doc = nlp(text.lower())
    # nouns + proper nouns + verbs as candidate keywords
    candidates = [token.lemma_ for token in doc if token.pos_ in ("NOUN","PROPN","VERB","ADJ") and not token.is_stop and token.is_alpha]
    freq = Counter(candidates)
    return [k for k,_ in freq.most_common(top_k)]

def keyword_overlap(resume_kw, jd_kw):
    if not jd_kw: return 0.0
    set_r = set(resume_kw)
    set_j = set(jd_kw)
    inter = set_r.intersection(set_j)
    return len(inter) / max(len(set_j), 1)

def suggest_keywords(jd_keywords, resume_keywords, top_n=10):
    # suggest jd keywords missing from resume
    missing = [k for k in jd_keywords if k not in resume_keywords]
    return missing[:top_n]

def identify_skill_gaps(jd_keywords, resume_keywords):
    # naive: treat keywords as skills when they are short / technical tokens
    tech_jd = [k for k in jd_keywords if len(k.split())<=3]
    gaps = [k for k in tech_jd if k not in resume_keywords]
    return gaps
