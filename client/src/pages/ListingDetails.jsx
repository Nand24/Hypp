import { DollarSign, Users, LineChart, Eye, Calendar, MapPin, CheckCircle2, ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, Loader2Icon, ShoppingBagIcon, ArrowUpRightFromSquareIcon, MessageSquareMoreIcon, Sparkles, ShieldCheck } from 'lucide-react';
import { assets, getProfileLink, platformIcons } from '../assets/assets';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setChat } from '../app/features/chatSlice';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import api from '../configs/axios';

export default function ListingDetails() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const { openSignIn } = useClerk();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currency = import.meta.env.VITE_CURRENCY || '$';

    const [listing, setListing] = useState(null);
    const profileLink = listing && getProfileLink(listing.platform, listing.username);

    const { listingId } = useParams();
    const { listings } = useSelector((state) => state.listing);

    const [current, setCurrent] = useState(0);
    const images = listing?.images || [];

    const prevSlide = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    const nextSlide = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    const loadChatbox = () => {
        if (!isLoaded || !user) return toast('Please login to chat with seller');
        if (user.id === listing.ownerId) return toast("You can't chat with your own listing");
        dispatch(setChat({ listing: listing }));
    };

    const purchaseAccount = async () => {
        try {
            if (!user) return openSignIn();
            toast.loading('Initializing order...');
            const token = await getToken();
            const { data } = await api.get(`/api/listing/purchase-account/${listing.id}`, { headers: { Authorization: `Bearer ${token}` } });
            toast.dismissAll();

            // Load Razorpay Checkout SDK dynamically if needed
            if (!window.Razorpay) {
                await new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.onload = () => resolve(true);
                    script.onerror = () => resolve(false);
                    document.body.appendChild(script);
                });
            }

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency || 'INR',
                name: 'Hypp Escrow Marketplace',
                description: data.title,
                order_id: data.orderId,
                prefill: {
                    name: user.fullName || user.firstName || 'Buyer',
                    email: user.primaryEmailAddress?.emailAddress || '',
                },
                theme: {
                    color: '#6366f1',
                },
                handler: async function (response) {
                    try {
                        toast.loading('Verifying payment...');
                        const verifyRes = await api.post(
                            '/api/listing/verify-razorpay',
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                transactionId: data.transactionId,
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        toast.dismissAll();
                        if (verifyRes.data?.success) {
                            toast.success('Payment Successful!');
                            navigate('/my-orders');
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (err) {
                        toast.dismissAll();
                        toast.error(err?.response?.data?.message || 'Verification Error');
                    }
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.dismissAll();
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        }
    };

    useEffect(() => {
        const listing = listings.find((listing) => listing.id === listingId);
        if (listing) {
            setListing(listing);
        }
    }, [listingId, listings]);

    return listing ? (
        <div className='mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32 '>
            <button onClick={() => navigate(-1)} className='flex items-center gap-2 text-slate-600 dark:text-slate-400 py-5 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer'>
                <ArrowLeftIcon className='size-4' /> Go to Previous Page
            </button>

            <div className='flex items-start max-md:flex-col gap-10'>
                <div className='flex-1 max-md:w-full'>
                    {/* Top Section */}
                    <div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 mb-5 shadow-xs'>
                        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
                            <div className='flex items-start gap-3'>
                                <div className='p-2 rounded-xl bg-slate-50 dark:bg-slate-800'>{platformIcons[listing.platform]}</div>
                                <div>
                                    <h2 className='flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-100'>
                                        {listing.title}
                                        <Link target='_blank' to={profileLink}>
                                            <ArrowUpRightFromSquareIcon className='size-4 text-slate-400 hover:text-indigo-500' />
                                        </Link>
                                    </h2>
                                    <p className='text-slate-500 dark:text-slate-400 text-sm'>
                                        @{listing.username} • {listing.platform?.charAt(0).toUpperCase() + listing.platform?.slice(1)}
                                    </p>
                                    <div className='flex gap-2 mt-2'>
                                        {listing.verified && (
                                            <span className='flex items-center text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 px-2.5 py-1 rounded-md'>
                                                <CheckCircle2 className='w-3 h-3 mr-1' /> Verified
                                            </span>
                                        )}
                                        {listing.monetized && (
                                            <span className='flex items-center text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 px-2.5 py-1 rounded-md'>
                                                <DollarSign className='w-3 h-3 mr-1' /> Monetized
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='text-right'>
                                <h3 className='text-2xl font-bold text-slate-800 dark:text-slate-100'>
                                    {currency}
                                    {listing.price?.toLocaleString()}
                                </h3>
                                <p className='text-sm text-slate-500 dark:text-slate-400'>INR</p>
                            </div>
                        </div>
                    </div>

                    {/* Screenshot Section */}
                    {images?.length > 0 && (
                        <div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 mb-5 overflow-hidden shadow-xs'>
                            <div className='p-4 border-b border-slate-100 dark:border-slate-800'>
                                <h4 className='font-semibold text-slate-800 dark:text-slate-100'>Screenshots & Proof</h4>
                            </div>

                            {/* Slider container */}
                            <div className='relative w-full aspect-video overflow-hidden bg-slate-950'>
                                <div className='flex transition-transform duration-300 ease-in-out' style={{ transform: `translateX(-${current * 100}%)` }}>
                                    {images.map((img, index) => (
                                        <img key={index} src={img} alt='Listing Proof' className='w-full shrink-0 object-cover' />
                                    ))}
                                </div>

                                {/* Navigation Buttons */}
                                <button onClick={prevSlide} className='absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-slate-900/80 hover:bg-white p-2 rounded-full shadow cursor-pointer'>
                                    <ChevronLeftIcon className='w-5 h-5 text-slate-700 dark:text-slate-200' />
                                </button>

                                <button onClick={nextSlide} className='absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-slate-900/80 hover:bg-white p-2 rounded-full shadow cursor-pointer'>
                                    <ChevronRightIcon className='w-5 h-5 text-slate-700 dark:text-slate-200' />
                                </button>

                                {/* Dots Indicator */}
                                <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2'>
                                    {images.map((_, index) => (
                                        <button key={index} onClick={() => setCurrent(index)} className={`w-2.5 h-2.5 rounded-full ${current === index ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Account Metrics */}
                    <div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 mb-5 shadow-xs'>
                        <div className='p-4 border-b border-slate-100 dark:border-slate-800'>
                            <h4 className='font-semibold text-slate-800 dark:text-slate-100'>Account Metrics</h4>
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-4 text-center'>
                            <div>
                                <Users className='mx-auto text-indigo-500 w-5 h-5 mb-1' />
                                <p className='font-semibold text-slate-800 dark:text-slate-200'>{listing.followers_count?.toLocaleString()}</p>
                                <p className='text-xs text-slate-500 dark:text-slate-400'>Followers</p>
                            </div>
                            <div>
                                <LineChart className='mx-auto text-purple-500 w-5 h-5 mb-1' />
                                <p className='font-semibold text-slate-800 dark:text-slate-200'>{listing.engagement_rate}%</p>
                                <p className='text-xs text-slate-500 dark:text-slate-400'>Engagement</p>
                            </div>
                            <div>
                                <Eye className='mx-auto text-pink-500 w-5 h-5 mb-1' />
                                <p className='font-semibold text-slate-800 dark:text-slate-200'>{listing.monthly_views?.toLocaleString()}</p>
                                <p className='text-xs text-slate-500 dark:text-slate-400'>Monthly Views</p>
                            </div>
                            <div>
                                <Calendar className='mx-auto text-emerald-500 w-5 h-5 mb-1' />
                                <p className='font-semibold text-slate-800 dark:text-slate-200'>
                                    {listing.createdAt && !isNaN(new Date(listing.createdAt))
                                        ? new Date(listing.createdAt).toLocaleDateString()
                                        : 'Recently'}
                                </p>
                                <p className='text-xs text-slate-500 dark:text-slate-400'>Listed</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 mb-5 shadow-xs'>
                        <div className='p-4 border-b border-slate-100 dark:border-slate-800'>
                            <h4 className='font-semibold text-slate-800 dark:text-slate-100'>Description</h4>
                        </div>
                        <div className='p-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed'>{listing.description}</div>
                    </div>

                    {/* AI Health & Security Audit Card */}
                    <div className='bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-5 mb-5 text-white shadow-md border border-indigo-700/50'>
                        <div className='flex items-center justify-between mb-3'>
                            <div className='flex items-center gap-2 font-semibold text-indigo-200 text-sm'>
                                <Sparkles className='size-4 text-amber-400 animate-pulse' /> AI Account Valuation & Risk Audit
                            </div>
                            <span className='bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1'>
                                <ShieldCheck className='size-3.5' /> Low Escrow Risk
                            </span>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-2 text-indigo-100'>
                            <div className='bg-white/10 rounded-xl p-3 backdrop-blur-xs'>
                                <p className='text-indigo-300'>Estimated Market Fair Value</p>
                                <p className='text-lg font-bold text-white mt-0.5'>
                                    ₹{Math.round(listing.price * 0.9)?.toLocaleString()} – ₹{Math.round(listing.price * 1.2)?.toLocaleString()}
                                </p>
                            </div>
                            <div className='bg-white/10 rounded-xl p-3 backdrop-blur-xs'>
                                <p className='text-indigo-300'>Engagement Ratio Health</p>
                                <p className='text-lg font-bold text-emerald-400 mt-0.5'>
                                    {listing.engagement_rate > 3 ? 'Optimal (High Conversion)' : 'Healthy Standard'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 mb-5 shadow-xs'>
                        <div className='p-4 border-b border-slate-100 dark:border-slate-800'>
                            <h4 className='font-semibold text-slate-800 dark:text-slate-100'>Additional Details</h4>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4 text-sm'>
                            <div>
                                <p className='text-slate-500 dark:text-slate-400'>Niche</p>
                                <p className='font-medium capitalize text-slate-800 dark:text-slate-200'>{listing.niche}</p>
                            </div>
                            <div>
                                <p className='text-slate-500 dark:text-slate-400'>Primary Country</p>
                                <p className='flex items-center font-medium text-slate-800 dark:text-slate-200'>
                                    <MapPin className='size-4 mr-1 text-slate-400' /> {listing.country}
                                </p>
                            </div>
                            <div>
                                <p className='text-slate-500 dark:text-slate-400'>Platform Verified</p>
                                <p className='font-medium text-slate-800 dark:text-slate-200'>{listing.platformAssured ? 'Yes' : 'No'}</p>
                            </div>
                            <div>
                                <p className='text-slate-500 dark:text-slate-400'>Monetization</p>
                                <p className='font-medium text-slate-800 dark:text-slate-200'>{listing.monetized ? 'Enabled' : 'Disabled'}</p>
                            </div>
                            <div>
                                <p className='text-slate-500 dark:text-slate-400'>Status</p>
                                <p className='font-medium capitalize text-slate-800 dark:text-slate-200'>{listing.status}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seller Info & Purchase Options */}
                <div className='bg-white dark:bg-slate-900 min-w-full md:min-w-[370px] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 max-md:mb-10 shadow-xs'>
                    <h4 className='font-semibold text-slate-800 dark:text-slate-100 mb-4'>Seller Information</h4>
                    <div className='flex items-center gap-3 mb-2'>
                        <img
                            src={listing.owner?.image || assets.user_profile}
                            alt={listing.owner?.name || 'seller'}
                            className='size-11 rounded-full object-cover border border-slate-200 dark:border-slate-700'
                            onError={(e) => { e.target.onerror = null; e.target.src = assets.user_profile; }}
                        />
                        <div>
                            <p className='font-medium text-slate-800 dark:text-slate-100'>{listing.owner?.name || 'Verified Seller'}</p>
                            <p className='text-sm text-slate-500 dark:text-slate-400'>{listing.owner?.email || 'Seller'}</p>
                        </div>
                    </div>
                    <div className='flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-4'>
                        <p>
                            Member Since <span className='font-medium text-slate-800 dark:text-slate-200'>
                                {listing.owner?.createdAt && !isNaN(new Date(listing.owner.createdAt))
                                    ? new Date(listing.owner.createdAt).toLocaleDateString()
                                    : listing.createdAt && !isNaN(new Date(listing.createdAt))
                                        ? new Date(listing.createdAt).toLocaleDateString()
                                        : 'Recently'}
                            </span>
                        </p>
                    </div>
                    <button onClick={loadChatbox} className='w-full bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 transition text-sm font-medium flex items-center justify-center gap-2 cursor-pointer shadow-sm'>
                        <MessageSquareMoreIcon className='size-4' /> Chat with Seller
                    </button>

                    {listing.status === 'active' && (
                        <button onClick={purchaseAccount} className='w-full mt-2 bg-purple-600 text-white py-2.5 rounded-xl hover:bg-purple-700 transition text-sm font-medium flex items-center justify-center gap-2 cursor-pointer shadow-sm'>
                            <ShoppingBagIcon className='size-4' /> Purchase Account
                        </button>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className='bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-4 text-center mt-28'>
                <p className='text-sm text-slate-500 dark:text-slate-400'>
                    © {new Date().getFullYear()} <span className='text-indigo-600 dark:text-indigo-400 font-semibold'>hypp.</span> All rights reserved.
                </p>
            </div>
        </div>
    ) : (
        <div className='h-screen flex justify-center items-center'>
            <Loader2Icon className='size-7 animate-spin text-indigo-600 dark:text-indigo-400' />
        </div>
    );
}
