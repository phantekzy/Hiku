import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { PaintCanvas } from '../components/canvas/PaintCanvas';
import { Button } from '../components/ui/Button';
import { api } from '../lib/api';
import type { Canvas } from '../types';

export const PaintPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (!id) return;
        api.get<Canvas>(`/canvases/${id}`).then((c) => {
            setCanvas(c);
            setTitle(c.title);
        }).finally(() => setLoading(false));
    }, [id]);

    const handleSave = useCallback(
        async (data: Record<string, unknown>) => {
            if (!id) return;
            await api.patch(`/canvases/${id}`, { data });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        },
        [id]
    );

    const handleTitleBlur = async () => {
        if (!id || title === canvas?.title) return;
        await api.patch(`/canvases/${id}`, { title });
        setCanvas((c) => c ? { ...c, title } : c);
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

    if (!canvas) return null;

    return (
        <Layout
            title={undefined}
            headerActions={
                <div className="flex items-center gap-2">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleTitleBlur}
                        className="bg-transparent border-none outline-none text-sm font-medium text-hiku-text placeholder:text-hiku-muted/40 w-40"
                        placeholder="Canvas title"
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
                <PaintCanvas
                    initialData={canvas.data as Record<string, unknown>}
                    onSave={handleSave}
                />
            </div>
        </Layout>
    );
};
