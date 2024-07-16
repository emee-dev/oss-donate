// import Cms from "@/components/cms";
// import Features from "@/components/features";
// import Footer from "@/components/footer";
// import Hero from "@/components/hero";
// import Navbar from "@/components/navbar";
import dynamic from "next/dynamic";
import Loader from "./loading";

const Navbar = dynamic(() => import("@/components/navbar"));
const Hero = dynamic(() => import("@/components/hero"), {
  ssr: false,
  loading: () => <Loader />,
});
const Cms = dynamic(() => import("@/components/cms"));
const Features = dynamic(() => import("@/components/features"));
const Footer = dynamic(() => import("@/components/footer"));

const LandingPage = () => {
  return (
    <div className="dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsla(var(--primary)_/_30%),#ffffff00)]">
      <Navbar />
      <Hero />
      <Cms />
      <Features />
      <Footer />
    </div>
  );
};

export default LandingPage;
