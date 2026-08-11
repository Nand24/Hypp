import { useState } from 'react';
import { ShieldCheck, Key, Mail, Lock, Smartphone, Link2Off, CheckCircle2, Circle } from 'lucide-react';

const transferSteps = [
    {
        id: 1,
        title: "Payment Securing",
        desc: "Buyer funds are safely locked in Hypp Escrow protection account.",
        icon: ShieldCheck,
        color: "text-indigo-600 bg-indigo-50 border-indigo-200"
    },
    {
        id: 2,
        title: "Credentials Handoff",
        desc: "Seller provides handle login password & access to original linked email.",
        icon: Key,
        color: "text-purple-600 bg-purple-50 border-purple-200"
    },
    {
        id: 3,
        title: "Email Update",
        desc: "Buyer logs in and immediately changes primary recovery email to their own.",
        icon: Mail,
        color: "text-blue-600 bg-blue-50 border-blue-200"
    },
    {
        id: 4,
        title: "Password Update",
        desc: "Buyer resets and creates a new secure password.",
        icon: Lock,
        color: "text-amber-600 bg-amber-50 border-amber-200"
    },
    {
        id: 5,
        title: "Phone Number & 2FA Update",
        desc: "Buyer links personal phone number and enables 2FA authenticator.",
        icon: Smartphone,
        color: "text-emerald-600 bg-emerald-50 border-emerald-200"
    },
    {
        id: 6,
        title: "Disconnecting Old Links",
        desc: "Seller unlinks connected Meta Business Manager, Facebook pages, or 3rd party apps.",
        icon: Link2Off,
        color: "text-rose-600 bg-rose-50 border-rose-200"
    },
    {
        id: 7,
        title: "Funds Release",
        desc: "Buyer confirms complete account takeover; Escrow releases payment to seller.",
        icon: CheckCircle2,
        color: "text-teal-600 bg-teal-50 border-teal-200"
    }
];

export default function TransferGuideChecklist({ interactive = true, initialCompleted = [1] }) {
    const [completedSteps, setCompletedSteps] = useState(initialCompleted);

    const toggleStep = (id) => {
        if (!interactive) return;
        setCompletedSteps((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const progressPercentage = Math.round((completedSteps.length / transferSteps.length) * 100);

    return (
        <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base">
                        <ShieldCheck className="size-5 text-indigo-600 dark:text-indigo-400" />
                        Account Transfer Protocol & Checklist
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Follow these 7 steps to safely verify and secure complete account ownership.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 shrink-0">
                    <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                        Transfer Progress: {progressPercentage}%
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mb-5 overflow-hidden">
                <div
                    className="bg-indigo-600 h-full transition-all duration-300 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>

            {/* Steps List */}
            <div className="space-y-2.5">
                {transferSteps.map((step) => {
                    const isDone = completedSteps.includes(step.id);
                    const StepIcon = step.icon;

                    return (
                        <div
                            key={step.id}
                            onClick={() => toggleStep(step.id)}
                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                                interactive ? 'cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700' : ''
                            } ${
                                isDone
                                    ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/60'
                                    : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800'
                            }`}
                        >
                            <button
                                type="button"
                                className="mt-0.5 focus:outline-none shrink-0"
                            >
                                {isDone ? (
                                    <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-900/50" />
                                ) : (
                                    <Circle className="size-5 text-slate-300 dark:text-slate-600" />
                                )}
                            </button>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                                        Step {step.id}
                                    </span>
                                    <h5
                                        className={`text-sm font-semibold ${
                                            isDone
                                                ? 'line-through text-emerald-800 dark:text-emerald-300 opacity-90'
                                                : 'text-slate-800 dark:text-slate-100'
                                        }`}
                                    >
                                        {step.title}
                                    </h5>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>

                            <div className={`p-1.5 rounded-lg border shrink-0 ${step.color}`}>
                                <StepIcon className="size-4" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
