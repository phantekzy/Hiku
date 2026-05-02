import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Paintbrush, Workflow, ArrowRight, Terminal, LayoutDashboard } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';

const FEATURES = [
    {
        cmd: 'hiku doc --new',
        title: 'Dev Editor',
        desc: 'Rich-text documentation with syntax-highlighted code blocks. Write technical content the way developers think.',
        icon: FileText,
        stat: '40+ languages',
    },
    {
        cmd: 'hiku canvas --open',
        title: 'Paint Canvas',
        desc: 'Professional vector drawing. Sketch wireframes, diagrams, and UI mockups. Export at 2× resolution.',
        icon: Paintbrush,
        stat: '7 drawing tools',
    },
    {
        cmd: 'hiku diagram --flow',
        title: 'Diagram Builder',
        desc: 'Node-based flowchart editor. Map system architecture, user flows, and process logic visually.',
        icon: Workflow,
        stat: 'drag & drop nodes',
    },
];

export const Home: React.FC = () => {
    const { token, user } = useStore();
    const isLoggedIn = !!token;

    return (
        <div className="min-h-screen bg-hiku-bg flex flex-col">

            <nav className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-hiku-border">
                <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-hiku-cream text-lg tracking-tighter">hiku</span>
                    <span className="text-hiku-accent text-xs animate-blink">▋</span>
                </div>

                <div className="flex items-center gap-2">
                    {isLoggedIn ? (
                        <>
                            <span className="hidden sm:block font-mono text-2xs text-hiku-muted">
                                <span className="text-hiku-moss">// </span>{user?.username}
                            </span>
                            <Link to="/dashboard">
                                <Button variant="primary" size="sm" icon={<LayoutDashboard size={13} />}>
                                    my_workspace
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" size="sm">sign_in</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="primary" size="sm">get_started</Button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <section className="flex-1 flex flex-col items-start justify-center px-4 sm:px-8 lg:px-16 py-16 sm:py-24 max-w-5xl mx-auto w-full">

                <div className="flex items-center gap-2 mb-6 sm:mb-8 bg-hiku-surface border border-hiku-border px-3 py-2 rounded-sm">
                    <Terminal size={13} className="text-hiku-accent flex-shrink-0" />
                    <span className="font-mono text-xs text-hiku-muted">~/workspace</span>
                    <span className="font-mono text-xs text-hiku-moss">$</span>
                    <span className="font-mono text-xs text-hiku-cream">hiku --init</span>
                    <span className="text-hiku-accent text-xs animate-blink ml-1">▋</span>
                </div>

                <h1
                    className="font-mono font-extrabold text-hiku-cream leading-[1.05] tracking-tight mb-6 sm:mb-8"
                    style={{ fontSize: 'clamp(2.8rem, 9vw, 5.5rem)' }}
                >
                    write.<br />
                    <span className="text-hiku-accent">draw.</span><br />
                    diagram.
                </h1>

                <p className="font-mono text-hiku-cream-dim text-sm sm:text-base max-w-lg mb-8 sm:mb-10 leading-relaxed border-l-2 border-hiku-border pl-4">
                    One workspace for developers and designers.
                    Documents with code blocks, a real drawing canvas,
                    and a flowchart builder , all persisted, all fast.
                </p>

                {isLoggedIn ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <Link to="/dashboard">
                            <Button size="lg" icon={<LayoutDashboard size={15} />}>
                                go_to_workspace
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <Link to="/register">
                            <Button size="lg" icon={<ArrowRight size={15} />}>
                                open_workspace
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button size="lg" variant="outline">
                                sign_in →
                            </Button>
                        </Link>
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-4 sm:gap-8 mt-10 sm:mt-14 pt-6 border-t border-hiku-border w-full">
                    {['3 tools', 'auto-save', 'open source', 'mobile ready'].map((s) => (
                        <span key={s} className="font-mono text-2xs text-hiku-cream-dim uppercase tracking-widest">
                            <span className="text-hiku-accent mr-1.5">✓</span>{s}
                        </span>
                    ))}
                </div>
            </section>

            <section className="px-4 sm:px-8 lg:px-16 pb-16 sm:pb-24 max-w-5xl mx-auto w-full">
                <p className="font-mono text-2xs text-hiku-cream-dim uppercase tracking-widest mb-5">
                    <span className="text-hiku-accent">// </span>features
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {FEATURES.map(({ cmd, title, desc, icon: Icon, stat }) => (
                        <div
                            key={title}
                            className="group bg-hiku-surface border border-hiku-border hover:border-hiku-border-light transition-all rounded p-4 sm:p-5 flex flex-col gap-3"
                        >
                            {/* cmd header */}
                            <div className="flex items-center gap-1.5 font-mono text-2xs">
                                <span className="text-hiku-accent">$</span>
                                <span className="text-hiku-muted group-hover:text-hiku-cream-dim transition-colors">{cmd}</span>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-sm bg-hiku-surface2 border border-hiku-border flex items-center justify-center flex-shrink-0 group-hover:border-hiku-accent/50 transition-colors">
                                    <Icon size={15} className="text-hiku-accent" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-mono font-semibold text-sm text-hiku-cream mb-1">{title}</h3>
                                    <p className="font-mono text-xs text-hiku-cream-dim leading-relaxed">{desc}</p>
                                </div>
                            </div>

                            <div className="mt-auto pt-2 border-t border-hiku-border/60">
                                <span className="font-mono text-2xs text-hiku-accent-bright">→ {stat}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="px-4 sm:px-8 py-4 border-t border-hiku-border">
                <p className="font-mono text-2xs text-hiku-muted text-center">
                    <span className="text-hiku-accent">// </span>
                    hiku // built with precision // by imainigination
                    <span className="text-hiku-accent"> // </span>
                </p>
            </footer>
        </div>
    );
};
