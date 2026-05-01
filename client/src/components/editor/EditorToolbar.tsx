import React from 'react';
import type { Editor } from '@tiptap/react';
import {
    Bold, Italic, Code, Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Minus, Link2, Highlighter,
    Undo, Redo, Terminal,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Tooltip } from '../ui/Tooltip';

interface ToolbarButtonProps {
    onClick: () => void;
    active?: boolean;
    tooltip: string;
    icon: React.ReactNode;
    disabled?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
    onClick, active, tooltip, icon, disabled,
}) => (
    <Tooltip content={tooltip}>
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'p-1.5 rounded-md text-hiku-muted hover:text-hiku-text hover:bg-hiku-surface2 transition-colors',
                active && 'bg-hiku-accent/20 text-hiku-accent',
                disabled && 'opacity-40 cursor-not-allowed'
            )}
        >
            {icon}
        </button>
    </Tooltip>
);

const Divider = () => (
    <div className="w-px h-5 bg-hiku-border mx-1" />
);

interface EditorToolbarProps {
    editor: Editor;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
    const setLink = () => {
        const url = window.prompt('Enter URL');
        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    return (
        <div className="flex items-center flex-wrap gap-0.5 px-4 py-2 border-b border-hiku-border bg-hiku-surface">
            {/* Undo/Redo */}
            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                tooltip="Undo (Ctrl+Z)"
                icon={<Undo size={15} />}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                tooltip="Redo (Ctrl+Shift+Z)"
                icon={<Redo size={15} />}
            />
            <Divider />

            {/* Headings */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                active={editor.isActive('heading', { level: 1 })}
                tooltip="Heading 1"
                icon={<Heading1 size={15} />}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor.isActive('heading', { level: 2 })}
                tooltip="Heading 2"
                icon={<Heading2 size={15} />}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                active={editor.isActive('heading', { level: 3 })}
                tooltip="Heading 3"
                icon={<Heading3 size={15} />}
            />
            <Divider />

            {/* Inline marks */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive('bold')}
                tooltip="Bold (Ctrl+B)"
                icon={<Bold size={15} />}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive('italic')}
                tooltip="Italic (Ctrl+I)"
                icon={<Italic size={15} />}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                active={editor.isActive('code')}
                tooltip="Inline Code (Ctrl+E)"
                icon={<Code size={15} />}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                active={editor.isActive('highlight')}
                tooltip="Highlight"
                icon={<Highlighter size={15} />}
            />
            <Divider />

            {/* Blocks */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive('bulletList')}
                tooltip="Bullet List"
                icon={<List size={15} />}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive('orderedList')}
                tooltip="Numbered List"
                icon={<ListOrdered size={15} />}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive('blockquote')}
                tooltip="Blockquote"
                icon={<Quote size={15} />}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                active={editor.isActive('codeBlock')}
                tooltip="Code Block (Ctrl+Alt+C)"
                icon={<Terminal size={15} />}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                tooltip="Horizontal Rule"
                icon={<Minus size={15} />}
            />
            <Divider />

            {/* Link */}
            <ToolbarButton
                onClick={setLink}
                active={editor.isActive('link')}
                tooltip="Add Link"
                icon={<Link2 size={15} />}
            />
        </div>
    );
};
