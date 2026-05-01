import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    side?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, side = 'top' }) => {
    const [visible, setVisible] = useState(false);

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
        left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
        right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
    };

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div
                    className={cn(
                        'absolute z-50 px-2 py-1 text-xs font-medium text-white',
                        'bg-gray-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none',
                        'animate-fade-in',
                        positions[side]
                    )}
                >
                    {content}
                </div>
            )}
        </div>
    );
};
