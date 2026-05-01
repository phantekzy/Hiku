import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export const DecisionNode = memo(({ data, selected }: NodeProps) => (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 80 }}>
        <Handle type="target" position={Position.Top} className="!bg-violet-400 !z-10" />
        <svg
            width="140" height="80" viewBox="0 0 140 80"
            className="absolute inset-0"
        >
            <polygon
                points="70,4 136,40 70,76 4,40"
                fill={selected ? 'rgba(124,58,237,0.25)' : 'rgba(26,26,53,1)'}
                stroke={selected ? '#7c3aed' : '#1e1e3a'}
                strokeWidth="2"
            />
        </svg>
        <p className="relative z-10 text-xs font-medium text-hiku-text text-center px-4 leading-tight">
            {String(data.label)}
        </p>
        <Handle type="source" position={Position.Bottom} className="!bg-violet-400 !z-10" />
        <Handle type="source" position={Position.Right} id="yes" className="!bg-green-400 !z-10" />
        <Handle type="source" position={Position.Left} id="no" className="!bg-red-400  !z-10" />
    </div>
));

DecisionNode.displayName = 'DecisionNode';
