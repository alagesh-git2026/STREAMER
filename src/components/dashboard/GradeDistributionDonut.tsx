import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Info } from "lucide-react";
import type { Student } from "../../data/students";
import { calculateStreamerPillars } from "../../utils/calculations";
import { BRAND_COLORS } from "../../constants/brandColors";

interface GradeDistributionDonutProps {
  students: Student[];
}

export const GradeDistributionDonut: React.FC<GradeDistributionDonutProps> = ({ students }) => {
  const [hoveredSlice, setHoveredSlice] = useState<{
    name: string;
    short?: string;
    code?: string;
    count: number;
    pct: number;
    color: string;
  } | null>(null);

  const data = React.useMemo(() => {
    let advanced = 0;
    let proficient = 0;
    let developing = 0;
    let emerging = 0;

    students.forEach(student => {
      const pillars = calculateStreamerPillars(student);
      pillars.forEach(p => {
        if (p.ytd >= 85) advanced += 1;
        else if (p.ytd >= 65) proficient += 1;
        else if (p.ytd >= 40) developing += 1;
        else emerging += 1;
      });
    });

    const total = advanced + proficient + developing + emerging;

    // Brand aligned colors: Blue (Advanced), Electric Blue (Proficient), Orangish Red (Developing), Dark Grey (Emerging)
    return {
      total,
      segments: [
        { name: "Advanced (85-100)", short: "Advanced", code: "A", count: advanced, color: BRAND_COLORS.blue },
        { name: "Proficient (65-84)", short: "Proficient", code: "B", count: proficient, color: BRAND_COLORS.electricBlue },
        { name: "Developing (40-64)", short: "Developing", code: "C", count: developing, color: BRAND_COLORS.orangeRed },
        { name: "Emerging (0-39)", short: "Emerging", code: "D", count: emerging, color: BRAND_COLORS.darkGrey },
      ].map(seg => ({
        ...seg,
        pct: total > 0 ? Number(((seg.count / total) * 100).toFixed(1)) : 0,
      }))
    };
  }, [students]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
          <span>Rubric Grade Distribution</span>
        </h3>
        <div title="Total pillar competency evaluations segmented by 4-band rubric standards">
          <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
        </div>
      </div>

      {/* Donut Chart with clean center text and zero-bleed overlay */}
      <div className="relative h-44 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              wrapperStyle={{ zIndex: 100, pointerEvents: "none" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-900/95 text-white px-3.5 py-2 rounded-xl text-xs shadow-2xl border border-slate-700 pointer-events-none select-none z-50">
                      <div className="font-bold flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                        <span>{d.name}</span>
                      </div>
                      <div className="text-slate-300 text-[11px] mt-0.5 font-medium">
                        {d.count} Assessments ({d.pct}%)
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data.segments}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={2.5}
              dataKey="count"
              stroke="none"
              onMouseEnter={(_, index) => setHoveredSlice(data.segments[index])}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              {data.segments.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label: Solid background to prevent any transparency bleed through */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
            {hoveredSlice ? (
              <div className="text-center animate-in fade-in duration-150">
                <span className="text-xl font-display font-black leading-none" style={{ color: hoveredSlice.color }}>
                  {hoveredSlice.pct}%
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-tight block mt-0.5">
                  {hoveredSlice.short}
                </span>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-2xl font-display font-black text-slate-900 leading-none">
                  {data.total}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mt-0.5">
                  Assessments
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown Legend Table with brand colors */}
      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
        {data.segments.map((seg) => (
          <div key={seg.code} className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: seg.color }} />
              <span className="font-medium text-slate-700">{seg.short}</span>
            </div>
            <div className="flex items-center space-x-3 text-right">
              <span className="text-slate-400 text-[11px] font-mono">{seg.count}</span>
              <span className="font-mono font-bold text-slate-800 text-[11px] w-12 text-right">
                {seg.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
