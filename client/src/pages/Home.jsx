import HeroSection from "../components/HomePage/HeroSection";
import HowItWorks from "../components/HomePage/HowItWorks";
import PopularSkills from "../components/HomePage/PopularSkills";
import Benefits from "../components/HomePage/Benefits";
import Testimonials from "../components/HomePage/Testimonials";
import CTASection from "../components/HomePage/CTASection";
import Footer from "../components/HomePage/Footer";

const Home = () => {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <PopularSkills />
      <Benefits />
      <Testimonials />
      <CTASection />
      <Footer />
    </>
  );
};

export default Home;
