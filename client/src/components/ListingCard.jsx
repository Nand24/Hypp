import { BadgeCheck, MapPin, Users, LineChart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { platformIcons } from '../assets/assets';

const ListingCard = ({ listing }) => {
    const currency = import.meta.env.VITE_CURRENCY || '$';
    const navigate = useNavigate();

    return (
        <div className='group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full'>
            
            {/* Top Accent Line / Featured Badge */}
            {listing.featured ? (
                <div className='w-full bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 text-white text-center text-[11px] font-bold py-1 tracking-wider uppercase flex items-center justify-center gap-1 shadow-xs'>
                    <span>✨ Featured Listing</span>
                </div>
            ) : (
                <div className='w-full h-1 bg-gradient-to-r from-slate-100 to-indigo-100 dark:from-slate-800 dark:to-indigo-950 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300' />
            )}

            <div className='p-6 flex-1 flex flex-col justify-between'>
                <div>
                    {/* Header */}
                    <div className='flex items-start justify-between gap-3 mb-4'>
                        <div className='flex items-center gap-3.5'>
                            <div className='p-2 bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 transition-colors shrink-0 rounded-xl'>
                                {platformIcons[listing.platform]}
                            </div>

                            <div>
                                <h3 className='text-slate-900 dark:text-slate-100 font-bold text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1'>
                                    {listing.title}
                                </h3>
                                <p className='text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5'>
                                    @{listing.username} • <span className='capitalize'>{listing.platform}</span>
                                </p>
                            </div>
                        </div>

                        {listing.verified && (
                            <span className='flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 shrink-0'>
                                <BadgeCheck className='size-3.5 text-emerald-500' /> Verified
                            </span>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className='grid grid-cols-2 gap-3 my-4 p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800'>
                        <div className='flex items-center gap-2'>
                            <Users className='size-4 text-indigo-500 shrink-0' />
                            <div>
                                <span className='text-xs text-slate-400 dark:text-slate-500 block font-medium'>Followers</span>
                                <span className='text-sm font-bold text-slate-800 dark:text-slate-200'>
                                    {listing.followers_count ? listing.followers_count.toLocaleString() : '0'}
                                </span>
                            </div>
                        </div>

                        {listing.engagement_rate ? (
                            <div className='flex items-center gap-2 border-l border-slate-200/60 dark:border-slate-700/60 pl-3'>
                                <LineChart className='size-4 text-purple-500 shrink-0' />
                                <div>
                                    <span className='text-xs text-slate-400 dark:text-slate-500 block font-medium'>Engagement</span>
                                    <span className='text-sm font-bold text-slate-800 dark:text-slate-200'>{listing.engagement_rate}%</span>
                                </div>
                            </div>
                        ) : listing.country ? (
                            <div className='flex items-center gap-2 border-l border-slate-200/60 dark:border-slate-700/60 pl-3'>
                                <MapPin className='size-4 text-pink-500 shrink-0' />
                                <div>
                                    <span className='text-xs text-slate-400 dark:text-slate-500 block font-medium'>Country</span>
                                    <span className='text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1'>{listing.country}</span>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Description */}
                    <p className='text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-4'>
                        {listing.description}
                    </p>
                </div>

                {/* Tags & Price Footer */}
                <div>
                    <div className='flex items-center gap-2 mb-4 flex-wrap'>
                        <span className='text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 px-2.5 py-0.5 rounded-full capitalize'>
                            {listing.niche}
                        </span>
                        {listing.monetized && (
                            <span className='text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full'>
                                💰 Monetized
                            </span>
                        )}
                    </div>

                    <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
                        <div>
                            <span className='text-xs text-slate-400 dark:text-slate-500 font-medium block'>Price</span>
                            <div className='flex items-baseline gap-1'>
                                <span className='text-2xl font-extrabold text-slate-900 dark:text-white'>
                                    {currency}{listing.price ? listing.price.toLocaleString() : '0'}
                                </span>
                                <span className='text-xs text-slate-400 dark:text-slate-500 font-medium'>INR</span>
                            </div>
                        </div>

                        <button
                            onClick={() => { navigate(`/listing/${listing.id}`); scrollTo(0, 0); }}
                            className='px-4 py-2.5 bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-sm group-hover:shadow-md cursor-pointer'
                        >
                            View Details <ArrowRight className='size-3.5' />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ListingCard;
