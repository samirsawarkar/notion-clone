import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  ExternalLink,
  Calendar,
  Hash,
  Type,
  Tag,
  CheckSquare,
  User as UserIcon,
} from 'lucide-react';
import { DatabaseProperty, NotionColor, NotionUser } from '../../types/notion';

interface PropertyCellProps {
  property: DatabaseProperty;
  value: any;
  users?: NotionUser[];
  onChange: (newValue: any) => void;
  onOpenPage?: () => void;
}

const COLOR_CLASSES: Record<NotionColor, string> = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  brown: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
  green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
  pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
};

export const PropertyCell: React.FC<PropertyCellProps> = ({
  property,
  value,
  users = [],
  onChange,
  onOpenPage,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  switch (property.type) {
    case 'title':
      return (
        <div className="flex items-center gap-1.5 w-full">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Empty"
            className="w-full bg-transparent text-sm font-medium focus:outline-none text-[var(--notion-text)]"
          />
          {onOpenPage && (
            <button
              onClick={onOpenPage}
              className="opacity-0 group-hover:opacity-100 p-0.5 text-xs text-[var(--notion-text-muted)] hover:text-blue-500 rounded"
              title="Open as Page"
            >
              Open
            </button>
          )}
        </div>
      );

    case 'person': {
      const assignedUser = users.find((u) => u.id === value);

      return (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 max-w-full px-1.5 py-0.5 rounded text-xs hover:bg-[var(--notion-hover)] transition-colors"
          >
            {assignedUser ? (
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm shrink-0">{assignedUser.avatar || '👤'}</span>
                <span className="truncate text-xs text-[var(--notion-text)] font-medium">
                  {assignedUser.name}
                </span>
              </div>
            ) : (
              <span className="text-[var(--notion-text-muted)]/50 text-xs">Unassigned</span>
            )}
            <ChevronDown size={11} className="text-[var(--notion-text-muted)] shrink-0 ml-auto" />
          </button>

          {showDropdown && (
            <div className="absolute left-0 top-7 z-50 w-52 rounded-md border border-[var(--notion-border)] bg-[var(--notion-card)] p-1 shadow-xl">
              <div className="text-[10px] uppercase font-semibold text-[var(--notion-text-muted)] px-2 py-1">
                Assign Member
              </div>
              <button
                onClick={() => {
                  onChange('');
                  setShowDropdown(false);
                }}
                className="flex items-center gap-2 w-full px-2 py-1.5 text-xs rounded hover:bg-[var(--notion-hover)] text-[var(--notion-text-muted)]"
              >
                <span>No Assignee</span>
              </button>
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onChange(u.id);
                    setShowDropdown(false);
                  }}
                  className="flex items-center justify-between w-full px-2 py-1.5 text-xs rounded hover:bg-[var(--notion-hover)] text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm">{u.avatar || '👤'}</span>
                    <div className="min-w-0">
                      <div className="truncate text-[var(--notion-text)] font-medium">
                        {u.name}
                      </div>
                      <div className="text-[10px] text-[var(--notion-text-muted)] truncate">
                        {u.role}
                      </div>
                    </div>
                  </div>
                  {value === u.id && <Check size={12} className="text-blue-500 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    case 'checkbox':
      return (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--notion-border)] text-blue-500 focus:ring-0 cursor-pointer"
          />
        </div>
      );

    case 'status':
    case 'select': {
      const options = property.options || [];
      const currentOpt = options.find((o) => o.name === value);
      const colorClass = currentOpt ? COLOR_CLASSES[currentOpt.color] : COLOR_CLASSES.gray;

      return (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center justify-between gap-1 max-w-full px-2 py-0.5 rounded text-xs transition-colors hover:opacity-80"
          >
            {value ? (
              <span className={`px-2 py-0.5 rounded-md font-medium truncate ${colorClass}`}>
                {value}
              </span>
            ) : (
              <span className="text-[var(--notion-text-muted)]/50">Empty</span>
            )}
            <ChevronDown size={11} className="text-[var(--notion-text-muted)] shrink-0" />
          </button>

          {showDropdown && (
            <div className="absolute left-0 top-7 z-50 w-44 rounded-md border border-[var(--notion-border)] bg-[var(--notion-card)] p-1 shadow-lg">
              <div className="text-[10px] uppercase font-semibold text-[var(--notion-text-muted)] px-2 py-1">
                Select Option
              </div>
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.name);
                    setShowDropdown(false);
                  }}
                  className="flex items-center justify-between w-full px-2 py-1 text-xs rounded hover:bg-[var(--notion-hover)]"
                >
                  <span className={`px-2 py-0.5 rounded ${COLOR_CLASSES[opt.color]}`}>
                    {opt.name}
                  </span>
                  {value === opt.name && <Check size={12} className="text-blue-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    case 'multi_select': {
      const options = property.options || [];
      const selectedNames: string[] = Array.isArray(value) ? value : [];

      const toggleOption = (name: string) => {
        if (selectedNames.includes(name)) {
          onChange(selectedNames.filter((n) => n !== name));
        } else {
          onChange([...selectedNames, name]);
        }
      };

      return (
        <div className="relative flex flex-wrap items-center gap-1">
          {selectedNames.map((name) => {
            const opt = options.find((o) => o.name === name);
            const colorClass = opt ? COLOR_CLASSES[opt.color] : COLOR_CLASSES.blue;
            return (
              <span
                key={name}
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium ${colorClass}`}
              >
                {name}
              </span>
            );
          })}

          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-0.5 text-[var(--notion-text-muted)] hover:bg-[var(--notion-hover)] rounded text-xs"
            title="Edit tags"
          >
            <ChevronDown size={12} />
          </button>

          {showDropdown && (
            <div className="absolute left-0 top-7 z-50 w-48 rounded-md border border-[var(--notion-border)] bg-[var(--notion-card)] p-1 shadow-lg">
              <div className="text-[10px] uppercase font-semibold text-[var(--notion-text-muted)] px-2 py-1">
                Select Tags
              </div>
              {options.map((opt) => {
                const isSelected = selectedNames.includes(opt.name);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleOption(opt.name)}
                    className="flex items-center justify-between w-full px-2 py-1 text-xs rounded hover:bg-[var(--notion-hover)]"
                  >
                    <span className={`px-2 py-0.5 rounded ${COLOR_CLASSES[opt.color]}`}>
                      {opt.name}
                    </span>
                    {isSelected && <Check size={12} className="text-blue-500" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    case 'date':
      return (
        <div className="flex items-center gap-1 text-xs">
          <Calendar size={13} className="text-[var(--notion-text-muted)] shrink-0" />
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="bg-transparent text-xs text-[var(--notion-text)] focus:outline-none cursor-pointer"
          />
        </div>
      );

    case 'number':
      return (
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
          placeholder="0"
          className="w-full bg-transparent text-sm focus:outline-none text-[var(--notion-text)] font-mono"
        />
      );

    case 'url':
      return (
        <div className="flex items-center gap-1 w-full">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://"
            className="w-full bg-transparent text-xs text-blue-500 hover:underline focus:outline-none truncate"
          />
          {value && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--notion-text-muted)] hover:text-blue-500"
            >
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      );

    case 'text':
    default:
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Empty"
          className="w-full bg-transparent text-sm focus:outline-none text-[var(--notion-text)]"
        />
      );
  }
};
