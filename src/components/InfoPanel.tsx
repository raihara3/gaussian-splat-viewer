interface InfoPanelProps {
  visible: boolean;
  filename: string;
  splatCount: string;
  fps: number;
}

export function InfoPanel({ visible, filename, splatCount, fps }: InfoPanelProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed top-20 right-[30px] z-[100] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-5 py-4 text-[13px]">
      <div className="flex justify-between gap-6 py-1.5 border-b border-[var(--border)]">
        <span className="text-[var(--text-secondary)]">ファイル</span>
        <span className="font-mono text-[var(--accent)]">{filename}</span>
      </div>
      <div className="flex justify-between gap-6 py-1.5 border-b border-[var(--border)]">
        <span className="text-[var(--text-secondary)]">スプラット数</span>
        <span className="font-mono text-[var(--accent)]">{splatCount}</span>
      </div>
      <div className="flex justify-between gap-6 py-1.5">
        <span className="text-[var(--text-secondary)]">FPS</span>
        <span className="font-mono text-[var(--accent)]">{fps}</span>
      </div>
    </div>
  );
}
