import React from "react";

const ROOTS = [
  "C","C#","D","D#","E","F","F#","G","G#","A","A#","B",
  "Db","Eb","Gb","Ab","Bb"
];
const MODES = [
  { value: "major", label: "Major" },
  { value: "minor", label: "Minor" }
];

export default function ScaleSelector({ root, mode, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm text-blue-200 mb-2">Root</label>
        <select
          value={root}
          onChange={(e) => onChange({ root: e.target.value, mode })}
          className="w-full bg-slate-800/70 border border-blue-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ROOTS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-blue-200 mb-2">Mode</label>
        <select
          value={mode}
          onChange={(e) => onChange({ root, mode: e.target.value })}
          className="w-full bg-slate-800/70 border border-blue-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {MODES.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-blue-200 mb-2">Length</label>
        <select
          onChange={(e) => onChange({ root, mode, length: Number(e.target.value) })}
          className="w-full bg-slate-800/70 border border-blue-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue={4}
        >
          {[2,3,4,5,6,7,8].map((n) => (
            <option key={n} value={n}>{n} chords</option>
          ))}
        </select>
      </div>
    </div>
  );
}
