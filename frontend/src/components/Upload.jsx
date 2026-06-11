import { useState, useRef } from "react";
import { X, Upload, Image, FileText, Video, Music, File } from "lucide-react";
import { uploadFile } from "../api/upload"; 

const FILE_TYPES = [
  { label: "Immagini",  icon: Image,    accept: ".jpg,.jpeg,.png,.gif,.webp,.svg" },
  { label: "Documenti", icon: FileText, accept: ".pdf,.docx,.doc,.txt,.xlsx,.pptx" },
  { label: "Video",     icon: Video,    accept: ".mp4,.mov,.avi,.mkv,.webm" },
  { label: "Audio",     icon: Music,    accept: ".mp3,.wav,.ogg,.flac,.aac" },
  { label: "Altro",     icon: File,     accept: "*" },
];

export default function UploadModal({ onClose, onUploadSuccess }) {
  const [selected, setSelected]   = useState(null);
  const [dragging, setDragging]   = useState(false);
  const [files, setFiles]         = useState([]);
  const [uploading, setUploading] = useState(false); 
  const [uploadError, setUploadError] = useState(""); 
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

  async function handleUpload() {
    const password = prompt("Enter your password to encrypt your files:");
    if (!password) return;

    setUploading(true);
    setUploadError("");
    try {
      for (const file of files) {
        await uploadFile(file, password);
      }
      onUploadSuccess?.();
      onClose();
    } catch (err) {
      setUploadError(err.message || "Error while uploading.");
    } finally {
      setUploading(false);
    }
  }

  const accept = selected !== null ? FILE_TYPES[selected].accept : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-120 mx-4 rounded-xl border border-slate-200 bg-white p-8 shadow-[0_25px_60px_rgba(0,0,0,0.2)]"
      >
        <button onClick={onClose} className="absolute right-4 top-4 bg-transparent border-none cursor-pointer text-slate-400">
          <X size={18} />
        </button>

        <h2 className="m-0 mb-1 text-[20px] font-bold text-slate-900">Upload files</h2>
        <p className="m-0 mb-6 text-[13px] text-slate-500">Choose the file type to upload</p>

        <div className="flex gap-2 mb-6 flex-wrap">
          {FILE_TYPES.map((t, i) => {
            const Icon = t.icon;
            const active = selected === i;
            return (
              <button
                key={i}
                onClick={() => { setSelected(i); setFiles([]); setUploadError(""); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium cursor-pointer transition-all ${
                  active 
                    ? "bg-slate-900 text-white border border-slate-900" 
                    : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}
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
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all mb-4 ${
                dragging ? "border-green bg-teal-50/50" : "border-slate-300 bg-slate-50"
              }`}
            >
              <Upload size={28} className="mx-auto mb-2 text-slate-400" />
              <p className="m-0 mb-1 text-[13px] font-medium text-slate-500">
                Drag files here or <span className="text-green-dark font-semibold">browse</span>
              </p>
              <p className="m-0 text-[11px] text-slate-500">
                {FILE_TYPES[selected].accept === "*" ? "Tutti i formati supportati" : FILE_TYPES[selected].accept}
              </p>
              <input ref={inputRef} type="file" multiple accept={accept} onChange={handlePick} className="hidden" />
            </div>

            {files.length > 0 && (
              <div className="mb-4 flex flex-col gap-1.5">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-md bg-slate-100 text-[12px] text-slate-700">
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-85">{f.name}</span>
                    <button onClick={() => removeFile(i)} className="bg-transparent border-none cursor-pointer text-slate-500 ml-2 p-0">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploadError && (
              <p className="rounded-md bg-red-50 p-3 text-[13px] text-red-600 mb-3">
                {uploadError}
              </p>
            )}

            <button
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
              className={`w-full rounded-md border-none p-2.5 text-[13px] font-semibold transition-colors ${
                (files.length === 0 || uploading) 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                  : "bg-slate-900 text-white cursor-pointer"
              }`}
            >
              {uploading ? "Encrypting and uploading..." : `Carica ${files.length > 0 ? `${files.length} file` : ""}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}