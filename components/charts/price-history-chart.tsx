"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ChartPoint } from "@/types/market";

export function PriceHistoryChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#59f2c4" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#59f2c4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
          <XAxis dataKey="date" stroke="#8da1c9" tickLine={false} axisLine={false} />
          <YAxis stroke="#8da1c9" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: "#08101d", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16 }} />
          <Area type="monotone" dataKey="value" stroke="#59f2c4" strokeWidth={3} fill="url(#priceGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
