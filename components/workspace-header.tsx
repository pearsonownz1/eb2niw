export function WorkspaceHeader({ title, lede }: { title: string; lede: string }) {
  return (
    <header className="border-b border-line px-5 py-8 sm:px-8">
      <h1 className="font-serif text-4xl leading-tight tracking-tight text-near sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{lede}</p>
    </header>
  );
}
