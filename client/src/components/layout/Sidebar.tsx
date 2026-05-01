import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    PenTool,
    LayoutDashboard,
    FileText,
    Workflow,
    Paintbrush,
    Plus,
    Zap,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { api } from '../../lib/api';
import type { Document, Canvas, Diagram } from '../../types';

const NAV_ITEMS = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/editor', label: 'Dev Editor', icon: FileText },
    { to: '/paint', label: 'Paint', icon: Paintbrush },
    { to: '/diagram', label: 'Diagram', icon: Workflow },
];

export const Sidebar: React.FC = () => {
    const { sidebarCollapsed } = useStore();
    const navigate = useNavigate();

    const handleNewDocument = async () => {
        const doc = await api.post<Document>('/documents', {});
        navigate(`/editor/${doc.id}`);
    };

    const handleNewCanvas = async () => {
        const canvas = await api.post<Canvas>('/canvases', {});
        navigate(`/paint/${canvas.id}`);
    };

    const handleNewDiagram = async () => {
        const diagram = await api.post<Diagram>('/diagrams', {});
        navigate(`/diagram/${diagram.id}`);
    };

    return (
        <aside
            className={cn(
                'flex flex-col h-full bg-hiku-surface border-r border-hiku-border transition-all duration-200',
                sidebarCollapsed ? 'w-14' : 'w-56'
            )}
        >
            <div className="h-14 flex items-center px-4 border-b border-hiku-border flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-hiku-accent flex items-center justify-center flex-shrink-0">
                        <Zap size={16} className="text-white" />
                    </div>
                    {!sidebarCollapsed && (
                        <span className="font-bold text-hiku-text text-lg tracking-tight">hiku</span>
                    )}
                </div>
            </div>

            {!sidebarCollapsed && (
                <div className="px-3 pt-4 pb-2">
                    <p className="text-xs font-semibold text-hiku-muted uppercase tracking-wider mb-2 px-1">
                        New
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                        {[
                            { label: 'Doc', icon: FileText, action: handleNewDocument },
                            { label: 'Canvas', icon: PenTool, action: handleNewCanvas },
                            { label: 'Diagram', icon: Workflow, action: handleNewDiagram },
                        ].map(({ label, icon: Icon, action }) => (
                            <button
                                key={label}
                                onClick={action}
                                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-hiku-surface2 hover:bg-hiku-border transition-colors text-hiku-muted hover:text-hiku-text group"
                            >
                                <Icon size={14} className="group-hover:text-hiku-accent transition-colors" />
                                <span className="text-xs">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {sidebarCollapsed && (
                <div className="px-2 pt-3">
                    <button
                        onClick={handleNewDocument}
                        className="w-full flex items-center justify-center p-2 rounded-lg bg-hiku-accent/20 hover:bg-hiku-accent/30 text-hiku-accent transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            )}

            <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
                {!sidebarCollapsed && (
                    <p className="text-xs font-semibold text-hiku-muted uppercase tracking-wider mb-2 px-1">
                        Workspace
                    </p>
                )}
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors',
                                isActive
                                    ? 'bg-hiku-accent/20 text-hiku-accent font-medium'
                                    : 'text-hiku-muted hover:bg-hiku-surface2 hover:text-hiku-text'
                            )
                        }
                    >
                        <Icon size={17} className="flex-shrink-0" />
                        {!sidebarCollapsed && label}
                    </NavLink>
                ))}
            </nav>

            {!sidebarCollapsed && (
                <div className="px-4 py-3 border-t border-hiku-border">
                    <p className="text-xs text-hiku-muted/50 text-center">Hiku v1.0</p>
                </div>
            )}
        </aside>
    );
};
