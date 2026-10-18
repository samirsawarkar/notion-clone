import React, { useState } from 'react';
import { X, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { NotionWorkspace } from '../../types/notion';

interface TrashModalProps {
  workspace: NotionWorkspace;
  isOpen: boolean;
  onClose: () => void;
  onRestorePage: (pageId: string) => void;
  onDeletePermanently: (pageId: string) => void;
}

export const TrashModal: React.FC<TrashModalProps> = ({
  workspace,
  isOpen,
  onClose,
  onRestorePage,
  onDeletePermanently,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const trashPages = workspace.trashPageIds
    .map((id) => workspace.pages[id])
    .filter((p) => {
      if (!p) return false;
      if (!search.trim()) return true;
      return (p.title || '').toLowerCase().includes(search.toLowerCase());
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-100 p-4">
      <div className="w-full max-w-lg rounded-xl border border-[var(--notion-border)] bg-[var(--notion-card)] shadow-2xl overflow-hidden text-[var(--notion-text)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--notion-border)]">
          <div className="flex items-center gap-2">
            <Trash2 size={16} className="text-red-500" />
            <h3 className="text-base font-semibold">Trash Bin</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--notion-text-muted)] hover:bg-[var(--notion-hover)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter input */}
        <div className="p-3 border-b border-[var(--notion-border)]">
          <input
            type="text"
            placeholder="Filter pages in trash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-md border border-[var(--notion-border)] bg-[var(--notion-hover)] focus:outline-none text-[var(--notion-text)] placeholder-[var(--notion-text-muted)]"
          />
        </div>

        {/* Trash list */}
        <div className="max-h-72 overflow-y-auto p-2 divide-y divide-[var(--notion-border)]">
          {trashPages.length === 0 ? (
            <div className="py-10 text-center text-xs text-[var(--notion-text-muted)]">
              Trash is empty
            </div>
          ) : (
            trashPages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between p-2 hover:bg-[var(--notion-hover)]/40 rounded transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="text-base shrink-0">{page.icon || '📄'}</span>
                  <span className="text-xs font-medium truncate">
                    {page.title || 'Untitled'}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onRestorePage(page.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-[var(--notion-hover)] text-blue-500 font-medium"
                    title="Restore page"
                  >
                    <RotateCcw size={12} />
                    <span>Restore</span>
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Permanently delete "${page.title || 'Untitled'}"? This cannot be undone.`
                        )
                      ) {
                        onDeletePermanently(page.id);
                      }
                    }}
                    className="p-1 rounded text-red-500 hover:bg-red-500/10"
                    title="Delete permanently"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
