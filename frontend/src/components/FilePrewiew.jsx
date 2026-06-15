import { X } from "lucide-react";

export default function FilePreview({
  fileName,
  previewUrl,
  mimeType,
  onClose,
}) {
  function renderPreview() {
    if (!previewUrl) return null;

    if (mimeType.startsWith("image/")) {
      return (
        <img
          src={previewUrl}
          alt={fileName}
          className="max-h-[70vh] max-w-full rounded"
        />
      );
    }

    if (mimeType === "application/pdf") {
      return (
        <iframe
          src={previewUrl}
          title={fileName}
          className="h-[70vh] w-full rounded border"
        />
      );
    }

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

    if (mimeType.startsWith("audio/")) {
      return (
        <audio controls className="w-full">
          <source src={previewUrl} type={mimeType} />
        </audio>
      );
    }

    return (
      <div className="text-center text-slate-600">
        Preview non disponibile per questo formato.
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative w-[90vw] max-w-5xl rounded-lg bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500"
        >
          <X size={20} />
        </button>

        <h3 className="mb-4 text-lg font-semibold">
          {fileName}
        </h3>

        <div className="flex justify-center">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}