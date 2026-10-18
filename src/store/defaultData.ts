import { Block, NotionDatabase, NotionPage, NotionUser, NotionWorkspace } from '../types/notion';

export const INITIAL_USERS: NotionUser[] = [
  {
    id: 'user_samir',
    name: 'samir sawarkar',
    email: 'samir@example.com',
    avatar: '👨‍💻',
    role: 'Workspace Owner',
    color: 'blue',
  },
  {
    id: 'user_alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    avatar: '⚡',
    role: 'Admin',
    color: 'purple',
  },
  {
    id: 'user_elena',
    name: 'Elena Chen',
    email: 'elena.chen@example.com',
    avatar: '🎨',
    role: 'Member',
    color: 'pink',
  },
  {
    id: 'user_marcus',
    name: 'Marcus Vance',
    email: 'marcus.v@example.com',
    avatar: '🚀',
    role: 'Member',
    color: 'green',
  },
];

export const INITIAL_WORKSPACE: NotionWorkspace = (() => {
  const blocks: Record<string, Block> = {
    // v9-platform blocks (from Samir's actual Notion setup)
    'b_v9_h1': {
      id: 'b_v9_h1',
      type: 'heading_1',
      content: 'v9-platform',
    },
    'b_v9_callout': {
      id: 'b_v9_callout',
      type: 'callout',
      icon: '🛡️',
      backgroundColor: 'yellow',
      content: 'STEP V9 — reposition the site as an AI reliability & evals platform (CEO approved 17 Oct 2026)',
    },
    'b_v9_intro': {
      id: 'b_v9_intro',
      type: 'paragraph',
      content: 'Read first: .aes/src/v3-brief.md (theme, honesty, voice). Fact sources ONLY: .aes/src/faultline-README.md (FAULTLINE workbench), .aes/src/faultgate-README-0.3.1.md + faultgate-CHANGELOG.md, .aes/src/mcp-guard-README.md, and numbers already on the site.\n\nCompany reality: no customers, no SOC 2, solo founder. Never imply past clients ("we\'ve helped", "teams use"), never invent numbers, turnaround times or guarantees. Theme, components and motion conventions unchanged. No new dependencies.',
    },
    'b_v9_h2_ceo': {
      id: 'b_v9_h2_ceo',
      type: 'heading_2',
      content: 'CEO decisions',
    },
    'b_v9_ceo_1': {
      id: 'b_v9_ceo_1',
      type: 'bulleted_list_item',
      content: 'Mission / hero H1: "Non-deterministic models. Deterministic decisions."',
    },
    'b_v9_ceo_2': {
      id: 'b_v9_ceo_2',
      type: 'bulleted_list_item',
      content: 'Platform — three pillars in one loop: EVALUATE = "FAULTLINE Evals" (the open-source workbench, github.com/faultline-lab/faultline, MIT), GATE = faultgate 0.3.1, GUARD = mcp-guard (PyPI: mcp-integrity).',
    },
    'b_v9_ceo_3': {
      id: 'b_v9_ceo_3',
      type: 'bulleted_list_item',
      content: 'Services: Readiness Review ($7,500, 5 business days — existing), Custom eval suite build, Tool-poisoning red-team, Ongoing reliability retainer. The three new ones show "Contact us" (no price, no turnaround). CTAs go to /demo?topic=',
    },
    'b_v9_h2_home': {
      id: 'b_v9_h2_home',
      type: 'heading_2',
      content: '1. Home (src/pages/index.astro) — new order',
    },
    'b_v9_home_1': {
      id: 'b_v9_home_1',
      type: 'numbered_list_item',
      content: 'Hero: eyebrow "AI RELIABILITY & EVALS PLATFORM". H1 "Non-deterministic models. Deterministic decisions."',
    },
    'b_v9_toggle_sample': {
      id: 'b_v9_toggle_sample',
      type: 'toggle',
      content: 'asdf',
      isOpen: true,
      childrenIds: ['b_v9_child_1', 'b_v9_child_2'],
    },
    'b_v9_child_1': {
      id: 'b_v9_child_1',
      type: 'bulleted_list_item',
      content: 'ASDAkl;',
    },
    'b_v9_child_2': {
      id: 'b_v9_child_2',
      type: 'bulleted_list_item',
      content: 'ASD;ALSJ',
    },

    // Ramp HQ Page Blocks
    'b_ramp_callout': {
      id: 'b_ramp_callout',
      type: 'callout',
      icon: '⚡',
      backgroundColor: 'blue',
      content: 'Ramp HQ — Central company sprint planning, feature launches, and task routing.',
    },
    'b_ramp_db': {
      id: 'b_ramp_db',
      type: 'database_view',
      content: 'Ramp Company Tasks',
      databaseId: 'db_ramp_tasks',
    },

    // Second Brain Page Blocks
    'b_sb_h1': {
      id: 'b_sb_h1',
      type: 'heading_1',
      content: 'Second Brain 🧠',
    },
    'b_sb_callout': {
      id: 'b_sb_callout',
      type: 'callout',
      icon: '💡',
      backgroundColor: 'purple',
      content: 'Capture, organize, and distill your knowledge using the PARA method (Projects, Areas, Resources, Archives).',
    },
    'b_sb_h2_projects': {
      id: 'b_sb_h2_projects',
      type: 'heading_2',
      content: 'Active Projects',
    },
    'b_sb_todo1': {
      id: 'b_sb_todo1',
      type: 'to_do',
      content: 'Launch Faultline Evals Benchmark suite',
      checked: true,
    },
    'b_sb_todo2': {
      id: 'b_sb_todo2',
      type: 'to_do',
      content: 'Publish 100 YouTube Thumbnail case study',
      checked: false,
    },
  };

  const databases: Record<string, NotionDatabase> = {
    'db_ramp_tasks': {
      id: 'db_ramp_tasks',
      title: 'Company Tasks',
      description: 'Sprint board and cross-functional task tracking',
      properties: [
        { id: 'prop_title', name: 'Task', type: 'title' },
        { id: 'prop_assignee', name: 'Assignee', type: 'person' },
        {
          id: 'prop_status',
          name: 'Status',
          type: 'status',
          options: [
            { id: 'opt_backlog', name: 'Backlog', color: 'gray' },
            { id: 'opt_prog', name: 'In progress', color: 'yellow' },
            { id: 'opt_rev', name: 'In review', color: 'blue' },
            { id: 'opt_done', name: 'Complete', color: 'green' },
          ],
        },
        { id: 'prop_due', name: 'Due Date', type: 'date' },
      ],
      views: [
        {
          id: 'v_board',
          name: 'Company tasks',
          type: 'board',
          groupByPropertyId: 'prop_status',
          visiblePropertyIds: ['prop_title', 'prop_assignee'],
          sorts: [],
          filters: [],
        },
        {
          id: 'v_table',
          name: 'My tasks',
          type: 'table',
          visiblePropertyIds: ['prop_title', 'prop_status', 'prop_assignee', 'prop_due'],
          sorts: [],
          filters: [],
        },
        {
          id: 'v_sprint',
          name: 'Current sprint',
          type: 'board',
          groupByPropertyId: 'prop_status',
          visiblePropertyIds: ['prop_title', 'prop_assignee'],
          sorts: [],
          filters: [],
        },
        {
          id: 'v_timeline',
          name: 'Timeline',
          type: 'calendar',
          visiblePropertyIds: ['prop_title', 'prop_status'],
          sorts: [],
          filters: [],
        },
      ],
      currentViewId: 'v_board',
      rows: [
        // Backlog
        { id: 'r1', pageId: 'p1', properties: { prop_title: 'Review performance metrics', prop_status: 'Backlog' } },
        { id: 'r2', pageId: 'p2', properties: { prop_title: 'Respond to beta test questions', prop_status: 'Backlog' } },
        { id: 'r3', pageId: 'p3', properties: { prop_title: 'Plan upcoming sprint goals', prop_status: 'Backlog' } },
        { id: 'r4', pageId: 'p4', properties: { prop_title: 'Update help center and office documentation', prop_status: 'Backlog' } },
        { id: 'r5', pageId: 'p5', properties: { prop_title: 'Review campaign assets', prop_status: 'Backlog' } },
        { id: 'r6', pageId: 'p6', properties: { prop_title: 'Customer stories', prop_status: 'Backlog' } },
        { id: 'r7', pageId: 'p7', properties: { prop_title: 'Refresh product color palette', prop_status: 'Backlog' } },

        // In progress
        { id: 'r8', pageId: 'p8', properties: { prop_title: 'Sales demo sync', prop_status: 'In progress', prop_assignee: 'user_alex' } },
        { id: 'r9', pageId: 'p9', properties: { prop_title: 'Launch demo video', prop_status: 'In progress', prop_assignee: 'user_samir' } },
        { id: 'r10', pageId: 'p10', properties: { prop_title: 'Headcount planning', prop_status: 'In progress', prop_assignee: 'user_elena' } },
        { id: 'r11', pageId: 'p11', properties: { prop_title: 'Engineering sync', prop_status: 'In progress', prop_assignee: 'user_marcus' } },

        // In review
        { id: 'r12', pageId: 'p12', properties: { prop_title: 'Weekly sales status report', prop_status: 'In review', prop_assignee: 'user_samir' } },
        { id: 'r13', pageId: 'p13', properties: { prop_title: 'Marketing campaign designs', prop_status: 'In review', prop_assignee: 'user_elena' } },
        { id: 'r14', pageId: 'p14', properties: { prop_title: 'Latest features customer emails', prop_status: 'In review', prop_assignee: 'user_alex' } },
        { id: 'r15', pageId: 'p15', properties: { prop_title: 'New features documentation', prop_status: 'In review', prop_assignee: 'user_marcus' } },

        // Complete
        { id: 'r16', pageId: 'p16', properties: { prop_title: 'Project onboarding', prop_status: 'Complete' } },
        { id: 'r17', pageId: 'p17', properties: { prop_title: 'Finalize launch timeline', prop_status: 'Complete' } },
        { id: 'r18', pageId: 'p18', properties: { prop_title: 'All hands alignment', prop_status: 'Complete' } },
        { id: 'r19', pageId: 'p19', properties: { prop_title: 'Draft press release', prop_status: 'Complete' } },
        { id: 'r20', pageId: 'p20', properties: { prop_title: 'Report daily performance summaries', prop_status: 'Complete' } },
        { id: 'r21', pageId: 'p21', properties: { prop_title: 'Product launch weekly report', prop_status: 'Complete' } },
        { id: 'r22', pageId: 'p22', properties: { prop_title: 'Project kickoff', prop_status: 'Complete' } },
        { id: 'r23', pageId: 'p23', properties: { prop_title: 'Marketing team status report', prop_status: 'Complete' } },
        { id: 'r24', pageId: 'p24', properties: { prop_title: 'Financial planning', prop_status: 'Complete' } },
        { id: 'r25', pageId: 'p25', properties: { prop_title: 'Pixelation of hero image', prop_status: 'Complete' } },
      ],
    },
  };

  const pages: Record<string, NotionPage> = {
    'page_v9': {
      id: 'page_v9',
      title: 'v9-platform',
      icon: '🛡️',
      parentId: null,
      isFavorite: true,
      createdAt: '2026-10-17T14:00:00.000Z',
      updatedAt: '2026-10-18T16:00:00.000Z',
      blockIds: [
        'b_v9_callout',
        'b_v9_intro',
        'b_v9_h2_ceo',
        'b_v9_ceo_1',
        'b_v9_ceo_2',
        'b_v9_ceo_3',
        'b_v9_h2_home',
        'b_v9_home_1',
        'b_v9_toggle_sample',
      ],
    },
    'page_ramp': {
      id: 'page_ramp',
      title: 'Ramp HQ',
      icon: '⚡',
      cover: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&auto=format&fit=crop&q=80',
      coverPosition: 50,
      parentId: null,
      isFavorite: true,
      createdAt: '2026-10-18T10:00:00.000Z',
      updatedAt: '2026-10-18T12:00:00.000Z',
      blockIds: ['b_ramp_callout', 'b_ramp_db'],
    },
    'page_second_brain': {
      id: 'page_second_brain',
      title: 'Second Brain',
      icon: '🧠',
      parentId: null,
      isFavorite: true,
      createdAt: '2026-10-18T09:00:00.000Z',
      updatedAt: '2026-10-18T09:30:00.000Z',
      blockIds: ['b_sb_h1', 'b_sb_callout', 'b_sb_h2_projects', 'b_sb_todo1', 'b_sb_todo2'],
    },
    'page_bahava': {
      id: 'page_bahava',
      title: 'Bahava',
      icon: '📌',
      parentId: null,
      isFavorite: true,
      createdAt: '2026-10-18T08:00:00.000Z',
      updatedAt: '2026-10-18T08:30:00.000Z',
      blockIds: [],
    },
    'page_system': {
      id: 'page_system',
      title: 'System',
      icon: '⚙️',
      parentId: null,
      isFavorite: false,
      createdAt: '2026-10-18T07:00:00.000Z',
      updatedAt: '2026-10-18T07:30:00.000Z',
      blockIds: [],
    },
    'page_youtube': {
      id: 'page_youtube',
      title: '100 YouTube Thumbnail Exam...',
      icon: '🎬',
      parentId: null,
      isFavorite: false,
      createdAt: '2026-10-18T06:00:00.000Z',
      updatedAt: '2026-10-18T06:30:00.000Z',
      blockIds: [],
    },
    'page_comm': {
      id: 'page_comm',
      title: 'Communication Center',
      icon: '💬',
      parentId: null,
      isFavorite: false,
      createdAt: '2026-10-18T05:00:00.000Z',
      updatedAt: '2026-10-18T05:30:00.000Z',
      blockIds: [],
    },
  };

  // Populate backing pages & blocks for all Ramp Tasks rows
  const rampRows = databases['db_ramp_tasks'].rows;
  rampRows.forEach((row) => {
    const pageId = row.pageId;
    const bCallout = `b_${pageId}_callout`;
    const bTodo1 = `b_${pageId}_todo1`;
    const bTodo2 = `b_${pageId}_todo2`;
    const bNotes = `b_${pageId}_notes`;

    blocks[bCallout] = {
      id: bCallout,
      type: 'callout',
      icon: '📌',
      backgroundColor: 'blue',
      content: `Sprint Task: ${row.properties.prop_title} | Status: ${row.properties.prop_status || 'Backlog'}`,
    };
    blocks[bTodo1] = {
      id: bTodo1,
      type: 'to_do',
      content: 'Define acceptance criteria and key dependencies',
      checked: row.properties.prop_status === 'Complete',
    };
    blocks[bTodo2] = {
      id: bTodo2,
      type: 'to_do',
      content: 'Verify implementation and coordinate with cross-functional team',
      checked: row.properties.prop_status === 'Complete',
    };
    blocks[bNotes] = {
      id: bNotes,
      type: 'paragraph',
      content: 'Documentation and delivery notes for this task. Use / commands to add tables, code snippets, or nested to-do checklists.',
    };

    pages[pageId] = {
      id: pageId,
      title: row.properties.prop_title,
      icon: '📋',
      parentId: 'page_ramp',
      createdAt: '2026-10-18T10:00:00.000Z',
      updatedAt: '2026-10-18T12:00:00.000Z',
      blockIds: [bCallout, bTodo1, bTodo2, bNotes],
    };
  });

  return {
    id: 'ws_default',
    name: "samir sawarkar's Notion",
    icon: '⚡',
    users: INITIAL_USERS,
    activeUserId: 'user_samir',
    pages,
    blocks,
    databases,
    rootPageIds: [
      'page_v9',
      'page_ramp',
      'page_second_brain',
      'page_bahava',
      'page_system',
      'page_youtube',
      'page_comm',
    ],
    trashPageIds: [],
    favoritePageIds: ['page_v9', 'page_second_brain', 'page_bahava'],
    activePageId: 'page_v9',
  };
})();
