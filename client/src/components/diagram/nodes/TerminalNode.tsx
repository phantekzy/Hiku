import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export const TerminalNode = memo(({ data, selected }: NodeProps) => (
    <div
        className={`px-5 py-2.5 min-w-[130px] text-center rounded-full border-2 transition-colors ${selected
                ? 'border-hiku-accent bg-hiku-accent text-white'
                : 'border-hiku-accent/50 bg-hiku-accent/10 text-hiku-accent'
            }`}
    >
        <Handle type="target" position={Position.Top} className="!bg-hiku-accent" />
        <p className="text-sm font-semibold">{String(data.label)}</p>
        <Handle type="source" position={Position.Bottom} className="!bg-hiku-accent" />
    </div>
));

TerminalNode.displayName = 'TerminalNode';
