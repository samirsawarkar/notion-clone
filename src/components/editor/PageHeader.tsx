import React, { useState } from 'react';
import { Smile, Image as ImageIcon, Sparkles, X, Move } from 'lucide-react';
import { NotionPage } from '../../types/notion';
import { EmojiPicker } from '../ui/EmojiPicker';
import { CoverPicker } from '../ui/CoverPicker';

interface PageHeaderProps {
  page: NotionPage;
  onUpdate: (partial: Partial<NotionPage>) => void;
  onEnterTitle?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ page, onUpdate, onEnterTitle }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [isRepositioning, setIsRepositioning] = useState(false);

  const hasCover = !!page.cover;
  const hasIcon = !!page.icon;

  return (
    <div className="relative mb-6 group/header">
      {/* Page Cover Image */}
      {hasCover && (
        <div className="relative w-full h-52 overflow-hidden group/cover">
          <img
            src={page.cover}
            alt="Page cover"
            style={{
              objectPosition: `center ${page.coverPosition ?? 50}%`,
            }}
            className="w-full h-full object-cover select-none"
          />

          {/* Cover Controls Bar */}
          <div className="absolute right-4 bottom-3 flex items-center gap-1.5 opacity-0 group-hover/cover:opacity-100 transition-opacity bg-black/60 backdrop-blur-xs px-2 py-1 rounded-md text-white text-xs">
            <button
              onClick={() => setShowCoverPicker(true)}
              className="px-2 py-1 rounded hover:bg-white/20 transition-colors"
            >
              Change cover
            </button>
            <button
              onClick={() => setIsRepositioning(!isRepositioning)}
              className="px-2 py-1 rounded hover:bg-white/20 transition-colors flex items-center gap-1"
            >
              <Move size={12} /> Reposition
            </button>
            <button
              onClick={() => onUpdate({ cover: undefined })}
              className="px-2 py-1 rounded hover:bg-white/20 transition-colors text-red-300 hover:text-red-200"
            >
              Remove
            </button>
          </div>

          {/* Reposition Slider */}
          {isRepositioning && (
            <div className="absolute inset-x-0 bottom-12 flex justify-center">
              <div className="bg-black/75 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs flex items-center gap-3 shadow-lg">
                <span>Drag to reposition:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={page.coverPosition ?? 50}
                  onChange={(e) => onUpdate({ coverPosition: Number(e.target.value) })}
                  className="w-40 cursor-pointer accent-blue-500"
                />
                <button
                  onClick={() => setIsRepositioning(false)}
                  className="px-2 py-0.5 bg-blue-500 rounded text-xs hover:bg-blue-600 font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Cover Picker Popover */}
          {showCoverPicker && (
            <CoverPicker
              onSelect={(coverUrl) => onUpdate({ cover: coverUrl })}
              onRemove={() => onUpdate({ cover: undefined })}
              onClose={() => setShowCoverPicker(false)}
            />
          )}
        </div>
      )}

      {/* Action Buttons row (Add icon, Add cover) when not already present */}
      <div className="px-12 pt-4">
        <div className="flex items-center gap-3 opacity-0 group-hover/header:opacity-100 transition-opacity mb-2 text-xs text-[var(--notion-text-muted)]">
          {!hasIcon && (
            <button
              onClick={() => setShowEmojiPicker(true)}
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)] transition-colors"
            >
              <Smile size={14} /> Add icon
            </button>
          )}
          {!hasCover && (
            <button
              onClick={() => setShowCoverPicker(true)}
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)] transition-colors"
            >
              <ImageIcon size={14} /> Add cover
            </button>
          )}
        </div>

        {/* Cover picker if cover wasn't present */}
        {!hasCover && showCoverPicker && (
          <div className="relative">
            <CoverPicker
              onSelect={(coverUrl) => onUpdate({ cover: coverUrl })}
              onRemove={() => onUpdate({ cover: undefined })}
              onClose={() => setShowCoverPicker(false)}
            />
          </div>
        )}

        {/* Icon Picker & Badge */}
        {hasIcon && (
          <div className="relative -mt-10 mb-4 inline-block">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="group/icon flex items-center justify-center text-6xl h-20 w-20 rounded-xl bg-[var(--notion-bg)] hover:bg-[var(--notion-hover)] border border-[var(--notion-border)] shadow-sm transition-transform hover:scale-105"
              title="Change icon"
            >
              <span>{page.icon}</span>
            </button>

            {showEmojiPicker && (
              <div className="absolute left-0 top-20 z-50">
                <EmojiPicker
                  currentIcon={page.icon}
                  onSelect={(icon) => onUpdate({ icon })}
                  onClose={() => setShowEmojiPicker(false)}
                />
              </div>
            )}
          </div>
        )}

        {/* Missing icon trigger popover */}
        {!hasIcon && showEmojiPicker && (
          <div className="relative">
            <EmojiPicker
              onSelect={(icon) => onUpdate({ icon })}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>
        )}

        {/* Page Title */}
        <textarea
          value={page.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (onEnterTitle) onEnterTitle();
            }
          }}
          placeholder="Untitled"
          rows={1}
          className="w-full bg-transparent text-4xl font-bold tracking-tight text-[var(--notion-text)] focus:outline-none resize-none placeholder-[var(--notion-text-muted)]/40 leading-tight"
          style={{ height: 'auto' }}
        />
      </div>
    </div>
  );
};
