import React from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

interface HeaderProps {
    title?: string;
    actions?: React.ReactNode;
    onMobileMenuOpen?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, actions, onMobileMenuOpen }) => {
    const { toggleSidebar } = useStore();
    const { user, logout } = useAuth();

    return (
        <header className="h-14 flex items-center justify-between px-3 sm:px-4 border-b border-hiku-border bg-hiku-surface flex-shrink-0">

            {/* Left: hamburger + title */}
            <div className="flex items-center gap-2 min-w-0">
                {/* Mobile hamburger */}
                <button
                    className="sm:hidden p-1.5 text-hiku-muted hover:text-hiku-cream transition-colors"
                    onClick={onMobileMenuOpen}
                >
                    <Menu size={18} />
                </button>

                {/* Desktop sidebar toggle */}
                <button
                    className="hidden sm:flex p-1.5 text-hiku-muted hover:text-hiku-cream transition-colors"
                    onClick={toggleSidebar}
                >
                    <Menu size={16} />
                </button>

                {title && (
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-hiku-accent text-xs font-mono">▋</span>
                        <h1 className="text-xs font-mono font-medium text-hiku-cream-dim truncate">{title}</h1>
                    </div>
                )}
            </div>

            {/* Right: actions + user */}
            <div className="flex items-center gap-1.5 sm:gap-2">
                {actions}

                <div className="flex items-center gap-1.5 pl-2 border-l border-hiku-border/50 ml-1">
                    <div className="hidden sm:flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-sm bg-hiku-surface2 border border-hiku-border flex items-center justify-center">
                            <User size={11} className="text-hiku-accent" />
                        </div>
                        <span className="text-2xs font-mono text-hiku-muted">{user?.username}</span>
                    </div>
                    <Button variant="ghost" size="xs" onClick={logout} title="Sign out">
                        <LogOut size={13} />
                    </Button>
                </div>
            </div>
        </header>
    );
};
