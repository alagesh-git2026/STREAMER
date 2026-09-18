import React, { useState } from "react";
import type { SdgGoalDetailed, SdgProjectMapping } from "../data/frameworkData";
import { SdgIconTile } from "./SdgIconTile";
import { X, Target, Wrench, Plus, CheckCircle, ShieldCheck, Tag } from "lucide-react";

interface SdgBlueprintModalProps {
  sdg: SdgGoalDetailed | null;
  isOpen: boolean;
  onClose: () => void;
  onAddCustomProject?: (sdgId: string, project: SdgProjectMapping) => void;
}

export const SdgBlueprintModal: React.FC<SdgBlueprintModalProps> = ({
  sdg,
  isOpen,
  onClose,
  onAddCustomProject,
}) => {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjBatch, setNewProjBatch] = useState<"Alpha-2026" | "Beta-2026" | "Custom">("Custom");
  const [newProjDomain, setNewProjDomain] = useState("Robotics");
  const [newProjPrototype, setNewProjPrototype] = useState("");
  const [newProjBrief, setNewProjBrief] = useState("");
  const [newProjMetric, setNewProjMetric] = useState("");
  const [localProjects, setLocalProjects] = useState<SdgProjectMapping[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync local projects whenever modal opens with sdg
  React.useEffect(() => {
    if (sdg) {
      setLocalProjects(sdg.mappedProjects);
      setIsAddingProject(false);
      setSuccessMessage(null);
    }
  }, [sdg]);

  if (!isOpen || !sdg) return null;

  const handleSaveCustomProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim() || !newProjPrototype.trim()) return;

    const newProject: SdgProjectMapping = {
      id: `proj-${Date.now()}`,
      name: newProjName.trim(),
      batch: newProjBatch,
      domain: newProjDomain,
      prototypeName: newProjPrototype.trim(),
      brief: newProjBrief.trim() || "Custom student lab hardware project targeting this UN SDG.",
      keyMetric: newProjMetric.trim() || "Active lab prototype verification in progress"
    };

    const updated = [...localProjects, newProject];
    setLocalProjects(updated);
    if (onAddCustomProject) {
      onAddCustomProject(sdg.id, newProject);
    }

    // Reset
    setNewProjName("");
    setNewProjPrototype("");
    setNewProjBrief("");
    setNewProjMetric("");
    setIsAddingProject(false);
    setSuccessMessage(`Project "${newProject.name}" assigned to ${newProject.batch}!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-800 p-6 md:p-8 custom-scrollbar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-sdg-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-200">
          <div className="flex items-center space-x-3.5">
            <SdgIconTile
              number={sdg.number}
              name={sdg.name}
              color={sdg.color}
              size="sm"
              className="rounded-xl shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 id="modal-sdg-title" className="text-xl md:text-2xl font-display font-bold text-slate-900">
                  {sdg.name}
                </h3>
                <span 
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase shadow-xs"
                  style={{ backgroundColor: `${sdg.color}15`, color: sdg.color, border: `1px solid ${sdg.color}30` }}
                >
                  UN Goal {sdg.number}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                UN Sustainable Development Goal Blueprint • Purpose-Driven Engineering
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-6 space-y-6">
          {/* Target Impact Callout */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              <Target className="w-4 h-4" style={{ color: sdg.color }} />
              <span>Official UN Target & Global Benchmark</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-medium mb-2">
              {sdg.unTarget}
            </p>
            <p className="text-xs text-slate-600 italic">
              "{sdg.description}"
            </p>
          </div>

          {/* Lab Application Blueprint */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              <Wrench className="w-4 h-4" style={{ color: sdg.color }} />
              <span>Lab Implementation Blueprint (How Students Build for this SDG)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {sdg.labApplication}
            </p>
          </div>

          {/* Mapped Student Projects with Batch Customization */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4" style={{ color: sdg.color }} />
                <span className="text-sm font-bold text-slate-900">
                  Assigned Student Projects ({localProjects.length})
                </span>
                <span className="text-xs text-slate-500 font-normal">
                  • Configurable per batch
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingProject(!isAddingProject)}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-white transition-all shadow-xs cursor-pointer"
                style={{ backgroundColor: sdg.color }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingProject ? "Cancel Customization" : "Customize / Add Project Goal"}</span>
              </button>
            </div>

            {successMessage && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Custom Project Assignment Form */}
            {isAddingProject && (
              <form onSubmit={handleSaveCustomProject} className="mb-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 animate-in fade-in space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Assign New Project Goal to {sdg.id}
                  </span>
                  <span className="text-[11px] text-amber-800">
                    Saves to current lab cohort
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Project Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. SolarRoam Explorer" 
                      value={newProjName}
                      onChange={(e) => setNewProjName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Assigned Batch</label>
                    <select
                      value={newProjBatch}
                      onChange={(e) => setNewProjBatch(e.target.value as "Alpha-2026" | "Beta-2026" | "Custom")}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option value="Alpha-2026">Alpha-2026 Batch</option>
                      <option value="Beta-2026">Beta-2026 Batch</option>
                      <option value="Custom">Custom / Next Cohort</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Domain</label>
                    <select
                      value={newProjDomain}
                      onChange={(e) => setNewProjDomain(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option value="Robotics">Robotics</option>
                      <option value="Aerospace">Aerospace</option>
                      <option value="Space & Astro">Space & Astro</option>
                      <option value="CleanTech">CleanTech IoT</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Example Build / Prototype</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Autonomous Solar Rover Rig" 
                      value={newProjPrototype}
                      onChange={(e) => setNewProjPrototype(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Key Impact Metric</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Cuts standby draw by 40%" 
                      value={newProjMetric}
                      onChange={(e) => setNewProjMetric(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Project Brief</label>
                  <textarea 
                    rows={2}
                    placeholder="Brief description of the student prototype and how it targets this SDG..." 
                    value={newProjBrief}
                    onChange={(e) => setNewProjBrief(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingProject(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
                    style={{ backgroundColor: sdg.color }}
                  >
                    Save Project Assignment
                  </button>
                </div>
              </form>
            )}

            {/* List of Mapped Projects */}
            <div className="space-y-2.5">
              {localProjects.map((proj) => (
                <div 
                  key={proj.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{proj.name}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {proj.batch}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {proj.domain}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      <strong>Example:</strong> {proj.prototypeName}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      {proj.brief}
                    </p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold inline-block">
                      {proj.keyMetric}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Band Measurable Real-World Impact Rubric */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4" style={{ color: sdg.color }} />
                <span>{sdg.name} 4-Band Real-World Impact Rubric</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 w-fit">
                UN SDG Sustainability Metric
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sdg.rubricBands.map((band, idx) => (
                <div 
                  key={idx} 
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:bg-slate-50/80 transition-colors"
                  style={{ borderLeft: `4px solid ${band.color}` }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold" style={{ color: band.color }}>
                        {band.name}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-semibold shadow-xs">
                        {band.range[0]}–{band.range[1]} pts
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                      {band.label}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {band.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
