import React, { useEffect, useCallback, useState } from 'react';
import { useNotion } from './store/useNotionStore';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { PageHeader } from './components/editor/PageHeader';
import { BlockList } from './components/editor/BlockList';
import { DatabaseView } from './components/database/DatabaseView';
import { FormattingBar } from './components/editor/FormattingBar';
import { SearchModal } from './components/layout/SearchModal';
import { SettingsModal } from './components/layout/SettingsModal';
import { TrashModal } from './components/layout/TrashModal';
import { TemplatesModal } from './components/layout/TemplatesModal';
import { RowPeekModal } from './components/database/RowPeekModal';
import { NotionAiPrompt } from './components/editor/NotionAiPrompt';

export default function App() {
  const {
    workspace,
    activePage,
    activeUser,
    users,
    theme,
    isSidebarCollapsed,
    isSearchOpen,
    isSettingsOpen,
    isTrashOpen,
    isTemplatesOpen,
    setTheme,
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
  } = useNotion();

  // Peak Modal State for clicking any card/row in a database
  const [peekPageId, setPeekPageId] = useState<string | null>(null);
  const [peekDatabaseId, setPeekDatabaseId] = useState<string | null>(null);

  // Notion AI Assistant Modal State
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Keyboard shortcut listener for Ctrl+K (Search) & Ctrl+J (Notion AI)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsAiOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);

  // Database renderer helper for embedding database views into any block or page
  const renderDatabase = useCallback(
    (databaseId: string) => {
      const db = workspace.databases[databaseId];
      if (!db) {
        return (
          <div className="p-4 rounded-lg border border-[var(--notion-border)] text-xs text-[var(--notion-text-muted)] bg-[var(--notion-hover)]">
            Database "{databaseId}" not found.
          </div>
        );
      }

      return (
        <DatabaseView
          database={db}
          users={users}
          onUpdateRow={updateDatabaseRow}
          onAddRow={addRowToDatabase}
          onDeleteRow={deleteDatabaseRow}
          onAddProperty={addDatabaseProperty}
          onSetView={setDatabaseView}
          onAddView={addDatabaseView}
          onOpenRowPage={(pageId: string) => {
            setPeekPageId(pageId);
            setPeekDatabaseId(databaseId);
          }}
        />
      );
    },
    [
      workspace.databases,
      users,
      updateDatabaseRow,
      addRowToDatabase,
      deleteDatabaseRow,
      addDatabaseProperty,
      setDatabaseView,
      addDatabaseView,
    ]
  );

  if (!activePage) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--notion-bg)] text-[var(--notion-text)]">
        <div className="text-center space-y-3">
          <div className="text-4xl">📄</div>
          <h2 className="text-lg font-semibold">No Page Selected</h2>
          <p className="text-xs text-[var(--notion-text-muted)]">
            Select a page from the sidebar or create a new one to get started.
          </p>
          <button
            onClick={() => createPage(null, 'Untitled', '📄')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            Create New Page
          </button>
        </div>
      </div>
    );
  }

  const fontClass =
    activePage.fontFamily === 'serif'
      ? 'font-serif'
      : activePage.fontFamily === 'mono'
      ? 'font-mono'
      : 'font-sans';

  const widthClass = activePage.isFullWidth ? 'max-w-full px-8' : 'max-w-4xl mx-auto';
  const textScaleClass = activePage.isSmallText ? 'text-xs' : 'text-sm';

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-[var(--notion-bg)] ${fontClass}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        workspace={workspace}
        activePageId={activePage.id}
        users={users}
        activeUserId={activeUser.id}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
        onSelectPage={setActivePage}
        onCreatePage={createPage}
        onArchivePage={archivePage}
        onToggleFavorite={toggleFavorite}
        onSetActiveUser={setActiveUser}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenTemplates={() => setTemplatesOpen(true)}
        onImportMarkdown={importMarkdownPage}
        onOpenTrash={() => setTrashOpen(true)}
      />

      {/* Main Page Workspace */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Topbar
          page={activePage}
          workspace={workspace}
          onSelectPage={setActivePage}
          onUpdatePage={(partial) => updatePage(activePage.id, partial)}
          onToggleFavorite={() => toggleFavorite(activePage.id)}
          onArchivePage={() => archivePage(activePage.id)}
          onExportJSON={exportJSON}
          onOpenAi={() => setIsAiOpen(true)}
        />

        <div className={`flex-1 w-full ${widthClass} ${textScaleClass} transition-all duration-150`}>
          {/* Page Header (Cover, Icon, Title) */}
          <PageHeader
            page={activePage}
            onUpdate={(partial) => updatePage(activePage.id, partial)}
            onEnterTitle={() => {
              if (activePage.blockIds.length > 0) {
                // Focus will transfer naturally
              } else {
                addBlock(activePage.id, 'paragraph');
              }
            }}
          />

          {/* Full Page Database Check (if this page is a dedicated database) */}
          {activePage.databaseId ? (
            <div className="px-12 pb-24">
              {renderDatabase(activePage.databaseId)}
            </div>
          ) : (
            /* Block List Editor */
            <BlockList
              pageId={activePage.id}
              blockIds={activePage.blockIds}
              blocks={workspace.blocks}
              onUpdateBlock={updateBlock}
              onDeleteBlock={deleteBlock}
              onDuplicateBlock={duplicateBlock}
              onConvertType={convertBlockType}
              onAddBlock={addBlock}
              onMoveBlock={moveBlock}
              renderDatabase={renderDatabase}
            />
          )}
        </div>
      </main>

      {/* Floating Selection Toolbar */}
      <FormattingBar onApplyFormat={() => {}} />

      {/* Modals */}
      <SearchModal
        workspace={workspace}
        isOpen={isSearchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectPage={setActivePage}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        theme={theme}
        users={users}
        activeUserId={activeUser.id}
        onClose={() => setSettingsOpen(false)}
        onSetTheme={setTheme}
        onAddUser={addUser}
        onUpdateUser={updateUser}
        onRemoveUser={removeUser}
        onSetActiveUser={setActiveUser}
        onExportJSON={exportJSON}
        onImportJSON={importJSON}
        onResetDefault={resetToDefault}
      />

      <TrashModal
        workspace={workspace}
        isOpen={isTrashOpen}
        onClose={() => setTrashOpen(false)}
        onRestorePage={restorePage}
        onDeletePermanently={deletePagePermanently}
      />

      {/* Real Notion Template Gallery Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setTemplatesOpen(false)}
        onApplyTemplate={applyTemplate}
      />

      {/* Database Item Peek Modal (Center Peek / Side Peek) */}
      <RowPeekModal
        isOpen={Boolean(peekPageId)}
        pageId={peekPageId}
        databaseId={peekDatabaseId}
        workspace={workspace}
        users={users}
        activeUser={activeUser}
        onClose={() => {
          setPeekPageId(null);
          setPeekDatabaseId(null);
        }}
        onOpenFullPage={(pId) => {
          setPeekPageId(null);
          setPeekDatabaseId(null);
          setActivePage(pId);
        }}
        onUpdatePage={updatePage}
        onUpdateRow={updateDatabaseRow}
        onAddProperty={addDatabaseProperty}
        onUpdateBlock={updateBlock}
        onDeleteBlock={deleteBlock}
        onDuplicateBlock={duplicateBlock}
        onConvertType={convertBlockType}
        onAddBlock={addBlock}
        onMoveBlock={moveBlock}
      />

      {/* Notion AI Assistant Modal */}
      <NotionAiPrompt
        isOpen={isAiOpen}
        selectedText=""
        contextText={activePage.title}
        onClose={() => setIsAiOpen(false)}
        onInsertResult={(content) => {
          addBlock(activePage.id, 'paragraph');
          // Add the AI generated content as a block
          const lastBlockId = activePage.blockIds[activePage.blockIds.length - 1];
          if (lastBlockId) {
            updateBlock(lastBlockId, { content });
          }
        }}
      />
    </div>
  );
}
