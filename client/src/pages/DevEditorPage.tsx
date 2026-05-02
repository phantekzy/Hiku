import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Download } from 'lucide-react';
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
        api.get<Document>(`/documents/${id}`)
            .then((d) => { setDoc(d); setTitle(d.title); })
            .catch(() => navigate('/dashboard'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const handleSaveContent = useCallback(async (content: Record<string, unknown>) => {
        if (!id) return;
        await api.patch(`/documents/${id}`, { content });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }, [id]);

    const handleTitleBlur = async () => {
        if (!id || title === doc?.title) return;
        await api.patch(`/documents/${id}`, { title });
        setDoc((d) => d ? { ...d, title } : d);
    };

    const handleExport = () => {
        if (!doc) return;

        const extractText = (node: Record<string, unknown>): string => {
            if (!node) return '';
            if (node.type === 'text') return (node.text as string) || '';

            const children = (node.content as Record<string, unknown>[]) || [];

            if (node.type === 'heading') {
                const level = (node.attrs as Record<string, unknown>)?.level || 1;
                const text = children.map(extractText).join('');
                return '\n' + '#'.repeat(Number(level)) + ' ' + text + '\n';
            }
            if (node.type === 'paragraph') return children.map(extractText).join('') + '\n\n';
            if (node.type === 'codeBlock') {
                const lang = (node.attrs as Record<string, unknown>)?.language || '';
                const text = children.map(extractText).join('');
                return `\`\`\`${lang}\n${text}\n\`\`\`\n\n`;
            }
            if (node.type === 'blockquote') return '> ' + children.map(extractText).join('') + '\n';
            if (node.type === 'bulletList') return children.map(extractText).join('');
            if (node.type === 'orderedList') return children.map(extractText).join('');
            if (node.type === 'listItem') return '- ' + children.map(extractText).join('') + '\n';
            if (node.type === 'horizontalRule') return '\n---\n\n';
            if (node.type === 'hardBreak') return '\n';

            return children.map(extractText).join('');
        };

        const content = doc.content as Record<string, unknown>;
        const markdown = content?.content
            ? (content.content as Record<string, unknown>[]).map(extractText).join('')
            : '';

        const blob = new Blob([`# ${doc.title}\n\n${markdown}`], { type: 'text/markdown' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${doc.title.replace(/\s+/g, '-').toLowerCase() || 'document'}.md`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    if (loading) {
        return (
            <Layout showBack>
                <div className="flex items-center justify-center h-full gap-2 text-hiku-muted">
                    <span className="w-3 h-3 border border-hiku-accent border-t-transparent rounded-full animate-spin" />
                    <span className="font-mono text-xs">loading...</span>
                </div>
            </Layout>
        );
    }

    if (!doc) return null;

    return (
        <Layout
            showBack
            headerActions={
                <div className="flex items-center gap-2">
                    {saved && (
                        <span className="flex items-center gap-1 font-mono text-2xs text-hiku-accent">
                            <Check size={11} /> saved
                        </span>
                    )}

                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleTitleBlur}
                        placeholder="untitled"
                        className="bg-transparent border-none outline-none font-mono text-xs text-hiku-cream-dim placeholder:text-hiku-moss w-32 sm:w-48 truncate"
                    />

                    <Button
                        variant="outline"
                        size="xs"
                        icon={<Download size={12} />}
                        onClick={handleExport}
                        title="export as markdown"
                    >
                        <span className="hidden sm:inline">export.md</span>
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col h-full">
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
