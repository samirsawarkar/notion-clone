import React, { useState, useRef, useEffect } from 'react';
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  RefreshCw,
  Palette,
  Check,
  ChevronRight,
  Database,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Block, BlockType, NotionColor } from '../../types/notion';
import { SlashMenu } from './SlashMenu';
import { TableBlock } from './TableBlock';
import { CodeBlock } from './CodeBlock';
import { MathBlock } from './MathBlock';
import { CalloutBlock } from './CalloutBlock';
import { BookmarkBlock } from './BookmarkBlock';
import { ToggleBlock } from './ToggleBlock';

interface BlockItemProps {
  block: Block;
  index: number;
  pageId: string;
  isFocused?: boolean;
  onUpdate: (partial: Partial<Block>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onConvertType: (newType: BlockType) => void;
  onAddBelow: (type?: BlockType) => void;
  onFocusPrevious?: () => void;
  onFocusNext?: () => void;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent, index: number) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
  renderDatabase?: (databaseId: string) => React.ReactNode;
}

const COLORS: { id: NotionColor; label: string; class: string }[] = [
  { id: 'default', label: 'Default', class: 'text-[var(--notion-text)]' },
  { id: 'gray', label: 'Gray', class: 'text-gray-500' },
  { id: 'brown', label: 'Brown', class: 'text-amber-800' },
  { id: 'orange', label: 'Orange', class: 'text-orange-500' },
  { id: 'yellow', label: 'Yellow', class: 'text-amber-500' },
  { id: 'green', label: 'Green', class: 'text-emerald-500' },
  { id: 'blue', label: 'Blue', class: 'text-blue-500' },
  { id: 'purple', label: 'Purple', class: 'text-purple-500' },
  { id: 'pink', label: 'Pink', class: 'text-pink-500' },
  { id: 'red', label: 'Red', class: 'text-red-500' },
];

