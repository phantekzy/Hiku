import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';

import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { DevEditorPage } from './pages/DevEditorPage';
import { PaintPage } from './pages/PaintPage';
import { DiagramPage } from './pages/DiagramPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token } = useStore();
    return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token } = useStore();
    return token ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

export const App: React.FC = () => (
    <BrowserRouter>
        <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

            {/* Protected */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/editor" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/editor/:id" element={<ProtectedRoute><DevEditorPage /></ProtectedRoute>} />
            <Route path="/paint" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/paint/:id" element={<ProtectedRoute><PaintPage /></ProtectedRoute>} />
            <Route path="/diagram" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/diagram/:id" element={<ProtectedRoute><DiagramPage /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
);
