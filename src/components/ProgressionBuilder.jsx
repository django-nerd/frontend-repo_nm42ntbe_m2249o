import React, { useEffect, useMemo, useRef, useState } from "react";
import { AudioEngine } from "./AudioEngine";

const apiBase = import.meta.env.VITE_BACKEND_URL || "";

export default function ProgressionBuilder() {
  const [root, setRoot] = useState("C");
  const [mode, setMode] = useState("major");
  const [length, setLength] = useState(4);
  const [chordTypes, setChordTypes] = useState(["triad"]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [volume, setVolume] = useState(0.3);
  const engineRef = useRef(null);

  useEffect(() => {
    engineRef.current = new AudioEngine();
    engineRef.current.setVolume(volume);
    return () => engineRef.current?.stopAll();
  }, []);

  useEffect(() => {
    engineRef.current?.setVolume(volume);
  }, [volume]);

  const fetchProgression = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`${apiBase}/api/generate-progression`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ root, mode, length, chord_types: chordTypes }),
      });
      if (!resp.ok) throw new Error(await resp.text());
      const data = await resp.json();
      setResult(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const playChord = (idx) => {
    if (!result) return;
    const chord = result.chords[idx];
    engineRef.current?.playChord(chord.frequencies, 1.2);
  };

  const playAll = async () => {
    if (!result) return;
    for (let i = 0; i < result.chords.length; i++) {
      playChord(i);
      // wait 1.1s before next
      await new Promise((r) => setTimeout(r, 1100));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-blue-200 mb-2">Root</label>
          <select value={root} onChange={(e) => setRoot(e.target.value)} className="w-full bg-slate-800/70 border border-blue-500/30 rounded-lg px-3 py-2 text-white">
            {["C","C#","D","D#","E","F","F#","G","G#","A","A#","B","Db","Eb","Gb","Ab","Bb"].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-2">Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full bg-slate-800/70 border border-blue-500/30 rounded-lg px-3 py-2 text-white">
            <option value="major">Major</option>
            <option value="minor">Minor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-2">Length</label>
          <select value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full bg-slate-800/70 border border-blue-500/30 rounded-lg px-3 py-2 text-white">
            {[2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-2">Volume</label>
          <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-blue-200 mb-2">Chord Types</label>
        <div className="flex flex-wrap gap-2">
          {["triad","seventh","sus2","sus4","power","add9"].map((ct) => (
            <button key={ct} onClick={() => setChordTypes((prev) => prev.includes(ct) ? prev.filter(x=>x!==ct) : [...prev, ct])} className={`px-3 py-1 rounded-full border transition ${
              chordTypes.includes(ct) ? "bg-blue-500 text-white border-blue-400" : "bg-slate-800/70 text-blue-200 border-blue-500/30 hover:border-blue-400/60"}`}>{ct}</button>
          ))}
        </div>
        <p className="text-xs text-blue-300/70 mt-2">Selected chord types will repeat across the sequence.</p>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={fetchProgression} disabled={loading} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-60">
          {loading ? "Generating..." : "Generate Progression"}
        </button>
        {result && (
          <>
            <button onClick={playAll} className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white">Play Progression</button>
            <button onClick={() => engineRef.current?.stopAll()} className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white">Stop</button>
          </>
        )}
      </div>

      {error && <div className="text-rose-300 text-sm">{error}</div>}

      {result && (
        <div className="mt-4 grid gap-3">
          <div className="text-blue-200">Scale: <span className="font-semibold text-white">{result.root} {result.mode}</span> · {result.scale.join(" ")}</div>
          <div className="grid md:grid-cols-2 gap-3">
            {result.chords.map((ch, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold text-lg">{result.roman[idx]} — {ch.name}</div>
                  <div className="text-blue-300/80 text-sm">{ch.notes.join(" • ")}</div>
                </div>
                <button onClick={() => playChord(idx)} className="px-3 py-1.5 rounded-lg bg-blue-500/90 hover:bg-blue-600 text-white">Play</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
