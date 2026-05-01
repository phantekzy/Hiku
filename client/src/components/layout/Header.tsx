import React from 'react';
import { Menu, Bell, LogOut, User } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';

interface HeaderProps {
    title?: string;
    actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, actions }) => {
    const { toggleSidebar } = useStore();
    const { user, logout } = useAuth();

    return (
        <header className="h-14 flex items-center justify-between px-4 border-b border-hiku-border bg-hiku-surface/80 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="xs" onClick={toggleSidebar}>
                    <Menu size={18} />
                </Button>
                {title && (
                    <h1 className="text-sm font-semibold text-hiku-text truncate max-w-xs">{title}</h1>
                )}
            </div>

            <div className="flex items-center gap-2">
                {actions}
                <Tooltip content="Notifications">
                    <Button variant="ghost" size="xs">
                        <Bell size={16} />
                    </Button>
                </Tooltip>
                <div className="flex items-center gap-2 pl-2 border-l border-hiku-border">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-7 h-7 rounded-full bg-hiku-accent/30 border border-hiku-accent/50 flex items-center justify-center">
                            <User size={14} className="text-hiku-accent" />
                        </div>
                        <span className="text-hiku-muted hidden sm:block">{user?.username}</span>
                    </div>
                    <Tooltip content="Sign out">
                        <Button variant="ghost" size="xs" onClick={logout}>
                            <LogOut size={16} />
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </header>
    );
};
