import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, Paintbrush, Workflow,
    Plus, Clock, Trash2, ExternalLink,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useDocuments } from '../hooks/useDocuments';
import { api } from '../lib/api';
import { formatRelative } from '../lib/utils';
import type { Document, Canvas, Diagram } from '../types';

type ItemType = 'document' | 'canvas' | 'diagram';

const TYPE_META: Record<ItemType, {
    label: string;
    icon: React.ElementType;
    apiPrefix: string;
    navPrefix: string;
}> = {
    document: { label: 'documents', icon: FileText, apiPrefix: '/documents', navPrefix: '/editor/' },
    canvas: { label: 'canvases', icon: Paintbrush, apiPrefix: '/canvases', navPrefix: '/paint/' },
    diagram: { label: 'diagrams', icon: Workflow, apiPrefix: '/diagrams', navPrefix: '/diagram/' },
};

export const Dashboard: React.FC = () => {
    const { documents, canvases, diagrams, loading, refetch } = useDocuments();
    const [deleteTarget, setDeleteTarget] = useState<{ type: ItemType; id: string; title: string } | null>(null);
    const [creating, setCreating] = useState<ItemType | null>(null);
    const navigate = useNavigate();

    const handleNew = async (type: ItemType) => {
        if (creating) return;
        setCreating(type);
        try {
            const { apiPrefix, navPrefix } = TYPE_META[type];
            const item = await api.post<Document | Canvas | Diagram>(apiPrefix, {});
            navigate(`${navPrefix}${item.id}`);
        } finally {
            setCreating(null);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const { apiPrefix } = TYPE_META[deleteTarget.type];
        await api.delete(`${apiPrefix}/${deleteTarget.id}`);
        setDeleteTarget(null);
        refetch();
    };

    const totalItems = documents.length + canvases.length + diagrams.length;

    // Reusable section
    const Section = ({
        type,
        items,
    }: {
        type: ItemType;
        items: { id: string; title: string; updatedAt: string }[];
    }) => {
        const { label, icon: Icon, navPrefix } = TYPE_META[type];

        return (
            <div className="mb-8 sm:mb-10">

                {/* Section header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-hiku-accent text-xs font-mono select-none">// </span>
                        <Icon size={12} className="text-hiku-muted" />
                        <span className="font-mono text-xs text-hiku-cream-dim uppercase tracking-wider">
                            {label}
                        </span>
                        {/* Item count badge   */}
                        <span className="font-mono text-2xs text-hiku-accent bg-hiku-surface2 border border-hiku-border px-1.5 py-0.5 rounded-sm min-w-[1.5rem] text-center">
                            {items.length}
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        size="xs"
                        icon={<Plus size={11} />}
                        onClick={() => handleNew(type)}
                        loading={creating === type}
                    >
                        new
                    </Button>
                </div>

                {/* Empty state */}
                {items.length === 0 ? (
                    <button
                        className="w-full border border-dashed border-hiku-border/60 hover:border-hiku-accent/50 rounded p-6 sm:p-8 text-center transition-colors group"
                        onClick={() => handleNew(type)}
                    >
                        <Plus size={15} className="text-hiku-moss group-hover:text-hiku-accent mx-auto mb-2 transition-colors" />
                        <p className="font-mono text-xs text-hiku-moss group-hover:text-hiku-muted transition-colors">
                            no {label} yet — create one
                        </p>
                    </button>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="group relative bg-hiku-surface border border-hiku-border hover:border-hiku-border-light rounded p-3 sm:p-4 cursor-pointer transition-all"
                                onClick={() => navigate(`${navPrefix}${item.id}`)}
                            >
                                {/* left accent */}
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l bg-hiku-accent opacity-0 group-hover:opacity-60 transition-opacity" />

                                {/* Title */}
                                <p className="font-mono text-xs text-hiku-cream font-medium truncate leading-relaxed mb-2 pr-10">
                                    {item.title}
                                </p>

                                {/* Meta row */}
                                <div className="flex items-center gap-1 text-hiku-moss">
                                    <Clock size={9} />
                                    <span className="font-mono text-2xs">{formatRelative(item.updatedAt)}</span>
                                </div>

                                {/* Action buttons */}
                                <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="p-1.5 rounded-sm text-hiku-muted hover:text-hiku-cream hover:bg-hiku-surface2 transition-colors"
                                        title="open"
                                        onClick={(e) => { e.stopPropagation(); navigate(`${navPrefix}${item.id}`); }}
                                    >
                                        <ExternalLink size={11} />
                                    </button>
                                    <button
                                        className="p-1.5 rounded-sm text-hiku-muted hover:text-hiku-danger hover:bg-hiku-danger-muted/10 transition-colors"
                                        title="delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteTarget({ type, id: item.id, title: item.title });
                                        }}
                                    >
                                        <Trash2 size={11} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Layout title="dashboard">
            <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">

                {/* Top status line */}
                <div className="mb-6 sm:mb-8 pb-4 border-b border-hiku-border/50">
                    <div className="font-mono text-2xs text-hiku-moss mb-1">
                        <span className="text-hiku-accent">$ </span>ls -la ./workspace
                    </div>
                    <div className="font-mono text-xs text-hiku-muted">
                        {loading
                            ? 'loading...'
                            : `${totalItems} item${totalItems !== 1 ? 's' : ''} total`
                        }
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center gap-2 text-hiku-muted py-8">
                        <span className="w-3 h-3 border border-hiku-accent border-t-transparent rounded-full animate-spin" />
                        <span className="font-mono text-xs">loading workspace...</span>
                    </div>
                ) : (
                    <>
                        <Section type="document" items={documents} />
                        <Section type="canvas" items={canvases} />
                        <Section type="diagram" items={diagrams} />
                    </>
                )}
            </div>

            {/* Delete confirmation modal */}
            <Modal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="confirm_delete"
                size="sm"
            >
                <p className="font-mono text-xs text-hiku-cream-dim mb-1">
                    delete <span className="text-hiku-cream">"{deleteTarget?.title}"</span>?
                </p>
                <p className="font-mono text-2xs text-hiku-muted mb-5">
                    <span className="text-hiku-danger">✗ </span>
                    this {deleteTarget?.type} will be permanently deleted.
                </p>
                <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
                        cancel
                    </Button>
                    <Button variant="danger" size="sm" onClick={handleDelete}>
                        delete
                    </Button>
                </div>
            </Modal>
        </Layout>
    );
};
