interface ControlsPanelProps {
  visible: boolean;
  onReset: () => void;
  onNewFile: () => void;
}

export function ControlsPanel({ visible, onReset, onNewFile }: ControlsPanelProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-[30px] left-1/2 -translate-x-1/2 z-[100] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl px-6 py-4 flex items-center gap-5">
      <div className="flex items-center gap-2.5">
        <span className="text-[13px] text-[var(--text-secondary)]">Controls:</span>
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          Drag=Rotate / Scroll=Zoom / Right Drag=Pan
        </span>
      </div>
      <div className="w-px h-6 bg-[var(--border)]" />
      <button
        className="w-9 h-9 border border-[var(--border)] bg-[var(--bg-primary)] rounded-lg text-[var(--text-primary)] cursor-pointer flex items-center justify-center transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
        title="Reset Camera"
        onClick={onReset}
      >
        <svg
          className="w-[18px] h-[18px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
      <button
        className="w-9 h-9 border border-[var(--border)] bg-[var(--bg-primary)] rounded-lg text-[var(--text-primary)] cursor-pointer flex items-center justify-center transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
        title="New File"
        onClick={onNewFile}
      >
        <svg
          className="w-[18px] h-[18px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </button>
    </div>
  );
}
