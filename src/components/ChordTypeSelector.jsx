import React from "react";

const OPTIONS = [
  { value: "triad", label: "Triad" },
  { value: "seventh", label: "Seventh" },
  { value: "sus2", label: "Sus2" },
  { value: "sus4", label: "Sus4" },
  { value: "power", label: "Power" },
  { value: "add9", label: "Add9" },
];

export default function ChordTypeSelector({ chordTypes, setChordTypes }) {
  const toggle = (val) => {
    if (chordTypes.includes(val)) {
      setChordTypes(chordTypes.filter((v) => v !== val));
    } else {
      setChordTypes([...chordTypes, val]);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`px-3 py-1 rounded-full border transition ${
              chordTypes.includes(opt.value)
                ? "bg-blue-500 text-white border-blue-400"
                : "bg-slate-800/70 text-blue-200 border-blue-500/30 hover:border-blue-400/60"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-blue-300/70 mt-2">Selected order is used cyclically across the progression.</p>
    </div>
  );
}
