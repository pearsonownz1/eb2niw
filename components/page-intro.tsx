export function PageIntro({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="max-w-3xl">
      <p className="text-sm font-semibold text-brass">{eyebrow}</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-balance text-navy sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-pretty text-muted">{lede}</p>
    </header>
  );
}
