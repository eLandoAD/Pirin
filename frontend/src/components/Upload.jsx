import { useState, useRef } from "react";
import { X, Upload, Image, FileText, Video, Music, File } from "lucide-react";

const FILE_TYPES = [
  { label: "Immagini",   icon: Image,    accept: ".jpg,.jpeg,.png,.gif,.webp,.svg" },
  { label: "Documenti",  icon: FileText, accept: ".pdf,.docx,.doc,.txt,.xlsx,.pptx" },
  { label: "Video",      icon: Video,    accept: ".mp4,.mov,.avi,.mkv,.webm" },
  { label: "Audio",      icon: Music,    accept: ".mp3,.wav,.ogg,.flac,.aac" },
  { label: "Altro",  icon: File,     accept: "*" },
];

export default function UploadModal({ onClose }) {
  const [selected, setSelected] = useState(null); 
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef();

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }

  function handlePick(e) {
    addFiles(Array.from(e.target.files));
  }

  function addFiles(newFiles) {
    setFiles((prev) => [...prev, ...newFiles]);
  }

  function removeFile(i) {
    setFiles((f) => f.filter((_, idx) => idx !== i));
  }

  function handleUpload() {
    console.log("Upload files:", files);
    onClose();
  }

  const accept = selected !== null ? FILE_TYPES[selected].accept : null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%", maxWidth: "480px",
          margin: "0 16px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          backgroundColor: "white",
          padding: "32px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
        }}
      >

        {}
        <button onClick={onClose} style={{ position: "absolute", right: "16px", top: "16px", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
          <X size={18} />
        </button>

        <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>Carica file</h2>
        <p style={{ margin: "0 0 24px", fontSize: "13px", color: "#64748b" }}>Scegli il tipo di file da caricare</p>

    
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {FILE_TYPES.map((t, i) => {
            const Icon = t.icon;
            const active = selected === i;
            return (
              <button
                key={i}
                onClick={() => { setSelected(i); setFiles([]); }}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 500,
                  cursor: "pointer", transition: "all 0.15s",
                  backgroundColor: active ? "#0f172a" : "#f1f5f9",
                  color: active ? "white" : "#475569",
                  border: active ? "1px solid #0f172a" : "1px solid #e2e8f0",
                }}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>


        {selected !== null && (
          <>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current.click()}
              style={{
                border: `2px dashed ${dragging ? "#5eead4" : "#cbd5e1"}`,
                borderRadius: "8px",
                padding: "32px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: dragging ? "#f0fdfa" : "#f8fafc",
                transition: "all 0.15s",
                marginBottom: "16px",
              }}
            >
              <Upload size={28} style={{ margin: "0 auto 8px", color: "#94a3b8" }} />
              <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 500, color: "#475569" }}>
                Trascina i file qui oppure <span style={{ color: "#0f766e", fontWeight: 600 }}>sfoglia</span>
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
                {FILE_TYPES[selected].accept === "*" ? "Tutti i formati supportati" : FILE_TYPES[selected].accept}
              </p>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept={accept}
                onChange={handlePick}
                style={{ display: "none" }}
              />
            </div>

            {files.length > 0 && (
              <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {files.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: "6px", backgroundColor: "#f1f5f9", fontSize: "12px", color: "#334155" }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "340px" }}>{f.name}</span>
                    <button onClick={() => removeFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", marginLeft: "8px", padding: 0 }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={files.length === 0}
              style={{
                width: "100%", borderRadius: "6px",
                backgroundColor: files.length === 0 ? "#e2e8f0" : "#0f172a",
                border: "none", padding: "10px",
                fontSize: "13px", fontWeight: 600,
                color: files.length === 0 ? "#94a3b8" : "white",
                cursor: files.length === 0 ? "not-allowed" : "pointer",
              }}
              onMouseEnter={e => { if (files.length > 0) e.target.style.backgroundColor = "#0f766e"; }}
              onMouseLeave={e => { if (files.length > 0) e.target.style.backgroundColor = "#0f172a"; }}
            >
              Carica {files.length > 0 ? `${files.length} file` : ""}
            </button>
          </>
        )}
      </div>
    </div>
  );
}