import { Block, BlockType } from '../types/notion';
import { generateId } from './id';

export function parseNotionMarkdown(markdownText: string): { title: string; blocks: Block[] } {
  const lines = markdownText.split('\n');
  const blocks: Block[] = [];
  let title = 'Imported Notion Page';

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Title / Headings
    if (trimmed.startsWith('# ') && title === 'Imported Notion Page') {
      title = trimmed.replace('# ', '').trim();
      i++;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      blocks.push({
        id: generateId('blk'),
        type: 'heading_1',
        content: trimmed.replace('# ', '').trim(),
      });
    } else if (trimmed.startsWith('## ')) {
      blocks.push({
        id: generateId('blk'),
        type: 'heading_2',
        content: trimmed.replace('## ', '').trim(),
      });
    } else if (trimmed.startsWith('### ')) {
      blocks.push({
        id: generateId('blk'),
        type: 'heading_3',
        content: trimmed.replace('### ', '').trim(),
      });
    } else if (trimmed.startsWith('- [ ] ') || trimmed.startsWith('* [ ] ')) {
      blocks.push({
        id: generateId('blk'),
        type: 'to_do',
        content: trimmed.replace(/^[-*]\s*\[ \]\s*/, '').trim(),
        checked: false,
      });
    } else if (trimmed.startsWith('- [x] ') || trimmed.startsWith('* [x] ')) {
      blocks.push({
        id: generateId('blk'),
        type: 'to_do',
        content: trimmed.replace(/^[-*]\s*\[x\]\s*/i, '').trim(),
        checked: true,
      });
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      blocks.push({
        id: generateId('blk'),
        type: 'bulleted_list_item',
        content: trimmed.replace(/^[-*]\s+/, '').trim(),
      });
    } else if (/^\d+\.\s+/.test(trimmed)) {
      blocks.push({
        id: generateId('blk'),
        type: 'numbered_list_item',
        content: trimmed.replace(/^\d+\.\s+/, '').trim(),
      });
    } else if (trimmed.startsWith('> ')) {
      blocks.push({
        id: generateId('blk'),
        type: 'quote',
        content: trimmed.replace(/^>\s*/, '').trim(),
      });
    } else if (trimmed.startsWith('---') || trimmed.startsWith('***')) {
      blocks.push({
        id: generateId('blk'),
        type: 'divider',
        content: '',
      });
    } else if (trimmed.startsWith('```')) {
      const lang = trimmed.replace('```', '').trim() || 'typescript';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        id: generateId('blk'),
        type: 'code',
        language: lang,
        content: codeLines.join('\n'),
      });
    } else {
      blocks.push({
        id: generateId('blk'),
        type: 'paragraph',
        content: trimmed,
      });
    }

    i++;
  }

  if (blocks.length === 0) {
    blocks.push({
      id: generateId('blk'),
      type: 'paragraph',
      content: '',
    });
  }

  return { title, blocks };
}
