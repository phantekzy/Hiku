import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export const ProcessNode = memo(({ data, selected }: NodeProps) => (
    <div
        className={`px-4 py-2.5 min-w-[140px] text-center rounded-lg border-2 transition-colors ${selected
                ? 'border-hiku-accent bg-hiku-accent/20'
                : 'border-hiku-border bg-hiku-surface2'
            }`}
    >
        <Handle type="target" position={Position.Top} className="!bg-hiku-accent" />
        <p className="text-sm font-medium text-hiku-text">{String(data.label)}</p>
        <Handle type="source" position={Position.Bottom} className="!bg-hiku-accent" />
        <Handle type="source" position={Position.Right} id="right" className="!bg-hiku-accent" />
        <Handle type="target" position={Position.Left} id="left" className="!bg-hiku-accent" />
    </div>
));

ProcessNode.displayName = 'ProcessNode';
