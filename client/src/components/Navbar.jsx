import { assets } from '../assets/assets';
import { UserButton, useUser, useClerk } from '@clerk/clerk-react';
import { BoxIcon, GripIcon, ListIcon, MenuIcon, MessageCircleMoreIcon, XIcon, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    return (
        <nav className='h-20'>
            <div className='fixed left-0 top-0 right-0 z-100 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md transition-colors shadow-xs'>
                <img onClick={() => { navigate('/'); scrollTo(0, 0); }} src={assets.logo} alt='hypp logo' className='h-9 hover:opacity-90 transition cursor-pointer dark:brightness-110' />

                {/* Desktop Menu */}
                <div className='hidden sm:flex items-center gap-6 md:gap-8 max-md:text-sm font-medium text-slate-700 dark:text-slate-200'>
                    <Link onClick={() => scrollTo(0, 0)} to='/' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'> Home </Link>
                    <Link onClick={() => scrollTo(0, 0)} to='/marketplace' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'> Marketplace </Link>
                    {user ? <Link onClick={() => scrollTo(0, 0)} to='/messages' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'> Messages </Link> : <Link onClick={openSignIn} to='#' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'> Messages </Link>}
                    {user ? <Link onClick={() => scrollTo(0, 0)} to='/my-listings' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'> My Listings </Link> : <Link onClick={openSignIn} to='#' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'> My Listings </Link>}
                </div>

                <div className='flex items-center gap-3 md:gap-4'>
                    {/* Dark Mode Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle Dark Mode"
                        className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shadow-xs"
                    >
                        {isDark ? <Sun className="size-4 animate-spin-slow" /> : <Moon className="size-4" />}
                    </button>

                    {!user ? (
                        <div className='flex items-center gap-2'>
                            <button onClick={openSignIn} className='max-sm:hidden cursor-pointer px-7 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all text-white font-medium shadow-md shadow-indigo-200 dark:shadow-indigo-900/30 rounded-full hover:shadow-lg active:scale-95 text-sm'>
                                Sign In
                            </button>
                            <MenuIcon className='sm:hidden cursor-pointer text-slate-700 dark:text-slate-200' onClick={() => setMenuOpen(true)} />
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
            </div>

            {/* Mobile Drawer */}
            <div className={`sm:hidden fixed inset-0 ${menuOpen ? 'w-full' : 'w-0'} overflow-hidden bg-slate-900/60 backdrop-blur-md z-200 text-sm transition-all`}>
                <div className='flex flex-col items-center justify-center h-full text-xl font-semibold gap-6 p-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-4/5 ml-auto shadow-2xl relative border-l border-slate-200 dark:border-slate-800'>
                    <Link to='/' onClick={() => setMenuOpen(false)} className='hover:text-indigo-600 dark:hover:text-indigo-400'> Home </Link>
                    <Link to='/marketplace' onClick={() => setMenuOpen(false)} className='hover:text-indigo-600 dark:hover:text-indigo-400'> Marketplace </Link>
                    <button onClick={() => { setMenuOpen(false); openSignIn(); }}> Messages </button>
                    <button onClick={() => { setMenuOpen(false); openSignIn(); }}> My Listings </button>
                    {!user && (
                        <button onClick={() => { setMenuOpen(false); openSignIn(); }} className='cursor-pointer px-8 py-2.5 bg-indigo-600 text-white rounded-full'>Sign In</button>
                    )}
                    <XIcon onClick={() => setMenuOpen(false)} className='absolute size-7 right-6 top-6 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer' />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
