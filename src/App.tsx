import { useRef } from "react";
import Navbar from "./components/Navbar";
import CinematicLayer from "./components/CinematicLayer";
import NoiseOverlay from "./components/NoiseOverlay";
import ScrollProgress from "./components/ScrollProgress";
import VideoIntro from "./sections/VideoIntro";
import Hero from "./sections/Hero";
import Experience from "./sections/Experience";
import Skills from "./sections/Skills";
import Certifications from "./sections/Certifications";
import Contact from "./sections/Contact";

export default function App() {
  const experienceRef = useRef<HTMLDivElement>(null);

  const scrollToExperience = () => {
    experienceRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen" style={{ background: "#080C15" }}>
      <CinematicLayer />
      <NoiseOverlay />
      <ScrollProgress />
      <Navbar />
      <VideoIntro onScrollDown={scrollToExperience} />
      <div ref={experienceRef}>
        <Experience />
      </div>
      <Skills />
      <Certifications />
      <Contact />
    </div>
  );
}
