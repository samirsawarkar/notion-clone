import { useState, useEffect, useCallback } from 'react';
import {
  Block,
  BlockType,
  DatabaseProperty,
  DatabaseRow,
  DatabaseViewConfig,
  DatabaseViewType,
  NotionColor,
  NotionDatabase,
  NotionPage,
  NotionUser,
  NotionWorkspace,
  PropertyType,
  UserRole,
} from '../types/notion';
import { INITIAL_USERS, INITIAL_WORKSPACE } from './defaultData';
import { generateId } from '../utils/id';
import { TemplateDefinition } from '../components/layout/TemplatesModal';
import { parseNotionMarkdown } from '../utils/markdownImporter';

const STORAGE_KEY = 'notoin_workspace_data_v1';
const THEME_KEY = 'notoin_theme_v1';

function getStoredWorkspace(): NotionWorkspace {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.pages && parsed.blocks) {
        if (!parsed.users || !Array.isArray(parsed.users) || parsed.users.length === 0) {
          parsed.users = INITIAL_USERS;
          parsed.activeUserId = 'user_samir';
        }
        // Merge in any missing default pages or blocks (such as Ramp task pages p1..p25)
        for (const [pId, pData] of Object.entries(INITIAL_WORKSPACE.pages)) {
          if (!parsed.pages[pId]) {
            parsed.pages[pId] = pData;
          }
        }
        for (const [bId, bData] of Object.entries(INITIAL_WORKSPACE.blocks)) {
          if (!parsed.blocks[bId]) {
            parsed.blocks[bId] = bData;
          }
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load workspace from localStorage:', err);
  }
  return INITIAL_WORKSPACE;
}

