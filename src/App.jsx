import Navbar from "./components/Navbar";

import Hero from "./sections/Hero";
import Intro from "./sections/Intro";
import Services from "./sections/Services";
import Team from "./sections/Team";
import News from "./sections/News";
import Diplomacy from "./sections/Diplomacy";
import Contact from "./sections/Contact";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Intro />
        <Services />
        <Team />
        <News />
        <Diplomacy />
        <Contact />
      </main>
    </>
  );
}

export default App;
