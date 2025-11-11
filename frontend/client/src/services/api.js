const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function analyzeResume(formData) {
  const resp = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    body: formData
  });
  if (!resp.ok) throw new Error(`Analyze failed: ${resp.statusText}`);
  return resp.json();
}

export async function updateOptimized(editedText) {
  const form = new FormData();
  form.append("edited_text", editedText);
  const resp = await fetch(`${API_BASE}/api/update_optimized`, {
    method: "POST",
    body: form
  });
  if (!resp.ok) throw new Error(`Update failed: ${resp.statusText}`);
  return resp.json();
}
