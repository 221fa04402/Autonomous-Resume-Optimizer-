import React from "react";

export default function CompareView({ result }){
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold">Results</h2>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 border rounded bg-white">
          <h3 className="font-semibold">Parsed Resume (excerpt)</h3>
          <pre className="text-sm max-h-40 overflow-auto">{result.resume_parsed.full_text.slice(0,2000)}</pre>
        </div>
        <div className="p-3 border rounded bg-white">
          <h3 className="font-semibold">Optimized Resume (excerpt)</h3>
          <pre className="text-sm max-h-40 overflow-auto">{(result.optimized?.optimized_text || "").slice(0,2000)}</pre>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 border rounded">
          <h4 className="font-medium">ATS Overlap</h4>
          <div className="text-2xl font-bold">{Math.round((result.overlap_score || 0) * 100)}%</div>
          <div className="text-xs text-gray-500 mt-1">How closely the resume matches JD keywords</div>
        </div>
        <div className="p-3 border rounded">
          <h4 className="font-medium">Suggested Keywords</h4>
          <ul className="text-sm mt-2">
            {(result.suggested_keywords || []).map((k,i)=> <li key={i}>• {k}</li>)}
          </ul>
        </div>
        <div className="p-3 border rounded">
          <h4 className="font-medium">Skill Gaps</h4>
          <ul className="text-sm mt-2">
            {(result.skill_gaps || []).map((k,i)=> <li key={i}>• {k}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
