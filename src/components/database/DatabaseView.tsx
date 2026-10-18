import React, { useState, useMemo } from 'react';
import {
  Table as TableIcon,
  Kanban,
  LayoutGrid,
  List as ListIcon,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
} from 'lucide-react';
import {
  DatabaseProperty,
  DatabaseRow,
  DatabaseViewType,
  NotionDatabase,
  NotionUser,
  PropertyType,
} from '../../types/notion';
import { TableView } from './TableView';
import { BoardView } from './BoardView';
import { GalleryView } from './GalleryView';
import { ListView } from './ListView';
import { CalendarView } from './CalendarView';

interface DatabaseViewProps {
  database: NotionDatabase;
  users?: NotionUser[];
  onUpdateRow: (databaseId: string, rowId: string, propertyId: string, value: any) => void;
  onAddRow: (databaseId: string, initialProps?: Record<string, any>) => void;
  onDeleteRow: (databaseId: string, rowId: string) => void;
  onAddProperty: (databaseId: string, name: string, type: PropertyType) => void;
  onSetView: (databaseId: string, viewId: string) => void;
  onAddView: (databaseId: string, name: string, type: DatabaseViewType) => void;
  onOpenRowPage: (pageId: string) => void;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({
  database,
  users = [],
  onUpdateRow,
  onAddRow,
  onDeleteRow,
  onAddProperty,
  onSetView,
  onAddView,
  onOpenRowPage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddViewMenu, setShowAddViewMenu] = useState(false);
  const [activeFilterProp, setActiveFilterProp] = useState<string>('all');
  const [activeSortOrder, setActiveSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  const currentView =
    database.views.find((v) => v.id === database.currentViewId) || database.views[0];

  const getViewIcon = (type: DatabaseViewType) => {
    switch (type) {
      case 'table':
        return <TableIcon size={14} />;
      case 'board':
        return <Kanban size={14} />;
      case 'gallery':
        return <LayoutGrid size={14} />;
      case 'list':
        return <ListIcon size={14} />;
      case 'calendar':
        return <CalendarIcon size={14} />;
    }
  };

  // Filter and sort rows
  const filteredRows = useMemo(() => {
    let rows = [...database.rows];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter((r) =>
        Object.values(r.properties).some((val) =>
          String(val).toLowerCase().includes(q)
        )
      );
    }

    // Property specific filter
    if (activeFilterProp !== 'all') {
      rows = rows.filter((r) => !!r.properties[activeFilterProp]);
    }

    // Sorting
    if (activeSortOrder !== 'none') {
      rows.sort((a, b) => {
        const valA = String(a.properties.prop_title || '');
        const valB = String(b.properties.prop_title || '');
        return activeSortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    }

    return rows;
  }, [database.rows, searchQuery, activeFilterProp, activeSortOrder]);

  return (
    <div className="my-6 space-y-3">
      {/* Database Title Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-[var(--notion-text)]">
            {database.title}
          </h3>
          {database.description && (
            <p className="text-xs text-[var(--notion-text-muted)] mt-0.5">
              {database.description}
            </p>
          )}
        </div>
      </div>

      {/* View Tabs & Action Bar */}
      <div className="flex items-center justify-between border-b border-[var(--notion-border)] pb-1.5 flex-wrap gap-2">
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {database.views.map((view) => (
            <button
              key={view.id}
              onClick={() => onSetView(database.id, view.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                view.id === currentView.id
                  ? 'border-b-2 border-blue-500 text-blue-500 font-semibold'
                  : 'text-[var(--notion-text-muted)] hover:text-[var(--notion-text)] hover:bg-[var(--notion-hover)]'
              }`}
            >
              {getViewIcon(view.type)}
              <span>{view.name}</span>
            </button>
          ))}

          {/* Add View Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAddViewMenu(!showAddViewMenu)}
              className="p-1 rounded text-[var(--notion-text-muted)] hover:text-[var(--notion-text)] hover:bg-[var(--notion-hover)]"
              title="Add a view"
            >
              <Plus size={14} />
            </button>

            {showAddViewMenu && (
              <div className="absolute left-0 top-7 z-50 w-44 rounded-md border border-[var(--notion-border)] bg-[var(--notion-card)] p-1 shadow-lg text-xs">
                <div className="px-2 py-1 text-[10px] uppercase font-semibold text-[var(--notion-text-muted)]">
                  Add View
                </div>
                {[
                  { type: 'table' as const, label: 'Table' },
                  { type: 'board' as const, label: 'Board (Kanban)' },
                  { type: 'gallery' as const, label: 'Gallery' },
                  { type: 'list' as const, label: 'List' },
                  { type: 'calendar' as const, label: 'Calendar' },
                ].map((v) => (
                  <button
                    key={v.type}
                    onClick={() => {
                      onAddView(database.id, `${v.label} 2`, v.type);
                      setShowAddViewMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-[var(--notion-hover)] text-left"
                  >
                    {getViewIcon(v.type)}
                    <span>{v.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search, Filter, Sort Controls */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-[var(--notion-border)] bg-[var(--notion-hover)]/50 text-xs">
            <Search size={13} className="text-[var(--notion-text-muted)]" />
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-28 sm:w-36 bg-transparent focus:outline-none text-[var(--notion-text)] placeholder-[var(--notion-text-muted)]"
            />
          </div>

          {/* Sort Button Toggle */}
          <button
            onClick={() =>
              setActiveSortOrder((prev) =>
                prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none'
              )
            }
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border border-[var(--notion-border)] transition-colors ${
              activeSortOrder !== 'none'
                ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                : 'text-[var(--notion-text-muted)] hover:bg-[var(--notion-hover)]'
            }`}
            title="Sort by Title"
          >
            <ArrowUpDown size={12} />
            <span>Sort {activeSortOrder !== 'none' ? `(${activeSortOrder.toUpperCase()})` : ''}</span>
          </button>

          {/* New Row Button */}
          <button
            onClick={() => onAddRow(database.id)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white font-medium text-xs transition-colors shadow-xs"
          >
            <Plus size={14} /> New
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {currentView.type === 'table' && (
        <TableView
          database={database}
          filteredRows={filteredRows}
          users={users}
          onUpdateRow={(rId, pId, val) => onUpdateRow(database.id, rId, pId, val)}
          onAddRow={() => onAddRow(database.id)}
          onDeleteRow={(rId) => onDeleteRow(database.id, rId)}
          onAddProperty={(name, type) => onAddProperty(database.id, name, type)}
          onOpenRowPage={onOpenRowPage}
        />
      )}

      {currentView.type === 'board' && (
        <BoardView
          database={database}
          filteredRows={filteredRows}
          onUpdateRow={(rId, pId, val) => onUpdateRow(database.id, rId, pId, val)}
          onAddRow={(props) => onAddRow(database.id, props)}
          onOpenRowPage={onOpenRowPage}
        />
      )}

      {currentView.type === 'gallery' && (
        <GalleryView
          database={database}
          filteredRows={filteredRows}
          onAddRow={() => onAddRow(database.id)}
          onOpenRowPage={onOpenRowPage}
        />
      )}

      {currentView.type === 'list' && (
        <ListView
          database={database}
          filteredRows={filteredRows}
          onAddRow={() => onAddRow(database.id)}
          onOpenRowPage={onOpenRowPage}
        />
      )}

      {currentView.type === 'calendar' && (
        <CalendarView
          database={database}
          filteredRows={filteredRows}
          onAddRow={(props) => onAddRow(database.id, props)}
          onOpenRowPage={onOpenRowPage}
        />
      )}
    </div>
  );
};
