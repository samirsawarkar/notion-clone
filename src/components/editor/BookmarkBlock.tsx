import React, { useState } from 'react';
import { Bookmark, ExternalLink, Globe } from 'lucide-react';
import { Block } from '../../types/notion';

interface BookmarkBlockProps {
  block: Block;
  onChange: (updated: Partial<Block>) => void;
}

export const BookmarkBlock: React.FC<BookmarkBlockProps> = ({ block, onChange }) => {
  const [isEditing, setIsEditing] = useState(!block.url);
  const [tempUrl, setTempUrl] = useState(block.url || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUrl.trim()) {
      let finalUrl = tempUrl.trim();
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
      }
      onChange({ url: finalUrl, content: tempUrl.replace(/https?:\/\//, '') });
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSubmit}
        className="my-2 p-3 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-card)] shadow-xs flex items-center gap-2"
      >
        <Bookmark size={16} className="text-[var(--notion-text-muted)] shrink-0" />
        <input
          type="text"
          value={tempUrl}
          onChange={(e) => setTempUrl(e.target.value)}
          placeholder="Paste web address link..."
          className="w-full bg-transparent text-sm focus:outline-none text-[var(--notion-text)]"
          autoFocus
        />
        <button
          type="submit"
          className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-colors"
        >
          Create Bookmark
        </button>
      </form>
    );
  }

  const hostname = block.url ? new URL(block.url).hostname : 'website.com';

  return (
    <div className="my-2.5 group relative flex items-center justify-between p-3.5 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-card)] hover:bg-[var(--notion-hover)] transition-colors cursor-pointer">
      <a
        href={block.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0 pr-4"
      >
        <div className="text-sm font-medium text-[var(--notion-text)] truncate">
          {block.content || hostname}
        </div>
        <div className="text-xs text-[var(--notion-text-muted)] truncate mt-0.5">
          {block.caption || `Read and explore resources on ${hostname}`}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[var(--notion-text-muted)]">
          <Globe size={12} />
          <span className="truncate">{hostname}</span>
        </div>
      </a>

      <div className="flex items-center gap-2">
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded text-[var(--notion-text-muted)] hover:text-[var(--notion-text)]"
        >
          <ExternalLink size={15} />
        </a>
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 text-xs text-[var(--notion-text-muted)] hover:text-[var(--notion-text)] px-1.5 py-0.5 rounded border border-[var(--notion-border)]"
        >
          Edit
        </button>
      </div>
    </div>
  );
};
