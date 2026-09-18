import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Info } from "lucide-react";
import type { Student } from "../../data/students";

interface CohortStatusGaugeProps {
  students: Student[];
}

export const CohortStatusGauge: React.FC<CohortStatusGaugeProps> = ({ students }) => {
  const data = React.useMemo(() => {
    const gradeCounts: Record<string, number> = {};
    students.forEach(s => {
      gradeCounts[s.grade] = (gradeCounts[s.grade] || 0) + 1;
    });

    const colors = ["#1E293B", "#3B82F6", "#0E7C6F", "#F59E0B"];
    const entries = Object.entries(gradeCounts).map(([grade, count], i) => ({
      name: grade,
      count,
      pct: students.length > 0 ? Number(((count / students.length) * 100).toFixed(1)) : 0,
      color: colors[i % colors.length],
    }));

    return {
      total: students.length,
      entries,
    };
  }, [students]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
          <span>Cohort Enrollment & Level</span>
        </h3>
        <div title="Active cohort distribution by grade tier and center enrollment">
          <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
        </div>
      </div>

      {/* Donut Chart & Center Metric */}
      <div className="relative h-44 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-lg border border-slate-700">
                      <div className="font-bold">{d.name}</div>
                      <div className="text-slate-300 text-[11px] mt-0.5">
                        {d.count} Students ({d.pct}%)
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data.entries}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={3}
              dataKey="count"
              stroke="none"
            >
              {data.entries.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label matching reference screenshot */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-display font-black text-slate-900 leading-none">
            {data.total}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
            Students
          </span>
        </div>
      </div>

      {/* Breakdown Legend Table */}
      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
        {data.entries.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-slate-700">{item.name}</span>
            </div>
            <div className="flex items-center space-x-3 text-right">
              <span className="text-slate-400 text-[11px] font-mono">{item.count}</span>
              <span className="font-mono font-bold text-slate-800 text-[11px] w-12 text-right">
                {item.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
