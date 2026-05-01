import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import type { Node, Edge } from '@xyflow/react';
import { Layout } from '../components/layout/Layout';
import { DiagramEditor } from '../components/diagram/DiagramEditor';
import { Button } from '../components/ui/Button';
import { api } from '../lib/api';
import type { Diagram } from '../types';

export const DiagramPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [diagram, setDiagram] = useState<Diagram | null>(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (!id) return;
        api.get<Diagram>(`/diagrams/${id}`).then((d) => {
            setDiagram(d);
            setTitle(d.title);
        }).finally(() => setLoading(false));
    }, [id]);

    const handleSave = useCallback(
        async (data: { nodes: Node[]; edges: Edge[] }) => {
            if (!id) return;
            await api.patch(`/diagrams/${id}`, { data });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        },
        [id]
    );

    const handleTitleBlur = async () => {
        if (!id || title === diagram?.title) return;
        await api.patch(`/diagrams/${id}`, { title });
        setDiagram((d) => d ? { ...d, title } : d);
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-hiku-accent border-t-transparent" />
                </div>
            </Layout>
        );
    }

    if (!diagram) return null;

    return (
        <Layout
            headerActions={
                <div className="flex items-center gap-2">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleTitleBlur}
                        className="bg-transparent border-none outline-none text-sm font-medium text-hiku-text placeholder:text-hiku-muted/40 w-40"
                        placeholder="Diagram title"
                    />
                    {saved && (
                        <span className="flex items-center gap-1 text-xs text-green-400">
                            <Check size={12} /> Saved
                        </span>
                    )}
                    <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate('/dashboard')}>
                        Back
                    </Button>
                </div>
            }
        >
            <div className="h-full">
                <DiagramEditor
                    initialNodes={diagram.data?.nodes ?? []}
                    initialEdges={diagram.data?.edges ?? []}
                    onSave={handleSave}
                />
            </div>
        </Layout>
    );
};
