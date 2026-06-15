import { X } from "lucide-react";

export default function FilePreview({
  fileName,
  previewUrl,
  mimeType,
  onClose,
}) {
  function renderPreview() {
    if (!previewUrl) return null;

    // File di Testo (.txt)
    if (mimeType === "text/plain") {
      return (
        <iframe
          src={previewUrl}
          title={fileName}
          className="h-[70vh] w-full rounded border bg-white p-4 font-mono text-sm text-slate-800"
        />
      );
    }

    // Immagini
    if (mimeType.startsWith("image/")) {
      return (
        <img
          src={previewUrl}
          alt={fileName}
          className="max-h-[70vh] max-w-full rounded"
        />
      );
    }

    // PDF
    if (mimeType === "application/pdf") {
      return (
        <iframe
          src={previewUrl}
          title={fileName}
          className="h-[70vh] w-full rounded border"
        />
      );
    }

    // Video
    if (mimeType.startsWith("video/")) {
      return (
        <video
          controls
          className="max-h-[70vh] max-w-full rounded"
        >
          <source src={previewUrl} type={mimeType} />
        </video>
      );
    }

    // Audio
    if (mimeType.startsWith("audio/")) {
      return (
        <audio controls className="w-full">
          <source src={previewUrl} type={mimeType} />
        </audio>
      );
    }

    return (
      <div className="text-center text-slate-600 py-8">
        Preview non disponibile per questo formato.
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-[90vw] max-w-5xl rounded-lg bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <h3 className="mb-4 pr-8 text-lg font-semibold text-slate-800 truncate">
          {fileName}
        </h3>

        <div className="flex justify-center bg-slate-50 rounded-md p-2 min-h-50 items-center">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}