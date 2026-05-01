import React from 'react';
import { Square, Diamond, Circle, Minus } from 'lucide-react';

interface DiagramSidebarProps {
    onAddNode: (type: 'process' | 'decision' | 'terminal') => void;
}

const NODE_TYPES = [
    {
        type: 'process' as const,
        label: 'Process',
        desc: 'A step or action',
        icon: <Square size={18} className="text-hiku-muted" />,
        preview: (
            <div className="w-full py-1.5 text-center text-xs font-medium text-hiku-text bg-hiku-surface2 border border-hiku-border rounded-lg">
                Process
            </div>
        ),
    },
    {
        type: 'decision' as const,
        label: 'Decision',
        desc: 'A yes/no branch',
        icon: <Diamond size={18} className="text-hiku-muted" />,
        preview: (
            <div className="w-full flex items-center justify-center">
                <svg width="80" height="44" viewBox="0 0 80 44">
                    <polygon points="40,3 77,22 40,41 3,22" fill="none" stroke="#1e1e3a" strokeWidth="2" />
                    <text x="40" y="26" textAnchor="middle" fontSize="9" fill="#94a3b8">Decision</text>
                </svg>
            </div>
        ),
    },
    {
        type: 'terminal' as const,
        label: 'Terminal',
        desc: 'Start or End',
        icon: <Circle size={18} className="text-hiku-muted" />,
        preview: (
            <div className="w-full py-1.5 text-center text-xs font-semibold text-hiku-accent bg-hiku-accent/10 border border-hiku-accent/30 rounded-full">
                Terminal
            </div>
        ),
    },
];

export const DiagramSidebar: React.FC<DiagramSidebarProps> = ({ onAddNode }) => (
    <aside className="w-52 bg-hiku-surface border-r border-hiku-border flex flex-col">
        <div className="px-4 py-3 border-b border-hiku-border">
            <p className="text-xs font-semibold text-hiku-muted uppercase tracking-wider">
                Node Types
            </p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {NODE_TYPES.map(({ type, label, desc, icon, preview }) => (
                <button
                    key={type}
                    onClick={() => onAddNode(type)}
                    className="w-full text-left p-3 rounded-lg border border-hiku-border bg-hiku-surface2 hover:border-hiku-accent/50 hover:bg-hiku-accent/5 transition-all group"
                >
                    <div className="flex items-center gap-2 mb-2">
                        {icon}
                        <div>
                            <p className="text-xs font-semibold text-hiku-text group-hover:text-hiku-accent transition-colors">
                                {label}
                            </p>
                            <p className="text-xs text-hiku-muted/70">{desc}</p>
                        </div>
                    </div>
                    {preview}
                </button>
            ))}
        </div>
        <div className="p-3 border-t border-hiku-border">
            <p className="text-xs text-hiku-muted/60 text-center leading-relaxed">
                Click to add a node,<br />drag handles to connect
            </p>
        </div>
    </aside>
);
