import React, { useState } from 'react';
import { X, Image as ImageIcon, Link2 } from 'lucide-react';

interface CoverPickerProps {
  onSelect: (coverUrl: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

const COVER_PRESETS = [
  {
    category: 'Color Gradients',
    images: [
      { name: 'Aurora Sunset', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&auto=format&fit=crop&q=80' },
      { name: 'Cyber Neon', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&auto=format&fit=crop&q=80' },
      { name: 'Deep Sea Blue', url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&auto=format&fit=crop&q=80' },
      { name: 'Warm Terracotta', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80' },
    ],
  },
  {
    category: 'Fine Art & Heritage',
    images: [
      { name: 'The Great Wave', url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1600&auto=format&fit=crop&q=80' },
      { name: 'Vintage Astronomy', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80' },
      { name: 'Minimalist Architecture', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&auto=format&fit=crop&q=80' },
      { name: 'Botanical Illustration', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&auto=format&fit=crop&q=80' },
    ],
  },
  {
    category: 'Cosmos & Nature',
    images: [
      { name: 'Milky Way Galaxy', url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop&q=80' },
      { name: 'Alpine Peaks', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=80' },
      { name: 'Tokyo Nightline', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1600&auto=format&fit=crop&q=80' },
      { name: 'Zen Bamboo Forest', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600&auto=format&fit=crop&q=80' },
    ],
  },
];

export const CoverPicker: React.FC<CoverPickerProps> = ({ onSelect, onRemove, onClose }) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'custom'>('gallery');
  const [customUrl, setCustomUrl] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onSelect(customUrl.trim());
      onClose();
    }
  };

  return (
    <div className="absolute right-0 top-10 z-50 w-96 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-card)] p-4 shadow-2xl backdrop-blur-md animate-in fade-in duration-100">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--notion-border)]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`text-xs font-semibold uppercase tracking-wider pb-1 transition-colors ${
              activeTab === 'gallery'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-[var(--notion-text-muted)] hover:text-[var(--notion-text)]'
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`text-xs font-semibold uppercase tracking-wider pb-1 transition-colors ${
              activeTab === 'custom'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-[var(--notion-text-muted)] hover:text-[var(--notion-text)]'
            }`}
          >
            Custom Link
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onRemove();
              onClose();
            }}
            className="text-xs text-red-500 hover:text-red-600 px-2 py-0.5 rounded hover:bg-red-500/10"
          >
            Remove
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--notion-hover)] text-[var(--notion-text-muted)]"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {activeTab === 'gallery' ? (
        <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
          {COVER_PRESETS.map((group) => (
            <div key={group.category}>
              <div className="text-xs font-semibold text-[var(--notion-text-muted)] mb-2">
                {group.category}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {group.images.map((img) => (
                  <button
                    key={img.url}
                    onClick={() => {
                      onSelect(img.url);
                      onClose();
                    }}
                    className="group relative h-20 w-full overflow-hidden rounded-md border border-[var(--notion-border)] transition-transform hover:scale-[1.02]"
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] text-white font-medium px-2 py-1 bg-black/60 rounded">
                        {img.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div className="text-xs text-[var(--notion-text-muted)]">
            Paste an image link from Unsplash, Imgur, or any public web image.
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded border border-[var(--notion-border)] bg-[var(--notion-hover)]">
            <Link2 size={16} className="text-[var(--notion-text-muted)]" />
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none text-[var(--notion-text)]"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full py-1.5 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
          >
            Apply Image Cover
          </button>
        </form>
      )}
    </div>
  );
};
