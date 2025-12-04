export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-[30px] py-5 flex justify-between items-center bg-gradient-to-b from-[var(--bg-primary)] to-transparent pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-10 h-10 rounded-[10px] object-contain"
        />
        <div className="font-bold text-xl tracking-tight">
          <span className="text-[var(--accent)]">Splat</span>Viewer
        </div>
      </div>
    </header>
  );
}
