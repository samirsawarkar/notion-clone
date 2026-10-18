import React from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { Block } from '../../types/notion';

interface ToggleBlockProps {
  block: Block;
  childrenBlocks?: Block[];
  onChange: (updated: Partial<Block>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAddChild?: () => void;
  renderChild?: (childBlock: Block) => React.ReactNode;
}

export const ToggleBlock: React.FC<ToggleBlockProps> = ({
  block,
  childrenBlocks = [],
  onChange,
  onKeyDown,
  onAddChild,
  renderChild,
}) => {
  const isOpen = block.isOpen !== false;

  return (
    <div className="my-1">
      <div className="flex items-center gap-1 group/toggle">
        <button
          onClick={() => onChange({ isOpen: !isOpen })}
          className="flex items-center justify-center h-6 w-6 rounded hover:bg-[var(--notion-hover)] text-[var(--notion-text-muted)] hover:text-[var(--notion-text)] transition-colors"
          title={isOpen ? 'Collapse' : 'Expand'}
        >
          <ChevronRight
            size={16}
            className={`transition-transform duration-150 ${isOpen ? 'rotate-90' : ''}`}
          />
        </button>

        <input
          type="text"
          value={block.content || ''}
          onChange={(e) => onChange({ content: e.target.value })}
          onKeyDown={onKeyDown}
          placeholder="Toggle header..."
          className="w-full bg-transparent text-sm font-medium py-1 focus:outline-none text-[var(--notion-text)] placeholder-[var(--notion-text-muted)]"
        />
      </div>

      {/* Nested Indented Container */}
      {isOpen && (
        <div className="ml-6 pl-2 border-l border-[var(--notion-border)] my-1 space-y-1">
          {childrenBlocks.map((child) => (
            <div key={child.id}>{renderChild ? renderChild(child) : child.content}</div>
          ))}

          {onAddChild && (
            <button
              onClick={onAddChild}
              className="flex items-center gap-1 text-xs text-[var(--notion-text-muted)] hover:text-[var(--notion-text)] hover:bg-[var(--notion-hover)] px-2 py-1 rounded transition-colors"
            >
              <Plus size={13} /> Add nested block
            </button>
          )}
        </div>
      )}
    </div>
  );
};
