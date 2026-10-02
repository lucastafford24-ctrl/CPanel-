import React, { useState } from 'react';
import { 
  CPanelTool, 
  CategoryInfo, 
  ActiveApp, 
  ToolCategory 
} from '../types/cpanel';
import { IconHelper } from './IconHelper';
import { 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Sparkles, 
  Search, 
  Layers, 
  FolderTree, 
  Database, 
  TerminalSquare, 
  Mail,
  Zap
} from 'lucide-react';

interface DashboardProps {
  categories: CategoryInfo[];
  tools: CPanelTool[];
  onOpenApp: (app: ActiveApp) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  categories,
  tools,
  onOpenApp,
  searchQuery,
  onClearSearch
}) => {
  // Collapsed state for category cards
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  // Starred favorites tool ids
  const [favoriteToolIds, setFavoriteToolIds] = useState<string[]>([
    'file-manager', 
    'phpmyadmin', 
    'email-accounts', 
    'wordpress-toolkit', 
    'terminal', 
    'zone-editor'
  ]);

  const toggleCategoryCollapse = (catId: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const toggleFavorite = (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteToolIds(prev => 
      prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]
    );
  };

  // Filter tools based on search query
  const query = searchQuery.trim().toLowerCase();
  const filteredTools = query
    ? tools.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query) || 
        t.category.toLowerCase().includes(query)
      )
    : tools;

  const favoriteTools = tools.filter(t => favoriteToolIds.includes(t.id));

  const handleToolClick = (tool: CPanelTool) => {
    if (tool.appTarget) {
      onOpenApp(tool.appTarget);
    } else {
      // Fallback for tools without dedicated modals: show friendly informative prompt
      alert(`${tool.name} configuration console is active in default mode.`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Quick Launchpad Banner */}
      {!query && (
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg p-5 shadow-sm border border-slate-700">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#ff6c2c] font-black text-lg">cPanel®</span>
                <span className="text-slate-400 text-xs">Hosting Automation Suite</span>
              </div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight">
                Control Panel Workspace
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Manage your domains, file directories, MySQL databases, email mailboxes, and automated cron jobs from a single unified console.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onOpenApp('wordpress')}
                className="px-3 py-2 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>WordPress Toolkit</span>
              </button>
              <button
                onClick={() => onOpenApp('file-manager')}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1.5"
              >
                <FolderTree className="w-3.5 h-3.5 text-amber-400" />
                <span>File Manager</span>
              </button>
              <button
                onClick={() => onOpenApp('terminal')}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1.5"
              >
                <TerminalSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Terminal (SSH)</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Search results summary bar if filtering */}
      {query && (
        <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-xs">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
            <Search className="w-4 h-4 text-amber-600" />
            <span>Found <strong>{filteredTools.length}</strong> matching tools for <em>"{searchQuery}"</em></span>
          </div>
          <button
            onClick={onClearSearch}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 dark:text-amber-300 underline"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Pinned Favorites Section (visible when not searching and favorites exist) */}
      {!query && favoriteTools.length > 0 && (
        <div className="bg-white dark:bg-[#0f172a] rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Favorites
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">({favoriteTools.length})</span>
            </div>
            <span className="text-[11px] text-slate-400">Click star on any tool to pin/unpin</span>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {favoriteTools.map(tool => (
              <div
                key={`fav-${tool.id}`}
                onClick={() => handleToolClick(tool)}
                className="group relative p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer flex items-start gap-3"
              >
                <div className="p-2 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 group-hover:text-[#ff6c2c] group-hover:border-[#ff6c2c]/40 transition-colors shadow-2xs">
                  <IconHelper name={tool.iconName} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#ff6c2c] transition-colors truncate">
                      {tool.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {tool.description}
                  </p>
                </div>
                <button
                  onClick={(e) => toggleFavorite(tool.id, e)}
                  className="absolute top-3 right-3 text-amber-500 hover:scale-110 transition-transform p-0.5"
                  title="Remove from favorites"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Categories Section */}
      <div className="space-y-4">
        {categories.map(category => {
          const categoryTools = filteredTools.filter(t => t.category === category.id);
          if (categoryTools.length === 0) return null;

          const isCollapsed = Boolean(collapsedCategories[category.id]);

          return (
            <div 
              key={category.id}
              className="bg-white dark:bg-[#0f172a] rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-shadow hover:shadow-sm"
            >
              {/* Category Header */}
              <div 
                onClick={() => toggleCategoryCollapse(category.id)}
                className="px-4 py-3 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none group"
              >
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider group-hover:text-[#ff6c2c] transition-colors">
                    {category.title}
                  </h2>
                  <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                    ({categoryTools.length})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden md:inline-block text-[11px] text-slate-400">
                    {category.description}
                  </span>
                  <button
                    className="p-1 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                    aria-label={isCollapsed ? "Expand section" : "Collapse section"}
                  >
                    {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Tools Grid */}
              {!isCollapsed && (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {categoryTools.map(tool => {
                    const isFav = favoriteToolIds.includes(tool.id);

                    return (
                      <div
                        key={tool.id}
                        onClick={() => handleToolClick(tool)}
                        className="group relative p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all cursor-pointer flex items-start gap-3"
                      >
                        <div className="p-2 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 group-hover:text-[#ff6c2c] group-hover:border-[#ff6c2c]/40 transition-colors shadow-2xs">
                          <IconHelper name={tool.iconName} className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#ff6c2c] transition-colors truncate">
                              {tool.name}
                            </h3>
                            {tool.badge && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#ff6c2c] bg-orange-50 dark:bg-orange-950/60 px-1 py-0.2 rounded border border-orange-200 dark:border-orange-800">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {tool.description}
                          </p>
                        </div>
                        <button
                          onClick={(e) => toggleFavorite(tool.id, e)}
                          className={`absolute top-3 right-3 p-0.5 transition-colors ${
                            isFav 
                              ? 'text-amber-500' 
                              : 'text-slate-300 dark:text-slate-600 hover:text-amber-400 opacity-0 group-hover:opacity-100'
                          }`}
                          title={isFav ? "Unpin favorite" : "Pin to favorites"}
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500' : ''}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
