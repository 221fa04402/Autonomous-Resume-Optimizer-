import React, {useState} from "react";
import CompareView from "./CompareView";

export default function UploadForm(){
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e){
    e.preventDefault();
    if(!file) return alert("Upload a resume file");
    setLoading(true);
    const form = new FormData();
    form.append("resume_file", file);
    form.append("job_description", jd);
    form.append("auto_optimize", "true");

    const resp = await fetch("http://localhost:8000/api/analyze", {
      method: "POST",
      body: form
    });
    const js = await resp.json();
    setResult(js);
    setLoading(false);
  }

  return (
    <>
      <form onSubmit={submit} className="space-y-4">
        <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={e=>setFile(e.target.files[0])} />
        <textarea placeholder="Paste job description (optional)" rows={6} value={jd} onChange={e=>setJd(e.target.value)} className="w-full p-2 border"/>
        <div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{loading? "Optimizing..." : "Analyze & Optimize"}</button>
        </div>
      </form>

      {result && <CompareView result={result} />}
    </>
  );
}
