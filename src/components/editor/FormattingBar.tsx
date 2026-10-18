import React, { useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
  Palette,
} from 'lucide-react';
import { NotionColor } from '../../types/notion';

interface FormattingBarProps {
  onApplyFormat: (format: string, value?: any) => void;
}

const COLORS: { name: string; color: NotionColor; class: string }[] = [
  { name: 'Default', color: 'default', class: 'text-[var(--notion-text)]' },
  { name: 'Gray', color: 'gray', class: 'text-gray-500' },
  { name: 'Brown', color: 'brown', class: 'text-amber-800' },
  { name: 'Orange', color: 'orange', class: 'text-orange-500' },
  { name: 'Yellow', color: 'yellow', class: 'text-amber-500' },
  { name: 'Green', color: 'green', class: 'text-emerald-500' },
  { name: 'Blue', color: 'blue', class: 'text-blue-500' },
  { name: 'Purple', color: 'purple', class: 'text-purple-500' },
  { name: 'Pink', color: 'pink', class: 'text-pink-500' },
  { name: 'Red', color: 'red', class: 'text-red-500' },
];

export const FormattingBar: React.FC<FormattingBarProps> = ({ onApplyFormat }) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        setPosition(null);
        setShowColorPicker(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setPosition({
          top: Math.max(10, rect.top + window.scrollY - 44),
          left: Math.max(10, rect.left + window.scrollX + rect.width / 2 - 120),
        });
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  if (!position) return null;

  return (
    <div
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="fixed z-50 flex items-center gap-0.5 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-card)] p-1 text-[var(--notion-text)] shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
    >
      <button
        onClick={() => document.execCommand('bold', false)}
        className="p-1.5 rounded hover:bg-[var(--notion-hover)] text-xs transition-colors"
        title="Bold (Ctrl+B)"
      >
        <Bold size={14} />
      </button>
      <button
        onClick={() => document.execCommand('italic', false)}
        className="p-1.5 rounded hover:bg-[var(--notion-hover)] text-xs transition-colors"
        title="Italic (Ctrl+I)"
      >
        <Italic size={14} />
      </button>
      <button
        onClick={() => document.execCommand('underline', false)}
        className="p-1.5 rounded hover:bg-[var(--notion-hover)] text-xs transition-colors"
        title="Underline (Ctrl+U)"
      >
        <Underline size={14} />
      </button>
      <button
        onClick={() => document.execCommand('strikeThrough', false)}
        className="p-1.5 rounded hover:bg-[var(--notion-hover)] text-xs transition-colors"
        title="Strikethrough"
      >
        <Strikethrough size={14} />
      </button>

      <div className="h-4 w-px bg-[var(--notion-border)] mx-1" />

      {/* Color picker */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="flex items-center gap-1 p-1.5 rounded hover:bg-[var(--notion-hover)] text-xs transition-colors"
          title="Color & Highlight"
        >
          <Palette size={14} />
        </button>

        {showColorPicker && (
          <div className="absolute left-0 top-8 z-50 w-44 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-card)] p-2 shadow-2xl">
            <div className="text-[10px] font-semibold text-[var(--notion-text-muted)] uppercase px-1 pb-1">
              Color
            </div>
            {COLORS.map((col) => (
              <button
                key={col.color}
                onClick={() => {
                  onApplyFormat('color', col.color);
                  setShowColorPicker(false);
                }}
                className="flex items-center gap-2 w-full px-2 py-1 text-xs rounded hover:bg-[var(--notion-hover)] text-left"
              >
                <span className={`font-semibold ${col.class}`}>A</span>
                <span className="text-[var(--notion-text)]">{col.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
