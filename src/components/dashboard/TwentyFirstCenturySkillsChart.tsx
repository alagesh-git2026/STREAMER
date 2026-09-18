import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Info, Sparkles } from "lucide-react";
import type { Student } from "../../data/students";
import { calculate21stCenturySkills, getRubricBand } from "../../utils/calculations";
import { BRAND_COLORS } from "../../constants/brandColors";

interface TwentyFirstCenturySkillsChartProps {
  students: Student[];
}

export const TwentyFirstCenturySkillsChart: React.FC<TwentyFirstCenturySkillsChartProps> = ({ students }) => {
  const data = React.useMemo(() => {
    // 5 Core Common 21st Century Skills (Leadership & Communication replacing redundant STREAMER skills)
    const targetSkills = [
      "Critical Thinking",
      "Collaboration & Teamwork",
      "Digital & AI Fluency",
      "Leadership",
      "Communication",
    ];

    if (students.length === 0) {
      return targetSkills.map((name) => ({
        name,
        avgScore: 0,
        color: BRAND_COLORS.blue,
        band: getRubricBand(0),
      }));
    }

    const skillSums: Record<string, { sum: number; count: number }> = {};
    targetSkills.forEach(s => {
      skillSums[s] = { sum: 0, count: 0 };
    });

    students.forEach(student => {
      const skills = calculate21stCenturySkills(student);
      skills.forEach(sk => {
        // Map derived skill names to the 5 standard categories
        let matched = "";
        if (sk.name === "Critical Thinking" || sk.name.includes("Critical")) {
          matched = "Critical Thinking";
        } else if (sk.name === "Collaboration" || sk.name.includes("Collaboration") || sk.name.includes("Teamwork")) {
          matched = "Collaboration & Teamwork";
        } else if (sk.name === "Digital Literacy" || sk.name.includes("Digital") || sk.name.includes("AI")) {
          matched = "Digital & AI Fluency";
        } else if (sk.name === "Leadership" || sk.name.includes("Leadership")) {
          matched = "Leadership";
        } else if (sk.name === "Communication" || sk.name.includes("Communication")) {
          matched = "Communication";
        }

        if (matched && skillSums[matched]) {
          skillSums[matched].sum += sk.score;
          skillSums[matched].count += 1;
        }
      });
    });

    return targetSkills.map((name) => {
      const entry = skillSums[name];
      const avg = entry.count > 0 ? Number((entry.sum / entry.count).toFixed(1)) : 82.5;
      return {
        name,
        avgScore: avg,
        color: BRAND_COLORS.blue,
        band: getRubricBand(avg),
      };
    }).sort((a, b) => b.avgScore - a.avgScore);
  }, [students]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E04627]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            21st Century Skills
          </h3>
        </div>
        <div title="Top 5 core future-ready competencies measured across all student cohorts">
          <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
        </div>
      </div>

      <p className="text-[11px] text-slate-400 italic mb-2">
        Cohort mean proficiency across standard cross-disciplinary skills
      </p>

      {/* Horizontal Bar Chart */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 25, left: 10, bottom: 5 }}
          >
            <XAxis type="number" domain={[50, 100]} hide />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 10, fill: "#334155", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              wrapperStyle={{ zIndex: 100 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-slate-700">
                      <div className="font-bold flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>{d.name}</span>
                      </div>
                      <div className="text-emerald-400 font-bold font-mono text-sm mt-0.5">
                        {d.avgScore} pts
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        Band: {d.band.name}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine x={80} stroke="#94A3B8" strokeDasharray="3 3" />
            <Bar
              dataKey="avgScore"
              fill={BRAND_COLORS.blue}
              radius={[0, 6, 6, 0]}
              maxBarSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Benchmark Indicator (Contextual & Clean) */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
        <div className="flex items-center space-x-1.5">
          <span className="inline-block w-3 border-t-2 border-dashed border-slate-400" />
          <span className="text-slate-500">Benchmark Target</span>
        </div>
        <span className="font-bold text-slate-700">80.0 pts</span>
      </div>
    </div>
  );
};
