"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { date: "Day 1", users: 120, volume: 2400, revenue: 2400 },
  { date: "Day 2", users: 132, volume: 2210, revenue: 1398 },
  { date: "Day 3", users: 101, volume: 2290, revenue: 9800 },
  { date: "Day 4", users: 200, volume: 2000, revenue: 3908 },
  { date: "Day 5", users: 250, volume: 2181, revenue: 4800 },
  { date: "Day 6", users: 290, volume: 2500, revenue: 3800 },
  { date: "Day 7", users: 320, volume: 2100, revenue: 4300 },
];

export function AdminMetrics() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
        <YAxis stroke="var(--color-muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
        <Line type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} />
        <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
