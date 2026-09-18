import React, { useState } from "react";
import type { Unique21stCenturySkill } from "../data/frameworkData";
import { X, CheckCircle2, AlertCircle, HelpCircle, Layers, ShieldCheck, Sparkles } from "lucide-react";

interface CenturySkillModalProps {
  skill: Unique21stCenturySkill | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CenturySkillModal: React.FC<CenturySkillModalProps> = ({
  skill,
  isOpen,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);

  if (!isOpen || !skill) return null;

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    setHasSubmittedAnswer(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-800 p-6 md:p-8 custom-scrollbar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-skill-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-200">
          <div className="flex items-center space-x-3.5">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-display font-bold text-lg shadow-md tracking-wider shrink-0"
              style={{ backgroundColor: skill.color }}
            >
              {skill.code}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 id="modal-skill-title" className="text-xl md:text-2xl font-display font-bold text-slate-900">
                  {skill.name} Blueprint
                </h3>
                <span 
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase shadow-xs"
                  style={{ backgroundColor: `${skill.color}15`, color: skill.color, border: `1px solid ${skill.color}30` }}
                >
                  {skill.focus}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                21st Century Competency Framework • Human, Social & Executive Mastery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-6 space-y-6">
          {/* Definition & Distinction Callout */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              <Sparkles className="w-4 h-4" style={{ color: skill.color }} />
              <span>What This 21st Century Skill Checks For</span>
            </div>
            <p className="text-sm md:text-base text-slate-800 leading-relaxed font-medium">
              "{skill.whatItChecksFor}"
            </p>

            {/* Why Unique from STREAMER Callout */}
            <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-cyan-950 flex items-start space-x-2 bg-cyan-50/80 p-3 rounded-xl border border-cyan-200">
              <span className="font-bold px-2 py-0.5 rounded bg-cyan-200 text-cyan-900 shrink-0 text-[11px] uppercase tracking-wide">
                Distinct from STREAMER
              </span>
              <span className="leading-relaxed">{skill.whyUniqueFromStreamer}</span>
            </div>
          </div>

          {/* Mapped Competencies Chips */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4 text-slate-500" />
              <span>Core Evaluated Competencies</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {skill.mappedCompetencies.map((comp, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-800 shadow-xs flex items-center space-x-1.5"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: skill.color }} />
                  <span>{comp}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Sample Assessment Scenario */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <HelpCircle className="w-4 h-4" style={{ color: skill.color }} />
                <span>Example Assessment Scenario: {skill.exampleScenario.title}</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-medium">
                Type: {skill.exampleScenario.type}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 mb-3 italic">
              <strong>Scenario Context:</strong> {skill.exampleScenario.scenario}
            </div>

            <p className="text-sm font-semibold text-slate-900 mb-3 leading-snug">
              {skill.exampleScenario.question}
            </p>

            {/* Options */}
            <div className="space-y-2">
              {skill.exampleScenario.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === skill.exampleScenario.correctIndex;
                let optionStyle = "border-slate-200 bg-white hover:border-slate-400 text-slate-700 shadow-xs";

                if (hasSubmittedAnswer) {
                  if (isCorrect) {
                    optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "border-rose-400 bg-rose-50 text-rose-900";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${optionStyle}`}
                  >
                    <span>
                      <span className="font-mono text-slate-400 mr-2 font-bold">[{String.fromCharCode(65 + idx)}]</span>
                      {option}
                    </span>
                    {hasSubmittedAnswer && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                    {hasSubmittedAnswer && isSelected && !isCorrect && (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {hasSubmittedAnswer && (
              <div className="mt-4 p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-xs animate-in fade-in">
                <span className="font-bold text-emerald-700 mr-1.5">Assessment Rationale:</span>
                {skill.exampleScenario.explanation}
              </div>
            )}
          </div>

          {/* 4-Band Measurable Rubric */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4" style={{ color: skill.color }} />
                <span>{skill.name} 4-Band Measurable Rubric</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 w-fit">
                Behavioral Assessment Rubric
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skill.rubricBands.map((band, idx) => (
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
