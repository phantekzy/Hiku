import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.email, form.password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-hiku-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-hiku-accent flex items-center justify-center shadow-lg shadow-hiku-accent/30">
                        <Zap size={22} className="text-white" />
                    </div>
                    <span className="text-3xl font-bold text-hiku-text tracking-tight">hiku</span>
                </div>

                <div className="bg-hiku-surface border border-hiku-border rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-hiku-text mb-1">Welcome back</h2>
                    <p className="text-hiku-muted text-sm mb-6">Sign in to your workspace</p>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            leftIcon={<Mail size={15} />}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                            leftIcon={<Lock size={15} />}
                            required
                        />
                        <Button type="submit" className="w-full" loading={loading} size="lg">
                            Sign In
                        </Button>
                    </form>

                    <p className="text-center text-sm text-hiku-muted mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-hiku-accent hover:text-violet-400 font-medium">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
