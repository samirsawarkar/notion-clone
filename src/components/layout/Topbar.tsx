import React, { useState } from 'react';
import {
  Star,
  Lock,
  Unlock,
  MoreHorizontal,
  Share2,
  Download,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  MessageSquare,
  Clock,
  Sparkles,
} from 'lucide-react';
import { NotionPage, NotionWorkspace } from '../../types/notion';

interface TopbarProps {
  page: NotionPage;
  workspace: NotionWorkspace;
  openTabIds?: string[];
  onSelectPage: (pageId: string) => void;
  onUpdatePage: (partial: Partial<NotionPage>) => void;
  onToggleFavorite: () => void;
  onArchivePage: () => void;
  onExportJSON: () => void;
  onCreatePage?: () => void;
  onOpenAi?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  page,
  workspace,
  openTabIds = ['page_v9', 'page_ramp', 'page_second_brain'],
  onSelectPage,
  onUpdatePage,
  onToggleFavorite,
  onArchivePage,
  onExportJSON,
  onCreatePage,
  onOpenAi,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Build breadcrumb trail
  const breadcrumbs: NotionPage[] = [];
  let curr: NotionPage | undefined = page;
  while (curr) {
    breadcrumbs.unshift(curr);
    curr = curr.parentId ? workspace.pages[curr.parentId] : undefined;
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const currentFont = page.fontFamily || 'sans';

  // Ensure current page is in the tabs
  const tabs = Array.from(new Set([...openTabIds, page.id]))
    .map((id) => workspace.pages[id])
    .filter(Boolean);

  return (
    <header className="sticky top-0 z-30 flex flex-col border-b border-[var(--notion-border)] bg-[var(--notion-bg)]/95 backdrop-blur-md select-none">
      {/* 1. Notion Desktop Tab Bar (matching user screenshot) */}
      <div className="flex items-center justify-between h-9 px-2 bg-[var(--notion-sidebar-bg)] border-b border-[var(--notion-border)] text-xs">
        <div className="flex items-center gap-1 min-w-0 flex-1 overflow-x-auto scrollbar-none">
          {/* History Nav */}
          <div className="flex items-center gap-0.5 pr-1.5 border-r border-[var(--notion-border)] text-[var(--notion-text-muted)]">
            <button className="p-1 rounded hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)]">
              <ChevronLeft size={14} />
            </button>
            <button className="p-1 rounded hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)]">
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Page Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = tab.id === page.id;
              return (
                <div
                  key={tab.id}
                  onClick={() => onSelectPage(tab.id)}
                  className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-t-md text-xs font-medium cursor-pointer transition-colors max-w-[160px] ${
                    isActive
                      ? 'bg-[var(--notion-bg)] text-[var(--notion-text)] font-semibold shadow-xs'
                      : 'text-[var(--notion-text-muted)] hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)]'
                  }`}
                >
                  <span className="text-xs shrink-0">{tab.icon || '📄'}</span>
                  <span className="truncate">{tab.title || 'Untitled'}</span>
                </div>
              );
            })}

            {/* Plus Tab */}
            {onCreatePage && (
              <button
                onClick={onCreatePage}
                className="p-1 rounded hover:bg-[var(--notion-hover)] text-[var(--notion-text-muted)] hover:text-[var(--notion-text)]"
                title="New tab"
              >
                <Plus size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Page Action Bar */}
      <div className="flex items-center justify-between h-10 px-4">
        {/* Left: Breadcrumbs Trail */}
        <div className="flex items-center gap-1 text-xs text-[var(--notion-text-muted)] min-w-0 pr-4">
          {breadcrumbs.map((b, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={b.id}>
                {idx > 0 && <span className="text-[var(--notion-text-muted)]/40">/</span>}
                <button
                  onClick={() => onSelectPage(b.id)}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)] truncate transition-colors ${
                    isLast ? 'text-[var(--notion-text)] font-semibold' : ''
                  }`}
                >
                  <span>{b.icon || '📄'}</span>
                  <span className="truncate max-w-[140px]">{b.title || 'Untitled'}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 text-xs text-[var(--notion-text-muted)]">
          <span className="text-[11px] text-[var(--notion-text-muted)]/70 hidden sm:inline mr-2">
            Edited recently
          </span>

          {/* Notion AI Button */}
          {onOpenAi && (
            <button
              onClick={onOpenAi}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 font-medium transition-colors"
              title="Notion AI (Ctrl+J)"
            >
              <Sparkles size={13} className="text-purple-500" />
              <span>Ask AI</span>
            </button>
          )}

          {/* Share & Export */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)] transition-colors font-medium text-xs"
            >
              <span>Share</span>
            </button>

            {showShareMenu && (
              <div className="absolute right-0 top-8 z-50 w-64 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-card)] p-2 shadow-2xl backdrop-blur-md">
                <div className="text-[10px] uppercase font-semibold text-[var(--notion-text-muted)] px-2 py-1">
                  Share & Export
                </div>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-between w-full px-2 py-1.5 rounded hover:bg-[var(--notion-hover)] text-left"
                >
                  <span>Copy page link</span>
                  {copiedLink ? (
                    <Check size={12} className="text-emerald-500" />
                  ) : (
                    <span className="text-[10px] text-[var(--notion-text-muted)]">Copy</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    onExportJSON();
                    setShowShareMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-[var(--notion-hover)] text-left"
                >
                  <Download size={13} />
                  <span>Export Workspace (JSON)</span>
                </button>
              </div>
            )}
          </div>

          {/* Comment icon button */}
          <button
            onClick={() => alert('Comments feature: You can leave comments on blocks using text selection!')}
            className="p-1.5 rounded hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)] transition-colors"
            title="Page comments"
          >
            <MessageSquare size={14} />
          </button>

          {/* Favorite Star */}
          <button
            onClick={onToggleFavorite}
            className={`p-1.5 rounded hover:bg-[var(--notion-hover)] transition-colors ${
              page.isFavorite ? 'text-amber-500' : 'hover:text-[var(--notion-text)]'
            }`}
            title={page.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <Star size={14} fill={page.isFavorite ? 'currentColor' : 'none'} />
          </button>

          {/* More Options Menu (`...`) */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-1.5 rounded hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)]"
              title="More style & page options"
            >
              <MoreHorizontal size={15} />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 top-8 z-50 w-64 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-card)] p-2 shadow-2xl backdrop-blur-md">
                {/* Style Font Picker */}
                <div className="px-2 py-1 text-[10px] uppercase font-semibold text-[var(--notion-text-muted)]">
                  Style
                </div>
                <div className="grid grid-cols-3 gap-1 px-1 py-1 mb-2">
                  {[
                    { id: 'sans', label: 'Default', font: 'font-sans' },
                    { id: 'serif', label: 'Serif', font: 'font-serif' },
                    { id: 'mono', label: 'Mono', font: 'font-mono' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => onUpdatePage({ fontFamily: f.id as any })}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded border text-xs transition-colors ${
                        currentFont === f.id
                          ? 'border-blue-500 bg-blue-500/10 text-blue-500 font-semibold'
                          : 'border-[var(--notion-border)] text-[var(--notion-text)] hover:bg-[var(--notion-hover)]'
                      }`}
                    >
                      <span className={`text-base font-bold ${f.font}`}>Ag</span>
                      <span className="text-[10px] mt-0.5">{f.label}</span>
                    </button>
                  ))}
                </div>

                <div className="h-px bg-[var(--notion-border)] my-1" />

                {/* Page Toggles */}
                <label className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-[var(--notion-hover)] cursor-pointer">
                  <span>Small text</span>
                  <input
                    type="checkbox"
                    checked={!!page.isSmallText}
                    onChange={(e) => onUpdatePage({ isSmallText: e.target.checked })}
                    className="rounded text-blue-500 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-[var(--notion-hover)] cursor-pointer">
                  <span>Full width</span>
                  <input
                    type="checkbox"
                    checked={!!page.isFullWidth}
                    onChange={(e) => onUpdatePage({ isFullWidth: e.target.checked })}
                    className="rounded text-blue-500 focus:ring-0"
                  />
                </label>

                <div className="h-px bg-[var(--notion-border)] my-1" />

                <button
                  onClick={() => {
                    onArchivePage();
                    setShowMoreMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-red-500 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 size={13} /> Delete page
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
