import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Point {
  period: string;
  value: number;
}

interface Props {
  series: Point[];
  color?: string;
  unit?: string;
}

const INK = "#1a1714";
const FONT = "Inter, 'Segoe UI', sans-serif";

function compact(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${Math.round(value / 1_000)}k`;
  return String(value);
}

/**
 * Single-series cumulative trend chart. Deliberately simple: one series,
 * no zoom, no brush, readable on a phone. Communication, not analysis.
 * Styled to the imigongo system: hairline grid, Inter tabular ticks,
 * kaolin tooltip card, gradient fill from the theme accent.
 */
export default function TrendChart({ series, color = "#175943", unit = "" }: Props) {
  const gradientId = `fill-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.32} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(26,23,20,0.09)" vertical={false} />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 11, fill: "rgba(26,23,20,0.72)", fontFamily: FONT }}
            tickLine={false}
            axisLine={{ stroke: "rgba(26,23,20,0.18)" }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={compact}
            tick={{
              fontSize: 11,
              fill: "rgba(26,23,20,0.72)",
              fontFamily: FONT,
            }}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip
            formatter={(value) => [`${Number(value).toLocaleString("en-US")} ${unit}`.trim(), ""]}
            separator=""
            cursor={{ stroke: "rgba(26,23,20,0.25)", strokeWidth: 1 }}
            contentStyle={{
              background: "#fffdf8",
              border: "1px solid rgba(26,23,20,0.14)",
              borderRadius: 10,
              boxShadow: "0 12px 32px -12px rgba(26,23,20,0.35)",
              fontSize: 12,
              fontFamily: FONT,
              color: INK,
              padding: "8px 12px",
            }}
            labelStyle={{
              fontWeight: 600,
              color: INK,
              marginBottom: 2,
              fontFamily: FONT,
            }}
            itemStyle={{ color, fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: "#fffdf8" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
