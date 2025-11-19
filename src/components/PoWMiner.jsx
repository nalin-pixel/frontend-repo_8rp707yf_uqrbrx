import { useEffect, useMemo, useRef, useState } from "react";

const apiBase = import.meta.env.VITE_BACKEND_URL || "";

export default function PoWMiner() {
  const [data, setData] = useState("Hello, Bitcoin!");
  const [difficulty, setDifficulty] = useState(4);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [hashrate, setHashrate] = useState(0);
  const startNonceRef = useRef(0);
  const t0Ref = useRef(null);

  useEffect(() => {
    startNonceRef.current = 0;
  }, [data, difficulty]);

  const targetPrefix = useMemo(() => "0".repeat(Number(difficulty) || 0), [difficulty]);

  async function stepMine() {
    setBusy(true);
    const t0 = performance.now();
    t0Ref.current = t0;

    try {
      const resp = await fetch(`${apiBase}/api/mine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          difficulty: Number(difficulty),
          start_nonce: startNonceRef.current,
          max_hashes: 50000,
          time_limit_ms: 900,
        }),
      });
      const json = await resp.json();
      const dt = performance.now() - t0;

      // Update hashrate estimate
      if (json.tried_hashes && dt > 0) {
        setHashrate(Math.round((json.tried_hashes / dt) * 1000));
      }

      setResult(json);

      if (json.found) {
        setBusy(false);
      } else {
        startNonceRef.current += json.tried_hashes || 0;
        setBusy(false);
      }
    } catch (e) {
      console.error(e);
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6 mb-4">
        <h2 className="text-white text-2xl font-semibold mb-4">Proof‑of‑Work Demo</h2>
        <p className="text-blue-200/80 text-sm mb-4">
          This is an educational proof‑of‑work simulator. It does not mine real Bitcoin. It searches for a nonce so that the SHA‑256 hash of your input begins with a number of zeros.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <label className="block">
            <div className="text-blue-200/80 text-sm mb-1">Data</div>
            <input
              className="w-full rounded-lg bg-slate-900/60 border border-blue-500/30 px-3 py-2 text-blue-100 outline-none focus:ring-2 focus:ring-blue-500/50"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </label>

          <label className="block">
            <div className="text-blue-200/80 text-sm mb-1">Difficulty (leading hex zeros)</div>
            <input
              type="number"
              min={1}
              max={7}
              className="w-full rounded-lg bg-slate-900/60 border border-blue-500/30 px-3 py-2 text-blue-100 outline-none focus:ring-2 focus:ring-blue-500/50"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            />
          </label>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={stepMine}
            disabled={busy}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:opacity-50 hover:bg-blue-600 transition"
          >
            {busy ? "Mining..." : "Mine step"}
          </button>
          <div className="text-blue-200/80 text-sm">Hashrate: {hashrate.toLocaleString()} H/s</div>
        </div>

        {result && (
          <div className="mt-4 text-sm text-blue-100 space-y-1">
            <div>Target prefix: <span className="font-mono">{targetPrefix}</span></div>
            <div>Tried: {result.tried_hashes?.toLocaleString()} • Time: {result.elapsed_ms} ms</div>
            {result.found ? (
              <div className="text-green-300">
                Found! Nonce <span className="font-mono">{result.nonce}</span> →
                <span className="font-mono break-all"> {result.hash_hex}</span>
              </div>
            ) : (
              <div className="text-yellow-300">Not found this round. Click again to continue from nonce {startNonceRef.current}.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
