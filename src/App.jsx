import PoWMiner from "./components/PoWMiner.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-6">
              <img
                src="/flame-icon.svg"
                alt="Flames"
                className="w-16 h-16 drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]"
              />
            </div>

            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Proof‑of‑Work Miner (Educational Demo)
            </h1>
            <p className="text-blue-200/90">
              Explore how proof‑of‑work functions by searching for a nonce that makes a SHA‑256 hash
              start with a chosen number of zeros. This is a learning tool, not real Bitcoin mining.
            </p>
          </div>

          <PoWMiner />

          <div className="mt-10 text-center text-blue-300/60 text-sm">
            Built with love — adjust difficulty to see how search time grows.
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
