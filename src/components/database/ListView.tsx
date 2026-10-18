import React from 'react';
import { Plus, FileText } from 'lucide-react';
import { DatabaseRow, NotionDatabase } from '../../types/notion';

interface ListViewProps {
  database: NotionDatabase;
  filteredRows: DatabaseRow[];
  onAddRow: () => void;
  onOpenRowPage: (pageId: string) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  database,
  filteredRows,
  onAddRow,
  onOpenRowPage,
}) => {
  return (
    <div className="divide-y divide-[var(--notion-border)] border border-[var(--notion-border)] rounded-md bg-[var(--notion-card)] overflow-hidden">
      {filteredRows.map((row) => {
        const titleVal = row.properties.prop_title || 'Untitled';
        const status = row.properties.prop_status;
        const priority = row.properties.prop_priority;
        const due = row.properties.prop_due;

        return (
          <div
            key={row.id}
            onClick={() => onOpenRowPage(row.pageId)}
            className="flex items-center justify-between px-3 py-2 hover:bg-[var(--notion-hover)]/40 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-4">
              <FileText size={15} className="text-[var(--notion-text-muted)] shrink-0" />
              <span className="text-sm font-medium text-[var(--notion-text)] truncate">
                {titleVal}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-xs">
              {status && (
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 font-medium">
                  {status}
                </span>
              )}
              {priority && (
                <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200">
                  {priority}
                </span>
              )}
              {due && (
                <span className="text-[var(--notion-text-muted)] text-xs">
                  {due}
                </span>
              )}
            </div>
          </div>
        );
      })}

      <button
        onClick={onAddRow}
        className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-[var(--notion-text-muted)] hover:text-[var(--notion-text)] hover:bg-[var(--notion-hover)] transition-colors"
      >
        <Plus size={14} /> New Item
      </button>
    </div>
  );
};
