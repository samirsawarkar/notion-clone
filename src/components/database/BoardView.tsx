import React, { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import {
  DatabaseProperty,
  DatabaseRow,
  NotionColor,
  NotionDatabase,
} from '../../types/notion';

interface BoardViewProps {
  database: NotionDatabase;
  filteredRows: DatabaseRow[];
  onUpdateRow: (rowId: string, propertyId: string, value: any) => void;
  onAddRow: (initialProps?: Record<string, any>) => void;
  onOpenRowPage: (pageId: string) => void;
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

export const BoardView: React.FC<BoardViewProps> = ({
  database,
  filteredRows,
  onUpdateRow,
  onAddRow,
  onOpenRowPage,
}) => {
  const [draggedRowId, setDraggedRowId] = useState<string | null>(null);

  // Find groupBy property (default to status or first select)
  const groupProp =
    database.properties.find((p) => p.type === 'status') ||
    database.properties.find((p) => p.type === 'select') ||
    database.properties[1];

  const columns = groupProp?.options || [
    { id: 'col_1', name: 'Not Started', color: 'gray' as NotionColor },
    { id: 'col_2', name: 'In Progress', color: 'blue' as NotionColor },
    { id: 'col_3', name: 'Done', color: 'green' as NotionColor },
  ];

  const handleDragStart = (e: React.DragEvent, rowId: string) => {
    setDraggedRowId(rowId);
    e.dataTransfer.setData('text/plain', rowId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, columnValue: string) => {
    e.preventDefault();
    if (draggedRowId && groupProp) {
      onUpdateRow(draggedRowId, groupProp.id, columnValue);
    }
    setDraggedRowId(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1">
      {columns.map((col) => {
        const rowsInCol = filteredRows.filter(
          (r) => r.properties[groupProp?.id || ''] === col.name
        );

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.name)}
            className="flex flex-col shrink-0 w-72 rounded-lg bg-[var(--notion-hover)]/40 p-2.5 border border-[var(--notion-border)]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    COLOR_CLASSES[col.color]
                  }`}
                >
                  {col.name}
                </span>
                <span className="text-xs text-[var(--notion-text-muted)] font-medium">
                  {rowsInCol.length}
                </span>
              </div>
              <button
                onClick={() => onAddRow({ [groupProp?.id || '']: col.name })}
                className="p-1 hover:bg-[var(--notion-hover)] rounded text-[var(--notion-text-muted)] hover:text-[var(--notion-text)]"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Cards List */}
            <div className="space-y-2 flex-1 min-h-[100px]">
              {rowsInCol.map((row) => {
                const titleVal = row.properties.prop_title || 'Untitled';
                const priority = row.properties.prop_priority;
                const tags: string[] = Array.isArray(row.properties.prop_tags)
                  ? row.properties.prop_tags
                  : [];
                const due = row.properties.prop_due;

                return (
                  <div
                    key={row.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, row.id)}
                    onClick={() => onOpenRowPage(row.pageId)}
                    className="group relative p-3 rounded-md border border-[var(--notion-border)] bg-[var(--notion-card)] shadow-xs hover:shadow-md transition-all cursor-pointer select-none"
                  >
                    <div className="text-sm font-medium text-[var(--notion-text)] leading-snug mb-2">
                      {titleVal}
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      {priority && (
                        <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200 font-medium">
                          {priority}
                        </span>
                      )}
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                        >
                          {t}
                        </span>
                      ))}
                      {due && (
                        <span className="text-[var(--notion-text-muted)] ml-auto">
                          {due}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Card Button */}
            <button
              onClick={() => onAddRow({ [groupProp?.id || '']: col.name })}
              className="flex items-center gap-1.5 mt-2 px-2 py-1.5 rounded hover:bg-[var(--notion-hover)] text-xs text-[var(--notion-text-muted)] hover:text-[var(--notion-text)] transition-colors"
            >
              <Plus size={14} /> New
            </button>
          </div>
        );
      })}
    </div>
  );
};
