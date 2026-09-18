import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useStudentData } from "../context/StudentDataContext";
import { SDG_LIST } from "../data/frameworkData";
import {
  calculateStreamerPillars,
  calculate21stCenturySkills,
  getTopAndBottomSkills,
  getAllSkillsRanked,
  getRubricBand,
  calculateFutureReadyScore
} from "../utils/calculations";
import { triggerLandscapePdfPrint } from "../utils/executiveExportUtils";
import { ExecutiveStudentDossierReport } from "../components/dashboard/ExecutiveStudentDossierReport";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from "recharts";
import {
  ArrowLeft,
  Printer,
  Calendar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Target,
  Sparkles,
  TrendingUp,
  BookOpen
} from "lucide-react";

export const StudentReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isFormulaExpanded, setIsFormulaExpanded] = useState(false);
  const { students } = useStudentData();

  const student = useMemo(() => {
    return students.find((s) => s.id === id) || null;
  }, [students, id]);

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Student Dossier Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">No enrolled learner matching ID "{id}" was found in the LOF registry.</p>
        <Link
          to="/insights"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-streamer-science text-white text-xs font-semibold shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Performance Insights</span>
        </Link>
      </div>
    );
  }

  // Calculations
  const pillars = calculateStreamerPillars(student);
  const twentyFirstCentury = calculate21stCenturySkills(student);
  const { top5, bottom5 } = getTopAndBottomSkills(student);
  const allSkills = getAllSkillsRanked(student);
  const futureReady = calculateFutureReadyScore(student);

  // Radar data format for Recharts
  const radarData = pillars.map(p => ({
    pillar: p.pillar,
    score: p.ytd,
    fullMark: 100
  }));

  // Flatten all projects for timeline
  const allProjects = useMemo(() => {
    const list: {
      skillCategory: string;
      projectName: string;
      date: string;
      score: number;
      sdgTags: string[];
    }[] = [];

    Object.entries(student.skillScores).forEach(([cat, detail]) => {
      detail.byProject.forEach(p => {
        list.push({
          skillCategory: cat,
          projectName: p.projectName,
          date: p.date,
          score: p.score,
          sdgTags: p.sdgTags
        });
      });
    });

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [student]);

  const handlePrint = () => {
    triggerLandscapePdfPrint(`Student_Dossier_${student.name}`);
  };

  const getBadgeColor = (tier: string) => {
    switch (tier) {
      case "Explorer": return "bg-blue-50 text-blue-900 border-blue-200";
      case "Builder": return "bg-emerald-50 text-emerald-900 border-emerald-200";
      case "Innovator": return "bg-purple-50 text-purple-900 border-purple-200";
      case "Skill Mastery": return "bg-amber-50 text-amber-900 border-amber-200";
      default: return "bg-slate-50 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-background text-slate-900 hide-on-print">
      {/* Top Bar: Navigation & Print Action */}
      <div className="flex items-center justify-between mb-6 no-print">
        <Link
          to="/insights"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-streamer-science transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Performance Insights</span>
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold transition-colors shadow-xs"
        >
          <Printer className="w-4 h-4 text-streamer-science" />
          <span>Download / Print Report</span>
        </button>
      </div>

      {/* 1. Header: Student Profile Information */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 mb-8 shadow-sm card-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-4">
            {/* Photo Avatar / Placeholder */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-streamer-science to-streamer-engineering flex items-center justify-center text-white font-display font-bold text-2xl sm:text-3xl shadow-md shrink-0">
              {student.name.split(" ").map(n => n[0]).join("")}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  {student.name}
                </h1>
                <span className="font-mono text-xs font-semibold text-slate-600 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
                  ID: {student.id}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
                <span className="flex items-center space-x-1 font-semibold text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{student.centre.city}, {student.centre.country}</span>
                </span>
                <span>•</span>
                <span>{student.grade} (Age {student.age})</span>
                <span>•</span>
                <span className="font-mono text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {student.batch}
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1 font-mono text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Enrolled (Day 0): {student.enrolledDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Headline Composite Score */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-6 self-start md:self-auto shadow-xs">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Future Ready Index</div>
              <div className="text-3xl font-display font-bold text-emerald-600">
                {futureReady.futureReadyScore}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Composite Score</div>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Track Domain</div>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {student.domain}
              </div>
              <div className="text-[10px] text-streamer-science font-semibold">K-12 Talent Pipeline</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DSR Diagnostic Study Panel */}
      <div className="mb-8">
        {student.diagnostic && student.diagnostic.attended ? (
          /* Attended DSR State: Styled as distinct Report Card */
          <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-blue-200 shadow-sm relative overflow-hidden card-print">
            <div className="absolute top-0 right-0 bg-streamer-science text-white text-[11px] font-bold px-3.5 py-1 rounded-bl-2xl uppercase tracking-wider shadow-xs">
              Diagnostic Study Record (DSR)
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-display font-bold text-slate-900">
                    Diagnostic Completed: {student.diagnostic.levelTested}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  Proctored baseline evaluation taken on <span className="font-mono text-slate-900 font-bold">{student.diagnostic.date}</span>.
                </p>
              </div>

              {/* DSR Metrics Badges */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Questions</div>
                  <div className="text-base font-display font-bold text-slate-900 mt-0.5">
                    {student.diagnostic.questionsCorrect} <span className="text-xs text-slate-400 font-normal">/ {student.diagnostic.questionsTotal}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Time Taken</div>
                  <div className="text-base font-display font-bold text-slate-900 mt-0.5">
                    {student.diagnostic.timeUsedMinutes}m <span className="text-xs text-slate-400 font-normal">/ {student.diagnostic.timeAllowedMinutes}m</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Score</div>
                  <div className="text-base font-display font-bold text-streamer-science mt-0.5">
                    {Math.round((student.diagnostic.questionsCorrect! / student.diagnostic.questionsTotal!) * 100)}%
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 col-span-3 sm:col-span-1">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Placed Level</div>
                  <div className="text-sm font-display font-bold text-emerald-600 mt-0.5">
                    {student.diagnostic.placedLevel}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Unattended State */
          <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 text-amber-950 card-print shadow-xs">
            <div className="flex items-start space-x-3.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-display font-bold text-amber-950 flex items-center space-x-2">
                  <span>No diagnostic on file — placed by trainer assessment</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900 border border-amber-300">
                    Direct Entry
                  </span>
                </h3>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed font-normal">
                  Per the Diagnostic Study Framework (Section 2), learners in open Exploration tracks or direct trainer-assessed placement skip the initial 45-minute timed test. Baseline competencies are tracked through continuous project-based formative evaluations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Main Grid: Radar Chart & Top/Bottom Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left Column (5 cols): 8-Pillar Radar Chart */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm card-print">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-display font-bold text-slate-900 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-streamer-science" />
                <span>STREAMER Radar Profile</span>
              </h3>
              <span className="text-xs font-mono font-semibold text-slate-500">Current YTD</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-normal">
              Visualizes holistic balance across all 8 foundational pillars. Smooth animated draw-in on load.
            </p>

            {/* Radar Canvas */}
            <div className="w-full h-72 sm:h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis 
                    dataKey="pillar" 
                    tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: "#94A3B8", fontSize: 9 }} 
                  />
                  <Radar
                    name="Student Score"
                    dataKey="score"
                    stroke="#2255A4"
                    strokeWidth={2}
                    fill="#2255A4"
                    fillOpacity={0.35}
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs shadow-xl text-slate-800">
                            <div className="font-bold text-slate-900">{data.pillar}</div>
                            <div className="font-mono text-streamer-science font-bold mt-0.5">{data.score} / 100 pts</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Pillar Scores Legend */}
          <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100">
            {pillars.map((p, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <div className="text-[10px] font-mono text-slate-400 font-bold">{p.letter}</div>
                <div className="text-xs font-display font-bold text-slate-900 mt-0.5">{p.ytd}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (7 cols): Top 5 & Bottom 5 Rankings */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top 5 Strengths */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm card-print">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
              <TrendingUp className="w-4 h-4" />
              <span>Top 5 Competency Strengths</span>
            </div>
            <div className="space-y-2.5">
              {top5.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-mono text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">
                        {item.skillName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 mt-0.5 font-medium">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: item.pillarColor }} 
                        />
                        <span>{item.pillar}</span>
                        {item.delta !== null && (
                          <span className="text-emerald-700 font-mono font-semibold">
                            (+{item.delta} since Day 0)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-display font-bold text-slate-900">
                      {item.ytd}
                    </div>
                    <span 
                      className="text-[10px] font-bold px-2 py-0.5 rounded border"
                      style={{ 
                        backgroundColor: `${item.rubric.color}15`, 
                        color: item.rubric.color,
                        borderColor: `${item.rubric.color}30`
                      }}
                    >
                      {item.rubric.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom 5 Growth Focus Areas */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm card-print">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">
              <Target className="w-4 h-4" />
              <span>Growth Focus Areas (Bottom 5 Opportunities)</span>
            </div>
            <div className="space-y-2.5">
              {bottom5.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 font-mono text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">
                        {item.skillName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 mt-0.5 font-medium">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: item.pillarColor }} 
                        />
                        <span>{item.pillar}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-display font-bold text-slate-900">
                      {item.ytd}
                    </div>
                    <span 
                      className="text-[10px] font-bold px-2 py-0.5 rounded border"
                      style={{ 
                        backgroundColor: `${item.rubric.color}15`, 
                        color: item.rubric.color,
                        borderColor: `${item.rubric.color}30`
                      }}
                    >
                      {item.rubric.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Complete Skill Scorecard */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 mb-8 shadow-sm card-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900">
              Holistic Skill Scorecard & Longitudinal Growth
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Comparison between Day 0 baseline diagnostic and current YTD demonstration.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <span className="flex items-center space-x-1.5 text-slate-500">
              <span className="w-3 h-3 rounded bg-slate-300 inline-block" />
              <span>Day 0 Baseline</span>
            </span>
            <span className="flex items-center space-x-1.5 text-slate-900">
              <span className="w-3 h-3 rounded bg-streamer-science inline-block" />
              <span>Current YTD</span>
            </span>
          </div>
        </div>

        <div className="space-y-3.5">
          {allSkills.map((item, idx) => {
            const hasBaseline = item.day0 !== null;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2.5">
                    <span 
                      className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold text-white shadow-xs"
                      style={{ backgroundColor: item.pillarColor }}
                    >
                      {item.pillar}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {item.skillName}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-medium">
                    {hasBaseline ? (
                      <span className="text-slate-500 font-mono">
                        Day 0: <strong className="text-slate-700">{item.day0}</strong>
                      </span>
                    ) : (
                      <span className="text-slate-400 italic font-mono text-[11px]">
                        Day 0: Direct Placement
                      </span>
                    )}
                    <span className="text-slate-400">→</span>
                    <span className="text-slate-900 font-mono font-bold">
                      YTD: {item.ytd}
                    </span>
                    {hasBaseline && item.delta !== null && (
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                        item.delta >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {item.delta >= 0 ? `+${item.delta}` : item.delta} pts
                      </span>
                    )}
                    <span 
                      className="text-[10px] font-bold px-2 py-0.5 rounded border ml-1"
                      style={{ 
                        backgroundColor: `${item.rubric.color}15`, 
                        color: item.rubric.color,
                        borderColor: `${item.rubric.color}30`
                      }}
                    >
                      {item.rubric.name}
                    </span>
                  </div>
                </div>

                {/* Comparative Progress Bar */}
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden relative flex items-center">
                  {hasBaseline && (
                    <div 
                      className="absolute top-0 bottom-0 bg-slate-400 rounded-full z-0"
                      style={{ width: `${item.day0}%` }}
                    />
                  )}
                  <div 
                    className="h-full rounded-full transition-all duration-500 relative z-10 shadow-xs"
                    style={{ 
                      width: `${item.ytd}%`,
                      backgroundColor: item.pillarColor
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. 21st Century Skills Derived Panel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 mb-8 shadow-sm card-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-streamer-engineering uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Derived Capabilities</span>
            </div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mt-1">
              21st Century Skills Mapping
            </h3>
          </div>
          <button
            onClick={() => setIsFormulaExpanded(!isFormulaExpanded)}
            className="flex items-center space-x-1.5 text-xs text-streamer-science hover:text-blue-700 bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-200 transition-colors self-start sm:self-auto font-semibold"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How these scores are calculated</span>
            {isFormulaExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Calculation Transparency Accordion */}
        {isFormulaExpanded && (
          <div className="mb-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
            <div className="font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-streamer-science" />
              <span>Transparent Mathematical Derivation Formula:</span>
            </div>
            <p className="text-slate-600 font-normal">
              To guarantee transparency for parents and corporate STEM recruiters, 21st Century Skills are strictly derived from verified STREAMER pillar scores and project presentation evaluations — they are never arbitrarily assigned:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] pt-2 text-slate-800">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">Critical Thinking = average(Research, Science)</div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">Creativity = Arts (direct)</div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">Communication = Presentation Add-on (direct)</div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">Collaboration = average(Presentation, Entrepreneurship)</div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">Digital Literacy = average(Technology, Engineering)</div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">Leadership = average(Entrepreneurship, Presentation)</div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">Adaptability = Resilience (direct)</div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">Initiative = average(Entrepreneurship, Resilience)</div>
            </div>
          </div>
        )}

        {/* 21st Century Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {twentyFirstCentury.map((skill, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs text-slate-500 font-semibold">{skill.name}</div>
                <div className="text-2xl font-display font-bold text-slate-900 mt-1">
                  {skill.score}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 text-[10px] text-slate-500 font-mono font-medium">
                Formula: {skill.formula}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Badges Earned Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 mb-8 shadow-sm card-print">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
          <Award className="w-4 h-4" />
          <span>Accreditation & Badging</span>
        </div>
        <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-4">
          Verified Micro-Credentials Earned ({student.badges.length})
        </h3>

        {student.badges.length === 0 ? (
          <p className="text-xs text-slate-500">No badges awarded yet for this student.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {student.badges.map((badge, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex items-start space-x-3.5 shadow-xs ${getBadgeColor(badge.tier)}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-slate-900">{badge.name}</div>
                  <div className="text-xs font-semibold opacity-90 mt-0.5">Tier: {badge.tier}</div>
                  <div className="text-[10px] opacity-75 font-mono mt-1">Earned on {badge.dateEarned}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Per-Project Performance Timeline with SDG Tags */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm card-print">
        <div className="flex items-center space-x-2 text-xs font-bold text-streamer-arts uppercase tracking-wider mb-2">
          <Target className="w-4 h-4" />
          <span>Project-Based Learning Evidence</span>
        </div>
        <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-4">
          Project Performance Portfolio & SDG Alignment
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Project Name</th>
                <th className="py-3 px-4">Evaluated Competency</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">SDG Alignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allProjects.map((p, idx) => {
                const rubric = getRubricBand(p.score);
                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {p.projectName}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 font-medium">
                      {p.skillCategory}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">
                      {p.date}
                    </td>
                    <td className="py-3 px-4">
                      <span 
                        className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold border"
                        style={{ 
                          backgroundColor: `${rubric.color}15`, 
                          color: rubric.color,
                          borderColor: `${rubric.color}30` 
                        }}
                      >
                        {p.score} pts
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {p.sdgTags.map((tag) => {
                          const sdg = SDG_LIST[tag];
                          return (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded text-[11px] font-bold text-white shadow-xs"
                              style={{ backgroundColor: sdg?.color || "#3B82F6" }}
                              title={sdg?.name}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Dedicated Printable Single Landscape Dossier Report */}
      <div className="hidden print-only-block">
        <ExecutiveStudentDossierReport
          students={[student]}
          focalStudentId={student.id}
          isPrintOnly={true}
        />
      </div>
    </div>
  );
};
