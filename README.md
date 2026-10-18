# Notion Clone (Notoin) ⚡

> **A complete, production-grade, 100% open-source Notion clone** built with React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, and KaTeX. Features an authentic hierarchical block-based editor, Notion AI assistant, multi-view database engine (Kanban Board, Table, Calendar, Gallery, List), Center/Side Peek modal views, team member management, and real Notion template importer.

[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Notion Clone Preview](https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&auto=format&fit=crop&q=80)

---

## 🌟 Key Features

### 1. 📝 Hierarchical Block-Based Editor
- **Full Block Architecture**: Every paragraph, heading, list item, or code block is an interactive block with drag handles, context menus, and nesting.
- **Left Gutter Handles**: Side-by-side `+` (add block below) and `⋮⋮` (drag handle & context menu) on hover.
- **Supported Block Types**:
  - `Text / Paragraph`: Plain text with inline formatting.
  - `Heading 1 (#)`, `Heading 2 (##)`, `Heading 3 (###)`: Auto-converting Markdown section headers.
  - `To-do list ([] or [ ])`: Interactive checkbox with completion line-through and celebratory confetti effect.
  - `Bulleted list (- or *)`: Clean circular bullet dots with sequential flow.
  - `Numbered list (1.)`: Auto-incrementing numerical order.
  - `Toggle block`: Collapsible accordion with nested children blocks.
  - `Quote (>)`: Left accent border with italic quotation typography.
  - `Callout`: Custom emoji icon with colored background tint (Yellow, Green, Blue, Purple, Red, Gray).
  - `Divider (---)`: Sleek horizontal separator.
  - `Code block`: Multi-language syntax switcher (TypeScript, Python, Rust, Go, SQL, HTML, etc.), line counts, and one-click copy.
  - `Simple Table`: Inline 2D grid with header row/column toggles and dynamic row/column management.
  - `Block Equation`: Standalone KaTeX mathematical formula rendering.
  - `Web Bookmark`: Visual link preview card with favicon, title, and external link trigger.
  - `Database View`: Embed any database inline directly inside any page.

### 2. ✨ Notion AI Assistant (<kbd>Ctrl</kbd> + <kbd>J</kbd> / <kbd>Cmd</kbd> + <kbd>J</kbd>)
- Integrated AI assistant for instant drafting, editing, and brainstorming:
  - 📝 **Summarize page**: Executive bullet-point synthesis.
  - 📋 **Extract action items**: Converts unstructured notes into `- [ ]` to-do checkboxes.
  - 🔍 **Fix spelling & grammar**: Cleans and refines prose.
  - 💡 **Brainstorm ideas**: Generates strategic angles and concepts.
  - 🌐 **Translate**: Multilingual translation.
  - ✍️ **Custom prompt**: Generate content from any text brief with one-click **Insert below**, **Try again**, or **Discard**.

### 3. 📊 Multi-View Notion Database Engine
- **Property Types**: Title, Status, Person / Assignee, Select, Multi-Select, Date, Number, Checkbox, URL link.
- **Multiple Layout Views**:
  - **Board / Kanban View**: Drag-and-drop cards between Status or Select columns with avatars, priority badges, and `+ New page` buttons.
  - **Table View**: Spreadsheet layout with property icons, cell editors, count calculations, and "+ Add property" modal.
  - **Gallery View**: Visual cards with preview thumbnails and property tags.
  - **List View**: Minimalist row layout with property chips.
  - **Calendar View**: Full monthly calendar plotting cards on their due dates with month navigation.
- **Search, Filter & Sort**: Live in-database keyword search, property filtering, and ascending/descending title sorting.

### 4. 🗂️ Database Item Peek Views (**Center Peek** & **Side Peek**)
- Clicking any card on a board or opening a table row displays Notion's signature **Peek Modal**:
  - **Center Peek**: Centered modal window.
  - **Side Peek**: Slide-out drawer on the right side.
  - **Open as full page**: Expands directly into the main workspace.
  - Live editing of properties, title, cover, and inner blocks with a dedicated discussion/comments thread.

### 5. 👥 Team Members & Workspace Management
- **User Management Modal**: Invite teammates, set roles (*Workspace Owner*, *Admin*, *Member*, *Guest*), and switch active profiles on the fly.
- **Assignee Avatars**: Assign team members to database tasks with interactive color avatars.

### 6. 📁 Templates & Real Notion Importer
- **Notion Template Gallery**: Browse and duplicate built-in templates (*Sales CRM*, *Habit Tracker*, *Reading List*, *Cornell Notes*).
- **Markdown Importer**: Import `.md` and `.txt` files exported from official Notion into native editable blocks.

### 7. 🎨 Navigation, Themes & Customization
- **Collapsible Sidebar**: Tree view of workspace pages with recursive subpage nesting, quick links (*Search or ask Ctrl+K*, *Home*, *Templates*, *Import*), Favorites, Recents, and Trash Bin.
- **Desktop Tabs**: Multi-page desktop tab bar with history forward/backward navigation and breadcrumbs.
- **Themes & Fonts**: Light & Dark mode with authentic Notion color tokens, and font switcher (*Sans*, *Serif*, *Mono*).
- **Local Persistence & Export**: Offline-first `localStorage` sync with full JSON workspace backup export/import.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>Cmd</kbd> + <kbd>K</kbd> | Quick Search across all workspace pages and blocks |
| <kbd>Ctrl</kbd> + <kbd>J</kbd> / <kbd>Cmd</kbd> + <kbd>J</kbd> | Open Notion AI Assistant |
| `/` | Open Slash Command Menu on any empty line |
| `#` + <kbd>Space</kbd> | Turn into Heading 1 |
| `##` + <kbd>Space</kbd> | Turn into Heading 2 |
| `###` + <kbd>Space</kbd> | Turn into Heading 3 |
| `-` or `*` + <kbd>Space</kbd> | Turn into Bulleted List |
| `[]` + <kbd>Space</kbd> | Turn into To-Do Checkbox |
| `>` + <kbd>Space</kbd> | Turn into Quote Block |
| `---` | Turn into Divider Line |
| <kbd>Esc</kbd> | Close menus, modals, and peek views |

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Math Formula Rendering**: [KaTeX](https://katex.org/)
- **Confetti Animation**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `pnpm`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/samirsawarkar/notion-clone.git

# 2. Navigate to the project directory
cd notion-clone

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The optimized static build will be output to the `dist/` directory, ready to deploy to **Vercel**, **Netlify**, or **GitHub Pages**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
