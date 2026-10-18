import React, { useState } from 'react';
import { Block, BlockType } from '../../types/notion';
import { BlockItem } from './BlockItem';

interface BlockListProps {
  pageId: string;
  blockIds: string[];
  blocks: Record<string, Block>;
  onUpdateBlock: (blockId: string, partial: Partial<Block>) => void;
  onDeleteBlock: (pageId: string, blockId: string) => void;
  onDuplicateBlock: (pageId: string, blockId: string) => void;
  onConvertType: (blockId: string, newType: BlockType) => void;
  onAddBlock: (pageId: string, type?: BlockType, afterBlockId?: string) => void;
  onMoveBlock: (pageId: string, fromIndex: number, toIndex: number) => void;
  renderDatabase?: (databaseId: string) => React.ReactNode;
}

export const BlockList: React.FC<BlockListProps> = ({
  pageId,
  blockIds,
  blocks,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onConvertType,
  onAddBlock,
  onMoveBlock,
  renderDatabase,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onMoveBlock(pageId, draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="px-12 pb-32">
      <div className="space-y-0.5">
        {blockIds.map((blockId, idx) => {
          const block = blocks[blockId];
          if (!block) return null;

          return (
            <BlockItem
              key={block.id}
              block={block}
              index={idx}
              pageId={pageId}
              onUpdate={(partial) => onUpdateBlock(block.id, partial)}
              onDelete={() => onDeleteBlock(pageId, block.id)}
              onDuplicate={() => onDuplicateBlock(pageId, block.id)}
              onConvertType={(newType) => onConvertType(block.id, newType)}
              onAddBelow={(type) => onAddBlock(pageId, type, block.id)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              renderDatabase={renderDatabase}
            />
          );
        })}
      </div>

      {/* Click below to append block */}
      <div
        onClick={() => onAddBlock(pageId, 'paragraph')}
        className="h-32 cursor-text flex items-start pt-4 text-xs text-transparent hover:text-[var(--notion-text-muted)]/30 transition-colors"
      >
        Click to add a block below...
      </div>
    </div>
  );
};
