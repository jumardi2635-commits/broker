"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { allocation } from "@/lib/mock-data";

export function AllocationChart() {
  return (
    <div className="flex items-center gap-5">
      <div className="h-32 w-32 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={allocation}
              dataKey="value"
              innerRadius={40}
              outerRadius={62}
              paddingAngle={2}
              stroke="none"
            >
              {allocation.map((slice) => (
                <Cell key={slice.name} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex-1 space-y-2">
        {allocation.map((slice) => (
          <li key={slice.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ background: slice.color }}
              />
              {slice.name}
            </span>
            <span className="font-semibold text-muted-foreground">{slice.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
