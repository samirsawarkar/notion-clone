import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Settings,
  Trash2,
  Star,
  FileText,
  ChevronsLeft,
  ChevronsRight,
  UserCheck,
  Users,
  Sparkles,
  Upload,
  Home,
  MessageSquare,
  Calendar,
  Clock,
  Lock,
} from 'lucide-react';
import { NotionPage, NotionUser, NotionWorkspace } from '../../types/notion';

interface SidebarProps {
  workspace: NotionWorkspace;
  activePageId: string;
  users?: NotionUser[];
  activeUserId?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectPage: (pageId: string) => void;
  onCreatePage: (parentId?: string | null) => void;
  onArchivePage: (pageId: string) => void;
  onToggleFavorite: (pageId: string) => void;
  onSetActiveUser?: (userId: string) => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenTemplates: () => void;
  onImportMarkdown: (markdownText: string) => void;
  onOpenTrash: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  workspace,
  activePageId,
  users = [],
  activeUserId,
  isCollapsed,
  onToggleCollapse,
  onSelectPage,
  onCreatePage,
  onArchivePage,
  onToggleFavorite,
  onSetActiveUser,
  onOpenSearch,
  onOpenSettings,
  onOpenTemplates,
  onImportMarkdown,
  onOpenTrash,
}) => {
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const mdInputRef = React.useRef<HTMLInputElement>(null);

  const activeUser = users.find((u) => u.id === activeUserId) || users[0];

  const toggleExpand = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedPages((prev) => ({ ...prev, [pageId]: !prev[pageId] }));
  };

  const getChildPages = (parentId: string) => {
    return Object.values(workspace.pages).filter(
      (p) => p.parentId === parentId && !p.isArchived
    );
  };

  const renderPageItem = (page: NotionPage, depth: number = 0) => {
    const children = getChildPages(page.id);
    const hasChildren = children.length > 0;
    const isExpanded = !!expandedPages[page.id];
    const isActive = page.id === activePageId;

    return (
      <div key={page.id} className="select-none">
        <div
          onClick={() => onSelectPage(page.id)}
          style={{ paddingLeft: `${Math.max(8, depth * 12 + 8)}px` }}
          className={`group flex items-center justify-between pr-2 py-1 my-0.5 rounded-md cursor-pointer transition-colors text-xs ${
            isActive
              ? 'bg-[var(--notion-hover)] text-[var(--notion-text)] font-semibold'
              : 'text-[var(--notion-text-muted)] hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)]'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(page.id, e)}
                className="p-0.5 rounded hover:bg-[var(--notion-active)] text-[var(--notion-text-muted)]"
              >
                <ChevronRight
                  size={12}
                  className={`transition-transform duration-100 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>
            ) : (
              <span className="w-2.5" />
            )}

            <span className="shrink-0 text-xs">{page.icon || '📄'}</span>
            <span className="truncate">{page.title || 'Untitled'}</span>
          </div>

          {/* Hover actions */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreatePage(page.id);
                setExpandedPages((prev) => ({ ...prev, [page.id]: true }));
              }}
              className="p-0.5 rounded hover:bg-[var(--notion-active)] text-[var(--notion-text-muted)]"
              title="Add child page"
            >
              <Plus size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchivePage(page.id);
              }}
              className="p-0.5 rounded hover:bg-red-500/10 text-red-400"
              title="Move to trash"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>{children.map((child) => renderPageItem(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  const favoritePages = workspace.favoritePageIds
    .map((id) => workspace.pages[id])
    .filter((p) => p && !p.isArchived);

  const rootPages = workspace.rootPageIds
    .map((id) => workspace.pages[id])
    .filter((p) => p && !p.isArchived);

  const recentPages = rootPages.slice(0, 5);

  if (isCollapsed) {
    return (
      <div className="fixed left-2 top-2 z-40">
        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-center h-8 w-8 rounded-md bg-[var(--notion-card)] border border-[var(--notion-border)] shadow-md text-[var(--notion-text)] hover:bg-[var(--notion-hover)]"
          title="Open sidebar"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <aside className="relative flex flex-col h-screen w-60 shrink-0 bg-[var(--notion-sidebar-bg)] border-r border-[var(--notion-border)] select-none">
      {/* 1. Top Search Bar (matching screenshot: Search or ask Ctrl+K) */}
      <div className="p-2 border-b border-[var(--notion-border)]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="flex items-center justify-center h-5 w-5 rounded bg-blue-500 text-white font-bold text-[10px]">
              {workspace.icon || '⚡'}
            </span>
            <span className="text-xs font-semibold text-[var(--notion-text)] truncate">
              {workspace.name}
            </span>
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded text-[var(--notion-text-muted)] hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)]"
            title="Collapse sidebar"
          >
            <ChevronsLeft size={15} />
          </button>
        </div>

        <button
          onClick={onOpenSearch}
          className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-hover)]/40 hover:bg-[var(--notion-hover)] text-xs text-[var(--notion-text-muted)] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search size={13} />
            <span>Search or ask</span>
          </div>
          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[var(--notion-card)] border border-[var(--notion-border)]">
            Ctrl+K
          </span>
        </button>
      </div>

      {/* 2. Quick Icons Row (Home, Chat, Calendar, Templates) */}
      <div className="px-2 py-1.5 space-y-0.5 text-xs">
        <button
          onClick={() => onSelectPage(rootPages[0]?.id || '')}
          className="flex items-center gap-2.5 w-full px-2 py-1 rounded-md text-[var(--notion-text-muted)] hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)] transition-colors font-medium"
        >
          <Home size={14} />
          <span>Home</span>
        </button>

        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-2.5 w-full px-2 py-1 rounded-md text-[var(--notion-text-muted)] hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)] transition-colors font-medium"
        >
          <Sparkles size={14} className="text-amber-500" />
          <span>Templates</span>
        </button>

        <button
          onClick={() => mdInputRef.current?.click()}
          className="flex items-center gap-2.5 w-full px-2 py-1 rounded-md text-[var(--notion-text-muted)] hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)] transition-colors font-medium"
        >
          <Upload size={14} />
          <span>Import (.md)</span>
        </button>
        <input
          ref={mdInputRef}
          type="file"
          accept=".md,.txt,.markdown"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const text = event.target?.result as string;
                if (text) onImportMarkdown(text);
              };
              reader.readAsText(file);
            }
          }}
          className="hidden"
        />
      </div>

      <div className="h-px bg-[var(--notion-border)] mx-2 my-1" />

      {/* 3. Scrollable Tree: Favorites, Recents, Private */}
      <div className="flex-1 overflow-y-auto px-1 py-1 space-y-4">
        {/* Favorites */}
        {favoritePages.length > 0 && (
          <div>
            <div className="px-2.5 pb-1 text-[10px] font-bold text-[var(--notion-text-muted)] uppercase tracking-wider">
              Favorites
            </div>
            {favoritePages.map((page) => renderPageItem(page, 0))}
          </div>
        )}

        {/* Recents */}
        <div>
          <div className="px-2.5 pb-1 text-[10px] font-bold text-[var(--notion-text-muted)] uppercase tracking-wider">
            Recents
          </div>
          {recentPages.map((page) => renderPageItem(page, 0))}
        </div>

        {/* Private Section */}
        <div>
          <div className="flex items-center justify-between px-2.5 pb-1 text-[10px] font-bold text-[var(--notion-text-muted)] uppercase tracking-wider">
            <span>Private</span>
            <button
              onClick={() => onCreatePage(null)}
              className="p-0.5 rounded hover:bg-[var(--notion-hover)]"
              title="Add page"
            >
              <Plus size={12} />
            </button>
          </div>
          {rootPages.map((page) => renderPageItem(page, 0))}
        </div>
      </div>

      {/* 4. Bottom Footer: Active User & Settings */}
      <div className="p-2 border-t border-[var(--notion-border)] relative">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 flex-1 min-w-0 p-1 rounded-md hover:bg-[var(--notion-hover)] text-left transition-colors"
          >
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[var(--notion-card)] border border-[var(--notion-border)] text-xs shrink-0 shadow-xs">
              {activeUser?.avatar || '👤'}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[var(--notion-text)] truncate">
                {activeUser?.name || workspace.name}
              </div>
            </div>
            <ChevronDown size={12} className="text-[var(--notion-text-muted)] shrink-0" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded hover:bg-[var(--notion-hover)] text-[var(--notion-text-muted)] hover:text-[var(--notion-text)]"
            title="Settings & Members"
          >
            <Settings size={14} />
          </button>

          <button
            onClick={onOpenTrash}
            className="p-1.5 rounded hover:bg-[var(--notion-hover)] text-[var(--notion-text-muted)] hover:text-[var(--notion-text)] relative"
            title="Trash"
          >
            <Trash2 size={14} />
            {workspace.trashPageIds.length > 0 && (
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500" />
            )}
          </button>
        </div>

        {/* User Switcher Dropdown */}
        {showUserMenu && (
          <div className="absolute left-2 bottom-12 z-50 w-56 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-card)] p-1.5 shadow-2xl backdrop-blur-md">
            <div className="px-2 py-1 text-[10px] font-semibold text-[var(--notion-text-muted)] uppercase tracking-wider">
              Switch Member Profile
            </div>
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  if (onSetActiveUser) onSetActiveUser(u.id);
                  setShowUserMenu(false);
                }}
                className={`flex items-center justify-between w-full px-2 py-1.5 rounded text-xs transition-colors ${
                  u.id === activeUserId
                    ? 'bg-blue-500/10 text-blue-500 font-semibold'
                    : 'text-[var(--notion-text)] hover:bg-[var(--notion-hover)]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm">{u.avatar || '👤'}</span>
                  <span className="truncate">{u.name}</span>
                </div>
                {u.id === activeUserId && <UserCheck size={14} className="shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
