import React, { useState } from "react";
import { analyzeResume, updateOptimized } from "../services/api";
import CompareView from "./CompareView";
import Editor from "./Editor";
import Suggestions from "./Suggestions";
import DiffView from "./DiffView";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [polishOnly, setPolishOnly] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editorText, setEditorText] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!file) return alert("Upload a resume file");
    setLoading(true);
    const form = new FormData();
    form.append("resume_file", file);
    form.append("job_description", jd);
    form.append("auto_optimize", "true");
    form.append("polish_only", polishOnly);

    try {
      const js = await analyzeResume(form);
      setResult(js);
      setEditorText(js.optimized?.optimized_text || js.optimized_text || "");
    } catch (err) {
      console.error(err);
      alert("Analyze failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveEdited(edited) {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("edited_text", edited);
      form.append("polish_only", polishOnly);
      const res = await updateOptimized(form);

      alert("DOCX/PDF regenerated successfully!");
      setResult(prev => ({
        ...prev,
        download_docx: res.download_docx,
        download_pdf: res.download_pdf
      }));
    } catch (err) {
      console.error(err);
      alert("Save/Export failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="space-y-3">
        <label>Upload Resume:</label>
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={e => setFile(e.target.files[0])}
        />

        <label>Paste Job Description (optional):</label>
        <textarea
          rows={5}
          value={jd}
          onChange={e => setJd(e.target.value)}
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={polishOnly}
            onChange={e => setPolishOnly(e.target.checked)}
          />
          <span>Polish resume only (don’t tailor to JD)</span>
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Processing..." : "Analyze & Optimize"}
        </button>
      </form>

      {result && (
        <>
          {/* === Top Metrics Section === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* ATS Score */}
            <div className="p-3 border rounded bg-white">
              <h4 className="font-semibold">ATS Score</h4>
              <div className="text-2xl font-bold">
                {Math.round(result.overlap_score * 100)}%
              </div>
            </div>

            {/* ✅ Missing JD Keywords Section (No Add Button) */}
            <div className="missing-jd-section">
              <h3>Missing JD Keywords</h3>
              <div className="missing-jd-list">
                {result.suggested_keywords && result.suggested_keywords.length > 0 ? (
                  result.suggested_keywords.map((k, i) => (
                    <div key={i} className="missing-jd-item">
                      {k}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">
                    No missing keywords.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* === AI Suggestions Section === */}
          <div className="mt-4 p-3 border rounded bg-gray-50">
            <h4 className="font-semibold">AI Suggestions for Missing Technologies</h4>
            {result.ai_suggestions && Object.keys(result.ai_suggestions).length > 0 ? (
              Object.entries(result.ai_suggestions).map(([tech, info]) => (
                <div key={tech} className="mt-2 p-2 border rounded bg-white">
                  <div className="font-medium">{tech}</div>
                  <div className="text-sm mt-1">{info.info}</div>
                  <div className="text-sm mt-1">
                    <strong>Project Ideas:</strong>
                    <ul className="list-disc list-inside">
                      {info.project_ideas.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 mt-2">
                No AI suggestions available.
              </div>
            )}
          </div>

          {/* ✅ Suggestions Section (Still Has Add Button) */}
          <Suggestions
            suggestedKeywords={result.suggested_keywords}
            optimizerSuggestions={result.optimized?.suggestions || []}
            onApplyKeyword={kw => setEditorText(prev => prev + "\n- " + kw)}
          />

          {/* === Editor, Compare, and Diff Views === */}
          <Editor
            text={editorText}
            onChange={setEditorText}
            onSave={() => saveEdited(editorText)}
            downloadDocx={result.download_docx}
            downloadPdf={result.download_pdf}
          />

          <CompareView result={result} />

          <DiffView
            original={result.resume_parsed.full_text}
            optimized={editorText}
          />
        </>
      )}
    </div>
  );
}
