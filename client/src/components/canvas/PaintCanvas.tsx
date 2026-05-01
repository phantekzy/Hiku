import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { CanvasToolbar, DrawingTool } from './CanvasToolbar';

interface PaintCanvasProps {
    initialData?: Record<string, unknown>;
    onSave?: (data: Record<string, unknown>) => void;
}

export const PaintCanvas: React.FC<PaintCanvasProps> = ({ initialData, onSave }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [tool, setTool] = useState<DrawingTool>('brush');
    const [brushSize, setBrushSize] = useState(4);
    const [color, setColor] = useState('#a78bfa');
    const [isFill, setIsFill] = useState(false);

    // Track shape drawing state
    const isDrawingShape = useRef(false);
    const shapeStartX = useRef(0);
    const shapeStartY = useRef(0);
    const activeShape = useRef<fabric.Object | null>(null);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const { offsetWidth: w, offsetHeight: h } = containerRef.current;

        const canvas = new fabric.Canvas(canvasRef.current, {
            backgroundColor: '#0d0d1a',
            width: w,
            height: h,
            selection: false,
        });

        fabricRef.current = canvas;

        // Load saved data
        if (initialData && Object.keys(initialData).length > 0) {
            canvas.loadFromJSON(initialData, () => canvas.renderAll());
        }

        return () => {
            canvas.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas || !onSave) return;

        let saveTimer: ReturnType<typeof setTimeout>;

        const triggerSave = () => {
            clearTimeout(saveTimer);
            saveTimer = setTimeout(() => {
                onSave(canvas.toJSON() as Record<string, unknown>);
            }, 2000);
        };

        canvas.on('object:modified', triggerSave);
        canvas.on('path:created', triggerSave);
        canvas.on('object:added', triggerSave);
        canvas.on('object:removed', triggerSave);

        return () => {
            clearTimeout(saveTimer);
            canvas.off('object:modified', triggerSave);
            canvas.off('path:created', triggerSave);
            canvas.off('object:added', triggerSave);
            canvas.off('object:removed', triggerSave);
        };
    }, [onSave]);

    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        // Reset all modes
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.off('mouse:down');
        canvas.off('mouse:move');
        canvas.off('mouse:up');
        canvas.getObjects().forEach((obj) => obj.set({ selectable: false, evented: false }));

        switch (tool) {
            case 'select':
                canvas.selection = true;
                canvas.getObjects().forEach((obj) => obj.set({ selectable: true, evented: true }));
                break;

            case 'brush':
                canvas.isDrawingMode = true;
                canvas.freeDrawingBrush.color = color;
                canvas.freeDrawingBrush.width = brushSize;
                break;

            case 'eraser':
                canvas.isDrawingMode = true;
                canvas.freeDrawingBrush.color = '#0d0d1a';
                canvas.freeDrawingBrush.width = brushSize * 2;
                break;

            case 'rect':
            case 'circle':
            case 'line':
                enableShapeDrawing(canvas, tool);
                break;

            case 'text':
                canvas.on('mouse:down', (opt) => {
                    const pointer = canvas.getPointer(opt.e as MouseEvent);
                    const text = new fabric.IText('Type here…', {
                        left: pointer.x,
                        top: pointer.y,
                        fill: color,
                        fontSize: 18,
                        fontFamily: 'JetBrains Mono',
                        selectable: true,
                        evented: true,
                    });
                    canvas.add(text);
                    canvas.setActiveObject(text);
                    text.enterEditing();
                    canvas.renderAll();
                });
                break;
        }

        canvas.renderAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tool, color, brushSize]);

    const enableShapeDrawing = (canvas: fabric.Canvas, currentTool: DrawingTool) => {
        canvas.on('mouse:down', (opt) => {
            const pointer = canvas.getPointer(opt.e as MouseEvent);
            isDrawingShape.current = true;
            shapeStartX.current = pointer.x;
            shapeStartY.current = pointer.y;

            const opts = {
                left: pointer.x,
                top: pointer.y,
                stroke: color,
                strokeWidth: brushSize,
                fill: isFill ? color : 'transparent',
                selectable: false,
                evented: false,
            };

            let shape: fabric.Object;
            if (currentTool === 'rect') shape = new fabric.Rect({ ...opts, width: 0, height: 0 });
            else if (currentTool === 'circle') shape = new fabric.Ellipse({ ...opts, rx: 0, ry: 0 });
            else shape = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], { ...opts, left: 0, top: 0 });

            activeShape.current = shape;
            canvas.add(shape);
        });

        canvas.on('mouse:move', (opt) => {
            if (!isDrawingShape.current || !activeShape.current) return;
            const pointer = canvas.getPointer(opt.e as MouseEvent);
            const sx = shapeStartX.current;
            const sy = shapeStartY.current;

            if (currentTool === 'rect') {
                const rect = activeShape.current as fabric.Rect;
                const w = Math.abs(pointer.x - sx);
                const h = Math.abs(pointer.y - sy);
                rect.set({
                    left: Math.min(sx, pointer.x),
                    top: Math.min(sy, pointer.y),
                    width: w, height: h,
                });
            } else if (currentTool === 'circle') {
                const ellipse = activeShape.current as fabric.Ellipse;
                ellipse.set({
                    rx: Math.abs(pointer.x - sx) / 2,
                    ry: Math.abs(pointer.y - sy) / 2,
                    left: Math.min(sx, pointer.x),
                    top: Math.min(sy, pointer.y),
                });
            } else {
                const line = activeShape.current as fabric.Line;
                line.set({ x2: pointer.x, y2: pointer.y });
            }

            canvas.renderAll();
        });

        canvas.on('mouse:up', () => {
            isDrawingShape.current = false;
            activeShape.current = null;
        });
    };

    const handleClear = useCallback(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        if (window.confirm('Clear the entire canvas?')) {
            canvas.clear();
            canvas.setBackgroundColor('#0d0d1a', () => canvas.renderAll());
        }
    }, []);

    const handleExport = useCallback(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'hiku-canvas.png';
        link.href = canvas.toDataURL({ format: 'png', multiplier: 2 });
        link.click();
    }, []);

    return (
        <div className="flex h-full">
            <CanvasToolbar
                activeTool={tool}
                onToolChange={setTool}
                brushSize={brushSize}
                onBrushSizeChange={setBrushSize}
                color={color}
                onColorChange={setColor}
                onClear={handleClear}
                onExport={handleExport}
                isFill={isFill}
                onFillToggle={() => setIsFill((f) => !f)}
            />
            <div
                ref={containerRef}
                className="flex-1 overflow-hidden bg-hiku-bg"
                style={{ cursor: tool === 'text' ? 'text' : tool === 'select' ? 'default' : 'crosshair' }}
            >
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};
