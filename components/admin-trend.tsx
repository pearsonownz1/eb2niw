import type { TrendPoint } from "@/lib/admin-model";

const series = [
  { key: "submissions", label: "Quiz submissions", color: "#17324f" },
  { key: "optIns", label: "News opt-ins", color: "#6f4a22" },
  { key: "signups", label: "Signups", color: "#1d5c40" },
  { key: "purchases", label: "Purchases", color: "#1b2430" },
] as const;

export function AdminTrend({ points, truncated }: { points: TrendPoint[]; truncated: boolean }) {
  const max = Math.max(1, ...points.flatMap((point) => series.map((item) => point[item.key])));
  const width = Math.max(points.length * 52, 320);
  const height = 220;
  const pad = { left: 32, right: 12, top: 16, bottom: 36 };
  const innerWidth = width - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;
  const labelStep = points.length > 16 ? Math.ceil(points.length / 8) : 1;

  function xAt(index: number): number {
    if (points.length <= 1) return pad.left + innerWidth / 2;
    return pad.left + (index / (points.length - 1)) * innerWidth;
  }

  function yAt(value: number): number {
    return pad.top + innerHeight - (value / max) * innerHeight;
  }

  return (
    <section className="rounded-2xl border border-line bg-raised p-4 sm:p-5" aria-labelledby="admin-trend-title">
      <h2 id="admin-trend-title" className="font-serif text-2xl text-near">
        Activity by day
      </h2>
      {truncated ? <p className="mt-1 text-sm text-muted">The chart shows the latest 45 days in this range.</p> : null}
      <div className="mt-4 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-labelledby="admin-trend-title">
          {[0, 0.5, 1].map((step) => {
            const value = Math.round(max * step);
            const y = yAt(value);
            return (
              <g key={step}>
                <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#e4d8c4" />
                <text x={0} y={y + 4} fill="#3e4c5f" fontSize="11">
                  {value}
                </text>
              </g>
            );
          })}
          {series.map((item) => {
            const pointsText = points.map((point, index) => `${xAt(index)},${yAt(point[item.key])}`).join(" ");
            return (
              <g key={item.key}>
                <polyline fill="none" stroke={item.color} strokeWidth="2" points={pointsText} />
                {points.map((point, index) => (
                  <circle key={`${item.key}-${point.day}`} cx={xAt(index)} cy={yAt(point[item.key])} r="2.5" fill={item.color} />
                ))}
              </g>
            );
          })}
          {points.map((point, index) =>
            index % labelStep === 0 ? (
              <text key={point.day} x={xAt(index)} y={height - 10} textAnchor="middle" fill="#3e4c5f" fontSize="11">
                {shortDay(point.day)}
              </text>
            ) : null,
          )}
        </svg>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
        {series.map((item) => (
          <li key={item.key} className="flex items-center gap-2">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
            {item.label}
          </li>
        ))}
      </ul>
      <table className="sr-only">
        <caption>Daily counts</caption>
        <thead>
          <tr>
            <th>Day</th>
            {series.map((item) => (
              <th key={item.key}>{item.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.day}>
              <th>{point.day}</th>
              {series.map((item) => (
                <td key={item.key}>{point[item.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function shortDay(day: string): string {
  const [, month, date] = day.split("-");
  return `${Number(month)}/${Number(date)}`;
}
