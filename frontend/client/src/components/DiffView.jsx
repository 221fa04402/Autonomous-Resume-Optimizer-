import React from "react";
import { diffWords } from "diff";

function highlightDiff(text, parts) {
  return parts.map((part, i) => {
    const cls = part.added
      ? "bg-green-100 text-green-800"
      : part.removed
      ? "bg-red-100 text-red-800 line-through"
      : "text-gray-800";
    return (
      <span key={i} className={`${cls} px-0.5`}>
        {part.value}
      </span>
    );
  });
}

export default function DiffView({ original = "", optimized = "" }) {
  const diffA = diffWords(original, optimized);

  return (
    <div className="diff-container">
      <div className="diff-section original-section">
        <h4 className="diff-title">Original Version</h4>
        <div className="diff-text">
          {highlightDiff(original, diffA.filter((p) => !p.added))}
        </div>
      </div>

      <div className="diff-section optimized-section">
        <h4 className="diff-title">Optimized Version</h4>
        <div className="diff-text">
          {highlightDiff(optimized, diffA.filter((p) => !p.removed))}
        </div>
      </div>
    </div>
  );
}
