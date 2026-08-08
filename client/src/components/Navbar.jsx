import { assets } from '../assets/assets';
import { UserButton, useUser, useClerk } from '@clerk/clerk-react';
import { BoxIcon, GripIcon, ListIcon, MenuIcon, MessageCircleMoreIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <nav className='h-20'>
            <div className='fixed left-0 top-0 right-0 z-100 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-200/80 bg-white/85 backdrop-blur-md transition-all shadow-xs'>
                <img onClick={() => { navigate('/'); scrollTo(0, 0); }} src={assets.logo} alt='hypp logo' className='h-9 hover:opacity-90 transition cursor-pointer' />

                {/* Desktop Menu */}
                <div className='hidden sm:flex items-center gap-6 md:gap-8 max-md:text-sm font-medium text-slate-700'>
                    <Link onClick={() => scrollTo(0, 0)} to='/' className='hover:text-indigo-600 transition-colors'> Home </Link>
                    <Link onClick={() => scrollTo(0, 0)} to='/marketplace' className='hover:text-indigo-600 transition-colors'> Marketplace </Link>
                    {user ? <Link onClick={() => scrollTo(0, 0)} to='/messages' className='hover:text-indigo-600 transition-colors'> Messages </Link> : <Link onClick={openSignIn} to='#' className='hover:text-indigo-600 transition-colors'> Messages </Link> }
                    {user ? <Link onClick={() => scrollTo(0, 0)} to='/my-listings' className='hover:text-indigo-600 transition-colors'> My Listings </Link> : <Link onClick={openSignIn} to='#' className='hover:text-indigo-600 transition-colors'> My Listings </Link> }
                </div>

                {!user ? (
                    <div>
                        <button onClick={openSignIn} className='max-sm:hidden cursor-pointer px-7 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all text-white font-medium shadow-md shadow-indigo-200 rounded-full hover:shadow-lg active:scale-95'>
                            Sign In
                        </button>
                        <MenuIcon className='sm:hidden cursor-pointer text-slate-700' onClick={()=>setMenuOpen(true)} />
                    </div>
                ) : (
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Action label='Marketplace' labelIcon={<GripIcon size={16} />} onClick={() => navigate('/marketplace')} />
                        </UserButton.MenuItems>
                        <UserButton.MenuItems>
                            <UserButton.Action label='Messages' labelIcon={<MessageCircleMoreIcon size={16} />} onClick={() => navigate('/messages')} />
                        </UserButton.MenuItems>
                        <UserButton.MenuItems>
                            <UserButton.Action label='My Listings' labelIcon={<ListIcon size={16} />} onClick={() => navigate('/my-listings')} />
                        </UserButton.MenuItems>
                        <UserButton.MenuItems>
                            <UserButton.Action label='My Orders' labelIcon={<BoxIcon size={16} />} onClick={() => navigate('/my-orders')} />
                        </UserButton.MenuItems>
                    </UserButton>
                )}
            </div>

            <div className={`sm:hidden fixed inset-0 ${menuOpen ? 'w-full' :'w-0'} overflow-hidden bg-slate-900/40 backdrop-blur-md z-200 text-sm transition-all`}>
                <div className='flex flex-col items-center justify-center h-full text-xl font-semibold gap-6 p-6 bg-white w-4/5 ml-auto shadow-2xl relative'>
                    <Link to='/marketplace' onClick={() => setMenuOpen(false)} className='hover:text-indigo-600'> Marketplace </Link>
                    <button onClick={() => { setMenuOpen(false); openSignIn(); }}> Messages </button>
                    <button onClick={() => { setMenuOpen(false); openSignIn(); }}> My Listings </button>
                    <button onClick={() => { setMenuOpen(false); openSignIn(); }} className='cursor-pointer px-8 py-2.5 bg-indigo-600 text-white rounded-full'>Sign In</button>
                    <XIcon onClick={() => setMenuOpen(false)} className='absolute size-7 right-6 top-6 text-slate-500 hover:text-slate-700 cursor-pointer' />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
