import { useState } from 'react'
import LiveTicker from './components/LiveTicker'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import CapabilityCards from './components/CapabilityCards'
import LumiTerminal from './components/LumiTerminal'
import Footer from './components/Footer'

function App() {
  const [agentState, setAgentState] = useState('idle')

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <LiveTicker />
      <Navbar />
      <main>
        <HeroSection agentState={agentState} />
        <CapabilityCards />
        <LumiTerminal agentState={agentState} setAgentState={setAgentState} />
      </main>
      <Footer />
    </div>
  )
}

export default App
