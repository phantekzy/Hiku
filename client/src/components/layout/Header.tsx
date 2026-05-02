import React, { useState } from 'react';
import { Menu, LogOut, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface HeaderProps {
    title?: string;
    actions?: React.ReactNode;
    onMobileMenuOpen?: () => void;
    showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    actions,
    onMobileMenuOpen,
    showBack = false,
}) => {
    const { toggleSidebar } = useStore();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [confirmLogout, setConfirmLogout] = useState(false);

    return (
        <>
            <header className="h-14 flex items-center justify-between px-3 sm:px-4 border-b border-hiku-border bg-hiku-surface flex-shrink-0">

                <div className="flex items-center gap-2 min-w-0">
                    <button
                        className="sm:hidden p-1.5 text-hiku-muted hover:text-hiku-cream transition-colors rounded-sm"
                        onClick={onMobileMenuOpen}
                        title="menu"
                    >
                        <Menu size={16} />
                    </button>

                    <button
                        className="hidden sm:flex p-1.5 text-hiku-muted hover:text-hiku-cream transition-colors rounded-sm"
                        onClick={toggleSidebar}
                        title="toggle sidebar"
                    >
                        <Menu size={15} />
                    </button>

                    {showBack && (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-1.5 px-2 py-1 text-hiku-muted hover:text-hiku-cream transition-colors font-mono text-xs rounded-sm hover:bg-hiku-surface2 border border-transparent hover:border-hiku-border"
                            title="back to dashboard"
                        >
                            <ArrowLeft size={13} />
                            <span className="hidden sm:inline">dashboard</span>
                        </button>
                    )}

                    {title && (
                        <div className="flex items-center gap-1.5 min-w-0 ml-1">
                            <span className="text-hiku-accent text-xs font-mono">▋</span>
                            <h1 className="text-xs font-mono text-hiku-cream-dim truncate max-w-[140px] sm:max-w-xs">
                                {title}
                            </h1>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1.5">
                    {actions}

                    <div className="flex items-center gap-1.5 pl-2 border-l border-hiku-border/50">
                        <div className="hidden sm:flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-sm bg-hiku-surface2 border border-hiku-border flex items-center justify-center">
                                <User size={11} className="text-hiku-accent" />
                            </div>
                            <span className="text-2xs font-mono text-hiku-muted">{user?.username}</span>
                        </div>

                        <button
                            onClick={() => setConfirmLogout(true)}
                            title="sign out"
                            className="p-1.5 text-hiku-muted hover:text-hiku-danger transition-colors rounded-sm hover:bg-hiku-danger-muted/10"
                        >
                            <LogOut size={13} />
                        </button>
                    </div>
                </div>
            </header>

            <Modal
                open={confirmLogout}
                onClose={() => setConfirmLogout(false)}
                title="confirm_signout"
                size="sm"
            >
                <p className="font-mono text-xs text-hiku-cream-dim mb-1">
                    are you sure you want to sign out?
                </p>
                <p className="font-mono text-2xs text-hiku-muted mb-5">
                    <span className="text-hiku-moss">// </span>
                    your work is saved automatically.
                </p>
                <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setConfirmLogout(false)}>
                        cancel
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => { setConfirmLogout(false); logout(); }}
                    >
                        sign_out
                    </Button>
                </div>
            </Modal>
        </>
    );
};
