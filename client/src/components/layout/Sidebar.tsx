import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, Workflow, Paintbrush, LayoutDashboard, Plus, X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { api } from '../../lib/api';
import type { Document, Canvas, Diagram } from '../../types';

const NAV = [
    { to: '/dashboard', label: 'dashboard', icon: LayoutDashboard },
    { to: '/editor', label: 'editor', icon: FileText },
    { to: '/paint', label: 'paint', icon: Paintbrush },
    { to: '/diagram', label: 'diagram', icon: Workflow },
];

const NEW_ITEMS = [
    { label: 'document', type: 'document' as const, icon: FileText, navPrefix: '/editor/' },
    { label: 'canvas', type: 'canvas' as const, icon: Paintbrush, navPrefix: '/paint/' },
    { label: 'diagram', type: 'diagram' as const, icon: Workflow, navPrefix: '/diagram/' },
];

interface SidebarProps {
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
    const { sidebarCollapsed } = useStore();
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState<string | null>(null);

    const handleNew = async (type: 'document' | 'canvas' | 'diagram', navPrefix: string) => {
        if (isCreating) return;
        setIsCreating(type);
        try {
            const endpoint =
                type === 'document' ? '/documents' :
                    type === 'canvas' ? '/canvases' : '/diagrams';
            const res = await api.post<Document | Canvas | Diagram>(endpoint, {});
            onMobileClose?.();
            navigate(`${navPrefix}${res.id}`);
        } catch (err) {
            console.error(`Failed to create ${type}:`, err);
        } finally {
            setIsCreating(null);
        }
    };

    const Inner = ({ collapsed }: { collapsed: boolean }) => (
        <div className="flex flex-col h-full select-none overflow-hidden">

            <div className={cn(
                'flex items-center h-14 border-b border-hiku-border flex-shrink-0',
                collapsed ? 'justify-center px-2' : 'justify-between px-4',
            )}>
                <div className="flex items-center gap-1.5">
                    <span className="text-hiku-accent font-mono font-bold text-lg tracking-tighter">
                        {collapsed ? '//' : 'hiku'}
                    </span>
                    {!collapsed && (
                        <span className="text-hiku-moss text-2xs font-mono mt-0.5">v1.0</span>
                    )}
                </div>
                {onMobileClose && !collapsed && (
                    <button
                        onClick={onMobileClose}
                        className="text-hiku-muted hover:text-hiku-cream sm:hidden p-1 transition-colors rounded-sm"
                    >
                        <X size={15} />
                    </button>
                )}
            </div>

            <div className={cn(
                'pt-4 pb-3 border-b border-hiku-border/40',
                collapsed ? 'px-1.5' : 'px-3',
            )}>
                {!collapsed && (
                    <p className="text-2xs text-hiku-moss uppercase tracking-widest mb-2 px-1 font-mono">
                        <span className="text-hiku-accent">// </span>new
                    </p>
                )}
                <div className="flex flex-col gap-0.5">
                    {NEW_ITEMS.map(({ label, type, icon: Icon, navPrefix }) => (
                        <button
                            key={type}
                            disabled={!!isCreating}
                            onClick={() => handleNew(type, navPrefix)}
                            title={collapsed ? `new ${label}` : undefined}
                            className={cn(
                                'flex items-center gap-2.5 py-1.5 rounded-sm w-full text-left',
                                'font-mono text-xs transition-colors duration-100 group',
                                'text-hiku-muted hover:text-hiku-cream hover:bg-hiku-surface2',
                                collapsed ? 'justify-center px-1' : 'px-2',
                                isCreating && 'opacity-50 cursor-not-allowed',
                            )}
                        >
                            {isCreating === type ? (
                                <Loader2 size={13} className="animate-spin text-hiku-accent flex-shrink-0" />
                            ) : collapsed ? (
                                <Icon size={14} className="text-hiku-accent group-hover:text-hiku-accent-bright transition-colors" />
                            ) : (
                                <>
                                    <Plus size={11} className="text-hiku-accent flex-shrink-0 group-hover:text-hiku-accent-bright transition-colors" />
                                    <span className="truncate flex-1">{label}</span>
                                    <Icon size={11} className="text-hiku-border group-hover:text-hiku-moss transition-colors" />
                                </>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <nav className={cn(
                'flex-1 py-3 overflow-y-auto',
                collapsed ? 'px-1.5' : 'px-3',
            )}>
                {!collapsed && (
                    <p className="text-2xs text-hiku-moss uppercase tracking-widest mb-2 px-1 font-mono">
                        <span className="text-hiku-accent">// </span>nav
                    </p>
                )}
                <div className="flex flex-col gap-0.5">
                    {NAV.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end
                            onClick={onMobileClose}
                            title={collapsed ? label : undefined}
                            className={({ isActive }) => cn(
                                'flex items-center gap-2.5 py-2 rounded-sm font-mono text-xs transition-colors duration-100 border-l-2',
                                isActive
                                    ? 'bg-hiku-surface2 text-hiku-cream border-hiku-accent'
                                    : 'text-hiku-muted hover:text-hiku-cream hover:bg-hiku-surface2/50 border-transparent',
                                collapsed ? 'justify-center px-1 border-l-0' : 'pl-[6px] pr-2',
                            )}
                        >
                            <Icon size={14} className="flex-shrink-0" />
                            {!collapsed && <span className="truncate">{label}</span>}
                        </NavLink>
                    ))}
                </div>
            </nav>

            <div className={cn(
                'py-3 border-t border-hiku-border/40',
                collapsed ? 'flex justify-center px-2' : 'px-4',
            )}>
                {collapsed ? (
                    <span className="text-hiku-moss text-xs font-mono">$</span>
                ) : (
                    <p className="text-2xs text-hiku-pine font-mono">
                        <span className="text-hiku-moss">$ </span>hiku --workspace
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className={cn(
                'hidden sm:flex flex-col h-full bg-hiku-surface border-r border-hiku-border',
                'transition-all duration-200 flex-shrink-0',
                sidebarCollapsed ? 'w-12' : 'w-48',
            )}>
                <Inner collapsed={sidebarCollapsed} />
            </aside>

            {/* Mobile drawer */}
            {mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/70 sm:hidden animate-fade-in"
                        onClick={onMobileClose}
                    />
                    <aside className="fixed inset-y-0 left-0 z-50 w-60 flex flex-col bg-hiku-surface border-r border-hiku-border sm:hidden animate-slide-up">
                        <Inner collapsed={false} />
                    </aside>
                </>
            )}
        </>
    );
};
