import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Info } from "lucide-react";
import type { Student } from "../../data/students";
import { calculateStreamerPillars } from "../../utils/calculations";
import { BRAND_COLORS } from "../../constants/brandColors";

interface PillarPerformanceBarChartProps {
  students: Student[];
}

export const PillarPerformanceBarChart: React.FC<PillarPerformanceBarChartProps> = ({ students }) => {
  const chartData = React.useMemo(() => {
    const pillars = [
      { name: "Science", code: "S" },
      { name: "Technology", code: "T" },
      { name: "Research", code: "R" },
      { name: "Engineering", code: "E" },
      { name: "Arts", code: "A" },
      { name: "Mathematics", code: "M" },
      { name: "Entrepreneurship", code: "En" },
      { name: "Resilience", code: "Re" },
    ];

    if (students.length === 0) {
      return pillars.map(p => ({ ...p, avgScore: 0, perfectPct: 0 }));
    }

    return pillars.map(pillarDef => {
      let sum = 0;
      let topMasteryCount = 0;

      students.forEach(student => {
        const studentPillars = calculateStreamerPillars(student);
        const match = studentPillars.find(p => p.pillar === pillarDef.name);
        if (match) {
          sum += match.ytd;
          if (match.ytd >= 80) {
            topMasteryCount += 1;
          }
        }
      });

      const avg = Number((sum / students.length).toFixed(1));
      const perfectPct = Number(((topMasteryCount / students.length) * 100).toFixed(1));

      return {
        name: pillarDef.name,
        code: pillarDef.code,
        avgScore: avg,
        perfectPct: perfectPct,
      };
    });
  }, [students]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Subject & Pillar Performance
          </h3>
          <p className="text-[11px] text-slate-400 italic mt-0.5">
            Average Score (Brand Blue) & High-Mastery % ≥80 (Orangish Red) across 8 pillars
          </p>
        </div>

        {/* Legend matching Brand Colors */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: BRAND_COLORS.blue }} />
            <span className="text-[11px] font-medium">Average Score</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: BRAND_COLORS.orangeRed }} />
            <span className="text-[11px] font-medium">Top Mastery %</span>
          </div>
          <div title="Pillar average scores in Brand Blue with overlaid percentage of students achieving high mastery in Brand Orangish Red">
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 20, left: -20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#334155", fontWeight: 600 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              axisLine={{ stroke: "#CBD5E1" }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              domain={[60, 100]}
              tick={{ fontSize: 10, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              hide
            />
            <Tooltip
              wrapperStyle={{ zIndex: 100 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl text-xs shadow-xl border border-slate-700">
                      <div className="font-bold text-sm text-slate-100 mb-1">{d.name} Pillar</div>
                      <div className="flex items-center justify-between space-x-4 text-slate-300">
                        <span>Average Score:</span>
                        <span className="font-bold text-white font-mono" style={{ color: BRAND_COLORS.electricBlue }}>
                          {d.avgScore} pts
                        </span>
                      </div>
                      <div className="flex items-center justify-between space-x-4 mt-0.5" style={{ color: BRAND_COLORS.orangeRed }}>
                        <span>High Mastery (≥80%):</span>
                        <span className="font-bold font-mono">{d.perfectPct}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Brand Blue Rounded Bars */}
            <Bar
              yAxisId="left"
              dataKey="avgScore"
              fill={BRAND_COLORS.blue}
              radius={[8, 8, 0, 0]}
              maxBarSize={36}
            />
            {/* Brand Orangish Red Trendline */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="perfectPct"
              stroke={BRAND_COLORS.orangeRed}
              strokeWidth={2.5}
              dot={{ r: 4, fill: BRAND_COLORS.orangeRed, strokeWidth: 1.5, stroke: "#FFFFFF" }}
              activeDot={{ r: 6, fill: "#DC2626" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
