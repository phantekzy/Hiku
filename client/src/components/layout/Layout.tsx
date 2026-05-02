import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    headerActions?: React.ReactNode;
    showBack?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    title,
    headerActions,
    showBack = false,
}) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-hiku-bg overflow-hidden">
            <Sidebar
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Header
                    title={title}
                    actions={headerActions}
                    onMobileMenuOpen={() => setMobileOpen(true)}
                    showBack={showBack}
                />
                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    );
};
