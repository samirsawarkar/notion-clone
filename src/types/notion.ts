export type BlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'to_do'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'toggle'
  | 'quote'
  | 'callout'
  | 'divider'
  | 'code'
  | 'image'
  | 'table'
  | 'math'
  | 'bookmark'
  | 'database_view';

export type NotionColor =
  | 'default'
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean; // for to_do
  color?: NotionColor;
  backgroundColor?: NotionColor;
  language?: string; // for code block
  url?: string; // for image, bookmark
  caption?: string; // for image, code
  icon?: string; // for callout
  childrenIds?: string[]; // for toggle or nested blocks
  isOpen?: boolean; // for toggle block collapse/expand
  tableData?: string[][]; // for inline table block: rows of columns
  hasHeaderRow?: boolean;
  hasHeaderColumn?: boolean;
  databaseId?: string; // for database_view block
}

// User / Member Models
export type UserRole = 'Workspace Owner' | 'Admin' | 'Member' | 'Guest';

export interface NotionUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  color?: NotionColor;
}

// Database Property Types
export type PropertyType =
  | 'title'
  | 'text'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'status'
  | 'date'
  | 'person'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone'
  | 'created_time';

export interface SelectOption {
  id: string;
  name: string;
  color: NotionColor;
}

export interface DatabaseProperty {
  id: string;
  name: string;
  type: PropertyType;
  options?: SelectOption[];
  numberFormat?: 'number' | 'dollar' | 'euro' | 'percent';
}

export type DatabaseViewType = 'table' | 'board' | 'gallery' | 'list' | 'calendar';

export interface DatabaseSort {
  propertyId: string;
  direction: 'ascending' | 'descending';
}

export interface DatabaseFilter {
  propertyId: string;
  operator: 'equals' | 'does_not_equal' | 'contains' | 'does_not_contain' | 'is_checked' | 'is_not_checked';
  value: string;
}

export interface DatabaseViewConfig {
  id: string;
  name: string;
  type: DatabaseViewType;
  groupByPropertyId?: string; // for board view
  visiblePropertyIds: string[];
  sorts: DatabaseSort[];
  filters: DatabaseFilter[];
  cardSize?: 'small' | 'medium' | 'large'; // for gallery view
}

export interface DatabaseRow {
  id: string;
  pageId: string; // each row is also a full Notion page!
  properties: Record<string, any>; // propertyId -> value
}

export interface NotionDatabase {
  id: string;
  title: string;
  description?: string;
  properties: DatabaseProperty[];
  views: DatabaseViewConfig[];
  currentViewId: string;
  rows: DatabaseRow[];
}

export interface NotionPage {
  id: string;
  title: string;
  icon?: string; // emoji or icon name
  cover?: string; // URL or preset id
  coverPosition?: number; // 0 to 100 percentage
  parentId: string | null; // null for top-level root pages
  isFavorite?: boolean;
  isLocked?: boolean;
  isArchived?: boolean; // in Trash
  createdAt: string;
  updatedAt: string;
  blockIds: string[]; // sequence of block IDs
  databaseId?: string; // if this page is a full-page database
  fontFamily?: 'sans' | 'serif' | 'mono';
  isSmallText?: boolean;
  isFullWidth?: boolean;
}

export interface NotionWorkspace {
  id: string;
  name: string;
  icon: string;
  users: NotionUser[];
  activeUserId: string;
  pages: Record<string, NotionPage>;
  blocks: Record<string, Block>;
  databases: Record<string, NotionDatabase>;
  rootPageIds: string[];
  trashPageIds: string[];
  favoritePageIds: string[];
  activePageId: string;
}
