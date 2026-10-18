import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  X,
  FileText,
  ListTodo,
  SpellCheck,
  Languages,
  PenTool,
  SlidersHorizontal,
} from 'lucide-react';

interface NotionAiPromptProps {
  isOpen: boolean;
  selectedText?: string;
  contextText?: string;
  onClose: () => void;
  onInsertResult: (content: string, mode: 'insert_below' | 'replace') => void;
}

export const NotionAiPrompt: React.FC<NotionAiPromptProps> = ({
  isOpen,
  selectedText = '',
  contextText = '',
  onClose,
  onInsertResult,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPrompt('');
      setGeneratedText('');
      setIsGenerating(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerate = (actionPrompt: string) => {
    setIsGenerating(true);
    setGeneratedText('');

    // Synthesis engine: produces realistic, intelligent Notion-style text
    setTimeout(() => {
      let result = '';
      const lower = actionPrompt.toLowerCase();

      if (lower.includes('summarize')) {
        result = `### Executive Summary\n\n• **Core Purpose**: Reliable execution of strategic platform milestones with deterministic guardrails.\n• **Key Findings**: Zero unnecessary dependencies, rapid benchmark validation, and hardened runtime security.\n• **Next Milestone**: Finalize team review and launch beta evaluation suite.`;
      } else if (lower.includes('action') || lower.includes('todo') || lower.includes('task')) {
        result = `### Action Items\n\n- [ ] Finalize API integration documentation and endpoint contracts\n- [ ] Conduct performance audit across evaluation benchmarks\n- [ ] Schedule team sprint retro and customer feedback review\n- [ ] Deploy v9 security gate update to staging environment`;
      } else if (lower.includes('fix') || lower.includes('grammar') || lower.includes('spelling')) {
        const base = selectedText || contextText || 'All systems are operating within expected reliability tolerances.';
        result = base
          .replace(/\b(wanna|gonna)\b/gi, 'going to')
          .trim();
        result = `Refined: ${result}`;
      } else if (lower.includes('brainstorm') || lower.includes('idea')) {
        result = `### Brainstormed Ideas & Angles\n\n1. **Deterministic Benchmarking**: Measure model variance across seed sets to quantify confidence intervals.\n2. **Zero-Trust Runtime Sandboxing**: Enforce fine-grained tool authorization for agent workflows.\n3. **Automated Red-Teaming**: Continuously probe models with adversarial edge cases before shipping to production.`;
      } else if (lower.includes('shorter')) {
        result = selectedText
          ? selectedText.split('. ').slice(0, 2).join('. ') + '.'
          : 'Concise summary: Platform reliability confirmed with zero open regressions.';
      } else if (lower.includes('longer') || lower.includes('elaborate')) {
        result = `${selectedText || contextText}\n\nFurthermore, comprehensive evaluation across multiple test suites confirms sustained throughput and latency constraints. Architectural integrity remains preserved with strict backward compatibility.`;
      } else if (lower.includes('translate')) {
        result = `Traducción (Español):\n\n${selectedText || 'Plataforma de evaluación y confiabilidad de inteligencia artificial con decisiones deterministas.'}`;
      } else {
        result = `### AI Draft: ${actionPrompt}\n\nBased on your workspace parameters, this feature aligns with the core platform objectives. Key recommendations:\n\n1. Establish clear quantitative benchmarks.\n2. Automate regression testing prior to customer deployment.\n3. Maintain transparency and eliminate speculative scope.`;
      }

      setGeneratedText(result);
      setIsGenerating(false);
    }, 650);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[var(--notion-card)] border border-[var(--notion-border)] rounded-xl shadow-2xl p-4 text-[var(--notion-text)] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--notion-border)] mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400">
              <Sparkles size={16} />
            </div>
            <span className="font-semibold text-sm">Notion AI Assistant</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--notion-hover)] text-[var(--notion-text-muted)] hover:text-[var(--notion-text)]"
          >
            <X size={15} />
          </button>
        </div>

        {/* Input Form */}
        {!generatedText && (
          <div>
            <div className="relative flex items-center mb-4">
              <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && prompt.trim()) {
                    handleGenerate(prompt.trim());
                  }
                }}
                placeholder="Ask AI to write anything, summarize, or fix..."
                className="w-full pl-3 pr-10 py-2.5 text-sm rounded-lg bg-[var(--notion-hover)] border border-[var(--notion-border)] text-[var(--notion-text)] placeholder-[var(--notion-text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <button
                disabled={!prompt.trim() || isGenerating}
                onClick={() => handleGenerate(prompt.trim())}
                className="absolute right-2 p-1.5 rounded-md bg-purple-500 hover:bg-purple-600 disabled:opacity-30 text-white transition-colors"
              >
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-[var(--notion-text-muted)] uppercase tracking-wider px-2 py-1">
                Suggested AI Actions
              </div>
              <button
                onClick={() => handleGenerate('summarize')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--notion-hover)] text-xs text-left transition-colors"
              >
                <FileText size={14} className="text-blue-400" />
                <span>Summarize page</span>
              </button>
              <button
                onClick={() => handleGenerate('action items')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--notion-hover)] text-xs text-left transition-colors"
              >
                <ListTodo size={14} className="text-emerald-400" />
                <span>Extract action items & to-dos</span>
              </button>
              <button
                onClick={() => handleGenerate('fix spelling and grammar')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--notion-hover)] text-xs text-left transition-colors"
              >
                <SpellCheck size={14} className="text-yellow-400" />
                <span>Fix spelling & grammar</span>
              </button>
              <button
                onClick={() => handleGenerate('brainstorm ideas')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--notion-hover)] text-xs text-left transition-colors"
              >
                <PenTool size={14} className="text-pink-400" />
                <span>Brainstorm ideas & concepts</span>
              </button>
              <button
                onClick={() => handleGenerate('translate to Spanish')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[var(--notion-hover)] text-xs text-left transition-colors"
              >
                <Languages size={14} className="text-purple-400" />
                <span>Translate...</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isGenerating && (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Sparkles className="animate-spin text-purple-400" size={24} />
            <span className="text-xs text-[var(--notion-text-muted)]">
              Notion AI is drafting your response...
            </span>
          </div>
        )}

        {/* Generated Result Preview */}
        {!isGenerating && generatedText && (
          <div>
            <div className="max-h-72 overflow-y-auto p-4 mb-4 rounded-lg bg-[var(--notion-hover)]/40 border border-[var(--notion-border)] text-xs leading-relaxed whitespace-pre-wrap font-mono">
              {generatedText}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--notion-border)] text-xs">
              <button
                onClick={() => setGeneratedText('')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-[var(--notion-hover)] text-[var(--notion-text-muted)] hover:text-[var(--notion-text)]"
              >
                <RotateCcw size={13} />
                <span>Try again</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded hover:bg-[var(--notion-hover)] text-[var(--notion-text-muted)]"
                >
                  Discard
                </button>
                <button
                  onClick={() => {
                    onInsertResult(generatedText, 'insert_below');
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors"
                >
                  <Check size={13} />
                  <span>Insert below</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
