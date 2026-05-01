import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Paintbrush, Workflow, FileText, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

const FEATURES = [
    {
        icon: <FileText size={28} className="text-indigo-400" />,
        title: 'Dev Editor',
        desc: 'Write documentation, tutorials and notes like a developer. Syntax-highlighted code blocks, headings, callouts — everything you need.',
        color: 'border-indigo-500/30 bg-indigo-500/5',
    },
    {
        icon: <Paintbrush size={28} className="text-violet-400" />,
        title: 'Paint Canvas',
        desc: 'Draw freely with a professional canvas. Brushes, shapes, colors, layers — export your artwork as high-res PNG.',
        color: 'border-violet-500/30 bg-violet-500/5',
    },
    {
        icon: <Workflow size={28} className="text-purple-400" />,
        title: 'Diagram Builder',
        desc: 'Build flowcharts, system diagrams, and process maps with drag-and-drop nodes and smart connections.',
        color: 'border-purple-500/30 bg-purple-500/5',
    },
];

export const Home: React.FC = () => (
    <div className="min-h-screen bg-hiku-bg">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-hiku-border">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-hiku-accent flex items-center justify-center">
                    <Zap size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold text-hiku-text">hiku</span>
            </div>
            <div className="flex items-center gap-3">
                <Link to="/login"><Button variant="ghost">Sign In</Button></Link>
                <Link to="/register"><Button>Get Started</Button></Link>
            </div>
        </header>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-8 py-24 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hiku-accent/30 bg-hiku-accent/10 text-hiku-accent text-xs font-medium mb-6">
                <Zap size={12} />
                All-in-one creative workspace
            </div>
            <h1 className="text-6xl font-extrabold text-hiku-text leading-tight mb-6">
                Write. Draw. <br />
                <span className="text-hiku-accent">Diagram.</span>
            </h1>
            <p className="text-xl text-hiku-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                Hiku is the creative workspace for developers and designers. Document ideas,
                paint freely, and build diagrams — all in one place.
            </p>
            <div className="flex items-center justify-center gap-4">
                <Link to="/register">
                    <Button size="lg" icon={<ArrowRight size={18} />}>
                        Start Creating
                    </Button>
                </Link>
                <Link to="/login">
                    <Button size="lg" variant="outline">Sign In</Button>
                </Link>
            </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-8 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FEATURES.map(({ icon, title, desc, color }) => (
                    <div
                        key={title}
                        className={`p-6 rounded-2xl border ${color} transition-transform hover:-translate-y-1`}
                    >
                        <div className="mb-4">{icon}</div>
                        <h3 className="text-lg font-semibold text-hiku-text mb-2">{title}</h3>
                        <p className="text-sm text-hiku-muted leading-relaxed">{desc}</p>
                    </div>
                ))}
            </div>
        </section>
    </div>
);
