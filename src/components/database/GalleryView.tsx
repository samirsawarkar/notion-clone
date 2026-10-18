import React from 'react';
import { Plus } from 'lucide-react';
import { DatabaseRow, NotionDatabase } from '../../types/notion';

interface GalleryViewProps {
  database: NotionDatabase;
  filteredRows: DatabaseRow[];
  onAddRow: () => void;
  onOpenRowPage: (pageId: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  database,
  filteredRows,
  onAddRow,
  onOpenRowPage,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8 pt-1">
      {filteredRows.map((row) => {
        const titleVal = row.properties.prop_title || 'Untitled';
        const status = row.properties.prop_status;
        const priority = row.properties.prop_priority;
        const tags: string[] = Array.isArray(row.properties.prop_tags)
          ? row.properties.prop_tags
          : [];

        return (
          <div
            key={row.id}
            onClick={() => onOpenRowPage(row.pageId)}
            className="group flex flex-col overflow-hidden rounded-lg border border-[var(--notion-border)] bg-[var(--notion-card)] shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            {/* Visual Header / Cover preview */}
            <div className="h-28 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10 border-b border-[var(--notion-border)] flex items-center justify-center text-3xl">
              📄
            </div>

            {/* Card Content */}
            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div className="text-sm font-semibold text-[var(--notion-text)] line-clamp-2 mb-3">
                {titleVal}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {status && (
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 font-medium">
                    {status}
                  </span>
                )}
                {priority && (
                  <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200">
                    {priority}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Add New Card Button */}
      <button
        onClick={onAddRow}
        className="flex flex-col items-center justify-center h-48 rounded-lg border border-dashed border-[var(--notion-border)] hover:bg-[var(--notion-hover)] text-xs text-[var(--notion-text-muted)] hover:text-[var(--notion-text)] transition-colors gap-2"
      >
        <Plus size={20} />
        <span>New Card</span>
      </button>
    </div>
  );
};
