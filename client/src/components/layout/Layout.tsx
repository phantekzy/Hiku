import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    headerActions?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, headerActions }) => {
    return (
        <div className="flex h-screen bg-hiku-bg overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0">
                <Header title={title} actions={headerActions} />
                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    );
};
