export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-[30px] py-5 flex justify-between items-center bg-gradient-to-b from-[var(--bg-primary)] to-transparent pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3">
        <div className="w-10 h-10 bg-[var(--accent)] rounded-[10px] flex items-center justify-center font-bold text-[var(--bg-primary)] text-lg">
          3D
        </div>
        <div className="font-bold text-xl tracking-tight">
          Gaussian<span className="text-[var(--accent)]">Splat</span>
        </div>
      </div>
    </header>
  );
}
