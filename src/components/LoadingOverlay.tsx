interface LoadingOverlayProps {
  visible: boolean;
  progress: number;
}

export function LoadingOverlay({ visible, progress }: LoadingOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-[rgba(10,10,15,0.9)] z-[200] flex flex-col items-center justify-center">
      <div className="w-[60px] h-[60px] border-[3px] border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
      <p className="mt-6 text-base text-[var(--text-secondary)]">
        Gaussian Splattingを読み込み中...
      </p>
      <p className="mt-3 font-mono text-sm text-[var(--accent)]">
        {Math.round(progress)}%
      </p>
    </div>
  );
}
