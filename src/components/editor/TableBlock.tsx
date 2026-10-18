import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Block } from '../../types/notion';

interface TableBlockProps {
  block: Block;
  onChange: (updated: Partial<Block>) => void;
}

export const TableBlock: React.FC<TableBlockProps> = ({ block, onChange }) => {
  const data = block.tableData || [
    ['Header 1', 'Header 2', 'Header 3'],
    ['Cell 1', 'Cell 2', 'Cell 3'],
  ];

  const handleCellChange = (rIdx: number, cIdx: number, val: string) => {
    const nextData = data.map((row, r) =>
      r === rIdx ? row.map((cell, c) => (c === cIdx ? val : cell)) : [...row]
    );
    onChange({ tableData: nextData });
  };

  const addRow = () => {
    const colsCount = data[0]?.length || 3;
    const newRow = new Array(colsCount).fill('');
    onChange({ tableData: [...data, newRow] });
  };

  const addColumn = () => {
    const nextData = data.map((row) => [...row, '']);
    onChange({ tableData: nextData });
  };

  const deleteRow = (rIdx: number) => {
    if (data.length <= 1) return;
    const nextData = data.filter((_, idx) => idx !== rIdx);
    onChange({ tableData: nextData });
  };

  const deleteColumn = (cIdx: number) => {
    if ((data[0]?.length || 0) <= 1) return;
    const nextData = data.map((row) => row.filter((_, idx) => idx !== cIdx));
    onChange({ tableData: nextData });
  };

  return (
    <div className="my-3 overflow-x-auto">
      <div className="flex items-center gap-3 mb-2 text-xs text-[var(--notion-text-muted)]">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={!!block.hasHeaderRow}
            onChange={(e) => onChange({ hasHeaderRow: e.target.checked })}
            className="rounded border-[var(--notion-border)] text-blue-500 focus:ring-0"
          />
          Header row
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={!!block.hasHeaderColumn}
            onChange={(e) => onChange({ hasHeaderColumn: e.target.checked })}
            className="rounded border-[var(--notion-border)] text-blue-500 focus:ring-0"
          />
          Header column
        </label>
      </div>

      <div className="inline-block min-w-full align-middle border border-[var(--notion-border)] rounded-md overflow-hidden bg-[var(--notion-card)]">
        <table className="min-w-full divide-y divide-[var(--notion-border)] border-collapse">
          <tbody>
            {data.map((row, rIdx) => {
              const isHeaderRow = block.hasHeaderRow && rIdx === 0;
              return (
                <tr
                  key={rIdx}
                  className={`group divide-x divide-[var(--notion-border)] ${
                    isHeaderRow ? 'bg-[var(--notion-hover)] font-medium' : ''
                  }`}
                >
                  {row.map((cell, cIdx) => {
                    const isHeaderCol = block.hasHeaderColumn && cIdx === 0;
                    return (
                      <td
                        key={cIdx}
                        className={`p-0 relative min-w-[120px] ${
                          isHeaderCol ? 'bg-[var(--notion-hover)] font-medium' : ''
                        }`}
                      >
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                          placeholder="Empty"
                          className="w-full px-2.5 py-1.5 text-sm bg-transparent focus:outline-none focus:bg-blue-500/5 text-[var(--notion-text)] placeholder-[var(--notion-text-muted)]/40"
                        />
                      </td>
                    );
                  })}
                  {/* Delete row button */}
                  <td className="w-8 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                    <button
                      onClick={() => deleteRow(rIdx)}
                      className="p-1 rounded text-red-500 hover:bg-red-500/10"
                      title="Delete row"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Add Row & Column buttons */}
        <div className="flex items-center justify-between p-1 bg-[var(--notion-hover)]/40 border-t border-[var(--notion-border)]">
          <button
            onClick={addRow}
            className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--notion-text-muted)] hover:text-[var(--notion-text)] hover:bg-[var(--notion-hover)] rounded transition-colors"
          >
            <Plus size={14} /> Add Row
          </button>
          <button
            onClick={addColumn}
            className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--notion-text-muted)] hover:text-[var(--notion-text)] hover:bg-[var(--notion-hover)] rounded transition-colors"
          >
            <Plus size={14} /> Add Column
          </button>
        </div>
      </div>
    </div>
  );
};
