// ResumeOptimizer.jsx
import React, { useState } from "react";

export default function ResumeOptimizer() {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 🚀 API call to backend here
    setResult({
      match: "85%",
      missing: ["Leadership", "Machine Learning", "Agile"],
      suggestions: "Add more quantified achievements and leadership examples."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Resume Optimizer
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resume Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Paste Your Resume
            </label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume here..."
              rows={6}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Job Description Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the job description here..."
              rows={4}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-200"
          >
            Optimize Resume
          </button>
        </form>

        {/* Result Section */}
        {result && (
          <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Results</h2>
            <p className="mb-2">
              <span className="font-semibold">Match Score:</span>{" "}
              <span className="text-blue-600">{result.match}</span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Missing Keywords:</span>{" "}
              <span className="text-red-500">{result.missing.join(", ")}</span>
            </p>
            <p>
              <span className="font-semibold">Suggestions:</span>{" "}
              {result.suggestions}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
