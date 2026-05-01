import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Paintbrush, Workflow, Plus, Clock, Trash2, ExternalLink } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useDocuments } from '../hooks/useDocuments';
import { api } from '../lib/api';
import { formatRelative } from '../lib/utils';
import type { Document, Canvas, Diagram } from '../types';

type ItemType = 'document' | 'canvas' | 'diagram';

const TYPE_META: Record<ItemType, { label: string; icon: React.ElementType; prefix: string; nav: string }> = {
    document: { label: 'documents', icon: FileText, prefix: '/documents', nav: '/editor/' },
    canvas: { label: 'canvases', icon: Paintbrush, prefix: '/canvases', nav: '/paint/' },
    diagram: { label: 'diagrams', icon: Workflow, prefix: '/diagrams', nav: '/diagram/' },
};

export const Dashboard: React.FC = () => {
    const { documents, canvases, diagrams, loading, refetch } = useDocuments();
    const [deleteTarget, setDeleteTarget] = useState<{ type: ItemType; id: string } | null>(null);
    const [creating, setCreating] = useState<ItemType | null>(null);
    const navigate = useNavigate();

    const handleNew = async (type: ItemType) => {
        setCreating(type);
        try {
            const { prefix, nav } = TYPE_META[type];
            const item = await api.post<Document | Canvas | Diagram>(prefix, {});
            navigate(`${nav}${item.id}`);
        } finally {
            setCreating(null);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await api.delete(`${TYPE_META[deleteTarget.type].prefix}/${deleteTarget.id}`);
        setDeleteTarget(null);
        refetch();
    };

    const allItems = [
        ...documents.map(i => ({ ...i, _type: 'document' as ItemType })),
        ...canvases.map(i => ({ ...i, _type: 'canvas' as ItemType })),
        ...diagrams.map(i => ({ ...i, _type: 'diagram' as ItemType })),
    ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const Section = ({
        type, items,
    }: {
        type: ItemType;
        items: { id: string; title: string; updatedAt: string }[];
    }) => {
        const { label, icon: Icon, nav } = TYPE_META[type];
        return (
            <div className="mb-8">
                {/* section header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-hiku-accent text-xs font-mono">// </span>
                        <Icon size={13} className="text-hiku-muted" />
                        <span className="font-mono text-xs text-hiku-cream-dim uppercase tracking-wider">{label}</span>
                        <span className="font-mono text-2xs text-hiku-pine bg-hiku-surface2 border border-hiku-border px-1.5 py-0.5 rounded-sm">
                            {items.length}
                        </span>
                    </div>
                    <Button
                        variant="ghost" size="xs"
                        icon={<Plus size={11} />}
                        onClick={() => handleNew(type)}
                        loading={creating === type}
                    >
                        new
                    </Button>
                </div>

                {items.length === 0 ? (
                    <button
                        className="w-full border border-dashed border-hiku-border/50 hover:border-hiku-accent/40 rounded p-6 sm:p-8 text-center transition-colors group"
                        onClick={() => handleNew(type)}
                    >
                        <Plus size={16} className="text-hiku-pine group-hover:text-hiku-accent mx-auto mb-2 transition-colors" />
                        <p className="font-mono text-xs text-hiku-pine group-hover:text-hiku-muted transition-colors">
                            no {label} yet — create one
                        </p>
                    </button>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="group relative bg-hiku-surface border border-hiku-border hover:border-hiku-border-light rounded p-3 cursor-pointer transition-all"
                                onClick={() => navigate(`${nav}${item.id}`)}
                            >
                                {/* accent bar */}
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-hiku-accent/0 group-hover:bg-hiku-accent/60 rounded-l transition-all" />

                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <p className="font-mono text-xs text-hiku-cream font-medium truncate leading-relaxed">
                                        {item.title}
                                    </p>
                                    {/* actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        <button
                                            className="p-1 text-hiku-muted hover:text-hiku-cream transition-colors"
                                            onClick={(e) => { e.stopPropagation(); navigate(`${nav}${item.id}`); }}
                                        >
                                            <ExternalLink size={11} />
                                        </button>
                                        <button
                                            className="p-1 text-hiku-muted hover:text-hiku-danger transition-colors"
                                            onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type, id: item.id }); }}
                                        >
                                            <Trash2 size={11} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 text-hiku-pine">
                                    <Clock size={9} />
                                    <span className="font-mono text-2xs">{formatRelative(item.updatedAt)}</span>
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

                {/* recent activity header */}
                <div className="mb-6 pb-4 border-b border-hiku-border/50">
                    <p className="font-mono text-2xs text-hiku-moss uppercase tracking-widest mb-1">
                        <span className="text-hiku-accent">$ </span>ls -la ./workspace
                    </p>
                    <p className="font-mono text-xs text-hiku-pine">
                        {allItems.length} item{allItems.length !== 1 ? 's' : ''} total
                        {allItems[0] && ` — last modified ${formatRelative(allItems[0].updatedAt)}`}
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center gap-2 text-hiku-muted">
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

            {/* Delete modal */}
            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="confirm_delete" size="sm">
                <p className="font-mono text-xs text-hiku-cream-dim mb-1">
                    this action cannot be undone.
                </p>
                <p className="font-mono text-2xs text-hiku-muted mb-5">
                    <span className="text-hiku-danger">✗ </span>
                    the {deleteTarget?.type} will be permanently deleted.
                </p>
                <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>cancel</Button>
                    <Button variant="danger" size="sm" onClick={handleDelete}>delete</Button>
                </div>
            </Modal>
        </Layout>
    );
};
