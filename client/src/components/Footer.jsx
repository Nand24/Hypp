import { assets } from "../assets/assets";

export default function Footer() {
    return (
        <>  
            <footer className="mt-32 px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 pt-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <a href="/">
                            <img src={assets.logo} alt="hypp logo" className="h-8 dark:brightness-110" />
                        </a>
                        <p className="text-sm/7 mt-6 text-slate-600 dark:text-slate-400">
                            hypp. is a premier social media marketplace connecting creators, brands, and buyers. Effortlessly buy and sell verified social profiles with ease and escrow security.
                        </p>
                    </div>
                    <div className="flex flex-col lg:items-center lg:justify-center">
                        <div className="flex flex-col text-sm space-y-2.5">
                            <h2 className="font-semibold mb-5 text-slate-800 dark:text-slate-200">Company</h2>
                            <a className="hover:text-slate-900 dark:hover:text-slate-100 transition" href="#">About us</a>
                            <a className="hover:text-slate-900 dark:hover:text-slate-100 transition" href="#">Careers<span className="text-xs text-white bg-indigo-600 rounded-md ml-2 px-2 py-0.5 font-medium">We’re hiring!</span></a>
                            <a className="hover:text-slate-900 dark:hover:text-slate-100 transition" href="#">Contact us</a>
                            <a className="hover:text-slate-900 dark:hover:text-slate-100 transition" href="#">Privacy policy</a>
                        </div>
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-5">Subscribe to our newsletter</h2>
                        <div className="text-sm space-y-6 max-w-sm">
                            <p>The latest news, listings, and resources, sent to your inbox weekly.</p>
                            <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-indigo-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                                <input className="focus:ring-2 ring-indigo-600 outline-none w-full max-w-64 py-2 rounded-lg px-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm" type="email" placeholder="Enter your email" />
                                <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-white rounded-lg font-medium transition cursor-pointer text-sm shrink-0">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-6 border-t mt-10 border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p>Copyright {new Date().getFullYear()} © hypp. All Rights Reserved.</p>
                    <p className="font-medium text-slate-600 dark:text-slate-300">
                        Made with <span className="text-red-500 inline-block animate-pulse">❤️</span> by <span className="font-semibold text-slate-800 dark:text-slate-100">Pranav Sharma</span>
                    </p>
                </div>
            </footer>
        </>
    );
};