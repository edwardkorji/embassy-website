import { useEffect } from "react";
import Hero from "../sections/Hero";
import Intro from "../sections/Intro";
import Services from "../sections/Services";
import Team from "../sections/Team";
import News from "../sections/News";
import Diplomacy from "../sections/Diplomacy";
import Contact from "../sections/Contact";

function Home() {
  // When arriving here from a different page (e.g. clicking "#services" from
  // /publications), the browser's own hash-scroll fires before React has
  // rendered any of these sections, so it finds nothing and silently gives
  // up. Do it ourselves once the sections actually exist in the DOM.
  useEffect(() => {
    if (!window.location.hash) return;
    const target = document.getElementById(window.location.hash.slice(1));
    target?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <main>
      <Hero />
      <Intro />
      <Services />
      <Team />
      <News />
      <Diplomacy />
      <Contact />
    </main>
  );
}

export default Home;
