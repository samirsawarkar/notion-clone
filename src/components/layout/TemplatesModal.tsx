import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Briefcase,
  CheckSquare,
  Calendar,
  Layers,
  GraduationCap,
  Users,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { Block, NotionDatabase, NotionPage } from '../../types/notion';
import { generateId } from '../../utils/id';

export interface TemplateDefinition {
  id: string;
  name: string;
  category: 'Work' | 'Personal' | 'Productivity' | 'Education';
  icon: string;
  cover: string;
  description: string;
  tags: string[];
  createData: () => {
    pageTitle: string;
    icon: string;
    cover: string;
    blocks: Block[];
    database?: NotionDatabase;
  };
}

export const TEMPLATES_CATALOG: TemplateDefinition[] = [
  {
    id: 'habit_tracker',
    name: 'Habit Tracker & Daily Journal',
    category: 'Personal',
    icon: '🌱',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80',
    description: 'Track daily habits, morning routines, hydration, and personal reflections.',
    tags: ['Daily Habits', 'Mindfulness', 'Personal'],
    createData: () => {
      const dbId = generateId('db_habit');
      return {
        pageTitle: 'Habit Tracker & Daily Journal',
        icon: '🌱',
        cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80',
        blocks: [
          {
            id: generateId('blk'),
            type: 'callout',
            icon: '🎯',
            backgroundColor: 'green',
            content: 'Consistency is what transforms average into excellence. Track your daily wins here.',
          },
          {
            id: generateId('blk'),
            type: 'heading_2',
            content: "Today's Core Habits",
          },
          { id: generateId('blk'), type: 'to_do', content: 'Morning 20-min workout or run', checked: false },
          { id: generateId('blk'), type: 'to_do', content: 'Drink 2.5L water throughout the day', checked: false },
          { id: generateId('blk'), type: 'to_do', content: 'Read 15 pages of non-fiction book', checked: false },
          { id: generateId('blk'), type: 'to_do', content: 'Evening gratitude journaling (3 things)', checked: false },
          { id: generateId('blk'), type: 'divider', content: '' },
          {
            id: generateId('blk'),
            type: 'heading_2',
            content: 'Weekly Habit Log',
          },
          {
            id: generateId('blk'),
            type: 'table',
            content: '',
            hasHeaderRow: true,
            tableData: [
              ['Habit', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              ['Workout', '✅', '✅', '✅', '❌', '✅', '✅', '—'],
              ['Read 15m', '✅', '✅', '✅', '✅', '✅', '✅', '—'],
              ['Meditation', '✅', '❌', '✅', '✅', '❌', '✅', '—'],
              ['No Sugar', '✅', '✅', '✅', '✅', '✅', '❌', '—'],
            ],
          },
        ],
      };
    },
  },
  {
    id: 'crm_pipeline',
    name: 'Sales CRM & Deals Pipeline',
    category: 'Work',
    icon: '💼',
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop&q=80',
    description: 'Track leads, deal sizes, account executives, and sales stages from Lead to Closed Won.',
    tags: ['Sales', 'Pipeline', 'CRM', 'Revenue'],
    createData: () => {
      const dbId = generateId('db_crm');
      const db: NotionDatabase = {
        id: dbId,
        title: 'Deals Pipeline',
        description: 'Active client deals and pipeline stages',
        properties: [
          { id: 'prop_title', name: 'Deal Name', type: 'title' },
          {
            id: 'prop_status',
            name: 'Stage',
            type: 'status',
            options: [
              { id: 'st_lead', name: 'Lead Qualified', color: 'gray' },
              { id: 'st_demo', name: 'Demo Scheduled', color: 'blue' },
              { id: 'st_prop', name: 'Proposal Sent', color: 'purple' },
              { id: 'st_won', name: 'Closed Won', color: 'green' },
            ],
          },
          { id: 'prop_assignee', name: 'Account Exec', type: 'person' },
          { id: 'prop_val', name: 'Deal Value ($)', type: 'number' },
          { id: 'prop_due', name: 'Expected Close', type: 'date' },
        ],
        views: [
          {
            id: generateId('view'),
            name: 'Kanban Pipeline',
            type: 'board',
            groupByPropertyId: 'prop_status',
            visiblePropertyIds: ['prop_title', 'prop_assignee', 'prop_val', 'prop_due'],
            sorts: [],
            filters: [],
          },
          {
            id: generateId('view'),
            name: 'Deals Table',
            type: 'table',
            visiblePropertyIds: ['prop_title', 'prop_status', 'prop_assignee', 'prop_val', 'prop_due'],
            sorts: [],
            filters: [],
          },
        ],
        currentViewId: '',
        rows: [
          {
            id: generateId('row'),
            pageId: generateId('page'),
            properties: {
              prop_title: 'Acme Corp — Enterprise License (500 seats)',
              prop_status: 'Proposal Sent',
              prop_val: 45000,
              prop_due: '2026-11-15',
            },
          },
          {
            id: generateId('row'),
            pageId: generateId('page'),
            properties: {
              prop_title: 'Starlight Media — Annual Cloud Sync',
              prop_status: 'Closed Won',
              prop_val: 18000,
              prop_due: '2026-10-12',
            },
          },
          {
            id: generateId('row'),
            pageId: generateId('page'),
            properties: {
              prop_title: 'Nordic Labs — AI Workspace Add-on',
              prop_status: 'Demo Scheduled',
              prop_val: 12500,
              prop_due: '2026-11-01',
            },
          },
        ],
      };
      db.currentViewId = db.views[0].id;

      return {
        pageTitle: 'Sales CRM & Deals Pipeline',
        icon: '💼',
        cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop&q=80',
        blocks: [
          {
            id: generateId('blk'),
            type: 'callout',
            icon: '📈',
            backgroundColor: 'blue',
            content: 'Q4 Pipeline Goal: $250,000. Track all deals, demos, and closing milestones here.',
          },
          {
            id: generateId('blk'),
            type: 'database_view',
            content: 'Deals Pipeline',
            databaseId: dbId,
          },
        ],
        database: db,
      };
    },
  },
  {
    id: 'reading_list',
    name: 'Reading List & Book Vault',
    category: 'Productivity',
    icon: '📚',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&auto=format&fit=crop&q=80',
    description: 'Curate books you want to read, currently reading, ratings, and key summary takeaways.',
    tags: ['Books', 'Reading', 'Knowledge', 'Gallery'],
    createData: () => {
      const dbId = generateId('db_books');
      const db: NotionDatabase = {
        id: dbId,
        title: 'Book Vault',
        description: 'Reading queue, favorites, and literature notes',
        properties: [
          { id: 'prop_title', name: 'Book Title', type: 'title' },
          {
            id: 'prop_status',
            name: 'Status',
            type: 'status',
            options: [
              { id: 'b_read', name: 'Want to Read', color: 'gray' },
              { id: 'b_prog', name: 'Currently Reading', color: 'blue' },
              { id: 'b_done', name: 'Finished', color: 'green' },
            ],
          },
          {
            id: 'prop_rating',
            name: 'Rating',
            type: 'select',
            options: [
              { id: 'r5', name: '⭐⭐⭐⭐⭐', color: 'yellow' },
              { id: 'r4', name: '⭐⭐⭐⭐', color: 'orange' },
              { id: 'r3', name: '⭐⭐⭐', color: 'gray' },
            ],
          },
          {
            id: 'prop_genre',
            name: 'Genre',
            type: 'multi_select',
            options: [
              { id: 'g_phil', name: 'Philosophy', color: 'purple' },
              { id: 'g_tech', name: 'Technology', color: 'blue' },
              { id: 'g_bio', name: 'Biography', color: 'green' },
              { id: 'g_sci', name: 'Sci-Fi', color: 'pink' },
            ],
          },
        ],
        views: [
          {
            id: generateId('view'),
            name: 'Gallery Cards',
            type: 'gallery',
            cardSize: 'medium',
            visiblePropertyIds: ['prop_title', 'prop_status', 'prop_rating', 'prop_genre'],
            sorts: [],
            filters: [],
          },
          {
            id: generateId('view'),
            name: 'Books Table',
            type: 'table',
            visiblePropertyIds: ['prop_title', 'prop_status', 'prop_rating', 'prop_genre'],
            sorts: [],
            filters: [],
          },
        ],
        currentViewId: '',
        rows: [
          {
            id: generateId('row'),
            pageId: generateId('page'),
            properties: {
              prop_title: 'Designing Data-Intensive Applications',
              prop_status: 'Currently Reading',
              prop_rating: '⭐⭐⭐⭐⭐',
              prop_genre: ['Technology'],
            },
          },
          {
            id: generateId('row'),
            pageId: generateId('page'),
            properties: {
              prop_title: 'Atomic Habits by James Clear',
              prop_status: 'Finished',
              prop_rating: '⭐⭐⭐⭐⭐',
              prop_genre: ['Philosophy'],
            },
          },
          {
            id: generateId('row'),
            pageId: generateId('page'),
            properties: {
              prop_title: 'The Design of Everyday Things',
              prop_status: 'Want to Read',
              prop_rating: '⭐⭐⭐⭐',
              prop_genre: ['Technology', 'Philosophy'],
            },
          },
        ],
      };
      db.currentViewId = db.views[0].id;

      return {
        pageTitle: 'Reading List & Book Vault',
        icon: '📚',
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&auto=format&fit=crop&q=80',
        blocks: [
          {
            id: generateId('blk'),
            type: 'callout',
            icon: '📖',
            backgroundColor: 'purple',
            content: 'A curated shelf of books, core lessons, and lifetime reading goals.',
          },
          {
            id: generateId('blk'),
            type: 'database_view',
            content: 'Book Vault',
            databaseId: dbId,
          },
        ],
        database: db,
      };
    },
  },
  {
    id: 'student_cornell',
    name: 'Class Notes & Cornell System',
    category: 'Education',
    icon: '🎓',
    cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1600&auto=format&fit=crop&q=80',
    description: 'Structured Cornell note-taking template with Cue questions, notes, and summaries.',
    tags: ['Study', 'University', 'Notes', 'Cornell'],
    createData: () => ({
      pageTitle: 'Lecture Notes (Cornell Method)',
      icon: '🎓',
      cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1600&auto=format&fit=crop&q=80',
      blocks: [
        {
          id: generateId('blk'),
          type: 'callout',
          icon: '📝',
          backgroundColor: 'blue',
          content: 'Course: CS301 Distributed Systems | Professor: Dr. Vance | Date: Oct 18, 2026',
        },
        {
          id: generateId('blk'),
          type: 'heading_2',
          content: '1. Cue Questions & Recall Prompts',
        },
        {
          id: generateId('blk'),
          type: 'toggle',
          content: 'What is the CAP Theorem and its three trade-offs?',
          isOpen: true,
        },
        {
          id: generateId('blk'),
          type: 'toggle',
          content: 'How does Raft consensus elect a leader during partition?',
          isOpen: true,
        },
        {
          id: generateId('blk'),
          type: 'heading_2',
          content: '2. Lecture Notes & Core Equations',
        },
        {
          id: generateId('blk'),
          type: 'paragraph',
          content: 'Consistency implies every read receives the most recent write or an error. Partition tolerance implies system continues to operate despite arbitrary message loss.',
        },
        {
          id: generateId('blk'),
          type: 'math',
          content: 'R + W > N \\implies \\text{Strong Quorum Consistency}',
        },
        {
          id: generateId('blk'),
          type: 'heading_2',
          content: '3. Summary & Review Takeaways',
        },
        {
          id: generateId('blk'),
          type: 'quote',
          content: 'In any asynchronous network prone to network drops, you must choose between consistency or availability when a partition occurs.',
        },
      ],
    }),
  },
];

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: TemplateDefinition) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDefinition>(TEMPLATES_CATALOG[0]);

  if (!isOpen) return null;

  const categories = ['All', 'Work', 'Personal', 'Productivity', 'Education'];

  const filtered = TEMPLATES_CATALOG.filter(
    (t) => selectedCategory === 'All' || t.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-100 p-4">
      <div className="flex flex-col h-[600px] w-full max-w-4xl rounded-2xl border border-[var(--notion-border)] bg-[var(--notion-card)] shadow-2xl overflow-hidden text-[var(--notion-text)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--notion-border)]">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-blue-500" />
            <h3 className="text-base font-bold tracking-tight">Notion Template Gallery</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--notion-text-muted)] hover:bg-[var(--notion-hover)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 px-6 py-2.5 border-b border-[var(--notion-border)] bg-[var(--notion-hover)]/30 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white shadow-xs'
                  : 'text-[var(--notion-text-muted)] hover:text-[var(--notion-text)] hover:bg-[var(--notion-hover)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Body: Left side template cards, Right side preview */}
        <div className="flex flex-1 min-h-0 divide-x divide-[var(--notion-border)]">
          {/* Left: Template Cards */}
          <div className="w-80 overflow-y-auto p-3 space-y-2">
            {filtered.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`flex items-start gap-3 w-full p-3 rounded-xl text-left border transition-all ${
                  selectedTemplate.id === t.id
                    ? 'border-blue-500 bg-blue-500/5 shadow-xs'
                    : 'border-[var(--notion-border)] hover:bg-[var(--notion-hover)]'
                }`}
              >
                <span className="text-2xl shrink-0 p-1 bg-[var(--notion-hover)] rounded-lg">
                  {t.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--notion-text)] truncate">
                    {t.name}
                  </div>
                  <div className="text-[11px] text-[var(--notion-text-muted)] line-clamp-2 mt-0.5">
                    {t.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Template Preview & Action */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[var(--notion-bg)] p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--notion-border)]">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedTemplate.icon}</span>
                <div>
                  <h4 className="text-lg font-bold text-[var(--notion-text)]">
                    {selectedTemplate.name}
                  </h4>
                  <div className="flex gap-1.5 mt-1">
                    {selectedTemplate.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--notion-hover)] text-[var(--notion-text-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onApplyTemplate(selectedTemplate);
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm hover:scale-[1.02]"
              >
                <span>Use This Template</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Template Preview Card */}
            <div className="rounded-xl border border-[var(--notion-border)] overflow-hidden shadow-xs flex-1 flex flex-col bg-[var(--notion-card)]">
              <div className="h-36 overflow-hidden relative">
                <img
                  src={selectedTemplate.cover}
                  alt={selectedTemplate.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs text-[var(--notion-text-muted)] leading-relaxed">
                  {selectedTemplate.description}
                </p>
                <div className="p-3 rounded-lg bg-[var(--notion-hover)]/50 border border-[var(--notion-border)] text-xs text-[var(--notion-text)] space-y-1">
                  <div className="font-semibold text-blue-500">What's included in this template:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-[var(--notion-text-muted)]">
                    <li>Full pre-configured page layout with authentic Notion styling</li>
                    <li>Interactive blocks, checklists, and summary callouts</li>
                    <li>Connected multi-view database schemas (Table & Kanban)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
