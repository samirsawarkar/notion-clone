import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Type,
  Hash,
  Tag,
  CheckSquare,
  Calendar,
  Globe,
  User as UserIcon,
  HelpCircle,
} from 'lucide-react';
import {
  DatabaseProperty,
  DatabaseRow,
  NotionDatabase,
  NotionUser,
  PropertyType,
} from '../../types/notion';
import { PropertyCell } from './PropertyCell';

interface TableViewProps {
  database: NotionDatabase;
  filteredRows: DatabaseRow[];
  users?: NotionUser[];
  onUpdateRow: (rowId: string, propertyId: string, value: any) => void;
  onAddRow: () => void;
  onDeleteRow: (rowId: string) => void;
  onAddProperty: (name: string, type: PropertyType) => void;
  onOpenRowPage: (pageId: string) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  database,
  filteredRows,
  users = [],
  onUpdateRow,
  onAddRow,
  onDeleteRow,
  onAddProperty,
  onOpenRowPage,
}) => {
  const [showAddProp, setShowAddProp] = useState(false);
  const [newPropName, setNewPropName] = useState('');
  const [newPropType, setNewPropType] = useState<PropertyType>('text');

  const handleAddPropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPropName.trim()) {
      onAddProperty(newPropName.trim(), newPropType);
      setNewPropName('');
      setShowAddProp(false);
    }
  };

  const getPropIcon = (type: PropertyType) => {
    switch (type) {
      case 'title':
      case 'text':
        return <Type size={14} className="text-[var(--notion-text-muted)]" />;
      case 'person':
        return <UserIcon size={14} className="text-blue-500" />;
      case 'number':
        return <Hash size={14} className="text-[var(--notion-text-muted)]" />;
      case 'select':
      case 'status':
      case 'multi_select':
        return <Tag size={14} className="text-[var(--notion-text-muted)]" />;
      case 'checkbox':
        return <CheckSquare size={14} className="text-[var(--notion-text-muted)]" />;
      case 'date':
        return <Calendar size={14} className="text-[var(--notion-text-muted)]" />;
      case 'url':
        return <Globe size={14} className="text-[var(--notion-text-muted)]" />;
      default:
        return <HelpCircle size={14} className="text-[var(--notion-text-muted)]" />;
    }
  };

  return (
    <div className="w-full overflow-x-auto border border-[var(--notion-border)] rounded-md bg-[var(--notion-card)] shadow-xs">
      <table className="min-w-full divide-y divide-[var(--notion-border)] border-collapse text-left text-xs">
        {/* Header Row */}
        <thead>
          <tr className="divide-x divide-[var(--notion-border)] bg-[var(--notion-hover)]/60 text-[var(--notion-text-muted)] font-medium">
            {database.properties.map((prop) => (
              <th key={prop.id} className="px-3 py-2 min-w-[150px] whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  {getPropIcon(prop.type)}
                  <span className="truncate">{prop.name}</span>
                </div>
              </th>
            ))}
            {/* Add Property Column */}
            <th className="w-10 px-2 py-2 text-center">
              <div className="relative">
                <button
                  onClick={() => setShowAddProp(!showAddProp)}
                  className="p-1 hover:bg-[var(--notion-hover)] rounded text-[var(--notion-text-muted)] hover:text-[var(--notion-text)]"
                  title="Add property"
                >
                  <Plus size={14} />
                </button>

                {showAddProp && (
                  <form
                    onSubmit={handleAddPropSubmit}
                    className="absolute right-0 top-7 z-50 w-52 p-3 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-card)] shadow-xl text-left"
                  >
                    <div className="text-xs font-semibold text-[var(--notion-text-muted)] mb-2">
                      New Property
                    </div>
                    <input
                      type="text"
                      placeholder="Property name"
                      value={newPropName}
                      onChange={(e) => setNewPropName(e.target.value)}
                      className="w-full px-2 py-1 mb-2 text-xs rounded border border-[var(--notion-border)] bg-[var(--notion-hover)] text-[var(--notion-text)] focus:outline-none"
                      autoFocus
                    />
                    <select
                      value={newPropType}
                      onChange={(e) => setNewPropType(e.target.value as PropertyType)}
                      className="w-full px-2 py-1 mb-3 text-xs rounded border border-[var(--notion-border)] bg-[var(--notion-hover)] text-[var(--notion-text)] focus:outline-none"
                    >
                      <option value="text">Text</option>
                      <option value="person">Person / Assignee</option>
                      <option value="number">Number</option>
                      <option value="select">Select</option>
                      <option value="multi_select">Multi-Select</option>
                      <option value="status">Status</option>
                      <option value="date">Date</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="url">URL Link</option>
                    </select>
                    <button
                      type="submit"
                      className="w-full py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-colors"
                    >
                      Create Property
                    </button>
                  </form>
                )}
              </div>
            </th>
            <th className="w-8" />
          </tr>
        </thead>

        {/* Rows */}
        <tbody className="divide-y divide-[var(--notion-border)]">
          {filteredRows.map((row) => (
            <tr
              key={row.id}
              className="group divide-x divide-[var(--notion-border)] hover:bg-[var(--notion-hover)]/30 transition-colors"
            >
              {database.properties.map((prop) => (
                <td key={prop.id} className="px-3 py-1.5 min-w-[150px]">
                  <PropertyCell
                    property={prop}
                    value={row.properties[prop.id]}
                    users={users}
                    onChange={(val) => onUpdateRow(row.id, prop.id, val)}
                    onOpenPage={prop.type === 'title' ? () => onOpenRowPage(row.pageId) : undefined}
                  />
                </td>
              ))}
              <td className="w-10" />
              {/* Row Actions */}
              <td className="w-8 text-center p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onDeleteRow(row.id)}
                  className="p-1 rounded text-red-500 hover:bg-red-500/10"
                  title="Delete row"
                >
                  <Trash2 size={13} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Table Footer: Add Row & Stats */}
      <div className="flex items-center justify-between px-3 py-2 bg-[var(--notion-hover)]/30 border-t border-[var(--notion-border)] text-xs text-[var(--notion-text-muted)]">
        <button
          onClick={onAddRow}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[var(--notion-hover)] hover:text-[var(--notion-text)] font-medium transition-colors"
        >
          <Plus size={14} /> New
        </button>
        <div>
          <span>Count {filteredRows.length}</span>
        </div>
      </div>
    </div>
  );
};
