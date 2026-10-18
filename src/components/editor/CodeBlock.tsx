import React, { useState } from 'react';
import { Copy, Check, ChevronDown } from 'lucide-react';
import { Block } from '../../types/notion';

interface CodeBlockProps {
  block: Block;
  onChange: (updated: Partial<Block>) => void;
}

const LANGUAGES = [
  'typescript',
  'javascript',
  'python',
  'rust',
  'go',
  'html',
  'css',
  'sql',
  'json',
  'markdown',
  'bash',
  'c++',
  'java',
  'yaml',
];

export const CodeBlock: React.FC<CodeBlockProps> = ({ block, onChange }) => {
  const [copied, setCopied] = useState(false);
  const language = block.language || 'typescript';

  const handleCopy = () => {
    navigator.clipboard.writeText(block.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2.5 rounded-lg border border-[var(--notion-border)] bg-[#1e1e1e] text-[#d4d4d4] font-mono shadow-sm overflow-hidden text-sm">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#333333] text-xs">
        <div className="relative group">
          <select
            value={language}
            onChange={(e) => onChange({ language: e.target.value })}
            className="appearance-none bg-transparent hover:bg-[#333333] text-gray-300 pr-5 pl-2 py-0.5 rounded cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 capitalize"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang} className="bg-[#252526] text-white">
                {lang}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-1 top-1.5 pointer-events-none text-gray-400"
          />
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-gray-400 hover:text-white hover:bg-[#333333] transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-[11px] text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Textarea */}
      <div className="p-3">
        <textarea
          value={block.content || ''}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="// Type or paste your code here..."
          rows={Math.max(3, (block.content || '').split('\n').length)}
          className="w-full bg-transparent font-mono text-sm leading-relaxed text-[#d4d4d4] focus:outline-none resize-none placeholder-gray-600"
          spellCheck={false}
        />
      </div>

      {/* Caption */}
      <div className="px-3 pb-2 pt-0">
        <input
          type="text"
          value={block.caption || ''}
          onChange={(e) => onChange({ caption: e.target.value })}
          placeholder="Add a caption..."
          className="w-full text-xs text-gray-400 bg-transparent focus:outline-none focus:text-gray-200 placeholder-gray-600 font-sans"
        />
      </div>
    </div>
  );
};
