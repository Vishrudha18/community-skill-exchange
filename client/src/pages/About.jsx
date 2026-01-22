import { useEffect, useState } from "react";
import {
  AboutHero,
  Mission,
  Vision,
  WhySkillExchange,
  Values,
  Benefits,
  Community,
} from "../components/AboutPage";
import useScrollAnimation from "../utils/useScrollAnimation";
import Skeleton from "../components/common/Skeleton";

const About = () => {
  const [loading, setLoading] = useState(true);
  useScrollAnimation(!loading);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "80px 10%" }}>
        <Skeleton height="60px" width="60%" />
        <br />
        <Skeleton height="20px" width="80%" />
        <br />
        <Skeleton height="20px" width="70%" />
      </div>
    );
  }

  return (
    <>
      <AboutHero />
      <Mission />
      <Vision />
      <WhySkillExchange />
      <Values />
      <Benefits />
      <Community />
    </>
  );
};

export default About;
