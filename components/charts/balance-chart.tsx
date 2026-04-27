"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ChartPoint } from "@/types/market";

export function BalanceChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#8da1c9" tickLine={false} axisLine={false} />
          <YAxis stroke="#8da1c9" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: "#08101d", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16 }} />
          <Line type="monotone" dataKey="value" stroke="#ff8e53" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
