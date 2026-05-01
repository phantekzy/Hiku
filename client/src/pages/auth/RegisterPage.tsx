import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
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
        <div className="min-h-screen bg-hiku-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Terminal Style Logo */}
                <div className="flex items-center justify-center mb-10 font-mono">
                    <span className="text-hiku-moss text-3xl font-bold mr-4">{">"}</span>
                    <span className="text-4xl font-bold text-hiku-cream tracking-tight">hiku</span>
                    <span className="w-4 h-9 bg-hiku-accent animate-blink ml-2 inline-block"></span>
                </div>

                {/* Systems Card */}
                <div className="bg-hiku-surface border border-hiku-border p-8 relative shadow-glow-sm">
                    {/* Minimalist corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-hiku-accent"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-hiku-accent"></div>

                    <h2 className="text-2xl font-bold text-hiku-cream mb-1 font-mono">Create account</h2>
                    <p className="text-hiku-muted text-sm mb-8 font-mono">Start your creative workspace</p>

                    {error && (
                        <div className="mb-6 p-3 bg-hiku-danger-muted/20 border border-hiku-danger text-hiku-cream text-sm font-mono">
                            [ERROR]: {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 font-mono">
                        <Input
                            label="Username"
                            type="text"
                            placeholder="yourname"
                            value={form.username}
                            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                            leftIcon={<User size={15} className="text-hiku-muted" />}
                            hint="3–20 characters, letters numbers and underscores"
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            leftIcon={<Mail size={15} className="text-hiku-muted" />}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="At least 6 characters"
                            value={form.password}
                            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                            leftIcon={<Lock size={15} className="text-hiku-muted" />}
                            required
                        />
                        <Button type="submit" className="w-full mt-4" loading={loading} size="lg">
                            Create Account
                        </Button>
                    </form>

                    <p className="text-center text-sm text-hiku-muted mt-8 font-mono">
                        Already have an account?{' '}
                        <Link to="/login" className="text-hiku-accent hover:text-hiku-accent-bright font-medium underline decoration-hiku-moss underline-offset-4 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
