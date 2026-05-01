import React from 'react';
import {
    MousePointer, Pencil, Square, Circle, Minus,
    Type, Eraser, Trash2, Download, Palette, Bold,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Tooltip } from '../ui/Tooltip';

export type DrawingTool =
    | 'select' | 'brush' | 'eraser'
    | 'rect' | 'circle' | 'line' | 'text';

interface CanvasToolbarProps {
    activeTool: DrawingTool;
    onToolChange: (tool: DrawingTool) => void;
    brushSize: number;
    onBrushSizeChange: (size: number) => void;
    color: string;
    onColorChange: (color: string) => void;
    onClear: () => void;
    onExport: () => void;
    isFill: boolean;
    onFillToggle: () => void;
}

const TOOLS: { id: DrawingTool; icon: React.ReactNode; label: string }[] = [
    { id: 'select', icon: <MousePointer size={16} />, label: 'Select (V)' },
    { id: 'brush', icon: <Pencil size={16} />, label: 'Brush (B)' },
    { id: 'eraser', icon: <Eraser size={16} />, label: 'Eraser (E)' },
    { id: 'rect', icon: <Square size={16} />, label: 'Rectangle (R)' },
    { id: 'circle', icon: <Circle size={16} />, label: 'Circle (C)' },
    { id: 'line', icon: <Minus size={16} />, label: 'Line (L)' },
    { id: 'text', icon: <Type size={16} />, label: 'Text (T)' },
];

const PRESET_COLORS = [
    '#ffffff', '#e2e8f0', '#94a3b8',
    '#7c3aed', '#818cf8', '#38bdf8',
    '#34d399', '#fbbf24', '#f87171',
    '#0d0d1a', '#1a1a35', '#f472b6',
];

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
    activeTool, onToolChange,
    brushSize, onBrushSizeChange,
    color, onColorChange,
    onClear, onExport,
    isFill, onFillToggle,
}) => {
    return (
        <div className="flex flex-col gap-3 w-14 bg-hiku-surface border-r border-hiku-border p-2 items-center">
            {/* Tools */}
            <div className="flex flex-col gap-1">
                {TOOLS.map(({ id, icon, label }) => (
                    <Tooltip key={id} content={label} side="right">
                        <button
                            onClick={() => onToolChange(id)}
                            className={cn(
                                'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                                activeTool === id
                                    ? 'bg-hiku-accent text-white'
                                    : 'text-hiku-muted hover:bg-hiku-surface2 hover:text-hiku-text'
                            )}
                        >
                            {icon}
                        </button>
                    </Tooltip>
                ))}
            </div>

            <div className="w-full h-px bg-hiku-border" />

            {/* Fill toggle */}
            <Tooltip content={isFill ? 'Fill: On' : 'Fill: Off'} side="right">
                <button
                    onClick={onFillToggle}
                    className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                        isFill
                            ? 'bg-hiku-accent/30 text-hiku-accent'
                            : 'text-hiku-muted hover:bg-hiku-surface2'
                    )}
                >
                    <Bold size={16} />
                </button>
            </Tooltip>

            {/* Color picker */}
            <Tooltip content="Color" side="right">
                <label className="w-9 h-9 rounded-lg overflow-hidden cursor-pointer border-2 border-hiku-border hover:border-hiku-accent transition-colors flex-shrink-0">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="w-full h-full opacity-0 cursor-pointer absolute"
                    />
                    <div className="w-full h-full" style={{ backgroundColor: color }} />
                </label>
            </Tooltip>

            {/* Preset colors */}
            <div className="flex flex-col gap-1 items-center">
                {PRESET_COLORS.slice(0, 6).map((c) => (
                    <button
                        key={c}
                        onClick={() => onColorChange(c)}
                        className={cn(
                            'w-5 h-5 rounded-full border transition-transform hover:scale-110',
                            color === c ? 'border-white scale-110' : 'border-hiku-border'
                        )}
                        style={{ backgroundColor: c }}
                    />
                ))}
            </div>

            <div className="w-full h-px bg-hiku-border" />

            {/* Brush size */}
            <div className="flex flex-col items-center gap-1">
                <input
                    type="range"
                    min={1}
                    max={50}
                    value={brushSize}
                    onChange={(e) => onBrushSizeChange(Number(e.target.value))}
                    className="w-8 cursor-pointer accent-hiku-accent"
                    style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                />
                <span className="text-xs text-hiku-muted font-mono">{brushSize}</span>
            </div>

            <div className="w-full h-px bg-hiku-border" />

            {/* Actions */}
            <Tooltip content="Export PNG" side="right">
                <button
                    onClick={onExport}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-hiku-muted hover:bg-hiku-surface2 hover:text-hiku-text transition-colors"
                >
                    <Download size={16} />
                </button>
            </Tooltip>
            <Tooltip content="Clear Canvas" side="right">
                <button
                    onClick={onClear}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-hiku-muted hover:bg-red-500/20 hover:text-red-400 transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </Tooltip>
        </div>
    );
};
