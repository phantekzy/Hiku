import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, Workflow, Paintbrush, LayoutDashboard, Plus, X } from 'lucide-react';
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

    const handleNew = async (type: 'document' | 'canvas' | 'diagram') => {
        onMobileClose?.();
        if (type === 'document') {
            const doc = await api.post<Document>('/documents', {});
            navigate(`/editor/${doc.id}`);
        } else if (type === 'canvas') {
            const canvas = await api.post<Canvas>('/canvases', {});
            navigate(`/paint/${canvas.id}`);
        } else {
            const diagram = await api.post<Diagram>('/diagrams', {});
            navigate(`/diagram/${diagram.id}`);
        }
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">

            {/* Logo row */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-hiku-border flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-hiku-accent font-mono font-bold text-lg tracking-tighter">hiku</span>
                    {!sidebarCollapsed && (
                        <span className="text-hiku-moss text-2xs font-mono hidden sm:block">v1.0</span>
                    )}
                </div>
                {/* close btn on mobile */}
                {onMobileClose && (
                    <button onClick={onMobileClose} className="text-hiku-muted hover:text-hiku-cream sm:hidden p-1">
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* New item quick actions */}
            <div className="px-3 pt-4 pb-2 border-b border-hiku-border/50">
                <p className="text-2xs text-hiku-moss uppercase tracking-widest mb-2 px-1 font-mono">
                    <span className="text-hiku-accent">// </span>new
                </p>
                <div className="flex flex-col gap-1">
                    {[
                        { label: 'document', type: 'document' as const, icon: FileText },
                        { label: 'canvas', type: 'canvas' as const, icon: Paintbrush },
                        { label: 'diagram', type: 'diagram' as const, icon: Workflow },
                    ].map(({ label, type, icon: Icon }) => (
                        <button
                            key={type}
                            onClick={() => handleNew(type)}
                            className={cn(
                                'flex items-center gap-2.5 px-2 py-1.5 rounded-sm w-full text-left',
                                'text-hiku-muted hover:text-hiku-cream hover:bg-hiku-surface2',
                                'transition-colors duration-100 font-mono text-xs group',
                                sidebarCollapsed && 'justify-center'
                            )}
                        >
                            <Plus size={11} className="text-hiku-accent flex-shrink-0 group-hover:text-hiku-accent-bright" />
                            {!sidebarCollapsed && <span>{label}</span>}
                            {!sidebarCollapsed && (
                                <Icon size={11} className="ml-auto text-hiku-border group-hover:text-hiku-moss" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-3 overflow-y-auto">
                <p className="text-2xs text-hiku-moss uppercase tracking-widest mb-2 px-1 font-mono">
                    <span className="text-hiku-accent">// </span>nav
                </p>
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
                                sidebarCollapsed && 'justify-center'
                            )}
                        >
                            <Icon size={14} className="flex-shrink-0" />
                            {!sidebarCollapsed && <span>{label}</span>}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Footer */}
            {!sidebarCollapsed && (
                <div className="px-4 py-3 border-t border-hiku-border/50">
                    <p className="text-2xs text-hiku-pine font-mono">
                        <span className="text-hiku-moss">$</span> hiku --workspace
                    </p>
                </div>
            )}
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
                {sidebarContent}
            </aside>

            {/* Mobile drawer */}
            {mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/60 sm:hidden"
                        onClick={onMobileClose}
                    />
                    <aside className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-hiku-surface border-r border-hiku-border sm:hidden animate-slide-up">
                        {sidebarContent}
                    </aside>
                </>
            )}
        </>
    );
};
