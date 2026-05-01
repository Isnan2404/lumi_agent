import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CapabilityCards from "./components/CapabilityCards";
import LumiTerminal from "./components/LumiTerminal";
import Footer from "./components/Footer";

function App() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <Navbar />
      <main className="flex flex-col items-center">
        <HeroSection />
        <CapabilityCards />
        <LumiTerminal />
      </main>
      <Footer />
    </div>
  );
}

export default App;
