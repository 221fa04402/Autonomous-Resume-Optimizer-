import React, {useRef} from "react";
import html2pdf from "html2pdf.js";

export default function Editor({ text, onChange, onSave, originalText, downloadDocx, downloadPdf }){
  const areaRef = useRef();

  function exportClientPdf(){
    // Quick client-side export of the editor area
    const element = areaRef.current;
    if (!element) return;
    const opt = {
      margin:       0.5,
      filename:     'optimized_resume.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  }

  function copyToClipboard(){
    navigator.clipboard.writeText(text).then(()=> alert("Copied to clipboard"));
  }

  return (
    <div>
      <div ref={areaRef}>
        <textarea
          rows={14}
          value={text}
          onChange={e=>onChange(e.target.value)}
          className="w-full p-3 border rounded font-sans text-sm"
        />
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={copyToClipboard} className="px-3 py-2 bg-gray-200 rounded text-sm">Copy</button>
        <button onClick={onSave} className="px-3 py-2 bg-blue-600 text-white rounded text-sm">Save & Generate DOCX/PDF</button>
        <button onClick={exportClientPdf} className="px-3 py-2 bg-indigo-600 text-white rounded text-sm">Export as PDF</button>
        {downloadDocx && <a href={downloadDocx} className="px-3 py-2 bg-green-600 text-white rounded text-sm">Download DOCX</a>}
        {downloadPdf && <a href={downloadPdf} className="px-3 py-2 bg-gray-800 text-white rounded text-sm">Download PDF</a>}
      </div>
    </div>
  );
}
