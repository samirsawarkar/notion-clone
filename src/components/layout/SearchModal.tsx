import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, X, ArrowRight } from 'lucide-react';
import { NotionWorkspace } from '../../types/notion';

interface SearchModalProps {
  workspace: NotionWorkspace;
  isOpen: boolean;
  onClose: () => void;
  onSelectPage: (pageId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  workspace,
  isOpen,
  onClose,
  onSelectPage,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global hotkey Ctrl+K / Cmd+K
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [isOpen, onClose]);

  const results = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    const pages = Object.values(workspace.pages).filter((p) => !p.isArchived);

    if (!q) {
      return pages.slice(0, 8).map((p) => ({
        page: p,
        matchType: 'recent' as const,
        snippet: '',
      }));
    }

    const matched: { page: typeof pages[0]; matchType: 'title' | 'content'; snippet: string }[] = [];

    for (const page of pages) {
      if (page.title.toLowerCase().includes(q)) {
        matched.push({ page, matchType: 'title', snippet: page.title });
        continue;
      }

      // Check block contents
      for (const bId of page.blockIds) {
        const blk = workspace.blocks[bId];
        if (blk && blk.content && blk.content.toLowerCase().includes(q)) {
          matched.push({ page, matchType: 'content', snippet: blk.content });
          break;
        }
      }
    }

    return matched;
  }, [workspace, query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          onSelectPage(results[selectedIndex].page.id);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onSelectPage, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100 p-4">
      <div className="w-full max-w-xl rounded-xl border border-[var(--notion-border)] bg-[var(--notion-card)] shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--notion-border)]">
          <Search size={18} className="text-[var(--notion-text-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search all pages and contents..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm focus:outline-none text-[var(--notion-text)] placeholder-[var(--notion-text-muted)]"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--notion-text-muted)] hover:bg-[var(--notion-hover)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--notion-text-muted)]">
              No pages or blocks matching "{query}"
            </div>
          ) : (
            results.map((item, idx) => (
              <button
                key={item.page.id + idx}
                onClick={() => {
                  onSelectPage(item.page.id);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors ${
                  idx === selectedIndex
                    ? 'bg-blue-500/10 text-blue-500'
                    : 'text-[var(--notion-text)] hover:bg-[var(--notion-hover)]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="text-base shrink-0">{item.page.icon || '📄'}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {item.page.title || 'Untitled'}
                    </div>
                    {item.matchType === 'content' && (
                      <div className="text-xs text-[var(--notion-text-muted)] truncate line-clamp-1 mt-0.5">
                        Matches: "{item.snippet}"
                      </div>
                    )}
                  </div>
                </div>
                <ArrowRight size={14} className="opacity-40 shrink-0" />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--notion-hover)]/30 border-t border-[var(--notion-border)] text-[11px] text-[var(--notion-text-muted)]">
          <span>Navigate with ↑ / ↓</span>
          <span>Select with Enter</span>
          <span>Close with Esc</span>
        </div>
      </div>
    </div>
  );
};
