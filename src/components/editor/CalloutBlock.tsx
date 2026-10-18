import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { Block, NotionColor } from '../../types/notion';
import { EmojiPicker } from '../ui/EmojiPicker';

interface CalloutBlockProps {
  block: Block;
  onChange: (updated: Partial<Block>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const CALLOUT_COLORS: { id: NotionColor; label: string; class: string }[] = [
  { id: 'gray', label: 'Default Gray', class: 'callout-gray' },
  { id: 'brown', label: 'Brown', class: 'callout-brown' },
  { id: 'orange', label: 'Orange', class: 'callout-orange' },
  { id: 'yellow', label: 'Yellow', class: 'callout-yellow' },
  { id: 'green', label: 'Green', class: 'callout-green' },
  { id: 'blue', label: 'Blue', class: 'callout-blue' },
  { id: 'purple', label: 'Purple', class: 'callout-purple' },
  { id: 'pink', label: 'Pink', class: 'callout-pink' },
  { id: 'red', label: 'Red', class: 'callout-red' },
];

export const CalloutBlock: React.FC<CalloutBlockProps> = ({
  block,
  onChange,
  onKeyDown,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const bgColor = block.backgroundColor || 'yellow';
  const colorClass = CALLOUT_COLORS.find((c) => c.id === bgColor)?.class || 'callout-yellow';

  return (
    <div
      className={`relative group/callout flex items-start gap-3 p-3.5 my-2.5 rounded-lg border border-[var(--notion-border)] ${colorClass} transition-colors`}
    >
      {/* Icon Picker Trigger */}
      <div className="relative shrink-0">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="flex items-center justify-center h-7 w-7 text-xl hover:scale-110 rounded transition-transform"
          title="Change icon"
        >
          {block.icon || '💡'}
        </button>
        {showEmojiPicker && (
          <div className="absolute left-0 top-8 z-50">
            <EmojiPicker
              currentIcon={block.icon}
              onSelect={(icon) => {
                onChange({ icon });
                setShowEmojiPicker(false);
              }}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>
        )}
      </div>

      {/* Editable Content */}
      <div className="flex-1 min-w-0">
        <textarea
          value={block.content || ''}
          onChange={(e) => onChange({ content: e.target.value })}
          onKeyDown={onKeyDown}
          placeholder="Type something in this callout..."
          rows={Math.max(1, (block.content || '').split('\n').length)}
          className="w-full bg-transparent resize-none text-sm leading-relaxed text-[var(--notion-text)] focus:outline-none placeholder-[var(--notion-text-muted)]"
        />
      </div>

      {/* Color picker toggle */}
      <div className="relative shrink-0 opacity-0 group-hover/callout:opacity-100 transition-opacity">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-1 rounded text-[var(--notion-text-muted)] hover:bg-black/10 hover:text-[var(--notion-text)]"
          title="Change background color"
        >
          <Palette size={14} />
        </button>

        {showColorPicker && (
          <div className="absolute right-0 top-6 z-50 w-36 rounded-md border border-[var(--notion-border)] bg-[var(--notion-card)] p-1.5 shadow-lg">
            <div className="text-[10px] font-semibold text-[var(--notion-text-muted)] px-1 pb-1">
              Background Color
            </div>
            {CALLOUT_COLORS.map((col) => (
              <button
                key={col.id}
                onClick={() => {
                  onChange({ backgroundColor: col.id });
                  setShowColorPicker(false);
                }}
                className={`flex items-center gap-2 w-full px-2 py-1 text-xs rounded hover:bg-[var(--notion-hover)] text-left ${
                  bgColor === col.id ? 'font-semibold text-blue-500' : ''
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${col.class} border border-black/10`} />
                <span>{col.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
