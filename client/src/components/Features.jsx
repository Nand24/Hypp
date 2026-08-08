import { ShieldCheck, Lock, Search, RefreshCw } from 'lucide-react'

const Features = () => {
    const steps = [
        {
            icon: <Search className="size-6 text-indigo-600 dark:text-indigo-400" />,
            title: "1. Discover & Verify",
            description: "Browse verified social media accounts with real audience analytics, niche metrics, and revenue history."
        },
        {
            icon: <Lock className="size-6 text-purple-600 dark:text-purple-400" />,
            title: "2. Escrow Protected Payment",
            description: "Your funds are securely held in escrow until you verify and accept full ownership of the account."
        },
        {
            icon: <RefreshCw className="size-6 text-emerald-600 dark:text-emerald-400" />,
            title: "3. Seamless Ownership Transfer",
            description: "Get original email & credentials handed over directly through our automated verification workflow."
        }
    ]

    return (
        <section className="my-24 px-4 md:px-12 lg:px-24 max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 text-xs font-semibold mb-3">
                    <ShieldCheck className="size-4" /> 100% Safe & Transparent
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    How <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">hypp.</span> Works
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg mt-3">
                    Buying and selling social media channels has never been easier or safer.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, i) => (
                    <div key={i} className="relative p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start group">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 rounded-2xl mb-6 transition-colors border border-slate-100 dark:border-slate-800">
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {step.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Features
