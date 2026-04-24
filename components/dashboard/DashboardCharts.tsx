"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

export function CollectionsChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats/collections")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="h-[300px] flex items-center justify-center animate-pulse bg-slate-50 rounded-2xl">Chargement...</div>;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="heure" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#94a3b8', fontSize: 12}}
            dy={10}
          />
          <YAxis 
            hide={true} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => [formatCurrency(Number(value)), "Collecté"]}
          />
          <Area 
            type="monotone" 
            dataKey="montant" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorAmount)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PerformanceChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats/performance")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  const COLORS = ['#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'];

  if (loading) return <div className="h-[300px] flex items-center justify-center animate-pulse bg-slate-50 rounded-2xl">Chargement...</div>;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#475569', fontSize: 12, fontWeight: 600}}
          />
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => [formatCurrency(Number(value)), "Total"]}
          />
          <Bar dataKey="total" radius={[0, 8, 8, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
