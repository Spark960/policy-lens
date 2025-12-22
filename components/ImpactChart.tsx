"use client";

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrency } from "@/lib/utils";

// --- STRICT TYPES ---
interface ChartProps {
  data: {
    student: { val: number; base: number };
    farmer: { val: number; base: number };
    pro: { val: number; base: number };
  };
}

export default function ImpactChart({ data }: ChartProps) {
  // Logic: Total Monthly Burden on Society
  const totalCost = data.student.val + data.farmer.val + data.pro.val;
  const baseCost = data.student.base + data.farmer.base + data.pro.base;
  
  // Logic: When does it turn red? 
  // Baseline (10% tax) diff is ~8,800. We set threshold at 12,000 to keep baseline green.
  const isHighBurden = (totalCost - baseCost) > 12000;

  const chartData = [
    { month: 'Jan', cost: baseCost + 8000 }, 
    { month: 'Feb', cost: baseCost + 8500 },
    { month: 'Mar', cost: totalCost * 0.98 }, 
    { month: 'Apr', cost: totalCost },       
    { month: 'May', cost: totalCost },
    { month: 'Jun', cost: totalCost },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-end mb-2">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Economic Burden Projection
        </h4>
        <div className={`text-xs font-mono font-bold ${isHighBurden ? "text-red-400" : "text-emerald-400"}`}>
          {isHighBurden ? "▲ HIGH INFLATION" : "● STABLE"}
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0"> 
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorBurden" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '12px' }}
              // FIX: Accept undefined, number, or string. Fallback to 0 if undefined.
              formatter={(value: number | string | undefined) => [
                formatCurrency(Number(value || 0)), 
                "Total Cost"
              ]}
            />
            <Area
              type="monotone"
              dataKey="cost"
              stroke={isHighBurden ? "#ef4444" : "#10b981"} 
              fill={isHighBurden ? "url(#colorBurden)" : "url(#colorSafe)"}
              strokeWidth={3}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}