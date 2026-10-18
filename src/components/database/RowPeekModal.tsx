import React, { useState, useEffect } from 'react';
import {
  X,
  Maximize2,
  PanelRightClose,
  PanelRight,
  Columns,
  Share2,
  Star,
  MoreHorizontal,
  Plus,
  Trash2,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import {
  Block,
  BlockType,
  DatabaseProperty,
  DatabaseRow,
  NotionColor,
  NotionDatabase,
  NotionPage,
  NotionUser,
  PropertyType,
} from '../../types/notion';
import { BlockList } from '../editor/BlockList';
import { PropertyCell } from './PropertyCell';
import { EmojiPicker } from '../ui/EmojiPicker';
import { CoverPicker } from '../ui/CoverPicker';

export type PeekMode = 'center' | 'side';

interface RowPeekModalProps {
  isOpen: boolean;
  pageId: string | null;
  databaseId?: string | null;
  workspace: {
    pages: Record<string, NotionPage>;
    blocks: Record<string, Block>;
    databases: Record<string, NotionDatabase>;
  };
  users: NotionUser[];
  activeUser: NotionUser;
  onClose: () => void;
  onOpenFullPage: (pageId: string) => void;
  onUpdatePage: (pageId: string, partial: Partial<NotionPage>) => void;
  onUpdateRow: (databaseId: string, rowId: string, propertyId: string, value: any) => void;
  onAddProperty?: (databaseId: string, name: string, type: PropertyType) => void;
  onUpdateBlock: (blockId: string, partial: Partial<Block>) => void;
  onDeleteBlock: (pageId: string, blockId: string) => void;
  onDuplicateBlock: (pageId: string, blockId: string) => void;
  onConvertType: (blockId: string, newType: BlockType) => void;
  onAddBlock: (pageId: string, type?: BlockType, afterBlockId?: string) => void;
  onMoveBlock: (pageId: string, fromIndex: number, toIndex: number) => void;
}

export const RowPeekModal: React.FC<RowPeekModalProps> = ({
  isOpen,
  pageId,
  databaseId,
  workspace,
  users,
  activeUser,
  onClose,
  onOpenFullPage,
  onUpdatePage,
  onUpdateRow,
  onAddProperty,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onConvertType,
  onAddBlock,
  onMoveBlock,
}) => {
  const [peekMode, setPeekMode] = useState<PeekMode>('center');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<
    { id: string; user: NotionUser; text: string; time: string }[]
  >([]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !pageId) return null;

  const page = workspace.pages[pageId];
  if (!page) return null;

  const database = databaseId ? workspace.databases[databaseId] : null;
  const row = database?.rows.find((r) => r.pageId === pageId);

  const handleTitleChange = (newTitle: string) => {
    onUpdatePage(pageId, { title: newTitle });
    if (database && row) {
      onUpdateRow(database.id, row.id, 'prop_title', newTitle);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: 'c_' + Date.now(),
        user: activeUser,
        text: commentText.trim(),
        time: 'Just now',
      },
    ]);
    setCommentText('');
  };

  const containerClasses =
    peekMode === 'center'
      ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6'
      : 'fixed inset-y-0 right-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs w-screen';

  const modalClasses =
    peekMode === 'center'
      ? 'w-full max-w-4xl max-h-[90vh] bg-[var(--notion-bg)] text-[var(--notion-text)] rounded-xl shadow-2xl border border-[var(--notion-border)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150'
      : 'w-full max-w-2xl h-full bg-[var(--notion-bg)] text-[var(--notion-text)] shadow-2xl border-l border-[var(--notion-border)] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200';

  return (
    <div className={containerClasses} onClick={onClose}>
      <div
        className={modalClasses}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--notion-border)] bg-[var(--notion-card)]/60 text-xs text-[var(--notion-text-muted)] select-none">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenFullPage(pageId)}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)] transition-colors"
              title="Open as full page"
            >
              <Maximize2 size={13} />
              <span className="font-medium">Open as full page</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            {/* View Mode Switcher */}
            <button
              onClick={() => setPeekMode('center')}
              className={`p-1.5 rounded transition-colors ${
                peekMode === 'center'
                  ? 'bg-[var(--notion-hover)] text-[var(--notion-text)]'
                  : 'hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)]'
              }`}
              title="Center peek"
            >
              <Columns size={14} />
            </button>
            <button
              onClick={() => setPeekMode('side')}
              className={`p-1.5 rounded transition-colors ${
                peekMode === 'side'
                  ? 'bg-[var(--notion-hover)] text-[var(--notion-text)]'
                  : 'hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)]'
              }`}
              title="Side peek"
            >
              <PanelRight size={14} />
            </button>
            <div className="w-[1px] h-3.5 bg-[var(--notion-border)] mx-1" />
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)] transition-colors"
              title="Close (Esc)"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-8 sm:px-12 py-6">
          {/* Optional Cover */}
          {page.cover && (
            <div className="relative -mx-8 sm:-mx-12 -mt-6 mb-6 h-36 sm:h-44 overflow-hidden group">
              <img
                src={page.cover}
                alt="Cover"
                className="w-full h-full object-cover"
                style={{ objectPosition: `center ${page.coverPosition || 50}%` }}
              />
              <button
                onClick={() => onUpdatePage(pageId, { cover: undefined })}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-black/60 hover:bg-black/80 text-white text-xs px-2 py-1 rounded transition-opacity"
              >
                Remove
              </button>
            </div>
          )}

          {/* Page Icon */}
          <div className="relative mb-3 inline-block">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-4xl hover:opacity-80 transition-opacity"
              title="Change icon"
            >
              {page.icon || '📄'}
            </button>
            {showEmojiPicker && (
              <EmojiPicker
                onSelect={(emoji) => {
                  onUpdatePage(pageId, { icon: emoji });
                  setShowEmojiPicker(false);
                }}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}
          </div>

          {/* Title Input */}
          <input
            type="text"
            value={page.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Untitled"
            className="w-full text-2xl sm:text-3xl font-bold bg-transparent border-none outline-none text-[var(--notion-text)] placeholder-[var(--notion-text-muted)] mb-5"
          />

          {/* Database Properties Section */}
          {database && row && (
            <div className="mb-8 p-3 rounded-lg bg-[var(--notion-hover)]/40 border border-[var(--notion-border)] space-y-2 text-xs">
              {database.properties
                .filter((p) => p.type !== 'title')
                .map((prop) => (
                  <div key={prop.id} className="flex items-center gap-4 py-1">
                    <div className="w-32 shrink-0 flex items-center gap-1.5 text-[var(--notion-text-muted)] font-medium">
                      <span>{prop.name}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <PropertyCell
                        property={prop}
                        value={row.properties[prop.id]}
                        users={users}
                        onChange={(newVal) =>
                          onUpdateRow(database.id, row.id, prop.id, newVal)
                        }
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Page Discussion / Comments Bar */}
          <div className="mb-6 pb-4 border-b border-[var(--notion-border)]">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-[var(--notion-text-muted)]">
              <MessageSquare size={13} />
              <span>Discussion</span>
            </div>

            {comments.map((c) => (
              <div key={c.id} className="flex gap-2.5 mb-2.5 text-xs">
                <span className="text-base leading-none">{c.user.avatar}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--notion-text)]">{c.user.name}</span>
                    <span className="text-[10px] text-[var(--notion-text-muted)]">{c.time}</span>
                  </div>
                  <p className="text-[var(--notion-text)] mt-0.5">{c.text}</p>
                </div>
              </div>
            ))}

            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <span className="text-sm">{activeUser.avatar}</span>
              <input
                type="text"
                placeholder="Add a comment as Samir Sawarkar..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-md bg-[var(--notion-card)] border border-[var(--notion-border)] text-[var(--notion-text)] placeholder-[var(--notion-text-muted)] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-medium rounded-md transition-colors"
              >
                Send
              </button>
            </form>
          </div>

          {/* Block Content Editor */}
          <div className="min-h-[250px]">
            <BlockList
              pageId={page.id}
              blockIds={page.blockIds}
              blocks={workspace.blocks}
              onUpdateBlock={onUpdateBlock}
              onDeleteBlock={onDeleteBlock}
              onDuplicateBlock={onDuplicateBlock}
              onConvertType={onConvertType}
              onAddBlock={onAddBlock}
              onMoveBlock={onMoveBlock}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
