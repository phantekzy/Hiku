import React, { useCallback, useRef } from 'react';
import {
    ReactFlow, Background, Controls, MiniMap,
    addEdge, useNodesState, useEdgesState,
    type Connection, type Node, type Edge,
    BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ProcessNode } from './nodes/ProcessNode';
import { DecisionNode } from './nodes/DecisionNode';
import { TerminalNode } from './nodes/TerminalNode';
import { DiagramSidebar } from './DiagramSidebar';
import { generateId } from '../../lib/utils';
import type { DiagramNode, DiagramEdge } from '../../types';

const nodeTypes = {
    process: ProcessNode,
    decision: DecisionNode,
    terminal: TerminalNode,
};

interface DiagramEditorProps {
    initialNodes?: DiagramNode[];
    initialEdges?: DiagramEdge[];
    onSave?: (data: { nodes: Node[]; edges: Edge[] }) => void;
}

export const DiagramEditor: React.FC<DiagramEditorProps> = ({
    initialNodes = [],
    initialEdges = [],
    onSave,
}) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as Node[]);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges as Edge[]);
    const saveTimer = useRef<ReturnType<typeof setTimeout>>();

    const triggerSave = useCallback(
        (ns: Node[], es: Edge[]) => {
            clearTimeout(saveTimer.current);
            saveTimer.current = setTimeout(() => onSave?.({ nodes: ns, edges: es }), 1500);
        },
        [onSave]
    );

    const onConnect = useCallback(
        (params: Connection) => {
            const newEdges = addEdge(
                { ...params, animated: true, style: { stroke: '#7c3aed', strokeWidth: 2 } },
                edges
            );
            setEdges(newEdges);
            triggerSave(nodes, newEdges);
        },
        [edges, nodes, setEdges, triggerSave]
    );

    const handleAddNode = useCallback(
        (type: 'process' | 'decision' | 'terminal') => {
            const labels = { process: 'New Step', decision: 'Decision?', terminal: 'Start' };
            const newNode: Node = {
                id: generateId(),
                type,
                position: { x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 },
                data: { label: labels[type] },
            };
            const newNodes = [...nodes, newNode];
            setNodes(newNodes);
            triggerSave(newNodes, edges);
        },
        [nodes, edges, setNodes, triggerSave]
    );

    return (
        <div className="flex h-full">
            <DiagramSidebar onAddNode={handleAddNode} />
            <div className="flex-1">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    snapToGrid
                    snapGrid={[15, 15]}
                    defaultEdgeOptions={{
                        animated: true,
                        style: { stroke: '#7c3aed', strokeWidth: 2 },
                    }}
                >
                    <Background variant={BackgroundVariant.Dots} color="#1e1e3a" gap={20} />
                    <Controls />
                    <MiniMap
                        nodeColor={(n) => {
                            if (n.type === 'decision') return '#7c3aed';
                            if (n.type === 'terminal') return '#6d28d9';
                            return '#1a1a35';
                        }}
                    />
                </ReactFlow>
            </div>
        </div>
    );
};
