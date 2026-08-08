import Title from './Title'
import ListingCard from './ListingCard'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

const LatestListings = () => {
    const { listings } = useSelector(state => state.listing)
    const navigate = useNavigate()

    const displayListings = (listings || [])
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)

    return (
        <section className='my-20 px-4 md:px-12 lg:px-24 max-w-7xl mx-auto'>
            <div className='flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-slate-100 pb-6'>
                <div>
                    <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold mb-2'>
                        <Sparkles className='size-3.5' /> Verified & Active
                    </div>
                    <h2 className='text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight'>
                        Featured Marketplace Accounts
                    </h2>
                    <p className='text-slate-500 text-sm md:text-base mt-1.5 max-w-xl'>
                        Explore top-rated YouTube, Instagram, and TikTok accounts with verified audience metrics.
                    </p>
                </div>

                <button
                    onClick={() => { navigate('/marketplace'); scrollTo(0, 0); }}
                    className='inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm hover:translate-x-1 transition-all cursor-pointer self-start md:self-auto'
                >
                    Explore All Marketplace <ArrowRight className='size-4' />
                </button>
            </div>

            {displayListings.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {displayListings.map((listing, index) => (
                        <ListingCard key={listing.id || index} listing={listing} />
                    ))}
                </div>
            ) : (
                <div className='text-center py-16 bg-slate-50 rounded-2xl border border-slate-200/60'>
                    <p className='text-slate-500 text-sm font-medium'>No active listings found right now.</p>
                </div>
            )}
        </section>
    )
}

export default LatestListings