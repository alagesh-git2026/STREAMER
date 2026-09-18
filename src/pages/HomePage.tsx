import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  STREAMER_PILLARS, 
  REAR_PILLARS_DATA,
  UNIQUE_21ST_CENTURY_SKILLS,
  SDG_GOALS_DETAILED,
  type StreamerPillar,
  type Unique21stCenturySkill,
  type SdgGoalDetailed,
  type SdgProjectMapping
} from "../data/frameworkData";
import { SkillBlueprintModal } from "../components/SkillBlueprintModal";
import { CenturySkillModal } from "../components/CenturySkillModal";
import { SdgBlueprintModal } from "../components/SdgBlueprintModal";
import { SdgIconTile } from "../components/SdgIconTile";
import { 
  ArrowRight, 
  Layers, 
  Sparkles, 
  Search, 
  Palette, 
  Briefcase, 
  RefreshCw, 
  CheckCircle,
  HelpCircle,
  Activity,
  SlidersHorizontal,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Filter
} from "lucide-react";

export const HomePage: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<StreamerPillar | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRearTab, setActiveRearTab] = useState<string>("all");

  // 21st Century Skills Modal State
  const [selectedCenturySkill, setSelectedCenturySkill] = useState<Unique21stCenturySkill | null>(null);
  const [isCenturyModalOpen, setIsCenturyModalOpen] = useState(false);

  // SDG Goals Modal & Customization State
  const [selectedSdg, setSelectedSdg] = useState<SdgGoalDetailed | null>(null);
  const [isSdgModalOpen, setIsSdgModalOpen] = useState(false);
  const [sdgBatchFilter, setSdgBatchFilter] = useState<"All" | "Alpha-2026" | "Beta-2026" | "Custom">("All");
  const [sdgGoalsList, setSdgGoalsList] = useState<SdgGoalDetailed[]>(SDG_GOALS_DETAILED);

  const getRearIcon = (id: string) => {
    switch (id) {
      case "research":
        return <Search className="w-3.5 h-3.5" />;
      case "arts":
        return <Palette className="w-3.5 h-3.5" />;
      case "entrepreneurship":
        return <Briefcase className="w-3.5 h-3.5" />;
      case "resilience":
        return <RefreshCw className="w-3.5 h-3.5" />;
      default:
        return <Activity className="w-3.5 h-3.5" />;
    }
  };

  const openBlueprint = (pillar: StreamerPillar) => {
    setSelectedPillar(pillar);
    setIsModalOpen(true);
  };

  const openBlueprintForId = (pillarId: string) => {
    const p = STREAMER_PILLARS.find(item => item.id.toLowerCase() === pillarId.toLowerCase());
    if (p) {
      setSelectedPillar(p);
      setIsModalOpen(true);
    }
  };

  const openCenturyBlueprint = (skill: Unique21stCenturySkill) => {
    setSelectedCenturySkill(skill);
    setIsCenturyModalOpen(true);
  };

  const openSdgBlueprint = (sdg: SdgGoalDetailed) => {
    setSelectedSdg(sdg);
    setIsSdgModalOpen(true);
  };

  const handleAddCustomProjectToSdg = (sdgId: string, newProj: SdgProjectMapping) => {
    setSdgGoalsList(prev => prev.map(item => {
      if (item.id === sdgId) {
        return {
          ...item,
          mappedProjects: [...item.mappedProjects, newProj]
        };
      }
      return item;
    }));
  };

  return (
    <div className="min-h-screen pb-16 bg-background text-slate-900">
      {/* 1. Hero Section with World Map Motif */}
      <section className="relative overflow-hidden pt-12 pb-16 md:py-20 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50/50 to-background">
        {/* Subtle World Map Line-Art Motif */}
        <div className="absolute inset-0 pointer-events-none opacity-15 flex items-center justify-center">
          <svg className="w-full h-full max-w-6xl text-slate-400" viewBox="0 0 1000 500" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M150,150 Q200,80 300,100 T450,130 T600,100 T750,140 T900,160" />
            <path d="M100,250 Q250,220 400,260 T700,240 T880,270" />
            <path d="M180,380 Q320,330 480,370 T720,350 T850,390" />
            <circle cx="260" cy="200" r="140" strokeDasharray="4 6" />
            <circle cx="700" cy="220" r="160" strokeDasharray="4 6" />
            <circle cx="680" cy="250" r="5" fill="#2255A4" />
            <circle cx="580" cy="220" r="5" fill="#0E7C6F" />
            <circle cx="240" cy="190" r="5" fill="#B65529" />
            <circle cx="780" cy="210" r="5" fill="#5A3FA0" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, description, metrics, CTAs */}
            <div className="lg:col-span-7">
              {/* Positioning Tag */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 mb-6 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-streamer-science animate-pulse" />
                <span>Lab of Future (LOF) • Global Educational Architecture</span>
              </div>

              {/* Page Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                The <span className="text-streamer-science">STREAMER</span> Framework
              </h1>

              {/* One-Sentence Positioning Statement */}
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                STREAMER is a technology-integrated, interdisciplinary educational layer that enhances existing curricula by transforming learning into a measurable system of innovation, research, and real-world application.
              </p>

              {/* Quick Metrics Bar */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div>
                  <div className="text-2xl font-display font-bold text-slate-900">8</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Core Pillars</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-slate-900">10</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Competencies</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-slate-900">6</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Mapped SDGs</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-slate-900">4</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Global Nations</div>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/insights"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-streamer-science hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-streamer-science/20"
                >
                  <span>View Performance Insights</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/profiles"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm transition-all shadow-xs"
                >
                  <span>Explore Future Ready Profiles</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Sci-Fi Model Visual */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative group max-w-md w-full">
                {/* Ambient glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-streamer-science via-cyan-400 to-streamer-engineering rounded-3xl blur-md opacity-25 group-hover:opacity-40 transition-opacity" />
                
                {/* Main Image Frame */}
                <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl">
                  <img
                    src={`${import.meta.env.BASE_URL}streamer-hero.jpg`}
                    alt="STREAMER Sci-Fi Model — Aerospace, Robotics & Space Exploration"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Floating Tech HUD Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-streamer-science font-mono">
                        STREAMER Concept Model
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        Autonomous Builder & Explorer
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active AI
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STREAMER 8 Pillar Tiles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-streamer-science uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Framework Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
              Eight Pillars of Modern Mastery
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-2 sm:mt-0">
            A comprehensive 8-dimensional framework empowering students with verified K-12 competencies across scientific theory, hands-on building, and real-world problem-solving.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STREAMER_PILLARS.map((pillar) => {
            return (
              <div
                key={pillar.id}
                className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-xl"
                style={{
                  borderTop: `5px solid ${pillar.color}`
                }}
              >
                <div>
                  {/* Pillar Badge & Letter */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center font-display font-bold text-xl text-white shadow-md"
                      style={{ backgroundColor: pillar.color }}
                    >
                      {pillar.letter}
                    </div>
                    <span 
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: `${pillar.color}15`,
                        color: pillar.color,
                        border: `1px solid ${pillar.color}30`
                      }}
                    >
                      {pillar.focus}
                    </span>
                  </div>

                  {/* Pillar Name */}
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                    {pillar.name}
                  </h3>

                  {/* Mapped Skills Chips */}
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {pillar.mappedSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* "What It Checks For" Description */}
                  <p className="text-xs text-slate-600 leading-relaxed italic mb-4 font-medium">
                    "{pillar.whatItChecksFor}"
                  </p>
                </div>

                {/* View Skill Blueprint Link / Button */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => openBlueprint(pillar)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-streamer-science"
                  >
                    <span>View skill blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. "Why STREAMER" Section — The REAR Optimization Engine */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          {/* Header spanning full width */}
          <div className="w-full mb-8">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-streamer-science uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Pedagogical Rationale • The REAR Optimization Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 leading-tight">
              Why STREAMER? How the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-pink-600 to-blue-600">"REAR"</span> Brakes Turn STEM Propulsion into Mastery
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
              Raw acceleration without control causes catastrophic crashes. In STREAMER, traditional <strong>STEM (Science, Technology, Engineering, Math)</strong> acts as the forward engine—providing raw power, code, and mechanics. Meanwhile, <strong>REAR (Research, Entrepreneurship, Arts, Resilience)</strong> acts as the vital four-wheel braking and stabilization system that steers, balances costs, ensures human usability, and cushions the shock of failure.
            </p>
          </div>

          {/* Interactive STREAMER Drivetrain / Train HUD */}
          <div className="p-4 sm:p-7 rounded-3xl bg-slate-900 text-white shadow-2xl mb-10 border border-slate-800 relative overflow-hidden">
            {/* Header / Subtitle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                  STREAMER Train Chain: 4 STEM Engines (Propulsion) ⇄ 4 REAR Brakes (Stability & Control)
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-amber-300 font-semibold">Spotlight on REAR Brakes:</span>
                <span>Click any highlighted brake car to inspect its feedback loop</span>
              </div>
            </div>

            {/* Train Formation Track Display */}
            <div className="relative overflow-x-auto pb-4 pt-5 px-1 custom-scrollbar">
              {/* The 8 Coupled Carriages */}
              <div className="min-w-[840px] flex items-end justify-between px-2 relative z-10">
                {[
                  {
                    id: "science",
                    letter: "S",
                    name: "Science",
                    color: "#2255A4",
                    isRear: false,
                    roleTitle: "Lead Locomotive",
                    typeLabel: "⚡ Drive 1",
                    subLabel: "Theory Propulsion",
                    rearKey: null,
                  },
                  {
                    id: "technology",
                    letter: "T",
                    name: "Technology",
                    color: "#0E7C6F",
                    isRear: false,
                    roleTitle: "Power Bogie",
                    typeLabel: "⚡ Drive 2",
                    subLabel: "Circuits Engine",
                    rearKey: null,
                  },
                  {
                    id: "research",
                    letter: "R",
                    name: "Research",
                    color: "#B65529",
                    isRear: true,
                    roleTitle: "Brake Car 01",
                    typeLabel: "🛑 REAR BRAKE 1",
                    subLabel: "Empirical Truth",
                    rearKey: "research",
                  },
                  {
                    id: "engineering",
                    letter: "E",
                    name: "Engineering",
                    color: "#5A3FA0",
                    isRear: false,
                    roleTitle: "Chassis Bogie",
                    typeLabel: "⚡ Drive 3",
                    subLabel: "Hardware Chassis",
                    rearKey: null,
                  },
                  {
                    id: "arts",
                    letter: "A",
                    name: "Arts",
                    color: "#C23768",
                    isRear: true,
                    roleTitle: "Brake Car 02",
                    typeLabel: "🛑 REAR BRAKE 2",
                    subLabel: "Aesthetic & Bonus",
                    rearKey: "arts",
                  },
                  {
                    id: "mathematics",
                    letter: "M",
                    name: "Mathematics",
                    color: "#41722E",
                    isRear: false,
                    roleTitle: "Logic Bogie",
                    typeLabel: "⚡ Drive 4",
                    subLabel: "Logic Propulsion",
                    rearKey: null,
                  },
                  {
                    id: "entrepreneurship",
                    letter: "E",
                    name: "Entrepren.",
                    color: "#9A6C10",
                    isRear: true,
                    roleTitle: "Brake Car 03",
                    typeLabel: "🛑 REAR BRAKE 3",
                    subLabel: "Decision & Pitch",
                    rearKey: "entrepreneurship",
                  },
                  {
                    id: "resilience",
                    letter: "R",
                    name: "Resilience",
                    color: "#1D6FA5",
                    isRear: true,
                    roleTitle: "Brake Car 04",
                    typeLabel: "🛑 REAR BRAKE 4",
                    subLabel: "Recovery Shock",
                    rearKey: "resilience",
                  },
                ].map((car, idx) => {
                  const isSelected = activeRearTab === car.rearKey;
                  return (
                    <React.Fragment key={car.id}>
                      {/* Mechanical Chain Coupler Link between carriages */}
                      {idx > 0 && (
                        <div className="flex flex-col items-center justify-center shrink-0 w-4 sm:w-5 pb-5 select-none -mx-1 z-0">
                          {/* Tension link bar */}
                          <div className="w-full flex items-center justify-center relative">
                            <div className="h-1 w-full bg-slate-600 rounded-full border border-slate-500/70" />
                            {/* Coupler knuckle pin */}
                            <div className="absolute w-2 h-2 rounded-full bg-slate-300 border border-slate-700 shadow-xs" />
                          </div>
                          <span className="text-[7px] text-slate-500 font-mono tracking-tighter uppercase mt-0.5">chain</span>
                        </div>
                      )}

                      {/* Carriage Body */}
                      {car.isRear ? (
                        /* SPOTLIGHTED REAR BRAKE CARRIAGE */
                        <button
                          type="button"
                          onClick={() => setActiveRearTab(activeRearTab === car.rearKey ? "all" : (car.rearKey || "all"))}
                          className={`flex-1 min-w-[102px] rounded-t-2xl rounded-b-lg p-2.5 text-center flex flex-col items-center justify-between transition-all duration-300 cursor-pointer relative z-10 ${
                            isSelected
                              ? "scale-105 -translate-y-4 shadow-2xl ring-4"
                              : "-translate-y-2.5 shadow-xl hover:-translate-y-3.5"
                          }`}
                          style={{
                            backgroundColor: "#0d131f",
                            borderColor: car.color,
                            borderWidth: "2px",
                            borderBottomWidth: "4px",
                            boxShadow: isSelected 
                              ? `0 18px 30px -5px ${car.color}70, 0 0 16px ${car.color}50`
                              : `0 10px 22px -5px ${car.color}40`,
                            outlineColor: car.color
                          }}
                        >
                          {/* Aerodynamic Roof Spoiler / Accent */}
                          <div 
                            className="w-14 h-1.5 rounded-full mb-1.5 shadow-sm"
                            style={{ backgroundColor: car.color }}
                          />

                          {/* Spotlight Badge */}
                          <span 
                            className="px-2 py-0.5 rounded-full text-[8.5px] font-bold font-mono tracking-tight flex items-center gap-1 shadow-sm mb-1.5 text-white"
                            style={{ backgroundColor: car.color }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            <span>{car.typeLabel}</span>
                          </span>

                          {/* Letter Token */}
                          <div 
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-display font-bold text-sm shadow-md mb-1"
                            style={{ backgroundColor: car.color }}
                          >
                            {car.letter}
                          </div>

                          {/* Name & Subtitle */}
                          <div className="w-full">
                            <div className="text-xs font-bold text-white tracking-tight">{car.name}</div>
                            <div className="text-[9px] font-mono font-bold mt-0.5 truncate" style={{ color: car.color }}>
                              {car.subLabel}
                            </div>
                          </div>

                          {/* Undercarriage Bogie Wheels (Resting on track with brake glow) */}
                          <div className="w-full flex justify-around px-2 pt-2 mt-1 border-t border-slate-700/60">
                            <div 
                              className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center bg-slate-900 shadow-xs"
                              style={{ borderColor: car.color }}
                            >
                              <div className="w-1 h-1 rounded-full bg-slate-200" />
                            </div>
                            <div 
                              className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center bg-slate-900 shadow-xs"
                              style={{ borderColor: car.color }}
                            >
                              <div className="w-1 h-1 rounded-full bg-slate-200" />
                            </div>
                          </div>
                        </button>
                      ) : (
                        /* STEM ENGINE CARRIAGE (Subdued foundation) */
                        <div 
                          className="flex-1 min-w-[92px] rounded-t-xl rounded-b-lg p-2.5 text-center flex flex-col items-center justify-between border border-slate-700/70 opacity-80 hover:opacity-100 transition-all duration-200"
                          style={{ backgroundColor: "#141a29" }}
                        >
                          {/* Roof Accent */}
                          <div className="w-10 h-1 bg-slate-700 rounded-full mb-1.5" />

                          {/* Propulsion Tag */}
                          <span className="text-[8.5px] font-mono uppercase text-slate-400 font-medium tracking-tight mb-1.5">
                            {car.typeLabel}
                          </span>

                          {/* Letter Token */}
                          <div 
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs mb-1 opacity-90"
                            style={{ backgroundColor: car.color }}
                          >
                            {car.letter}
                          </div>

                          {/* Name & Subtitle */}
                          <div className="w-full">
                            <div className="text-xs font-bold text-slate-300 tracking-tight">{car.name}</div>
                            <div className="text-[9px] font-mono text-slate-500 mt-0.5 truncate">
                              {car.subLabel}
                            </div>
                          </div>

                          {/* Undercarriage Bogie Wheels */}
                          <div className="w-full flex justify-around px-2 pt-2 mt-1 border-t border-slate-800">
                            <div className="w-3 h-3 rounded-full border-2 border-slate-600 bg-slate-900 flex items-center justify-center">
                              <div className="w-0.5 h-0.5 rounded-full bg-slate-500" />
                            </div>
                            <div className="w-3 h-3 rounded-full border-2 border-slate-600 bg-slate-900 flex items-center justify-center">
                              <div className="w-0.5 h-0.5 rounded-full bg-slate-500" />
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Continuous Railway Steel Track Rails & Sleepers underneath all carriages */}
              <div className="min-w-[840px] px-2 relative mt-0.5 z-0">
                {/* Continuous steel rail line */}
                <div className="h-1 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-500 rounded-full shadow-sm" />
                {/* Cross railway ties / sleepers */}
                <div className="flex justify-between px-1 mt-0.5">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1 bg-slate-700/80 rounded-xs" />
                  ))}
                </div>
                <div className="h-0.5 bg-slate-800 mt-0.5" />
              </div>
            </div>

            {/* Quick Filter Control Tabs */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">Filter View:</span>
                <button
                  type="button"
                  onClick={() => setActiveRearTab("all")}
                  className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                    activeRearTab === "all" ? "bg-white text-slate-900 shadow-sm" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  All 4 REAR Brakes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRearTab("research")}
                  className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                    activeRearTab === "research" ? "bg-amber-500 text-white shadow-sm" : "bg-slate-800 text-amber-300 hover:bg-slate-700"
                  }`}
                >
                  🛑 R: Empirical
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRearTab("arts")}
                  className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                    activeRearTab === "arts" ? "bg-pink-500 text-white shadow-sm" : "bg-slate-800 text-pink-300 hover:bg-slate-700"
                  }`}
                >
                  🛑 A: Aesthetic & Creative
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRearTab("entrepreneurship")}
                  className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                    activeRearTab === "entrepreneurship" ? "bg-yellow-500 text-white shadow-sm" : "bg-slate-800 text-yellow-300 hover:bg-slate-700"
                  }`}
                >
                  🛑 E: Decision & Pitch
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRearTab("resilience")}
                  className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                    activeRearTab === "resilience" ? "bg-blue-500 text-white shadow-sm" : "bg-slate-800 text-blue-300 hover:bg-slate-700"
                  }`}
                >
                  🛑 R: Shock Absorber
                </button>
              </div>

              {/* Real-time Status Message */}
              <div className="flex items-center space-x-2 text-slate-300 font-mono text-[11px]">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>
                  {activeRearTab === "all" 
                    ? "Full System Synchronization: 4 Drives ⇄ 4 Brakes" 
                    : activeRearTab === "research" 
                    ? "Telemetry Calibration: Multi-trial error < 2%" 
                    : activeRearTab === "arts" 
                    ? "Aesthetic Calibration: Project styling & bonus creative challenges active" 
                    : activeRearTab === "entrepreneurship" 
                    ? "Decision Calibration: Autonomous choices & real-world pitch active" 
                    : "Recovery Calibration: Fault recovery latency < 60s"}
                </span>
              </div>
            </div>
          </div>

          {/* Cards Grid: 4 REAR Brakes with Prefix Questions and Graphical Linkages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {REAR_PILLARS_DATA
              .filter((item) => activeRearTab === "all" || item.id === activeRearTab)
              .map((item) => {
                return (
                  <div
                    key={item.id}
                    className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
                    style={{
                      borderTop: `6px solid ${item.color}`
                    }}
                  >
                    <div>
                      {/* Top Bar: Prefix Question & Brake Tag */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div 
                          className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: `${item.color}15`,
                            color: item.color,
                            border: `1px solid ${item.color}35`
                          }}
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Why Is This Essential?</span>
                        </div>

                        {/* Red circled area: Mentioned as labels of each brake with its icon */}
                        <div 
                          className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 shadow-xs border"
                          style={{
                            backgroundColor: `${item.color}12`,
                            borderColor: `${item.color}40`,
                            color: item.color
                          }}
                        >
                          {getRearIcon(item.id)}
                          <span>{item.brakeTag}</span>
                        </div>
                      </div>

                      {/* Prominent Prefix Question */}
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 leading-snug mb-2">
                        "{item.prefixQuestion}"
                      </h3>

                      {/* Role Descriptor Subheading (Duplication removed) */}
                      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 mb-4">
                        <span 
                          className="w-5 h-5 rounded-md flex items-center justify-center text-white shadow-xs shrink-0"
                          style={{ backgroundColor: item.color }} 
                        >
                          {getRearIcon(item.id)}
                        </span>
                        <span className="uppercase tracking-wider font-bold text-slate-800 font-mono text-xs">
                          {item.rearBrakeTitle}
                        </span>
                      </div>

                      {/* SPECIFIC GRAPHICAL REPRESENTATION: STREAMER Linkage Diagram (Crisp, unclipped text) */}
                      <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200 mb-5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 font-mono">
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-streamer-science" />
                            <span>STREAMER Feedback & Linkage Flow</span>
                          </span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full font-semibold">
                            Active Calibration
                          </span>
                        </div>

                        {/* Visual 3-Stage Process Flow */}
                        <div className="grid grid-cols-11 items-center gap-1.5 text-center py-1">
                          {/* Stage 1: STEM Drive */}
                          <div className="col-span-3 p-2 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center min-h-[58px]">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">STEM Drive</span>
                            <span className="text-xs font-bold text-slate-900 leading-tight mt-0.5">
                              {item.stemLinkage.stemDrive}
                            </span>
                          </div>

                          {/* Arrow 1 */}
                          <div className="col-span-1 flex justify-center text-slate-400">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>

                          {/* Stage 2: REAR Brake Intervention */}
                          <div 
                            className="col-span-3 p-2 rounded-xl border shadow-xs flex flex-col items-center justify-center min-h-[58px] text-white"
                            style={{ backgroundColor: item.color, borderColor: item.color }}
                          >
                            <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider flex items-center gap-1">
                              {getRearIcon(item.id)}
                              <span>REAR Brake</span>
                            </span>
                            <span className="text-xs font-bold text-white leading-tight mt-0.5">
                              {item.stemLinkage.brakeIntervention}
                            </span>
                          </div>

                          {/* Arrow 2 */}
                          <div className="col-span-1 flex justify-center text-slate-400">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>

                          {/* Stage 3: Optimized Outcome */}
                          <div className="col-span-3 p-2 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs flex flex-col items-center justify-center min-h-[58px]">
                            <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-600" /> Result
                            </span>
                            <span className="text-xs font-bold text-emerald-950 leading-tight mt-0.5">
                              {item.stemLinkage.streamerOutcome}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Justification of Inclusion: Unique, Justifiable Bullet Points */}
                      <div className="mb-5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-2.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>Pedagogical Justification:</span>
                        </div>
                        <ul className="space-y-2">
                          {item.justificationBullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                              <span 
                                className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" 
                                style={{ backgroundColor: item.color }} 
                              />
                              <span>
                                <strong className="text-slate-900 font-semibold">{bullet.highlight}: </strong>
                                <span>{bullet.text}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Without Brake (Risk) vs. With REAR Brake (Optimized) */}
                      <div className="space-y-2 mb-6">
                        <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200/80 text-rose-950 text-xs flex items-start space-x-2.5">
                          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[11px] uppercase tracking-wider text-rose-700 block mb-0.5">
                              Without this REAR Brake (Failure Mode):
                            </span>
                            <span className="leading-relaxed text-slate-800">{item.withoutBrakeRisk}</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 text-xs flex items-start space-x-2.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[11px] uppercase tracking-wider text-emerald-700 block mb-0.5">
                              With REAR Brake (Optimized Mastery):
                            </span>
                            <span className="leading-relaxed text-slate-800">{item.withBrakeOptimization}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Competency Chip & Interactive Blueprint Button */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-500 font-medium">Mapped Competency:</span>
                        <span 
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-xs"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.diagnosticSkill}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => openBlueprintForId(item.id)}
                        className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-streamer-science cursor-pointer"
                      >
                        <span>Inspect Diagnostic Question</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* 4. 21st Century Skills Framework Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Human, Social & Executive Competencies</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              21st Century Skills Blueprint
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Essential non-technical capabilities that augment hands-on STEM builds. Redundant domains (such as Creativity in Arts, Adaptability in Resilience, and Digital Literacy in Technology) are unified under their primary STREAMER pillars, leaving only unique 21st-century capabilities here.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>6 Unique Competencies • 4-Band Rubrics</span>
          </div>
        </div>

        {/* 6 Unique 21st Century Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {UNIQUE_21ST_CENTURY_SKILLS.map((skill) => (
            <div
              key={skill.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              style={{ borderTop: `6px solid ${skill.color}` }}
            >
              <div>
                {/* Top Row: Code Badge & Focus Pill */}
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-display font-bold text-base shadow-md tracking-wider"
                    style={{ backgroundColor: skill.color }}
                  >
                    {skill.code}
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: `${skill.color}15`, 
                      color: skill.color,
                      border: `1px solid ${skill.color}30` 
                    }}
                  >
                    {skill.focus}
                  </span>
                </div>

                <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                  {skill.name}
                </h3>

                {/* Mapped Competencies Chips */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {skill.mappedCompetencies.map((comp, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700"
                    >
                      {comp}
                    </span>
                  ))}
                </div>

                {/* "What It Checks For" Description */}
                <p className="text-xs text-slate-600 leading-relaxed italic mb-4 font-medium">
                  "{skill.whatItChecksFor}"
                </p>
              </div>

              {/* View Skill Blueprint Link / Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => openCenturyBlueprint(skill)}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
                >
                  <span>View skill blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. UN Sustainable Development Goals (SDG) Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
              <Globe className="w-4 h-4" />
              <span>Purpose-Driven Engineering • UN Global Goals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              Sustainable Development Goals (SDG) Blueprint
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Every student project in the Lab of Future is anchored to a measurable UN Sustainable Development Goal. Explore the common foundational goals below, or customize target project assignments per batch cohort.
            </p>
          </div>

          {/* Batch Filter Tabs */}
          <div className="mt-4 md:mt-0 flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1 shrink-0" />
            {(["All", "Alpha-2026", "Beta-2026", "Custom"] as const).map((batch) => (
              <button
                key={batch}
                type="button"
                onClick={() => setSdgBatchFilter(batch)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  sdgBatchFilter === batch
                    ? "bg-white text-slate-900 shadow-sm font-bold border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {batch === "All" ? "All Batches" : batch}
              </button>
            ))}
          </div>
        </div>

        {/* 6 SDG Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sdgGoalsList.map((sdg) => {
            const filteredProjects = sdg.mappedProjects.filter(p => 
              sdgBatchFilter === "All" || p.batch === sdgBatchFilter
            );

            return (
              <div
                key={sdg.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                style={{ borderTop: `6px solid ${sdg.color}` }}
              >
                <div>
                  {/* Card Header with Real UN SDG Icon Tile & Standard Meta */}
                  <div className="flex items-start gap-4 mb-4">
                    <SdgIconTile 
                      number={sdg.number} 
                      name={sdg.name} 
                      color={sdg.color} 
                      size="md" 
                      className="shrink-0 rounded-2xl shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span 
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase"
                          style={{ 
                            backgroundColor: `${sdg.color}15`, 
                            color: sdg.color,
                            border: `1px solid ${sdg.color}35` 
                          }}
                        >
                          UN Goal {sdg.number}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 shrink-0">
                          {filteredProjects.length} Assigned Project{filteredProjects.length === 1 ? "" : "s"}
                        </span>
                      </div>
                      <h3 className="text-lg font-display font-bold text-slate-900 leading-snug">
                        {sdg.name}
                      </h3>
                      <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-2">
                        {sdg.focus}
                      </p>
                    </div>
                  </div>

                  {/* Description Quote */}
                  <p className="text-xs text-slate-600 leading-relaxed italic mb-4 font-medium">
                    "{sdg.description}"
                  </p>

                  {/* Example Mapped Project Preview */}
                  {filteredProjects.length > 0 && (
                    <div className="mb-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sdg.color }} />
                        <span>Example:</span>
                      </div>
                      <div className="text-slate-700 font-medium">
                        <span className="font-semibold text-slate-900">{filteredProjects[0].name}</span>
                        <span className="text-slate-400 mx-1.5">—</span>
                        <span className="text-slate-600">{filteredProjects[0].prototypeName}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* View SDG Blueprint Button */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => openSdgBlueprint(sdg)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer shadow-xs"
                  >
                    <span>View SDG blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 1. STREAMER Pillar Blueprint Modal */}
      <SkillBlueprintModal
        pillar={selectedPillar}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* 2. 21st Century Skills Blueprint Modal */}
      <CenturySkillModal
        skill={selectedCenturySkill}
        isOpen={isCenturyModalOpen}
        onClose={() => setIsCenturyModalOpen(false)}
      />

      {/* 3. UN SDG Blueprint Modal */}
      <SdgBlueprintModal
        sdg={selectedSdg}
        isOpen={isSdgModalOpen}
        onClose={() => setIsSdgModalOpen(false)}
        onAddCustomProject={handleAddCustomProjectToSdg}
      />
    </div>
  );
};