export const BlockItem: React.FC<BlockItemProps> = ({
  block,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
  onConvertType,
  onAddBelow,
  onFocusPrevious,
  onFocusNext,
  onDragStart,
  onDragOver,
  onDrop,
  renderDatabase,
}) => {
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTurnInto, setShowTurnInto] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;

    // Check for Markdown shortcut prefixes
    if (val === '# ') {
      onConvertType('heading_1');
      onUpdate({ content: '' });
      return;
    }
    if (val === '## ') {
      onConvertType('heading_2');
      onUpdate({ content: '' });
      return;
    }
    if (val === '### ') {
      onConvertType('heading_3');
      onUpdate({ content: '' });
      return;
    }
    if (val === '- ' || val === '* ') {
      onConvertType('bulleted_list_item');
      onUpdate({ content: '' });
      return;
    }
    if (val === '1. ') {
      onConvertType('numbered_list_item');
      onUpdate({ content: '' });
      return;
    }
    if (val === '[] ' || val === '[ ] ') {
      onConvertType('to_do');
      onUpdate({ content: '', checked: false });
      return;
    }
    if (val === '> ') {
      onConvertType('quote');
      onUpdate({ content: '' });
      return;
    }
    if (val === '---') {
      onConvertType('divider');
      onUpdate({ content: '' });
      return;
    }
    if (val === '```') {
      onConvertType('code');
      onUpdate({ content: '' });
      return;
    }

    // Check for slash menu
    if (val.startsWith('/')) {
      setShowSlashMenu(true);
      setSlashQuery(val);
    } else {
      setShowSlashMenu(false);
    }

    onUpdate({ content: val });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSlashMenu) {
      if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(e.key)) {
        return; // Handled by SlashMenu component
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Keep list types flowing naturally
      if (block.type === 'to_do') {
        onAddBelow('to_do');
      } else if (block.type === 'bulleted_list_item') {
        onAddBelow('bulleted_list_item');
      } else if (block.type === 'numbered_list_item') {
        onAddBelow('numbered_list_item');
      } else {
        onAddBelow('paragraph');
      }
    } else if (e.key === 'Backspace' && (!block.content || block.content === '')) {
      if (block.type !== 'paragraph') {
        e.preventDefault();
        onConvertType('paragraph');
      } else {
        e.preventDefault();
        onDelete();
        if (onFocusPrevious) onFocusPrevious();
      }
    } else if (e.key === 'ArrowUp' && inputRef.current?.selectionStart === 0) {
      if (onFocusPrevious) onFocusPrevious();
    } else if (
      e.key === 'ArrowDown' &&
      inputRef.current?.selectionStart === (block.content || '').length
    ) {
      if (onFocusNext) onFocusNext();
    }
  };

  const handleTodoToggle = () => {
    const nextChecked = !block.checked;
    onUpdate({ checked: nextChecked });
    if (nextChecked) {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
      });
    }
  };

  const textStyleClass = block.color
    ? COLORS.find((c) => c.id === block.color)?.class || ''
    : '';

  // Render the inner content based on block.type
  const renderContent = () => {
    switch (block.type) {
      case 'heading_1':
        return (
          <textarea
            ref={inputRef}
            value={block.content || ''}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Heading 1"
            rows={1}
            className={`w-full bg-transparent text-2xl font-bold tracking-tight text-[var(--notion-text)] focus:outline-none resize-none placeholder-[var(--notion-text-muted)]/40 ${textStyleClass}`}
          />
        );
      case 'heading_2':
        return (
          <textarea
            ref={inputRef}
            value={block.content || ''}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Heading 2"
            rows={1}
            className={`w-full bg-transparent text-xl font-semibold tracking-tight text-[var(--notion-text)] focus:outline-none resize-none placeholder-[var(--notion-text-muted)]/40 ${textStyleClass}`}
          />
        );
      case 'heading_3':
        return (
          <textarea
            ref={inputRef}
            value={block.content || ''}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Heading 3"
            rows={1}
            className={`w-full bg-transparent text-lg font-semibold text-[var(--notion-text)] focus:outline-none resize-none placeholder-[var(--notion-text-muted)]/40 ${textStyleClass}`}
          />
        );
      case 'to_do':
        return (
          <div className="flex items-start gap-2.5 w-full">
            <button
              onClick={handleTodoToggle}
              className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                block.checked
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-[var(--notion-text-muted)]/50 hover:bg-[var(--notion-hover)]'
              }`}
            >
              {block.checked && <Check size={12} strokeWidth={3} />}
            </button>
            <textarea
              ref={inputRef}
              value={block.content || ''}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="To-do"
              rows={1}
              className={`w-full bg-transparent text-sm text-[var(--notion-text)] focus:outline-none resize-none placeholder-[var(--notion-text-muted)]/40 ${
                block.checked ? 'line-through text-[var(--notion-text-muted)]' : ''
              } ${textStyleClass}`}
            />
          </div>
        );
      case 'bulleted_list_item':
        return (
          <div className="flex items-start gap-2.5 w-full">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--notion-text)] select-none" />
            <textarea
              ref={inputRef}
              value={block.content || ''}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="List item"
              rows={1}
              className={`w-full bg-transparent text-sm text-[var(--notion-text)] focus:outline-none resize-none placeholder-[var(--notion-text-muted)]/40 ${textStyleClass}`}
            />
          </div>
        );
      case 'numbered_list_item':
        return (
          <div className="flex items-start gap-2.5 w-full">
            <span className="text-sm font-medium text-[var(--notion-text-muted)] select-none">
              {index + 1}.
            </span>
            <textarea
              ref={inputRef}
              value={block.content || ''}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="List item"
              rows={1}
              className={`w-full bg-transparent text-sm text-[var(--notion-text)] focus:outline-none resize-none placeholder-[var(--notion-text-muted)]/40 ${textStyleClass}`}
            />
          </div>
        );
      case 'quote':
        return (
          <div className="flex items-stretch border-l-3 border-[var(--notion-text)] pl-3 my-1">
            <textarea
              ref={inputRef}
              value={block.content || ''}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Empty quote"
              rows={1}
              className={`w-full bg-transparent italic text-sm text-[var(--notion-text)] focus:outline-none resize-none placeholder-[var(--notion-text-muted)]/40 ${textStyleClass}`}
            />
          </div>
        );
      case 'divider':
        return (
          <div className="py-2 w-full">
            <hr className="border-t border-[var(--notion-border)]" />
          </div>
        );
      case 'table':
        return <TableBlock block={block} onChange={onUpdate} />;
      case 'code':
        return <CodeBlock block={block} onChange={onUpdate} />;
      case 'math':
        return <MathBlock block={block} onChange={onUpdate} />;
      case 'callout':
        return (
          <CalloutBlock
            block={block}
            onChange={onUpdate}
            onKeyDown={handleKeyDown}
          />
        );
      case 'bookmark':
        return <BookmarkBlock block={block} onChange={onUpdate} />;
      case 'toggle':
        return <ToggleBlock block={block} onChange={onUpdate} />;
      case 'database_view':
        return block.databaseId && renderDatabase ? (
          renderDatabase(block.databaseId)
        ) : (
          <div className="p-4 rounded border border-[var(--notion-border)] flex items-center gap-2 text-sm text-[var(--notion-text-muted)]">
            <Database size={16} /> Database View
          </div>
        );
      case 'paragraph':
      default:
        return (
          <textarea
            ref={inputRef}
            value={block.content || ''}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type '/' for commands"
            rows={1}
            className={`w-full bg-transparent text-sm text-[var(--notion-text)] focus:outline-none resize-none placeholder-[var(--notion-text-muted)]/40 leading-relaxed ${textStyleClass}`}
          />
        );
    }
  };

  return (
    <div
      ref={blockRef}
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, index)}
      onDragOver={(e) => onDragOver && onDragOver(e, index)}
      onDrop={(e) => onDrop && onDrop(e, index)}
      className="group/block relative flex items-start gap-1 py-1 -ml-8 pl-8 rounded-sm hover:bg-[var(--notion-hover)]/30 transition-colors"
    >
      {/* Left Gutter Controls (Plus & 6-dot drag handle) */}
      <div className="absolute left-0 top-1.5 flex items-center gap-0.5 opacity-0 group-hover/block:opacity-100 transition-opacity">
        <button
          onClick={() => onAddBelow('paragraph')}
          className="p-0.5 rounded hover:bg-[var(--notion-hover)] text-[var(--notion-text-muted)] hover:text-[var(--notion-text)]"
          title="Add block below"
        >
          <Plus size={14} />
        </button>
        <button
          onClick={() => setShowContextMenu(!showContextMenu)}
          className="p-0.5 rounded hover:bg-[var(--notion-hover)] text-[var(--notion-text-muted)] hover:text-[var(--notion-text)] cursor-grab active:cursor-grabbing"
          title="Drag to reorder or click for options"
        >
          <GripVertical size={14} />
        </button>
      </div>

      {/* Block Context Menu Popover */}
      {showContextMenu && (
        <div className="absolute left-6 top-6 z-50 w-56 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-card)] p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
          <button
            onClick={() => {
              onDelete();
              setShowContextMenu(false);
            }}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-red-500 hover:bg-red-500/10 rounded transition-colors"
          >
            <Trash2 size={13} /> Delete
          </button>
          <button
            onClick={() => {
              onDuplicate();
              setShowContextMenu(false);
            }}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-[var(--notion-text)] hover:bg-[var(--notion-hover)] rounded transition-colors"
          >
            <Copy size={13} /> Duplicate
          </button>

          <div className="h-px bg-[var(--notion-border)] my-1" />

          {/* Turn into submenu */}
          <div className="relative">
            <button
              onClick={() => setShowTurnInto(!showTurnInto)}
              className="flex items-center justify-between w-full px-2 py-1.5 text-xs text-[var(--notion-text)] hover:bg-[var(--notion-hover)] rounded transition-colors"
            >
              <span className="flex items-center gap-2">
                <RefreshCw size={13} /> Turn into
              </span>
              <ChevronRight size={12} />
            </button>

            {showTurnInto && (
              <div className="absolute left-full top-0 ml-1 w-48 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-card)] p-1.5 shadow-xl">
                {[
                  { type: 'paragraph', label: 'Text' },
                  { type: 'heading_1', label: 'Heading 1' },
                  { type: 'heading_2', label: 'Heading 2' },
                  { type: 'heading_3', label: 'Heading 3' },
                  { type: 'to_do', label: 'To-do list' },
                  { type: 'bulleted_list_item', label: 'Bulleted list' },
                  { type: 'numbered_list_item', label: 'Numbered list' },
                  { type: 'quote', label: 'Quote' },
                  { type: 'callout', label: 'Callout' },
                  { type: 'code', label: 'Code' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => {
                      onConvertType(item.type as BlockType);
                      setShowTurnInto(false);
                      setShowContextMenu(false);
                    }}
                    className="w-full text-left px-2 py-1 text-xs text-[var(--notion-text)] hover:bg-[var(--notion-hover)] rounded"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color picker submenu */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center justify-between w-full px-2 py-1.5 text-xs text-[var(--notion-text)] hover:bg-[var(--notion-hover)] rounded transition-colors"
            >
              <span className="flex items-center gap-2">
                <Palette size={13} /> Color
              </span>
              <ChevronRight size={12} />
            </button>

            {showColorPicker && (
              <div className="absolute left-full top-0 ml-1 w-44 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-card)] p-1.5 shadow-xl max-h-56 overflow-y-auto">
                {COLORS.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      onUpdate({ color: col.id });
                      setShowColorPicker(false);
                      setShowContextMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-2 py-1 text-xs text-[var(--notion-text)] hover:bg-[var(--notion-hover)] rounded"
                  >
                    <span className={`font-semibold ${col.class}`}>A</span>
                    <span>{col.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Render */}
      <div className="flex-1 min-w-0">{renderContent()}</div>

      {/* Slash Menu */}
      {showSlashMenu && (
        <SlashMenu
          searchQuery={slashQuery}
          onSelect={(newType) => {
            onConvertType(newType);
            onUpdate({ content: '' });
            setShowSlashMenu(false);
          }}
          onClose={() => setShowSlashMenu(false)}
        />
      )}
    </div>
  );
};
