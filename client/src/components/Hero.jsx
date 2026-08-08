import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Sparkles, ShieldCheck, Zap, TrendingUp, Users } from 'lucide-react'

const Hero = () => {
    const navigate = useNavigate()
    const [input, setInput] = React.useState('')

    const onSubmitHandler = (e) => {
        e.preventDefault()
        if (input.trim()) {
            navigate(`/marketplace?search=${encodeURIComponent(input)}`)
        }
    }

    const popularTags = [
        { label: 'Instagram', search: 'instagram' },
        { label: 'YouTube Tech', search: 'tech' },
        { label: 'TikTok Fitness', search: 'fitness' },
        { label: 'Travel Pages', search: 'travel' }
    ]

    return (
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
            {/* Background Ambient Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-pink-500/15 blur-3xl pointer-events-none rounded-full -z-10" />

            <div className="flex flex-col items-center justify-center text-center px-4 md:px-12 lg:px-24 max-w-5xl mx-auto">
                
                {/* Announcement Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100/80 text-indigo-600 text-xs md:text-sm font-medium mb-6 shadow-xs backdrop-blur-xs hover:bg-indigo-100/80 transition-all cursor-pointer" onClick={() => navigate('/marketplace')}>
                    <Sparkles className="size-4 text-indigo-600 animate-pulse" />
                    <span>#1 Escrow-Protected Social Marketplace</span>
                    <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">New</span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                    Buy & Sell Verified <br />
                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Social Media Profiles
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="max-w-2xl text-slate-600 text-base md:text-lg mt-6 mb-8 leading-relaxed font-normal">
                    The safest platform to discover, buy, and monetize established Instagram, YouTube, TikTok, and Twitter accounts with guaranteed escrow transfer.
                </p>

                {/* Search Bar */}
                <form onSubmit={onSubmitHandler} className="w-full max-w-xl mb-6">
                    <div className="relative flex items-center bg-white p-2 rounded-2xl border border-slate-200/90 shadow-lg shadow-indigo-500/5 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                        <Search className="size-5 text-slate-400 ml-3 mr-2 shrink-0" />
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Search YouTube, Instagram, Fitness, Tech..."
                            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm md:text-base outline-none py-2"
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-200 active:scale-95 text-sm shrink-0 cursor-pointer"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Trending Tags */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 mb-12">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <TrendingUp className="size-3.5 text-indigo-600" /> Trending:
                    </span>
                    {popularTags.map((tag, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => navigate(`/marketplace?search=${tag.search}`)}
                            className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-full transition-all border border-slate-200/60 cursor-pointer"
                        >
                            {tag.label}
                        </button>
                    ))}
                </div>

                {/* Stats Bar */}
                <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex flex-col items-center p-2">
                        <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-xl md:text-2xl">
                            <Users className="size-5" /> 10,000+
                        </div>
                        <span className="text-xs text-slate-500 font-medium mt-1">Active Creators</span>
                    </div>

                    <div className="flex flex-col items-center p-2 border-l border-slate-100">
                        <div className="flex items-center gap-1.5 text-purple-600 font-bold text-xl md:text-2xl">
                            <ShieldCheck className="size-5" /> 100%
                        </div>
                        <span className="text-xs text-slate-500 font-medium mt-1">Escrow Secured</span>
                    </div>

                    <div className="flex flex-col items-center p-2 border-l border-slate-100">
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xl md:text-2xl">
                            <Zap className="size-5" /> &lt;24h
                        </div>
                        <span className="text-xs text-slate-500 font-medium mt-1">Avg. Transfer Time</span>
                    </div>

                    <div className="flex flex-col items-center p-2 border-l border-slate-100">
                        <div className="flex items-center gap-1.5 text-pink-600 font-bold text-xl md:text-2xl">
                            ★ 4.9/5
                        </div>
                        <span className="text-xs text-slate-500 font-medium mt-1">User Rating</span>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Hero