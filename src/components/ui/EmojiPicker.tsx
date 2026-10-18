import React, { useState } from 'react';
import { Smile, Sparkles, Folder, Flag, Coffee, Heart, Globe, X } from 'lucide-react';

interface EmojiPickerProps {
  currentIcon?: string;
  onSelect: (icon: string) => void;
  onClose: () => void;
}

const EMOJI_CATEGORIES: Record<string, string[]> = {
  'Recent & Popular': ['✨', '🚀', '💡', '📝', '🎯', '⚡', '📊', '🔥', '🎨', '🛡️', '📋', '❤️', '🌟', '📌', '🏷️', '💎'],
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😋', '😛', '😎', '🤓', '🧐', '🥳'],
  'Objects & Tech': ['💻', '📱', '🖥️', '⌨️', '💾', '💿', '🕹️', '⏱️', '📡', '🔋', '🔌', '💡', '🔦', '🔬', '🔭', '📡', '🧭', '⚙️', '🧰', '🔧', '🔨'],
  'Nature & Animals': ['🌱', '🌿', '☘️', '🍀', '🌲', '🌳', '🌴', '🌵', '🌾', '🌷', '🌸', '🌹', '🌻', '🐶', '🐱', '🦊', '🦁', '🐯', '🐼', '🐨', '🦄', '🦅'],
  'Symbols & Flags': ['✅', '❌', '⚠️', '❗', '❓', '💯', '🔔', '🔕', '💤', '🛑', '🏁', '🚩', '🏳️', '🏴', '🎯', '🎲', '🧩', '🏷️', '🔑', '🔒', '🔓'],
};

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('Recent & Popular');
  const [search, setSearch] = useState('');

  const filteredEmojis = search
    ? Object.values(EMOJI_CATEGORIES)
        .flat()
        .filter((emoji, i, arr) => arr.indexOf(emoji) === i)
    : EMOJI_CATEGORIES[activeTab] || [];

  return (
    <div className="absolute z-50 mt-1 w-72 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-card)] p-3 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--notion-border)]">
        <span className="text-xs font-semibold text-[var(--notion-text-muted)] uppercase tracking-wider">Select Icon</span>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-[var(--notion-hover)] text-[var(--notion-text-muted)]"
        >
          <X size={14} />
        </button>
      </div>

      <input
        type="text"
        placeholder="Filter icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-2.5 py-1 mb-2.5 text-sm rounded border border-[var(--notion-border)] bg-[var(--notion-hover)] focus:outline-none focus:border-blue-500 text-[var(--notion-text)] placeholder-[var(--notion-text-muted)]"
        autoFocus
      />

      {!search && (
        <div className="flex gap-1 overflow-x-auto pb-1 mb-2 border-b border-[var(--notion-border)] scrollbar-none text-xs">
          {Object.keys(EMOJI_CATEGORIES).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-2 py-0.5 whitespace-nowrap rounded text-xs transition-colors ${
                activeTab === cat
                  ? 'bg-blue-500/10 text-blue-500 font-medium'
                  : 'text-[var(--notion-text-muted)] hover:bg-[var(--notion-hover)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto p-1">
        {filteredEmojis.map((emoji, idx) => (
          <button
            key={idx}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="flex items-center justify-center text-xl p-2 rounded hover:bg-[var(--notion-hover)] transition-transform hover:scale-125 duration-100"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
