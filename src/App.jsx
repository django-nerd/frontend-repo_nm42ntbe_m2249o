import React from 'react'
import ProgressionBuilder from './components/ProgressionBuilder'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(59,130,246,0.12),transparent_40%)] pointer-events-none" />
      <header className="relative max-w-5xl mx-auto px-6 pt-14 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Chord Progression Generator</h1>
        <p className="text-blue-300/80 mt-2">Pick a scale, choose chord types, and preview the sound with a volume slider.</p>
      </header>

      <main className="relative max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-slate-900/60 backdrop-blur-md border border-blue-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <ProgressionBuilder />
        </div>
        <footer className="text-center text-blue-300/60 text-sm mt-8">Tip: On some browsers the first play may ask to enable audio.</footer>
      </main>
    </div>
  )
}

export default App