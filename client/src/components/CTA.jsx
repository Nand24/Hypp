import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CTA() {
    const navigate = useNavigate()

    return (
        <section className="my-24 px-4 md:px-12 lg:px-24 max-w-7xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-8 md:p-16 text-white shadow-2xl">
                
                {/* Background Ambient Glow */}
                <div className="absolute -top-24 -right-24 size-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 size-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-2xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold mb-4 backdrop-blur-md border border-white/10">
                            <Sparkles className="size-3.5 text-indigo-400 animate-pulse" />
                            <span>Ready to Cash Out Your Audience?</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            Sell Your Social Profile & <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                                Earn Fast Money Today
                            </span>
                        </h2>

                        <p className="text-slate-300 text-sm md:text-base mt-4 leading-relaxed">
                            Join thousands of creators turning their social media channels into instant liquid capital. List your account in under 2 minutes with guaranteed buyer protection.
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
                            <button
                                onClick={() => { navigate('/my-listings'); scrollTo(0, 0); }}
                                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 text-sm flex items-center gap-2 cursor-pointer"
                            >
                                List Your Account Free <ArrowRight className="size-4" />
                            </button>

                            <button
                                onClick={() => { navigate('/marketplace'); scrollTo(0, 0); }}
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all backdrop-blur-md border border-white/15 text-sm cursor-pointer"
                            >
                                Browse Marketplace
                            </button>
                        </div>
                    </div>

                    {/* Trust Card Pill */}
                    <div className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 max-w-xs w-full flex flex-col gap-4 text-left shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                                <ShieldCheck className="size-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Escrow Protected</h4>
                                <p className="text-xs text-slate-300">100% Funds Safety</p>
                            </div>
                        </div>

                        <div className="h-px bg-white/10 w-full" />

                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Total Volume Traded</span>
                            <span className="font-bold text-indigo-300">$2.5M+ USD</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Average Payout</span>
                            <span className="font-bold text-emerald-300">Instant</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
