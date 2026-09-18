import React, { useState } from "react";
import {
  X,
  Save,
  RotateCcw,
  Download,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Database,
  Search,
  Calendar,
  Users,
  FileSpreadsheet
} from "lucide-react";
import { useStudentData, type MilestoneItem } from "../../context/StudentDataContext";
import type { Student, SkillScoreDetail } from "../../data/students";
import { calculateStreamerPillars } from "../../utils/calculations";
import { exportPerformanceToExcel } from "../../utils/executiveExportUtils";

interface SourceDataEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SourceDataEditorModal: React.FC<SourceDataEditorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    students,
    updateStudent,
    addStudent,
    deleteStudent,
    resetToDefaultData,
    exportStudentsData,
    quarterlyMilestones,
    monthlyMilestones,
    updateQuarterlyMilestone,
    updateMonthlyMilestone,
    resetMilestones,
  } = useStudentData();

  const [activeSubTab, setActiveSubTab] = useState<"students" | "milestones">("students");
  const [milestoneTimeTab, setMilestoneTimeTab] = useState<"quarterly" | "monthly">("quarterly");

  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Student Form State
  const [newName, setNewName] = useState("");
  const [newCity, setNewCity] = useState("Bengaluru");
  const [newCountry, setNewCountry] = useState("India");
  const [newGrade, setNewGrade] = useState("Grade 10");
  const [newBatch, setNewBatch] = useState("Alpha-2026");
  const [newDomain, setNewDomain] = useState<"Aerospace" | "Robotics" | "Space & Astro">("Aerospace");
  const [newDefaultScore, setNewDefaultScore] = useState(80);

  // Editable scores state when editing a student
  const [editPillarScores, setEditPillarScores] = useState<Record<string, number>>({});

  // Editable milestone item state
  const [editingMilestone, setEditingMilestone] = useState<MilestoneItem | null>(null);
  const [editMilestoneAvg, setEditMilestoneAvg] = useState(80);
  const [editMilestonePass, setEditMilestonePass] = useState(85);
  const [editMilestoneWeighted, setEditMilestoneWeighted] = useState(78);
  const [editMilestoneAcademicYear, setEditMilestoneAcademicYear] = useState("2025-2026");
  const [editMilestonePeriod, setEditMilestonePeriod] = useState("2025");
  const [milestoneYearTab, setMilestoneYearTab] = useState<string>("2025-2026");
  const [newAcademicYear, setNewAcademicYear] = useState("2025-2026");

  if (!isOpen) return null;

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleStartEdit = (student: Student) => {
    setEditingStudent(student);
    const pillars = calculateStreamerPillars(student);
    const scoreMap: Record<string, number> = {};
    pillars.forEach(p => {
      scoreMap[p.pillar] = p.ytd;
    });
    setEditPillarScores(scoreMap);
    setIsAddingNew(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const makeScore = (val: number): SkillScoreDetail => ({
      day0: Math.max(40, val - 15),
      ytd: val,
      byProject: [
        { projectName: "Core Project Lab Work", date: "2026-02-01", score: val, sdgTags: ["SDG 9"] }
      ]
    });

    const updated: Student = {
      ...editingStudent,
      skillScores: {
        ...editingStudent.skillScores,
        "Conceptual Foundation": makeScore(editPillarScores["Science"] || 80),
        "Circuit Basics": makeScore(editPillarScores["Technology"] || 80),
        "Data Analysis": makeScore(editPillarScores["Research"] || 80),
        "Awareness of Materials": makeScore(editPillarScores["Engineering"] || 80),
        "Equipment Handling": makeScore(editPillarScores["Engineering"] || 80),
        "Creativity / Design Thinking": makeScore(editPillarScores["Arts"] || 80),
        "Mathematics (blended)": makeScore(editPillarScores["Mathematics"] || 80),
        "Decision Making": makeScore(editPillarScores["Entrepreneurship"] || 80),
        "Troubleshooting": makeScore(editPillarScores["Resilience"] || 80),
      }
    };

    updateStudent(updated);
    setEditingStudent(null);
    showStatus(`Successfully updated record for "${updated.name}"! Dashboard recalculated.`);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const makeScore = (val: number): SkillScoreDetail => ({
      day0: Math.max(40, val - 12),
      ytd: val,
      byProject: [
        { projectName: "Introductory Lab Project", date: "2026-03-01", score: val, sdgTags: ["SDG 4", "SDG 9"] }
      ]
    });

    const newStudent: Student = {
      id: `LOF-2026-${String(students.length + 1).padStart(3, "0")}`,
      name: newName.trim(),
      age: 15,
      grade: newGrade,
      domain: newDomain,
      centre: { city: newCity, country: newCountry },
      batch: newBatch,
      enrolledDate: "2026-01-10",
      diagnostic: {
        attended: true,
        date: "2026-01-15",
        levelTested: "Builder Entry Diagnostic",
        questionsTotal: 30,
        questionsCorrect: 24,
        timeUsedMinutes: 35,
        timeAllowedMinutes: 45,
        placedLevel: "Builder"
      },
      skillScores: {
        "Conceptual Foundation": makeScore(newDefaultScore),
        "Circuit Basics": makeScore(newDefaultScore),
        "Data Analysis": makeScore(newDefaultScore),
        "Awareness of Materials": makeScore(newDefaultScore),
        "Equipment Handling": makeScore(newDefaultScore),
        "Creativity / Design Thinking": makeScore(newDefaultScore),
        "Mathematics (blended)": makeScore(newDefaultScore),
        "Decision Making": makeScore(newDefaultScore),
        "Troubleshooting": makeScore(newDefaultScore),
        "Communication & Collaboration": makeScore(newDefaultScore),
      },
      badges: [
        { name: "STEM Builder Foundation", tier: "Builder", dateEarned: "2026-01-20" }
      ]
    };

    addStudent(newStudent);
    setIsAddingNew(false);
    setNewName("");
    showStatus(`Created new student record "${newStudent.name}" (${newStudent.id})!`);
  };

  const handleStartEditMilestone = (m: MilestoneItem) => {
    setEditingMilestone(m);
    setEditMilestoneAvg(m.avgScore);
    setEditMilestonePass(m.passRate);
    setEditMilestoneWeighted(m.weightedAvg);
    setEditMilestoneAcademicYear(m.academicYear || "2025-2026");
    setEditMilestonePeriod(m.period);
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone) return;

    const payload = {
      avgScore: editMilestoneAvg,
      passRate: editMilestonePass,
      weightedAvg: editMilestoneWeighted,
      academicYear: editMilestoneAcademicYear,
      period: editMilestonePeriod,
    };

    if (milestoneTimeTab === "quarterly") {
      updateQuarterlyMilestone(editingMilestone.id, payload);
    } else {
      updateMonthlyMilestone(editingMilestone.id, payload);
    }

    setEditingMilestone(null);
    showStatus(`Updated ${editingMilestone.label} (${editMilestoneAcademicYear}) milestone scores! Chart synchronized.`);
  };

  const handleExport = () => {
    const jsonStr = exportStudentsData();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `streamer-dataset-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showStatus("Exported complete dataset to JSON file.");
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.centre.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in hide-on-print">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900">
                Backend Source Data Editor & Report Engine
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Customizable data tables • Changes dynamically sync and recalculate all Power BI visual charts
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                exportPerformanceToExcel({
                  students,
                  quarterlyMilestones,
                  monthlyMilestones,
                  selectedCentre: "All",
                  selectedYear: milestoneYearTab,
                });
                showStatus("Exported complete performance workbook to Excel CSV!");
              }}
              className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Excel</span>
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Reset dataset & milestones back to defaults? Any custom changes will be overwritten.")) {
                  resetToDefaultData();
                  resetMilestones();
                  showStatus("Dataset & milestones successfully reset to defaults.");
                }
              }}
              className="px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside modal: Student Records vs Milestone Trends */}
        <div className="px-6 pt-3 bg-white border-b border-slate-200 flex items-center space-x-4">
          <button
            type="button"
            onClick={() => {
              setActiveSubTab("students");
              setEditingMilestone(null);
            }}
            className={`pb-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
              activeSubTab === "students"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student Profiles & Pillar Scores ({students.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSubTab("milestones");
              setEditingStudent(null);
              setIsAddingNew(false);
            }}
            className={`pb-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
              activeSubTab === "milestones"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Milestone Trend Data (Quarterly & Monthly)</span>
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center space-x-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* SUBTAB 1: STUDENTS DATA */}
        {activeSubTab === "students" && (
          <>
            {/* Action / Search Toolbar */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search student or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(!isAddingNew);
                    setEditingStudent(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingNew ? "Cancel New Student" : "Add Student Record"}</span>
                </button>
              </div>
            </div>

            {/* Body Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Add New Student Form */}
              {isAddingNew && (
                <form onSubmit={handleSaveNew} className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 animate-in fade-in space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Create New Student Profile in Dataset
                    </h3>
                    <span className="text-[11px] text-amber-700">Will automatically update all metrics</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Student Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ajay Kumar"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Innovation Centre</label>
                      <select
                        value={newCity}
                        onChange={(e) => {
                          setNewCity(e.target.value);
                          if (e.target.value === "Bengaluru" || e.target.value === "New Delhi") setNewCountry("India");
                          else if (e.target.value === "Dubai") setNewCountry("UAE");
                          else if (e.target.value === "Austin") setNewCountry("USA");
                          else setNewCountry("China");
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      >
                        <option value="Bengaluru">Bengaluru, India</option>
                        <option value="New Delhi">New Delhi, India</option>
                        <option value="Dubai">Dubai, UAE</option>
                        <option value="Austin">Austin, USA</option>
                        <option value="Shanghai">Shanghai, China</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Domain Track</label>
                      <select
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      >
                        <option value="Aerospace">Aerospace</option>
                        <option value="Robotics">Robotics</option>
                        <option value="Space & Astro">Space & Astro</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Grade</label>
                      <select
                        value={newGrade}
                        onChange={(e) => setNewGrade(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      >
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Batch Cohort</label>
                      <select
                        value={newBatch}
                        onChange={(e) => setNewBatch(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      >
                        <option value="Alpha-2026">Alpha-2026</option>
                        <option value="Beta-2026">Beta-2026</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Academic Year</label>
                      <select
                        value={newAcademicYear}
                        onChange={(e) => setNewAcademicYear(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none font-bold"
                      >
                        <option value="2025-2026">2025-2026 (Aug–Mar)</option>
                        <option value="2024-2025">2024-2025 (Aug–Mar)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Baseline Score (0-100)</label>
                      <input
                        type="number"
                        min="30"
                        max="100"
                        value={newDefaultScore}
                        onChange={(e) => setNewDefaultScore(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer hover:bg-slate-800"
                    >
                      Save & Add Student
                    </button>
                  </div>
                </form>
              )}

              {/* Edit Individual Student Pillar Scores */}
              {editingStudent && (
                <form onSubmit={handleSaveEdit} className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 animate-in fade-in space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                        Edit STREAMER Pillar Scores for {editingStudent.name}
                      </h3>
                      <span className="text-[11px] text-blue-700 font-mono">
                        ID: {editingStudent.id} • {editingStudent.centre.city}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingStudent(null)}
                      className="text-xs text-blue-700 hover:underline font-bold"
                    >
                      Close Edit Mode
                    </button>
                  </div>

                  {/* 8 Pillar Scores Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      "Science",
                      "Technology",
                      "Research",
                      "Engineering",
                      "Arts",
                      "Mathematics",
                      "Entrepreneurship",
                      "Resilience"
                    ].map((pillar) => (
                      <div key={pillar} className="p-2.5 rounded-xl bg-white border border-blue-200">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          {pillar} Score
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editPillarScores[pillar] ?? 80}
                          onChange={(e) =>
                            setEditPillarScores(prev => ({
                              ...prev,
                              [pillar]: Number(e.target.value)
                            }))
                          }
                          className="w-full px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingStudent(null)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer hover:bg-slate-800 flex items-center space-x-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Scores & Update Dashboard</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Tabular Data Grid of All Records */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Centre</th>
                      <th className="py-2.5 px-3">Batch</th>
                      <th className="py-2.5 px-3">Domain</th>
                      <th className="py-2.5 px-3 font-mono text-center">Sci</th>
                      <th className="py-2.5 px-3 font-mono text-center">Tech</th>
                      <th className="py-2.5 px-3 font-mono text-center">Res</th>
                      <th className="py-2.5 px-3 font-mono text-center">Eng</th>
                      <th className="py-2.5 px-3 font-mono text-center">Arts</th>
                      <th className="py-2.5 px-3 font-mono text-center">Math</th>
                      <th className="py-2.5 px-3 font-mono text-center">Ent</th>
                      <th className="py-2.5 px-3 font-mono text-center">Rsl</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((s) => {
                      const pillars = calculateStreamerPillars(s);
                      const pMap: Record<string, number> = {};
                      pillars.forEach(p => { pMap[p.pillar] = p.ytd; });

                      return (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-slate-500 font-semibold">{s.id}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{s.name}</td>
                          <td className="py-2.5 px-3 text-slate-600">{s.centre.city}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{s.batch}</td>
                          <td className="py-2.5 px-3 text-slate-600">{s.domain}</td>
                          <td className="py-2.5 px-3 font-mono text-center">{pMap["Science"] ?? "-"}</td>
                          <td className="py-2.5 px-3 font-mono text-center">{pMap["Technology"] ?? "-"}</td>
                          <td className="py-2.5 px-3 font-mono text-center">{pMap["Research"] ?? "-"}</td>
                          <td className="py-2.5 px-3 font-mono text-center">{pMap["Engineering"] ?? "-"}</td>
                          <td className="py-2.5 px-3 font-mono text-center">{pMap["Arts"] ?? "-"}</td>
                          <td className="py-2.5 px-3 font-mono text-center">{pMap["Mathematics"] ?? "-"}</td>
                          <td className="py-2.5 px-3 font-mono text-center">{pMap["Entrepreneurship"] ?? "-"}</td>
                          <td className="py-2.5 px-3 font-mono text-center">{pMap["Resilience"] ?? "-"}</td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(s)}
                                className="p-1 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                title="Edit student scores"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {students.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Delete student record for ${s.name}?`)) {
                                      deleteStudent(s.id);
                                      showStatus(`Deleted record for ${s.name}.`);
                                    }
                                  }}
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Delete student"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* SUBTAB 2: MILESTONE TRENDS (QUARTER & MONTH) */}
        {activeSubTab === "milestones" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* Time & Academic Year Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Milestone Series:</span>
                <button
                  type="button"
                  onClick={() => {
                    setMilestoneTimeTab("quarterly");
                    setEditingMilestone(null);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    milestoneTimeTab === "quarterly"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  Quarterly Series (Q1–Capstone)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMilestoneTimeTab("monthly");
                    setEditingMilestone(null);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    milestoneTimeTab === "monthly"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  Monthly Series (Aug–Mar)
                </button>

                <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />

                <span className="text-xs font-bold text-slate-700">Academic Year:</span>
                <select
                  value={milestoneYearTab}
                  onChange={(e) => {
                    setMilestoneYearTab(e.target.value);
                    setEditingMilestone(null);
                  }}
                  className="px-2.5 py-1 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:ring-2 focus:ring-slate-900 cursor-pointer"
                >
                  <option value="all">All Academic Years</option>
                  <option value="2025-2026">2025-2026 (Aug–Mar)</option>
                  <option value="2024-2025">2024-2025 (Aug–Mar)</option>
                </select>
              </div>

              <span className="text-[11px] text-slate-500 font-medium">
                Changes immediately update the Performance Trend bar chart
              </span>
            </div>

            {/* Edit Milestone Form */}
            {editingMilestone && (
              <form onSubmit={handleSaveMilestone} className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 animate-in fade-in space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    Edit Milestone: {editingMilestone.label} ({editMilestoneAcademicYear})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingMilestone(null)}
                    className="text-xs text-blue-700 font-bold hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Academic Year</label>
                    <select
                      value={editMilestoneAcademicYear}
                      onChange={(e) => setEditMilestoneAcademicYear(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white font-bold focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="2025-2026">2025-2026</option>
                      <option value="2024-2025">2024-2025</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Period (Year)</label>
                    <input
                      type="text"
                      value={editMilestonePeriod}
                      onChange={(e) => setEditMilestonePeriod(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white font-mono font-bold focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Average Score</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={editMilestoneAvg}
                      onChange={(e) => setEditMilestoneAvg(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white font-mono font-bold focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Pass Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={editMilestonePass}
                      onChange={(e) => setEditMilestonePass(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white font-mono font-bold focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Weighted Avg (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={editMilestoneWeighted}
                      onChange={(e) => setEditMilestoneWeighted(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white font-mono font-bold focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer hover:bg-slate-800 flex items-center space-x-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Milestone Scores</span>
                  </button>
                </div>
              </form>
            )}

            {/* Milestones Data Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Milestone</th>
                    <th className="py-2.5 px-3">Academic Year</th>
                    <th className="py-2.5 px-3">Calendar Period</th>
                    <th className="py-2.5 px-3 text-right">Average Score</th>
                    <th className="py-2.5 px-3 text-right">Pass Rate (%)</th>
                    <th className="py-2.5 px-3 text-right">Weighted Avg (%)</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(milestoneTimeTab === "quarterly" ? quarterlyMilestones : monthlyMilestones)
                    .filter(m => milestoneYearTab === "all" || m.academicYear === milestoneYearTab)
                    .map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{m.label}</td>
                      <td className="py-2.5 px-3 font-semibold text-blue-700 font-mono text-[11px]">
                        {m.academicYear || "2025-2026"}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{m.period}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">{m.avgScore}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">{m.passRate}%</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-600">{m.weightedAvg}%</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleStartEditMilestone(m)}
                          className="p-1 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit milestone score"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Source Data synced with active dashboard session</span>
          <span>Edits are automatically saved to browser localStorage</span>
        </div>
      </div>
    </div>
  );
};
