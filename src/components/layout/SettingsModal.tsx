import React, { useState, useRef } from 'react';
import {
  X,
  Moon,
  Sun,
  Download,
  Upload,
  RotateCcw,
  Users,
  UserPlus,
  Trash2,
  Check,
  Shield,
  Sliders,
} from 'lucide-react';
import { NotionUser, UserRole } from '../../types/notion';

interface SettingsModalProps {
  isOpen: boolean;
  theme: 'light' | 'dark';
  users: NotionUser[];
  activeUserId: string;
  onClose: () => void;
  onSetTheme: (theme: 'light' | 'dark') => void;
  onAddUser: (name: string, email: string, role: UserRole, avatar: string) => void;
  onUpdateUser: (userId: string, partial: Partial<NotionUser>) => void;
  onRemoveUser: (userId: string) => void;
  onSetActiveUser: (userId: string) => void;
  onExportJSON: () => void;
  onImportJSON: (jsonStr: string) => boolean;
  onResetDefault: () => void;
}

const AVATAR_PRESETS = ['👨‍💻', '👩‍💻', '⚡', '🚀', '🎨', '🛡️', '🎯', '✨', '🦊', '🐼', '🦁', '🦉'];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  theme,
  users,
  activeUserId,
  onClose,
  onSetTheme,
  onAddUser,
  onUpdateUser,
  onRemoveUser,
  onSetActiveUser,
  onExportJSON,
  onImportJSON,
  onResetDefault,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'members'>('members');
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('Member');
  const [newAvatar, setNewAvatar] = useState('👨‍💻');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newEmail.trim()) {
      onAddUser(newName.trim(), newEmail.trim(), newRole, newAvatar);
      setNewName('');
      setNewEmail('');
      setShowAddUserForm(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const success = onImportJSON(text);
          if (success) {
            alert('Workspace imported successfully!');
            onClose();
          } else {
            alert('Failed to parse workspace JSON file.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-100 p-4">
      <div className="w-full max-w-xl rounded-xl border border-[var(--notion-border)] bg-[var(--notion-card)] shadow-2xl overflow-hidden text-[var(--notion-text)]">
        {/* Header & Tabs */}
        <div className="flex items-center justify-between px-5 pt-3 border-b border-[var(--notion-border)]">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('members')}
              className={`flex items-center gap-2 pb-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'members'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-[var(--notion-text-muted)] hover:text-[var(--notion-text)]'
              }`}
            >
              <Users size={15} />
              <span>Members ({users.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 pb-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'settings'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-[var(--notion-text-muted)] hover:text-[var(--notion-text)]'
              }`}
            >
              <Sliders size={15} />
              <span>Settings</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 -mt-2 rounded text-[var(--notion-text-muted)] hover:bg-[var(--notion-hover)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab 1: Members & Access */}
        {activeTab === 'members' && (
          <div className="p-5 space-y-5 max-h-[480px] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[var(--notion-text)]">
                  Workspace Members
                </h4>
                <p className="text-xs text-[var(--notion-text-muted)] mt-0.5">
                  Manage members, assign roles, and switch the current active user profile.
                </p>
              </div>

              <button
                onClick={() => setShowAddUserForm(!showAddUserForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium transition-colors shadow-xs"
              >
                <UserPlus size={14} />
                <span>Add Member</span>
              </button>
            </div>

            {/* Add Member Form Drawer */}
            {showAddUserForm && (
              <form
                onSubmit={handleAddUserSubmit}
                className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/5 space-y-3 animate-in fade-in duration-100"
              >
                <div className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
                  Invite New Member
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--notion-text-muted)] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jane Doe"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-[var(--notion-border)] bg-[var(--notion-card)] text-[var(--notion-text)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--notion-text-muted)] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="jane@company.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-[var(--notion-border)] bg-[var(--notion-card)] text-[var(--notion-text)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--notion-text-muted)] mb-1">
                      Role
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as UserRole)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-[var(--notion-border)] bg-[var(--notion-card)] text-[var(--notion-text)] focus:outline-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Member">Member</option>
                      <option value="Guest">Guest</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[var(--notion-text-muted)] mb-1">
                      Avatar
                    </label>
                    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                      {AVATAR_PRESETS.map((av) => (
                        <button
                          type="button"
                          key={av}
                          onClick={() => setNewAvatar(av)}
                          className={`text-base p-1 rounded transition-transform ${
                            newAvatar === av
                              ? 'bg-blue-500/20 scale-125 border border-blue-500/40'
                              : 'hover:bg-[var(--notion-hover)]'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUserForm(false)}
                    className="px-3 py-1 text-xs rounded border border-[var(--notion-border)] hover:bg-[var(--notion-hover)] text-[var(--notion-text-muted)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs rounded bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-xs"
                  >
                    Add Member
                  </button>
                </div>
              </form>
            )}

            {/* Members List */}
            <div className="divide-y divide-[var(--notion-border)] border border-[var(--notion-border)] rounded-lg overflow-hidden bg-[var(--notion-hover)]/20">
              {users.map((u) => {
                const isActive = u.id === activeUserId;
                return (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-3 hover:bg-[var(--notion-hover)]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <span className="flex items-center justify-center h-8 w-8 rounded-full bg-[var(--notion-card)] border border-[var(--notion-border)] text-lg shrink-0 shadow-xs">
                        {u.avatar || '👤'}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[var(--notion-text)] truncate">
                            {u.name}
                          </span>
                          {isActive && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-500 text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[var(--notion-text-muted)] truncate">
                          {u.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Role selector */}
                      <select
                        value={u.role}
                        onChange={(e) =>
                          onUpdateUser(u.id, { role: e.target.value as UserRole })
                        }
                        disabled={u.role === 'Workspace Owner'}
                        className="px-2 py-1 text-xs rounded border border-[var(--notion-border)] bg-[var(--notion-card)] text-[var(--notion-text)] focus:outline-none cursor-pointer"
                      >
                        <option value="Workspace Owner">Workspace Owner</option>
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                        <option value="Guest">Guest</option>
                      </select>

                      {/* Switch Active User button */}
                      {!isActive && (
                        <button
                          onClick={() => onSetActiveUser(u.id)}
                          className="px-2.5 py-1 text-xs font-medium rounded hover:bg-blue-500/10 text-blue-500 border border-blue-500/30 transition-colors"
                        >
                          Switch User
                        </button>
                      )}

                      {/* Remove user */}
                      {u.role !== 'Workspace Owner' && users.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove member "${u.name}" from this workspace?`)) {
                              onRemoveUser(u.id);
                            }
                          }}
                          className="p-1 rounded text-[var(--notion-text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Remove user"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Settings & Storage */}
        {activeTab === 'settings' && (
          <div className="p-5 space-y-6 max-h-[480px] overflow-y-auto">
            {/* Appearance Section */}
            <div>
              <div className="text-xs font-semibold text-[var(--notion-text-muted)] uppercase tracking-wider mb-2">
                Appearance
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-hover)]/30">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon size={18} className="text-indigo-400" />
                  ) : (
                    <Sun size={18} className="text-amber-500" />
                  )}
                  <div>
                    <div className="text-sm font-medium">Color Theme</div>
                    <div className="text-xs text-[var(--notion-text-muted)]">
                      Customize your workspace interface mode
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 p-1 bg-[var(--notion-hover)] rounded-lg border border-[var(--notion-border)]">
                  <button
                    onClick={() => onSetTheme('light')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      theme === 'light'
                        ? 'bg-[var(--notion-card)] text-blue-500 shadow-xs'
                        : 'text-[var(--notion-text-muted)] hover:text-[var(--notion-text)]'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => onSetTheme('dark')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      theme === 'dark'
                        ? 'bg-[var(--notion-card)] text-blue-500 shadow-xs'
                        : 'text-[var(--notion-text-muted)] hover:text-[var(--notion-text)]'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>

            {/* Backup & Data Section */}
            <div>
              <div className="text-xs font-semibold text-[var(--notion-text-muted)] uppercase tracking-wider mb-2">
                Data & Storage
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-hover)]/30">
                  <div className="flex items-center gap-3">
                    <Download size={18} className="text-blue-500" />
                    <div>
                      <div className="text-sm font-medium">Export Workspace</div>
                      <div className="text-xs text-[var(--notion-text-muted)]">
                        Download full workspace backup as JSON
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onExportJSON}
                    className="px-3 py-1.5 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium transition-colors"
                  >
                    Export
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--notion-border)] bg-[var(--notion-hover)]/30">
                  <div className="flex items-center gap-3">
                    <Upload size={18} className="text-purple-500" />
                    <div>
                      <div className="text-sm font-medium">Import Workspace</div>
                      <div className="text-xs text-[var(--notion-text-muted)]">
                        Restore from an existing JSON backup
                      </div>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded border border-[var(--notion-border)] hover:bg-[var(--notion-hover)] text-xs font-medium transition-colors"
                  >
                    Import
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-3">
                    <RotateCcw size={18} className="text-red-500" />
                    <div>
                      <div className="text-sm font-medium text-red-500">
                        Reset to Starter Workspace
                      </div>
                      <div className="text-xs text-[var(--notion-text-muted)]">
                        Reload default Notion templates and sample pages
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          'Are you sure you want to reset your workspace? Current changes will be overwritten with default templates.'
                        )
                      ) {
                        onResetDefault();
                        onClose();
                      }
                    }}
                    className="px-3 py-1.5 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
