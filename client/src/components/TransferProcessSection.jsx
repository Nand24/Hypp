import { useState } from 'react';
import { ShieldCheck, Key, Mail, Lock, Smartphone, Link2Off, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TransferProcessSection() {
    const [activeStep, setActiveStep] = useState(1);

    const steps = [
        {
            id: 1,
            title: "Payment Securing",
            short: "Escrow Deposit",
            desc: "The buyer funds a secure escrow account held by Hypp. Money stays locked safely while transfer proceeds.",
            icon: ShieldCheck,
            color: "from-indigo-500 to-blue-600",
            bg: "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800"
        },
        {
            id: 2,
            title: "Credentials Handoff",
            desc: "The seller submits the current account password and grants access to the original linked email address.",
            icon: Key,
            color: "from-purple-500 to-pink-600",
            bg: "bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800"
        },
        {
            id: 3,
            title: "Email Update",
            desc: "The buyer logs into the account and immediately updates the primary email address to their own.",
            icon: Mail,
            color: "from-blue-500 to-cyan-600",
            bg: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800"
        },
        {
            id: 4,
            title: "Password Update",
            desc: "The buyer updates and creates a brand-new secure password to lock out unauthorized access.",
            icon: Lock,
            color: "from-amber-500 to-orange-600",
            bg: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800"
        },
        {
            id: 5,
            title: "Phone Number Update",
            desc: "The buyer attaches their personal phone number and enables Two-Factor Authentication (2FA).",
            icon: Smartphone,
            color: "from-emerald-500 to-teal-600",
            bg: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800"
        },
        {
            id: 6,
            title: "Disconnecting Old Links",
            desc: "The seller unlinks any connected Facebook Pages, Meta Business Manager accounts, or third-party tools.",
            icon: Link2Off,
            color: "from-rose-500 to-red-600",
            bg: "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800"
        },
        {
            id: 7,
            title: "Funds Release",
            desc: "The buyer verifies 100% account control, and Hypp Escrow instantly releases payment to the seller.",
            icon: CheckCircle2,
            color: "from-teal-500 to-emerald-600",
            bg: "bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800"
        }
    ];

    return (
        <section className="my-24 px-4 md:px-12 lg:px-24 max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 text-xs font-semibold mb-3 border border-indigo-200 dark:border-indigo-800">
                    <ShieldCheck className="size-4 text-indigo-600 dark:text-indigo-400" /> Flippa-Grade Trust & Security
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    The <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Transfer Process</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg mt-3">
                    Our 7-step escrow transfer model ensures complete account control before funds reach the seller.
                </p>
            </div>

            {/* Step Selector Tabs (Mobile & Desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-10">
                {steps.map((step) => {
                    const isActive = activeStep === step.id;
                    const Icon = step.icon;
                    return (
                        <button
                            key={step.id}
                            onClick={() => setActiveStep(step.id)}
                            className={`flex flex-col items-center p-3 rounded-2xl border transition-all text-center cursor-pointer ${
                                isActive
                                    ? 'bg-gradient-to-b from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border-indigo-600 scale-105'
                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300'
                            }`}
                        >
                            <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                                Step {step.id}
                            </span>
                            <Icon className={`size-5 mb-1 ${isActive ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
                            <span className="text-xs font-semibold truncate w-full">{step.title}</span>
                        </button>
                    );
                })}
            </div>

            {/* Active Step Highlight Card */}
            {(() => {
                const current = steps.find((s) => s.id === activeStep) || steps[0];
                const Icon = current.icon;
                return (
                    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-indigo-500/30 relative overflow-hidden mb-12">
                        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                            <Icon className="size-80 text-indigo-400" />
                        </div>

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-8 space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
                                    <span>Step {current.id} of 7</span>
                                    <span>•</span>
                                    <span className="text-emerald-400 font-medium">Guaranteed Escrow Protection</span>
                                </div>
                                <h3 className="text-2xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
                                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${current.color} text-white shadow-md`}>
                                        <Icon className="size-7" />
                                    </div>
                                    {current.title}
                                </h3>
                                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                                    {current.desc}
                                </p>
                            </div>

                            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center gap-4">
                                <Link
                                    to="/marketplace"
                                    className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                                >
                                    Explore Marketplace <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <p className="text-xs text-slate-400 text-center lg:text-right">
                                    🔒 Protected by 48-Hour Inspection Escrow Window
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* 7-Step Horizontal Timeline Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {steps.map((step) => {
                    const Icon = step.icon;
                    return (
                        <div
                            key={step.id}
                            onClick={() => setActiveStep(step.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                                activeStep === step.id
                                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-400">0{step.id}</span>
                                    <div className={`p-1.5 rounded-lg ${step.bg}`}>
                                        <Icon className="size-4 text-slate-800 dark:text-slate-200" />
                                    </div>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{step.title}</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-3 leading-snug">{step.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
