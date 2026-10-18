import React, { useState, useMemo } from 'react';
import katex from 'katex';
import { Sigma } from 'lucide-react';
import { Block } from '../../types/notion';

interface MathBlockProps {
  block: Block;
  onChange: (updated: Partial<Block>) => void;
}

export const MathBlock: React.FC<MathBlockProps> = ({ block, onChange }) => {
  const [isEditing, setIsEditing] = useState(!block.content);

  const formulaHtml = useMemo(() => {
    if (!block.content) return '';
    try {
      return katex.renderToString(block.content, {
        displayMode: true,
        throwOnError: false,
      });
    } catch (err: any) {
      return `<span class="text-red-500 font-mono text-xs">Error parsing formula: ${err.message}</span>`;
    }
  }, [block.content]);

  return (
    <div className="my-2">
      {isEditing ? (
        <div className="p-3 rounded-lg border border-blue-500/50 bg-[var(--notion-card)] shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-xs font-medium text-blue-500">
            <Sigma size={14} />
            <span>KaTeX Equation Editor</span>
          </div>
          <input
            type="text"
            value={block.content || ''}
            onChange={(e) => onChange({ content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setIsEditing(false);
              }
            }}
            placeholder="e.g. E = mc^2 \quad or \quad \int_{0}^{\infty} f(x) dx"
            className="w-full px-2.5 py-1.5 text-sm font-mono rounded border border-[var(--notion-border)] bg-[var(--notion-hover)] focus:outline-none focus:border-blue-500 text-[var(--notion-text)]"
            autoFocus
          />
          <div className="flex justify-between items-center mt-2 text-[11px] text-[var(--notion-text-muted)]">
            <span>Press Enter or click away to preview equation</span>
            <button
              onClick={() => setIsEditing(false)}
              className="px-2 py-0.5 rounded bg-blue-500 text-white font-medium hover:bg-blue-600"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="group relative flex flex-col items-center justify-center p-4 rounded-lg hover:bg-[var(--notion-hover)] cursor-pointer transition-colors border border-transparent hover:border-[var(--notion-border)]"
        >
          {block.content ? (
            <div
              className="text-lg overflow-x-auto py-1"
              dangerouslySetInnerHTML={{ __html: formulaHtml }}
            />
          ) : (
            <div className="flex items-center gap-2 text-sm text-[var(--notion-text-muted)]">
              <Sigma size={16} />
              <span>Click to add a KaTeX equation...</span>
            </div>
          )}
          <span className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-[10px] bg-[var(--notion-card)] px-1.5 py-0.5 rounded border border-[var(--notion-border)] text-[var(--notion-text-muted)]">
            Edit
          </span>
        </div>
      )}
    </div>
  );
};
