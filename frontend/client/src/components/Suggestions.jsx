import React from "react";
import "../styles.css"; // make sure this path is correct

export default function Suggestions({
  suggestedKeywords = [],
  optimizerSuggestions = [],
  onApplyKeyword = () => {},
}) {
  const hasSuggestions =
    optimizerSuggestions.length > 0 || suggestedKeywords.length > 0;

  return (
    <div className="suggestions-section">
      <h3>Suggestions</h3>

      {!hasSuggestions && (
        <p className="text-sm text-gray-500">
          No suggestions found — try adding a job description.
        </p>
      )}

      {optimizerSuggestions.length > 0 && (
        <>
          <h4 style={{ color: "#1e40af", marginTop: "10px" }}>
            Optimizer Recommendations
          </h4>
          <div className="suggestions-list">
            {optimizerSuggestions.map((s, i) => (
              <div key={"opt-" + i} className="suggestion-item">
                <span>{s}</span>
                <button onClick={() => onApplyKeyword(s)}>Add</button>
              </div>
            ))}
          </div>
        </>
      )}

      {suggestedKeywords.length > 0 && (
        <>
          <h4 style={{ color: "#166534", marginTop: "20px" }}>
            Missing Job Description Keywords
          </h4>
          <div className="suggestions-list">
            {suggestedKeywords.map((k, i) => (
              <div key={i} className="suggestion-item">
                <span>{k}</span>
                <button onClick={() => onApplyKeyword(k)}>Add</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
