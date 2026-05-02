import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const RegisterPage: React.FC = () => {
    const { register } = useAuth();
    const [form, setForm] = useState({ email: '', username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(form.email, form.username, form.password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-hiku-bg flex flex-col">

            <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-hiku-border">
                <Link
                    to="/"
                    className="flex items-center gap-2 font-mono text-xs text-hiku-muted hover:text-hiku-cream transition-colors group"
                >
                    <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span>back_to_home</span>
                </Link>
                <span className="font-mono font-bold text-hiku-cream text-base tracking-tighter">
                    hiku<span className="text-hiku-accent animate-blink">▋</span>
                </span>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-sm">

                    <div className="mb-8">
                        <p className="font-mono text-2xs text-hiku-moss mb-3">
                            <span className="text-hiku-accent">$ </span>hiku auth --register
                        </p>
                        <h1 className="font-mono font-bold text-2xl text-hiku-cream tracking-tight mb-1">
                            Create account
                        </h1>
                        <p className="font-mono text-xs text-hiku-muted">
                            start your creative workspace
                        </p>
                    </div>

                    <div className="bg-hiku-surface border border-hiku-border p-6 relative">
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-hiku-accent" />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-hiku-accent" />

                        {error && (
                            <div className="mb-5 px-3 py-2.5 bg-hiku-danger-muted/20 border border-hiku-danger/50 font-mono text-xs text-hiku-cream flex items-start gap-2">
                                <span className="text-hiku-danger mt-0.5 flex-shrink-0">✗</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Username"
                                type="text"
                                placeholder="yourname"
                                value={form.username}
                                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                                leftIcon={<User size={14} />}
                                hint="3–20 chars, letters numbers underscores"
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                leftIcon={<Mail size={14} />}
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="at least 6 characters"
                                value={form.password}
                                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                                leftIcon={<Lock size={14} />}
                                required
                            />
                            <Button
                                type="submit"
                                className="w-full mt-2"
                                loading={loading}
                                size="md"
                            >
                                create_account →
                            </Button>
                        </form>

                        <div className="mt-5 pt-4 border-t border-hiku-border/50">
                            <p className="font-mono text-xs text-hiku-muted text-center">
                                already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="text-hiku-accent hover:text-hiku-accent-bright transition-colors underline underline-offset-3 decoration-hiku-moss"
                                >
                                    sign_in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
