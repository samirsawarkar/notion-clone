import React, { useState, useEffect, useRef } from 'react';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  List,
  ListOrdered,
  ChevronRightSquare,
  Quote,
  Minus,
  AlertCircle,
  Code2,
  Table as TableIcon,
  Sigma,
  Image as ImageIcon,
  Bookmark,
  Database,
  Sparkles,
  CodeXml,
  Bot,
} from 'lucide-react';
import { BlockType } from '../../types/notion';

interface SlashItem {
  type: BlockType;
  title: string;
  subtitle: string;
  shortcut?: string;
  keywords: string[];
  icon: React.ReactNode;
  category: 'Suggested' | 'Basic blocks' | 'Media & Code' | 'Database';
  badge?: string;
}

const SLASH_ITEMS: SlashItem[] = [
  // Suggested Section (matching user screenshot)
  {
    type: 'callout',
    title: 'AI Meeting Notes',
    subtitle: 'Summarize meeting discussions and action items',
    keywords: ['ai', 'meeting', 'notes', 'summarize'],
    icon: <Bot size={18} className="text-purple-400" />,
    category: 'Suggested',
  },
  {
    type: 'code',
    title: 'HTML · Embeds',
    subtitle: 'Embed interactive widgets or custom HTML code',
    keywords: ['html', 'embed', 'iframe', 'widget'],
    icon: <CodeXml size={18} className="text-blue-400" />,
    category: 'Suggested',
    badge: 'New',
  },

  // Basic Blocks (matching user screenshot)
  {
    type: 'paragraph',
    title: 'Text',
    subtitle: 'Just start writing with plain text.',
    keywords: ['p', 'text', 'paragraph', 'plain'],
    icon: <Type size={18} className="text-gray-400" />,
    category: 'Basic blocks',
  },
  {
    type: 'heading_1',
    title: 'Heading 1',
    subtitle: 'Big section heading.',
    shortcut: '#',
    keywords: ['h1', 'title', 'heading1', 'large'],
    icon: <Heading1 size={18} className="text-gray-300" />,
    category: 'Basic blocks',
  },
  {
    type: 'heading_2',
    title: 'Heading 2',
    subtitle: 'Medium section heading.',
    shortcut: '##',
    keywords: ['h2', 'subheading', 'heading2'],
    icon: <Heading2 size={18} className="text-gray-300" />,
    category: 'Basic blocks',
  },
  {
    type: 'heading_3',
    title: 'Heading 3',
    subtitle: 'Small section heading.',
    shortcut: '###',
    keywords: ['h3', 'subheading', 'heading3'],
    icon: <Heading3 size={18} className="text-gray-300" />,
    category: 'Basic blocks',
  },
  {
    type: 'bulleted_list_item',
    title: 'Bulleted list',
    subtitle: 'Create a simple bulleted list.',
    shortcut: '-',
    keywords: ['bullet', 'list', 'ul'],
    icon: <List size={18} className="text-gray-300" />,
    category: 'Basic blocks',
  },
  {
    type: 'numbered_list_item',
    title: 'Numbered list',
    subtitle: 'Create a list with numbering.',
    shortcut: '1.',
    keywords: ['number', 'ordered', 'ol', '1.'],
    icon: <ListOrdered size={18} className="text-gray-300" />,
    category: 'Basic blocks',
  },
  {
    type: 'to_do',
    title: 'To-do list',
    subtitle: 'Track tasks with a to-do checklist.',
    shortcut: '[]',
    keywords: ['todo', 'task', 'check', 'checkbox'],
    icon: <CheckSquare size={18} className="text-gray-300" />,
    category: 'Basic blocks',
  },
  {
    type: 'toggle',
    title: 'Toggle list',
    subtitle: 'Toggles hide and show content inside.',
    shortcut: '>',
    keywords: ['toggle', 'accordion', 'collapse', 'details'],
    icon: <ChevronRightSquare size={18} className="text-gray-300" />,
    category: 'Basic blocks',
  },
  {
    type: 'quote',
    title: 'Quote',
    subtitle: 'Capture a quote or key takeaway.',
    shortcut: '|',
    keywords: ['quote', 'blockquote', 'cite'],
    icon: <Quote size={18} className="text-gray-300" />,
    category: 'Basic blocks',
  },
  {
    type: 'divider',
    title: 'Divider',
    subtitle: 'Visually divide blocks with a line.',
    shortcut: '---',
    keywords: ['divider', 'line', 'hr', 'separator'],
    icon: <Minus size={18} className="text-gray-400" />,
    category: 'Basic blocks',
  },
  {
    type: 'callout',
    title: 'Callout',
    subtitle: 'Make writing stand out with an icon & colored tint.',
    keywords: ['callout', 'alert', 'notice', 'box', 'highlight'],
    icon: <AlertCircle size={18} className="text-yellow-500" />,
    category: 'Basic blocks',
  },

  // Media & Code
  {
    type: 'code',
    title: 'Code',
    subtitle: 'Capture a code snippet with syntax highlighting.',
    shortcut: '```',
    keywords: ['code', 'snippet', 'pre', 'typescript', 'python', 'javascript'],
    icon: <Code2 size={18} className="text-rose-400" />,
    category: 'Media & Code',
  },
  {
    type: 'table',
    title: 'Table',
    subtitle: 'Add a simple inline grid table.',
    keywords: ['table', 'grid', 'columns', 'rows'],
    icon: <TableIcon size={18} className="text-cyan-400" />,
    category: 'Media & Code',
  },
  {
    type: 'math',
    title: 'Block equation',
    subtitle: 'Display a standalone KaTeX mathematical formula.',
    keywords: ['math', 'equation', 'katex', 'latex', 'formula'],
    icon: <Sigma size={18} className="text-teal-400" />,
    category: 'Media & Code',
  },
  {
    type: 'image',
    title: 'Image',
    subtitle: 'Upload or embed with a link.',
    keywords: ['image', 'photo', 'picture', 'upload'],
    icon: <ImageIcon size={18} className="text-pink-400" />,
    category: 'Media & Code',
  },
  {
    type: 'bookmark',
    title: 'Web bookmark',
    subtitle: 'Save a visual web bookmark preview.',
    keywords: ['bookmark', 'link', 'url', 'preview'],
    icon: <Bookmark size={18} className="text-violet-400" />,
    category: 'Media & Code',
  },
  {
    type: 'database_view',
    title: 'Table View (Database)',
    subtitle: 'Embed a rich multi-view database with properties.',
    keywords: ['database', 'tableview', 'kanban', 'board', 'gallery', 'records'],
    icon: <Database size={18} className="text-blue-500" />,
    category: 'Database',
  },
];