export function useNotion() {
  const [workspace, setWorkspace] = useState<NotionWorkspace>(getStoredWorkspace);
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isTrashOpen, setTrashOpen] = useState(false);
  const [isTemplatesOpen, setTemplatesOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    } catch (e) {
      console.warn('Storage quota exceeded or error saving workspace:', e);
    }
  }, [workspace]);

  // Apply theme class to documentElement
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // User Management Operations
  const addUser = useCallback(
    (name: string, email: string, role: UserRole = 'Member', avatar: string = '👤') => {
      const newUserId = generateId('user');
      const newUser: NotionUser = {
        id: newUserId,
        name,
        email,
        role,
        avatar,
        color: 'blue',
      };

      setWorkspace((prev) => ({
        ...prev,
        users: [...(prev.users || []), newUser],
      }));

      return newUserId;
    },
    []
  );

  const updateUser = useCallback((userId: string, partial: Partial<NotionUser>) => {
    setWorkspace((prev) => ({
      ...prev,
      users: (prev.users || []).map((u) => (u.id === userId ? { ...u, ...partial } : u)),
    }));
  }, []);

  const removeUser = useCallback((userId: string) => {
    setWorkspace((prev) => {
      const nextUsers = (prev.users || []).filter((u) => u.id !== userId);
      const nextActiveId =
        prev.activeUserId === userId ? nextUsers[0]?.id || '' : prev.activeUserId;
      return {
        ...prev,
        users: nextUsers,
        activeUserId: nextActiveId,
      };
    });
  }, []);

  const setActiveUser = useCallback((userId: string) => {
    setWorkspace((prev) => ({
      ...prev,
      activeUserId: userId,
    }));
  }, []);

  const setActivePage = useCallback((pageId: string) => {
    setWorkspace((prev) => {
      if (!prev.pages[pageId]) return prev;
      return { ...prev, activePageId: pageId };
    });
  }, []);

  const updatePage = useCallback((pageId: string, partial: Partial<NotionPage>) => {
    setWorkspace((prev) => {
      const page = prev.pages[pageId];
      if (!page) return prev;
      return {
        ...prev,
        pages: {
          ...prev.pages,
          [pageId]: {
            ...page,
            ...partial,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const createPage = useCallback(
    (parentId: string | null = null, title: string = 'Untitled', icon: string = '📄') => {
      const newPageId = generateId('page');
      const firstBlockId = generateId('blk');

      const newBlock: Block = {
        id: firstBlockId,
        type: 'paragraph',
        content: '',
      };

      const newPage: NotionPage = {
        id: newPageId,
        title,
        icon,
        parentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        blockIds: [firstBlockId],
      };

      setWorkspace((prev) => {
        const nextRootIds = parentId ? prev.rootPageIds : [...prev.rootPageIds, newPageId];
        return {
          ...prev,
          pages: { ...prev.pages, [newPageId]: newPage },
          blocks: { ...prev.blocks, [firstBlockId]: newBlock },
          rootPageIds: nextRootIds,
          activePageId: newPageId,
        };
      });

      return newPageId;
    },
    []
  );

  const archivePage = useCallback((pageId: string) => {
    setWorkspace((prev) => {
      const page = prev.pages[pageId];
      if (!page) return prev;

      const nextRootIds = prev.rootPageIds.filter((id) => id !== pageId);
      const nextFavorites = prev.favoritePageIds.filter((id) => id !== pageId);
      const nextTrash = Array.from(new Set([...prev.trashPageIds, pageId]));

      let nextActiveId = prev.activePageId;
      if (nextActiveId === pageId) {
        nextActiveId = nextRootIds[0] || '';
      }

      return {
        ...prev,
        rootPageIds: nextRootIds,
        favoritePageIds: nextFavorites,
        trashPageIds: nextTrash,
        activePageId: nextActiveId,
        pages: {
          ...prev.pages,
          [pageId]: { ...page, isArchived: true },
        },
      };
    });
  }, []);

  const restorePage = useCallback((pageId: string) => {
    setWorkspace((prev) => {
      const page = prev.pages[pageId];
      if (!page) return prev;

      const nextTrash = prev.trashPageIds.filter((id) => id !== pageId);
      const nextRoot = page.parentId ? prev.rootPageIds : [...prev.rootPageIds, pageId];

      return {
        ...prev,
        trashPageIds: nextTrash,
        rootPageIds: nextRoot,
        pages: {
          ...prev.pages,
          [pageId]: { ...page, isArchived: false },
        },
        activePageId: pageId,
      };
    });
  }, []);

  const deletePagePermanently = useCallback((pageId: string) => {
    setWorkspace((prev) => {
      const page = prev.pages[pageId];
      if (!page) return prev;

      const newPages = { ...prev.pages };
      delete newPages[pageId];

      const newBlocks = { ...prev.blocks };
      page.blockIds.forEach((bId) => {
        delete newBlocks[bId];
      });

      return {
        ...prev,
        pages: newPages,
        blocks: newBlocks,
        trashPageIds: prev.trashPageIds.filter((id) => id !== pageId),
      };
    });
  }, []);

  const toggleFavorite = useCallback((pageId: string) => {
    setWorkspace((prev) => {
      const isFav = prev.favoritePageIds.includes(pageId);
      const nextFavs = isFav
        ? prev.favoritePageIds.filter((id) => id !== pageId)
        : [...prev.favoritePageIds, pageId];

      return {
        ...prev,
        favoritePageIds: nextFavs,
        pages: {
          ...prev.pages,
          [pageId]: {
            ...prev.pages[pageId],
            isFavorite: !isFav,
          },
        },
      };
    });
  }, []);

  // Block Operations
  const addBlock = useCallback(
    (
      pageId: string,
      type: BlockType = 'paragraph',
      afterBlockId?: string,
      initialContent: string = ''
    ) => {
      const newBlockId = generateId('blk');
      const newBlock: Block = {
        id: newBlockId,
        type,
        content: initialContent,
        checked: type === 'to_do' ? false : undefined,
        isOpen: type === 'toggle' ? true : undefined,
        childrenIds: type === 'toggle' ? [] : undefined,
      };

      if (type === 'table') {
        newBlock.tableData = [
          ['Column 1', 'Column 2', 'Column 3'],
          ['', '', ''],
          ['', '', ''],
        ];
        newBlock.hasHeaderRow = true;
      } else if (type === 'code') {
        newBlock.language = 'typescript';
      } else if (type === 'callout') {
        newBlock.icon = '💡';
        newBlock.backgroundColor = 'yellow';
      }

      setWorkspace((prev) => {
        const page = prev.pages[pageId];
        if (!page) return prev;

        const blockIds = [...page.blockIds];
        if (afterBlockId) {
          const index = blockIds.indexOf(afterBlockId);
          if (index !== -1) {
            blockIds.splice(index + 1, 0, newBlockId);
          } else {
            blockIds.push(newBlockId);
          }
        } else {
          blockIds.push(newBlockId);
        }

        return {
          ...prev,
          blocks: {
            ...prev.blocks,
            [newBlockId]: newBlock,
          },
          pages: {
            ...prev.pages,
            [pageId]: {
              ...page,
              blockIds,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });

      return newBlockId;
    },
    []
  );

  const updateBlock = useCallback((blockId: string, partial: Partial<Block>) => {
    setWorkspace((prev) => {
      const current = prev.blocks[blockId];
      if (!current) return prev;
      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          [blockId]: {
            ...current,
            ...partial,
          },
        },
      };
    });
  }, []);

  const deleteBlock = useCallback((pageId: string, blockId: string) => {
    setWorkspace((prev) => {
      const page = prev.pages[pageId];
      if (!page) return prev;

      let newBlockIds = page.blockIds.filter((id) => id !== blockId);
      const newBlocks = { ...prev.blocks };
      delete newBlocks[blockId];

      if (newBlockIds.length === 0) {
        const fallbackId = generateId('blk');
        newBlocks[fallbackId] = { id: fallbackId, type: 'paragraph', content: '' };
        newBlockIds = [fallbackId];
      }

      return {
        ...prev,
        blocks: newBlocks,
        pages: {
          ...prev.pages,
          [pageId]: {
            ...page,
            blockIds: newBlockIds,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const moveBlock = useCallback((pageId: string, fromIndex: number, toIndex: number) => {
    setWorkspace((prev) => {
      const page = prev.pages[pageId];
      if (!page) return prev;

      const newBlockIds = [...page.blockIds];
      const [removed] = newBlockIds.splice(fromIndex, 1);
      newBlockIds.splice(toIndex, 0, removed);

      return {
        ...prev,
        pages: {
          ...prev.pages,
          [pageId]: {
            ...page,
            blockIds: newBlockIds,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const duplicateBlock = useCallback((pageId: string, blockId: string) => {
    setWorkspace((prev) => {
      const page = prev.pages[pageId];
      const source = prev.blocks[blockId];
      if (!page || !source) return prev;

      const newId = generateId('blk');
      const clonedBlock: Block = {
        ...source,
        id: newId,
        content: source.content,
      };

      const blockIds = [...page.blockIds];
      const idx = blockIds.indexOf(blockId);
      blockIds.splice(idx + 1, 0, newId);

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          [newId]: clonedBlock,
        },
        pages: {
          ...prev.pages,
          [pageId]: {
            ...page,
            blockIds,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const convertBlockType = useCallback((blockId: string, newType: BlockType) => {
    setWorkspace((prev) => {
      const block = prev.blocks[blockId];
      if (!block) return prev;

      const updated: Block = {
        ...block,
        type: newType,
        checked: newType === 'to_do' ? false : undefined,
        isOpen: newType === 'toggle' ? true : undefined,
        childrenIds: newType === 'toggle' ? (block.childrenIds || []) : undefined,
      };

      if (newType === 'table' && !block.tableData) {
        updated.tableData = [
          ['Header 1', 'Header 2', 'Header 3'],
          ['Data 1', 'Data 2', 'Data 3'],
        ];
        updated.hasHeaderRow = true;
      }
      if (newType === 'code' && !block.language) {
        updated.language = 'typescript';
      }
      if (newType === 'callout') {
        updated.icon = updated.icon || '💡';
        updated.backgroundColor = updated.backgroundColor || 'yellow';
      }

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          [blockId]: updated,
        },
      };
    });
  }, []);

  // Database operations
  const addRowToDatabase = useCallback(
    (databaseId: string, initialProps: Record<string, any> = {}) => {
      const newRowId = generateId('row');
      const newPageId = generateId('page_row');

      setWorkspace((prev) => {
        const db = prev.databases[databaseId];
        if (!db) return prev;

        const newRow: DatabaseRow = {
          id: newRowId,
          pageId: newPageId,
          properties: {
            prop_title: initialProps.prop_title || 'New Item',
            ...initialProps,
          },
        };

        const newPage: NotionPage = {
          id: newPageId,
          title: newRow.properties.prop_title,
          icon: '📄',
          parentId: prev.activePageId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          blockIds: [],
        };

        return {
          ...prev,
          pages: { ...prev.pages, [newPageId]: newPage },
          databases: {
            ...prev.databases,
            [databaseId]: {
              ...db,
              rows: [...db.rows, newRow],
            },
          },
        };
      });
      return newRowId;
    },
    []
  );

  const updateDatabaseRow = useCallback(
    (databaseId: string, rowId: string, propertyId: string, value: any) => {
      setWorkspace((prev) => {
        const db = prev.databases[databaseId];
        if (!db) return prev;

        const updatedRows = db.rows.map((row) => {
          if (row.id !== rowId) return row;
          const nextProps = { ...row.properties, [propertyId]: value };
          if (propertyId === 'prop_title' && prev.pages[row.pageId]) {
            prev.pages[row.pageId].title = value || 'Untitled';
          }
          return {
            ...row,
            properties: nextProps,
          };
        });

        return {
          ...prev,
          databases: {
            ...prev.databases,
            [databaseId]: {
              ...db,
              rows: updatedRows,
            },
          },
        };
      });
    },
    []
  );

  const deleteDatabaseRow = useCallback((databaseId: string, rowId: string) => {
    setWorkspace((prev) => {
      const db = prev.databases[databaseId];
      if (!db) return prev;

      const targetRow = db.rows.find((r) => r.id === rowId);
      const newRows = db.rows.filter((r) => r.id !== rowId);

      const nextPages = { ...prev.pages };
      if (targetRow && nextPages[targetRow.pageId]) {
        delete nextPages[targetRow.pageId];
      }

      return {
        ...prev,
        pages: nextPages,
        databases: {
          ...prev.databases,
          [databaseId]: {
            ...db,
            rows: newRows,
          },
        },
      };
    });
  }, []);

  const addDatabaseProperty = useCallback(
    (databaseId: string, name: string, type: PropertyType) => {
      const propId = generateId('prop');
      setWorkspace((prev) => {
        const db = prev.databases[databaseId];
        if (!db) return prev;

        const newProp: DatabaseProperty = {
          id: propId,
          name,
          type,
          options:
            type === 'select' || type === 'multi_select' || type === 'status'
              ? [
                  { id: generateId('opt'), name: 'Option 1', color: 'blue' },
                  { id: generateId('opt'), name: 'Option 2', color: 'green' },
                ]
              : undefined,
        };

        const updatedViews = db.views.map((v) => ({
          ...v,
          visiblePropertyIds: [...v.visiblePropertyIds, propId],
        }));

        return {
          ...prev,
          databases: {
            ...prev.databases,
            [databaseId]: {
              ...db,
              properties: [...db.properties, newProp],
              views: updatedViews,
            },
          },
        };
      });
    },
    []
  );

  const setDatabaseView = useCallback((databaseId: string, viewId: string) => {
    setWorkspace((prev) => {
      const db = prev.databases[databaseId];
      if (!db) return prev;
      return {
        ...prev,
        databases: {
          ...prev.databases,
          [databaseId]: {
            ...db,
            currentViewId: viewId,
          },
        },
      };
    });
  }, []);

  const addDatabaseView = useCallback((databaseId: string, name: string, type: DatabaseViewType) => {
    const viewId = generateId('view');
    setWorkspace((prev) => {
      const db = prev.databases[databaseId];
      if (!db) return prev;

      const newView: DatabaseViewConfig = {
        id: viewId,
        name,
        type,
        visiblePropertyIds: db.properties.map((p) => p.id),
        sorts: [],
        filters: [],
        groupByPropertyId: type === 'board' ? 'prop_status' : undefined,
      };

      return {
        ...prev,
        databases: {
          ...prev.databases,
          [databaseId]: {
            ...db,
            views: [...db.views, newView],
            currentViewId: viewId,
          },
        },
      };
    });
  }, []);

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setWorkspace(INITIAL_WORKSPACE);
  }, []);

  const exportJSON = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(workspace, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `notion_workspace_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [workspace]);

  const importJSON = useCallback((jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.pages && parsed.blocks) {
        if (!parsed.users || !Array.isArray(parsed.users) || parsed.users.length === 0) {
          parsed.users = INITIAL_USERS;
          parsed.activeUserId = 'user_samir';
        }
        setWorkspace(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON import file:', e);
    }
    return false;
  }, []);

  const applyTemplate = useCallback((template: TemplateDefinition) => {
    const data = template.createData();
    const newPageId = generateId('page_tmpl');

    const newBlocks: Record<string, Block> = {};
    const blockIds: string[] = [];

    data.blocks.forEach((b) => {
      newBlocks[b.id] = b;
      blockIds.push(b.id);
    });

    const newPage: NotionPage = {
      id: newPageId,
      title: data.pageTitle,
      icon: data.icon,
      cover: data.cover,
      parentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blockIds,
    };

    setWorkspace((prev) => {
      const nextDatabases = { ...prev.databases };
      if (data.database) {
        nextDatabases[data.database.id] = data.database;
      }

      return {
        ...prev,
        pages: { ...prev.pages, [newPageId]: newPage },
        blocks: { ...prev.blocks, ...newBlocks },
        databases: nextDatabases,
        rootPageIds: [...prev.rootPageIds, newPageId],
        activePageId: newPageId,
      };
    });

    return newPageId;
  }, []);

  const importMarkdownPage = useCallback((markdownText: string) => {
    const { title, blocks } = parseNotionMarkdown(markdownText);
    const newPageId = generateId('page_md');

    const newBlocks: Record<string, Block> = {};
    const blockIds: string[] = [];

    blocks.forEach((b) => {
      newBlocks[b.id] = b;
      blockIds.push(b.id);
    });

    const newPage: NotionPage = {
      id: newPageId,
      title,
      icon: '📝',
      parentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blockIds,
    };

    setWorkspace((prev) => ({
      ...prev,
      pages: { ...prev.pages, [newPageId]: newPage },
      blocks: { ...prev.blocks, ...newBlocks },
      rootPageIds: [...prev.rootPageIds, newPageId],
      activePageId: newPageId,
    }));

    return newPageId;
  }, []);

  const activeUser =
    workspace.users?.find((u) => u.id === workspace.activeUserId) ||
    workspace.users?.[0] ||
    INITIAL_USERS[0];

  return {
    workspace,
    activePage: workspace.pages[workspace.activePageId] || workspace.pages[workspace.rootPageIds[0]],
    activeUser,
    users: workspace.users || INITIAL_USERS,
    theme,
    isSidebarCollapsed,
    isSearchOpen,
    isSettingsOpen,
    isTrashOpen,
    isTemplatesOpen,
    setTheme,
    toggleTheme,
    addUser,
    updateUser,
    removeUser,
    setActiveUser,
    setSidebarCollapsed,
    setSearchOpen,
    setSettingsOpen,
    setTrashOpen,
    setTemplatesOpen,
    applyTemplate,
    importMarkdownPage,
    setActivePage,
    updatePage,
    createPage,
    archivePage,
    restorePage,
    deletePagePermanently,
    toggleFavorite,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    duplicateBlock,
    convertBlockType,
    addRowToDatabase,
    updateDatabaseRow,
    deleteDatabaseRow,
    addDatabaseProperty,
    setDatabaseView,
    addDatabaseView,
    resetToDefault,
    exportJSON,
    importJSON,
  };
}
