import CTA from "../components/CTA";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import LatestListings from "../components/LatestListings";
import TransferProcessSection from "../components/TransferProcessSection";

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-50/50">
            <Hero />
            <LatestListings />
            <Features />
            <TransferProcessSection />
            <CTA />
            <Footer />
        </div>
    );
};

export default Home;