interface SlashMenuProps {
  searchQuery: string;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  position?: { top: number; left: number };
}

export const SlashMenu: React.FC<SlashMenuProps> = ({
  searchQuery,
  onSelect,
  onClose,
  position,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const cleanQuery = searchQuery.replace('/', '').toLowerCase().trim();

  const filteredItems = SLASH_ITEMS.filter((item) => {
    if (!cleanQuery) return true;
    return (
      item.title.toLowerCase().includes(cleanQuery) ||
      item.subtitle.toLowerCase().includes(cleanQuery) ||
      item.keywords.some((kw) => kw.includes(cleanQuery))
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [cleanQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelect(filteredItems[selectedIndex].type);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredItems, selectedIndex, onSelect, onClose]);

  useEffect(() => {
    const el = menuRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (filteredItems.length === 0) {
    return (
      <div
        ref={menuRef}
        style={position ? { top: `${position.top}px`, left: `${position.left}px` } : undefined}
        className="absolute z-50 w-72 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-card)] p-3 text-sm text-[var(--notion-text-muted)] shadow-2xl"
      >
        No matching blocks found
      </div>
    );
  }

  // Group items by category
  let currentCategory = '';

  return (
    <div
      ref={menuRef}
      style={position ? { top: `${position.top}px`, left: `${position.left}px` } : undefined}
      className="absolute z-50 w-80 max-h-96 overflow-y-auto rounded-xl border border-[var(--notion-border)] bg-[var(--notion-card)] shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 divide-y divide-[var(--notion-border)]/50"
    >
      <div className="py-1">
        {filteredItems.map((item, idx) => {
          const showCatHeader = item.category !== currentCategory;
          if (showCatHeader) {
            currentCategory = item.category;
          }

          return (
            <React.Fragment key={item.title + idx}>
              {showCatHeader && (
                <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-[var(--notion-text-muted)] tracking-wider">
                  {item.category}
                </div>
              )}
              <button
                data-index={idx}
                onClick={() => onSelect(item.type)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-left transition-colors ${
                  idx === selectedIndex ? 'bg-[var(--notion-hover)]' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--notion-border)] bg-[var(--notion-bg)] shadow-xs">
                    {item.icon}
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium text-[var(--notion-text)] leading-tight truncate">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>

                {item.shortcut && (
                  <span className="text-xs font-mono text-[var(--notion-text-muted)]/70 shrink-0">
                    {item.shortcut}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Close menu esc footer (exactly matching user screenshot) */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--notion-hover)]/40 text-[11px] text-[var(--notion-text-muted)]">
        <span>Close menu</span>
        <span className="font-mono text-[10px]">esc</span>
      </div>
    </div>
  );
};
