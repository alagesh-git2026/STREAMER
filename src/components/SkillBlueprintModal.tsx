import React, { useState } from "react";
import { type StreamerPillar, RUBRIC_BANDS, SKILL_MAPPINGS } from "../data/frameworkData";
import { X, CheckCircle2, AlertCircle, HelpCircle, Layers, BookOpen, ShieldCheck } from "lucide-react";

interface SkillBlueprintModalProps {
  pillar: StreamerPillar | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SkillBlueprintModal: React.FC<SkillBlueprintModalProps> = ({
  pillar,
  isOpen,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);

  if (!isOpen || !pillar) return null;

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    setHasSubmittedAnswer(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-800 p-6 md:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-200">
          <div className="flex items-center space-x-3.5">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-display font-bold text-2xl shadow-md"
              style={{ backgroundColor: pillar.color }}
            >
              {pillar.letter}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 id="modal-headline" className="text-xl md:text-2xl font-display font-bold text-slate-900">
                  {pillar.name} Pillar Blueprint
                </h3>
                <span 
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase"
                  style={{ backgroundColor: `${pillar.color}15`, color: pillar.color, border: `1px solid ${pillar.color}30` }}
                >
                  Diagnostic Framework
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Diagnostic Study Framework (Section 4a) & Curriculum Specification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-streamer-science"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-6">
          {/* What It Checks For Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              <BookOpen className="w-4 h-4 text-streamer-science" />
              <span>What This Pillar Checks For</span>
            </div>
            <p className="text-sm md:text-base text-slate-800 leading-relaxed font-medium">
              "{pillar.whatItChecksFor}"
            </p>
            {pillar.whyStreamerBlindSpot && (
              <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-amber-900 flex items-start space-x-2 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                <span className="font-semibold px-2 py-0.5 rounded bg-amber-200 text-amber-900 shrink-0 text-[11px]">
                  STEM Blind Spot Solved
                </span>
                <span>{pillar.whyStreamerBlindSpot}</span>
              </div>
            )}
          </div>

          {/* Section 4a Mapping Table */}
          <div>
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 mb-3">
              <Layers className="w-4 h-4 text-streamer-science" />
              <span>Diagnostic Study Skill Mapping (Framework Section 4a)</span>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Skill Category</th>
                    <th className="py-2.5 px-4">Mapped STREAMER Pillar</th>
                    <th className="py-2.5 px-4">Assessment Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SKILL_MAPPINGS.map((mapping, idx) => {
                    const isCurrent = mapping.pillar.toLowerCase() === pillar.name.toLowerCase();
                    return (
                      <tr 
                        key={idx} 
                        className={`transition-colors ${
                          isCurrent 
                            ? "bg-blue-50/70 font-semibold text-slate-900" 
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <td className="py-2.5 px-4 flex items-center space-x-2">
                          {isCurrent && (
                            <span 
                              className="w-2 h-2 rounded-full shrink-0" 
                              style={{ backgroundColor: pillar.color }} 
                            />
                          )}
                          <span>{mapping.category}</span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span 
                            className="px-2 py-0.5 rounded text-[11px] font-semibold text-white inline-block shadow-xs"
                            style={{ backgroundColor: mapping.pillarColor }}
                          >
                            {mapping.pillar}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-xs text-slate-500">
                          {mapping.notes ? (
                            <span className="text-amber-700 font-medium">{mapping.notes}</span>
                          ) : (
                            "45-Min DSR Question Bank"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Sample Diagnostic Question */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <HelpCircle className="w-4 h-4 text-streamer-science" />
                <span>Example Diagnostic Question Type</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-medium">
                Format: {pillar.exampleQuestion.type}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-900 mb-4 leading-snug">
              {pillar.exampleQuestion.question}
            </p>

            {/* Options */}
            <div className="space-y-2">
              {pillar.exampleQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === pillar.exampleQuestion.correctIndex;
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
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-all ${optionStyle}`}
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
              <div className="mt-4 p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-xs">
                <span className="font-bold text-emerald-700 mr-1.5">Assessment Rationale:</span>
                {pillar.exampleQuestion.explanation}
              </div>
            )}
          </div>

          {/* Rubric Bands Applied */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4" style={{ color: pillar.color }} />
                <span>{pillar.name === "Arts" ? "Arts & Creativity" : pillar.name} 4-Band Measurable Rubric</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 w-fit">
                Skill-Specific Assessment Criteria
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(pillar.rubricBands || RUBRIC_BANDS).map((band, idx) => (
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
                    {'label' in band && typeof (band as { label?: string }).label === "string" && (
                      <div className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                        {(band as { label: string }).label}
                      </div>
                    )}
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
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
