import CinematicLayer  from "./components/CinematicLayer";
import NoiseOverlay    from "./components/NoiseOverlay";
import ScrollProgress  from "./components/ScrollProgress";
import Navbar          from "./components/Navbar";
import VideoIntro      from "./sections/VideoIntro";
import Experience      from "./sections/Experience";
import Skills          from "./sections/Skills";
import Certifications  from "./sections/Certifications";
import Contact         from "./sections/Contact";

function Divider() {
  return (
    <div className="relative z-20 max-w-5xl mx-auto px-6">
      <div style={{ height:"1px", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)" }}/>
    </div>
  );
}

function scrollToExperience() {
  document.querySelector("#experience")?.scrollIntoView({ behavior: "smooth" });
}

export default function App() {
  return (
    <div className="relative min-h-screen" style={{ background:"#080C15" }}>
      {/* Cinematic warm particle layer */}
      <CinematicLayer />

      {/* Film grain overlay */}
      <NoiseOverlay />

      {/* Scroll progress bar */}
      <ScrollProgress />

      {/* Navigation */}
      <Navbar />

      <main>
        {/* Fullscreen cinematic hero */}
        <VideoIntro onScrollDown={scrollToExperience} />

        <Divider />
        <Experience />
        <Divider />
        <Skills />
        <Divider />
        <Certifications />
        <Divider />
        <Contact />
      </main>
    </div>
  );
}
