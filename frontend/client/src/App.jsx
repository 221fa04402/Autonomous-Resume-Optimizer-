import React from "react";
import UploadForm from "./components/UploadForm";
import ResumeOptimizer from "./components/ResumeOptimizer";

export default function App(){
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Student Resume Optimizer — MVP</h1>
        <UploadForm />
      </div>
    </div>
  );
}
