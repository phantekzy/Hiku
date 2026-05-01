import React, { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Typography from '@tiptap/extension-typography';
import { common, createLowlight } from 'lowlight';
import { EditorToolbar } from './EditorToolbar';
import { debounce } from '../../lib/utils';

const lowlight = createLowlight(common);

interface DevEditorProps {
    content?: Record<string, unknown>;
    onSave?: (content: Record<string, unknown>) => void;
    readOnly?: boolean;
}

export const DevEditor: React.FC<DevEditorProps> = ({
    content,
    onSave,
    readOnly = false,
}) => {
    const editor = useEditor({
        editable: !readOnly,
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            CodeBlockLowlight.configure({ lowlight }),
            Placeholder.configure({
                placeholder: 'Start writing… Use / for commands, ``` for code blocks',
            }),
            Highlight,
            Link.configure({ openOnClick: false }),
            Typography,
        ],
        content: content || '',
        editorProps: {
            attributes: {
                class: 'focus:outline-none',
            },
        },
    });

    const debouncedSave = useCallback(
        debounce((json: Record<string, unknown>) => {
            onSave?.(json);
        }, 1500),
        [onSave]
    );

    useEffect(() => {
        if (!editor || !onSave) return;
        const handler = () => {
            debouncedSave(editor.getJSON() as Record<string, unknown>);
        };
        editor.on('update', handler);
        return () => { editor.off('update', handler); };
    }, [editor, debouncedSave, onSave]);

    useEffect(() => {
        if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
            editor.commands.setContent(content);
        }
    }, [editor, content]);

    if (!editor) return null;

    return (
        <div className="flex flex-col h-full bg-hiku-bg">
            {!readOnly && <EditorToolbar editor={editor} />}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto tiptap-editor">
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    );
};
