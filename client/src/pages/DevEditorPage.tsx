import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Check } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { DevEditor } from '../components/editor/DevEditor';
import { Button } from '../components/ui/Button';
import { api } from '../lib/api';
import type { Document } from '../types';

export const DevEditorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [doc, setDoc] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (!id) return;
        api.get<Document>(`/documents/${id}`).then((d) => {
            setDoc(d);
            setTitle(d.title);
        }).finally(() => setLoading(false));
    }, [id]);

    const handleSaveContent = useCallback(
        async (content: Record<string, unknown>) => {
            if (!id) return;
            await api.patch(`/documents/${id}`, { content });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        },
        [id]
    );

    const handleTitleBlur = async () => {
        if (!id || title === doc?.title) return;
        await api.patch(`/documents/${id}`, { title });
        setDoc((d) => d ? { ...d, title } : d);
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

    if (!doc) {
        return (
            <Layout title="Not Found">
                <div className="flex flex-col items-center justify-center h-full gap-4">
                    <p className="text-hiku-muted">Document not found</p>
                    <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout
            headerActions={
                <div className="flex items-center gap-2">
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
            <div className="flex flex-col h-full">
                {/* Editable title */}
                <div className="px-12 pt-8 pb-2 max-w-3xl mx-auto w-full">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleTitleBlur}
                        placeholder="Untitled Document"
                        className="w-full text-3xl font-bold bg-transparent border-none outline-none text-hiku-text placeholder:text-hiku-muted/40"
                    />
                </div>

                {/* Editor */}
                <div className="flex-1 overflow-hidden">
                    <DevEditor
                        content={doc.content as Record<string, unknown>}
                        onSave={handleSaveContent}
                    />
                </div>
            </div>
        </Layout>
    );
};
