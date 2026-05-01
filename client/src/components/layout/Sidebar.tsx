import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, Workflow, Paintbrush, LayoutDashboard, Plus, X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { api } from '../../lib/api';
import type { Document, Canvas, Diagram } from '../../types';

const NAV = [
    { to: '/dashboard', label: 'dashboard', icon: LayoutDashboard, key: 'db' },
    { to: '/editor', label: 'editor', icon: FileText, key: 'ed' },
    { to: '/paint', label: 'paint', icon: Paintbrush, key: 'pa' },
    { to: '/diagram', label: 'diagram', icon: Workflow, key: 'di' },
];

interface SidebarProps {
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
    const { sidebarCollapsed } = useStore();
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);

    const handleNew = async (type: 'document' | 'canvas' | 'diagram') => {
        if (isCreating) return;
        setIsCreating(true);
        try {
            const endpoint = type === 'document' ? '/documents' : type === 'canvas' ? '/canvases' : '/diagrams';
            const res = await api.post<any>(endpoint, {});
            onMobileClose?.();
            navigate(`/${type === 'document' ? 'editor' : type}/${res.id}`);
        } catch (error) {
            console.error(`Failed to create ${type}:`, error);
        } finally {
            setIsCreating(false);
        }
    };

    const sidebarContent = (
        <div className="flex flex-col h-full select-none overflow-hidden">
            {/* Logo */}
            <div className={cn(
                "flex items-center h-14 border-b border-hiku-border flex-shrink-0 transition-all duration-200",
                sidebarCollapsed ? "justify-center px-0" : "justify-between px-4"
            )}>
                <div className="flex items-center gap-1.5">
                    <span className="text-hiku-accent font-mono font-bold text-lg tracking-tighter">
                        {sidebarCollapsed ? "//" : "hiku"}
                    </span>
                    {!sidebarCollapsed && (
                        <span className="text-hiku-moss text-2xs font-mono hidden sm:block mt-1">v1.0</span>
                    )}
                </div>
                {onMobileClose && !sidebarCollapsed && (
                    <button onClick={onMobileClose} className="text-hiku-muted hover:text-hiku-cream sm:hidden p-1">
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Quick Actions */}
            <div className={cn("pt-4 pb-2 border-b border-hiku-border/50", sidebarCollapsed ? "px-1.5" : "px-3")}>
                {!sidebarCollapsed && (
                    <p className="text-2xs text-hiku-moss uppercase tracking-widest mb-2 px-1 font-mono">
                        <span className="text-hiku-accent">// </span>new
                    </p>
                )}
                <div className="flex flex-col gap-1">
                    {[
                        { label: 'document', type: 'document' as const, icon: FileText },
                        { label: 'canvas', type: 'canvas' as const, icon: Paintbrush },
                        { label: 'diagram', type: 'diagram' as const, icon: Workflow },
                    ].map(({ label, type, icon: Icon }) => (
                        <button
                            key={type}
                            disabled={isCreating}
                            onClick={() => handleNew(type)}
                            className={cn(
                                'flex items-center gap-2.5 px-2 py-1.5 rounded-sm w-full text-left transition-all duration-100 font-mono text-xs group',
                                'text-hiku-muted hover:text-hiku-cream hover:bg-hiku-surface2',
                                sidebarCollapsed && 'justify-center',
                                isCreating && 'opacity-50 cursor-not-allowed'
                            )}
                            title={sidebarCollapsed ? label : undefined}
                        >
                            {isCreating ? (
                                <Loader2 size={14} className="animate-spin text-hiku-accent" />
                            ) : sidebarCollapsed ? (
                                <Icon size={14} className="text-hiku-accent group-hover:text-hiku-accent-bright" />
                            ) : (
                                <>
                                    <Plus size={11} className="text-hiku-accent flex-shrink-0 group-hover:text-hiku-accent-bright" />
                                    <span className="truncate">{label}</span>
                                    <Icon size={11} className="ml-auto text-hiku-border group-hover:text-hiku-moss" />
                                </>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <nav className={cn("flex-1 py-3 overflow-y-auto custom-scrollbar", sidebarCollapsed ? "px-1.5" : "px-3")}>
                {!sidebarCollapsed && (
                    <p className="text-2xs text-hiku-moss uppercase tracking-widest mb-2 px-1 font-mono">
                        <span className="text-hiku-accent">// </span>nav
                    </p>
                )}
                <div className="flex flex-col gap-0.5">
                    {NAV.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={onMobileClose}
                            className={({ isActive }) => cn(
                                'flex items-center gap-2.5 px-2 py-2 rounded-sm font-mono text-xs transition-colors duration-100',
                                isActive
                                    ? 'bg-hiku-surface2 text-hiku-cream border-l-2 border-hiku-accent pl-[6px]'
                                    : 'text-hiku-muted hover:text-hiku-cream hover:bg-hiku-surface2/50 border-l-2 border-transparent pl-[6px]',
                                sidebarCollapsed && 'justify-center pl-2'
                            )}
                            title={sidebarCollapsed ? label : undefined}
                        >
                            <Icon size={14} className="flex-shrink-0" />
                            {!sidebarCollapsed && <span className="truncate">{label}</span>}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Footer */}
            <div className={cn(
                "py-3 border-t border-hiku-border/50 transition-all",
                sidebarCollapsed ? "px-0 flex justify-center" : "px-4"
            )}>
                {sidebarCollapsed ? (
                    <span className="text-hiku-moss text-[10px] font-mono">$</span>
                ) : (
                    <p className="text-2xs text-hiku-pine font-mono">
                        <span className="text-hiku-moss">$</span> hiku --workspace
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <>
            <aside className={cn(
                'hidden sm:flex flex-col h-full bg-hiku-surface border-r border-hiku-border transition-all duration-200 flex-shrink-0',
                sidebarCollapsed ? 'w-12' : 'w-48',
            )}>
                {sidebarContent}
            </aside>

            {mobileOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/60 sm:hidden animate-in fade-in duration-300" onClick={onMobileClose} />
                    <aside className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-hiku-surface border-r border-hiku-border sm:hidden animate-in slide-in-from-left duration-300">
                        {/* Note: Mobile drawer uses !sidebarCollapsed logic by default (w-64) */}
                        {React.cloneElement(sidebarContent as React.ReactElement, { sidebarCollapsed: false })}
                    </aside>
                </>
            )}
        </>
    );
};
