import { useCallback, useState, useRef } from "react";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  onLoadSample: () => void;
  visible: boolean;
}

export function DropZone({ onFileSelect, onLoadSample, visible }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  if (!visible) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[min(600px,90vw)] px-10 py-[60px] bg-[var(--bg-secondary)] border-2 border-dashed rounded-3xl text-center transition-all duration-300 cursor-pointer ${
          isDragOver
            ? "border-[var(--accent)] bg-[var(--accent-dim)] scale-[1.02]"
            : "border-[var(--border)]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-[var(--accent-dim)] rounded-full flex items-center justify-center">
          <svg
            className="w-9 h-9 stroke-[var(--accent)]"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-3">
          Gaussian Splattingファイルをドロップ
        </h2>
        <p className="text-[var(--text-secondary)] text-[15px] mb-6">
          またはクリックしてファイルを選択
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <span className="font-mono text-xs px-3.5 py-1.5 bg-[var(--bg-primary)] rounded-full text-[var(--text-secondary)]">
            .ply
          </span>
          <span className="font-mono text-xs px-3.5 py-1.5 bg-[var(--bg-primary)] rounded-full text-[var(--text-secondary)]">
            .splat
          </span>
          <span className="font-mono text-xs px-3.5 py-1.5 bg-[var(--bg-primary)] rounded-full text-[var(--text-secondary)]">
            .ksplat
          </span>
        </div>
        <button
          className="mt-5 px-6 py-3 bg-transparent border border-[var(--accent)] text-[var(--accent)] rounded-lg font-[Outfit,sans-serif] text-sm cursor-pointer transition-all duration-200 hover:bg-[var(--accent)] hover:text-[var(--bg-primary)]"
          onClick={(event) => {
            event.stopPropagation();
            onLoadSample();
          }}
        >
          サンプルデータを読み込む
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".ply,.splat,.ksplat"
        onChange={handleFileChange}
      />
    </>
  );
}
