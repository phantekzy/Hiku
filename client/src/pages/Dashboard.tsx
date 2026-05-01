import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, Paintbrush, Workflow, Plus,
    Clock, Trash2, ExternalLink,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useDocuments } from '../hooks/useDocuments';
import { api } from '../lib/api';
import { formatRelative } from '../lib/utils';
import type { Document, Canvas, Diagram } from '../types';

export const Dashboard: React.FC = () => {
    const { documents, canvases, diagrams, loading, refetch } = useDocuments();
    const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const routes: Record<string, string> = {
            document: '/documents',
            canvas: '/canvases',
            diagram: '/diagrams',
        };
        await api.delete(`${routes[deleteTarget.type]}/${deleteTarget.id}`);
        setDeleteTarget(null);
        refetch();
    };

    const handleNew = async (type: 'document' | 'canvas' | 'diagram') => {
        const routes = {
            document: { api: '/documents', nav: '/editor/' },
            canvas: { api: '/canvases', nav: '/paint/' },
            diagram: { api: '/diagrams', nav: '/diagram/' },
        };
        const r = routes[type];
        const item = await api.post<Document | Canvas | Diagram>(r.api, {});
        navigate(`${r.nav}${item.id}`);
    };

    const Section = <T extends { id: string; title: string; updatedAt: string }>({
        title, icon, items, itemType, navPrefix,
    }: {
        title: string;
        icon: React.ReactNode;
        items: T[];
        itemType: string;
        navPrefix: string;
    }) => (
        <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-hiku-text font-semibold">
                    {icon}
                    <span>{title}</span>
                    <span className="text-xs text-hiku-muted bg-hiku-surface2 px-2 py-0.5 rounded-full">
                        {items.length}
                    </span>
                </div>
                <Button
                    size="sm"
                    variant="ghost"
                    icon={<Plus size={14} />}
                    onClick={() => handleNew(itemType as 'document' | 'canvas' | 'diagram')}
                >
                    New
                </Button>
            </div>

            {items.length === 0 ? (
                <div
                    className="border-2 border-dashed border-hiku-border rounded-xl p-8 text-center cursor-pointer hover:border-hiku-accent/50 transition-colors group"
                    onClick={() => handleNew(itemType as 'document' | 'canvas' | 'diagram')}
                >
                    <p className="text-hiku-muted text-sm group-hover:text-hiku-text transition-colors">
                        No {title.toLowerCase()} yet — click to create one
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="group relative p-4 bg-hiku-surface border border-hiku-border rounded-xl hover:border-hiku-accent/50 transition-all cursor-pointer"
                            onClick={() => navigate(`${navPrefix}${item.id}`)}
                        >
                            <p className="font-medium text-sm text-hiku-text truncate mb-2">{item.title}</p>
                            <div className="flex items-center gap-1 text-xs text-hiku-muted">
                                <Clock size={10} />
                                <span>{formatRelative(item.updatedAt)}</span>
                            </div>
                            <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                                <button
                                    className="p-1 rounded-md hover:bg-hiku-border text-hiku-muted hover:text-hiku-text transition-colors"
                                    onClick={(e) => { e.stopPropagation(); navigate(`${navPrefix}${item.id}`); }}
                                >
                                    <ExternalLink size={12} />
                                </button>
                                <button
                                    className="p-1 rounded-md hover:bg-red-500/20 text-hiku-muted hover:text-red-400 transition-colors"
                                    onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: itemType, id: item.id }); }}
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );

    return (
        <Layout title="Dashboard">
            <div className="max-w-6xl mx-auto p-8">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-hiku-accent border-t-transparent" />
                    </div>
                ) : (
                    <>
                        <Section
                            title="Documents"
                            icon={<FileText size={16} />}
                            items={documents}
                            itemType="document"
                            navPrefix="/editor/"
                        />
                        <Section
                            title="Canvases"
                            icon={<Paintbrush size={16} />}
                            items={canvases}
                            itemType="canvas"
                            navPrefix="/paint/"
                        />
                        <Section
                            title="Diagrams"
                            icon={<Workflow size={16} />}
                            items={diagrams}
                            itemType="diagram"
                            navPrefix="/diagram/"
                        />
                    </>
                )}
            </div>

            {/* Delete confirmation */}
            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Item" size="sm">
                <p className="text-hiku-muted text-sm mb-6">
                    Are you sure? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </div>
            </Modal>
        </Layout>
    );
};
