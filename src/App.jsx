import { useState } from "react";

const DRINKS = [
  { key: "beer",   label: "Beer",        sub: "350ml · 5%",  ml: 350, pct: 0.05 },
  { key: "chu5",   label: "Highball 5%", sub: "350ml · 5%",  ml: 350, pct: 0.05 },
  { key: "chu9",   label: "Highball 9%", sub: "500ml · 9%",  ml: 500, pct: 0.09, strong: true },
  { key: "wine",   label: "Wine",        sub: "120ml · 12%", ml: 120, pct: 0.12 },
  { key: "sake",   label: "Sake",        sub: "180ml · 15%", ml: 180, pct: 0.15 },
  { key: "whisky", label: "Whisky",      sub: "30ml · 40%",  ml: 30,  pct: 0.40 },
];

const TIMES    = ["7 – 9 PM", "9 – 11 PM", "After 11 PM", "After midnight"];
const MOODS    = [
  { key: "great", label: "Great"  },
  { key: "ok",    label: "Fine"   },
  { key: "tired", label: "Tired"  },
  { key: "bad",   label: "Rough"  },
];
const SYMPTOMS = ["Headache", "Nausea", "Fatigue", "Dry mouth", "None"];
const FOCUS    = ["Low", "Below avg", "Average", "High"];

function calcAlcohol(counts) {
  return DRINKS.reduce((sum, d) => sum + (counts[d.key] || 0) * Math.round(d.ml * d.pct * 0.8), 0);
}

function alcoholComment(g) {
  if (g === 0)  return { text: "Recommended limit: 20g / day", color: "#aaa" };
  if (g <= 20)  return { text: "Within recommended range",     color: "#2d8a5e" };
  if (g <= 40)  return { text: "Slightly over",                color: "#b07000" };
  return              { text: "Exceeding the limit",           color: "#b03030" };
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function yesterdayLabel() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}
function todayLabel() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

const wrap = {
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  minHeight: "100vh",
  background: "#f5f5f3",
  display: "flex",
  justifyContent: "center",
  padding: "40px 16px 80px",
};

const card = {
  background: "#fff",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.07)",
  padding: "36px 28px 40px",
  width: "100%",
  maxWidth: 360,
  alignSelf: "flex-start",
};

const eyebrow = {
  fontSize: 10,
  letterSpacing: "0.14em",
  color: "#bbb",
  textTransform: "uppercase",
  margin: "0 0 6px",
};

const heading = {
  fontSize: 22,
  fontWeight: 400,
  color: "#111",
  margin: "0 0 32px",
  lineHeight: 1.35,
  letterSpacing: "-0.01em",
};

const sectionLabel = {
  fontSize: 9,
  letterSpacing: "0.16em",
  color: "#bbb",
  textTransform: "uppercase",
  marginBottom: 14,
};

const rule = {
  border: "none",
  borderTop: "1px solid rgba(0,0,0,0.06)",
  margin: "28px 0",
};

const btnBase = {
  padding: "10px 0",
  borderRadius: 6,
  border: "1px solid rgba(0,0,0,0.1)",
  background: "transparent",
  fontSize: 12,
  color: "#888",
  cursor: "pointer",
  letterSpacing: "0.02em",
};

const btnActive = {
  ...btnBase,
  border: "1px solid #111",
  color: "#111",
  fontWeight: 500,
};

function DrinkScreen({ onSave }) {
  const [counts, setCounts] = useState({});
  const [time,   setTime]   = useState(null);
  const [saved,  setSaved]  = useState(false);

  const total   = calcAlcohol(counts);
  const comment = alcoholComment(total);

  function change(key, delta) {
    setCounts(prev => ({ ...prev, [key]: Math.max(0, (prev[key] || 0) + delta) }));
  }

  function handleSave() {
    const record = { date: todayKey(), counts, time, alcohol: total };
    const all = JSON.parse(localStorage.getItem("drinklog") || "[]");
    all.push(record);
    localStorage.setItem("drinklog", JSON.stringify(all));
    setSaved(true);
    setTimeout(() => onSave(), 900);
  }

  return (
    <div style={wrap}>
      <div style={card}>
        <p style={eyebrow}>{yesterdayLabel()} — Last night</p>
        <p style={heading}>What did you drink?</p>

        <hr style={rule} />
        <p style={sectionLabel}>Drinks</p>

        {DRINKS.map(d => {
          const cnt = counts[d.key] || 0;
          return (
            <div key={d.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, color: "#111", letterSpacing: "-0.01em" }}>{d.label}</span>
                  {d.strong && (
                    <span style={{ fontSize: 9, letterSpacing: "0.12em", color: "#b07000", border: "1px solid #b07000", borderRadius: 3, padding: "1px 5px", textTransform: "uppercase" }}>Strong</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: "#ccc", marginTop: 3, letterSpacing: "0.02em" }}>{d.sub}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button onClick={() => change(d.key, -1)} style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.12)", background: "transparent", fontSize: 15, lineHeight: 1, color: "#999", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ fontSize: 17, fontWeight: cnt > 0 ? 500 : 400, color: cnt > 0 ? "#111" : "#ddd", minWidth: 16, textAlign: "center" }}>{cnt}</span>
                <button onClick={() => change(d.key, 1)}  style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.12)", background: "transparent", fontSize: 15, lineHeight: 1, color: "#999", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
            </div>
          );
        })}

        <div style={{ paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 11, color: "#bbb", letterSpacing: "0.04em" }}>Pure alcohol</span>
          <span>
            <span style={{ fontSize: 20, fontWeight: 400, color: "#111", letterSpacing: "-0.02em" }}>{total}</span>
            <span style={{ fontSize: 11, color: "#bbb", marginLeft: 3 }}>g</span>
          </span>
        </div>
        <div style={{ textAlign: "right", marginTop: 4 }}>
          <span style={{ fontSize: 11, color: comment.color, letterSpacing: "0.02em" }}>{comment.text}</span>
        </div>

        <hr style={rule} />
        <p style={sectionLabel}>Time</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 32 }}>
          {TIMES.map(t => (
            <button key={t} onClick={() => setTime(t)} style={time === t ? btnActive : btnBase}>
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          style={{ width: "100%", padding: 14, borderRadius: 6, border: "1px solid #111", background: saved ? "#111" : "transparent", color: saved ? "#fff" : "#111", fontSize: 13, letterSpacing: "0.06em", cursor: "pointer", transition: "background 0.25s, color 0.25s", textTransform: "uppercase" }}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}

function MorningScreen({ onDone }) {
  const [mood,     setMood]     = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [focus,    setFocus]    = useState(null);
  const [saved,    setSaved]    = useState(false);

  function toggleSymptom(s) {
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  function handleSave() {
    const record = { date: todayKey(), mood, symptoms, focus };
    const all = JSON.parse(localStorage.getItem("morninglog") || "[]");
    all.push(record);
    localStorage.setItem("morninglog", JSON.stringify(all));
    setSaved(true);
    setTimeout(() => onDone(), 900);
  }

  return (
    <div style={wrap}>
      <div style={card}>
        <p style={eyebrow}>{todayLabel()}</p>
        <p style={heading}>Good morning.</p>

        <hr style={rule} />
        <p style={sectionLabel}>Condition</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 28 }}>
          {MOODS.map(m => (
            <button key={m.key} onClick={() => setMood(m.key)} style={mood === m.key ? { ...btnActive, padding: "14px 8px" } : { ...btnBase, padding: "14px 8px" }}>
              {m.label}
            </button>
          ))}
        </div>

        <p style={sectionLabel}>Symptoms</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 28 }}>
          {SYMPTOMS.map(s => {
            const on = symptoms.includes(s);
            return (
              <button key={s} onClick={() => toggleSymptom(s)} style={{ padding: "6px 14px", borderRadius: 20, border: on ? "1px solid #111" : "1px solid rgba(0,0,0,0.1)", background: "transparent", fontSize: 12, color: on ? "#111" : "#aaa", cursor: "pointer", letterSpacing: "0.02em" }}>
                {s}
              </button>
            );
          })}
        </div>

        <p style={sectionLabel}>Focus</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5, marginBottom: 32 }}>
          {FOCUS.map(f => (
            <button key={f} onClick={() => setFocus(f)} style={focus === f ? { ...btnActive, fontSize: 11 } : { ...btnBase, fontSize: 11 }}>
              {f}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          style={{ width: "100%", padding: 14, borderRadius: 6, border: "1px solid #111", background: saved ? "#111" : "transparent", color: saved ? "#fff" : "#111", fontSize: 13, letterSpacing: "0.06em", cursor: "pointer", transition: "background 0.25s, color 0.25s", textTransform: "uppercase" }}
        >
          {saved ? "Saved" : "Save"}
        </button>
        <p style={{ textAlign: "center", fontSize: 10, color: "#ddd", marginTop: 10, letterSpacing: "0.06em" }}>Takes about 20 seconds</p>
      </div>
    </div>
  );
}

function CompleteScreen({ onReset }) {
  return (
    <div style={{ ...wrap, alignItems: "center" }}>
      <div style={{ ...card, textAlign: "center", padding: "56px 28px" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #111", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <polyline points="1.5,6 4.5,9 10.5,3" stroke="#111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p style={{ fontSize: 18, fontWeight: 400, color: "#111", margin: "0 0 10px", letterSpacing: "-0.01em" }}>Logged.</p>
        <p style={{ fontSize: 12, color: "#bbb", margin: "0 0 36px", lineHeight: 1.7, letterSpacing: "0.02em" }}>Patterns emerge<br />as data accumulates.</p>
        <button onClick={onReset} style={{ padding: "9px 24px", borderRadius: 6, border: "1px solid rgba(0,0,0,0.12)", background: "transparent", fontSize: 11, color: "#aaa", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Start over
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ onDrink, onMorning }) {
  return (
    <div style={wrap}>
      <div style={card}>
        <p style={eyebrow}>Drink Log</p>
        <p style={{ fontSize: 22, fontWeight: 400, color: "#111", margin: "0 0 8px", letterSpacing: "-0.01em" }}>Alcohol & Recovery</p>
        <p style={{ fontSize: 12, color: "#bbb", margin: "0 0 36px", lineHeight: 1.7, letterSpacing: "0.02em" }}>Track what you drink.<br />Understand how you feel.</p>

        <hr style={rule} />
        <p style={sectionLabel}>Log</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={onDrink} style={{ width: "100%", padding: "18px 20px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)", background: "transparent", textAlign: "left", cursor: "pointer" }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#111", margin: "0 0 3px", letterSpacing: "-0.01em" }}>Last night's drinks</p>
            <p style={{ fontSize: 11, color: "#bbb", margin: 0, letterSpacing: "0.02em" }}>Type, count, and timing</p>
          </button>
          <button onClick={onMorning} style={{ width: "100%", padding: "18px 20px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)", background: "transparent", textAlign: "left", cursor: "pointer" }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#111", margin: "0 0 3px", letterSpacing: "-0.01em" }}>Morning condition</p>
            <p style={{ fontSize: 11, color: "#bbb", margin: 0, letterSpacing: "0.02em" }}>Mood, symptoms, and focus</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");

  return (
    <>
      {screen === "home"     && <HomeScreen    onDrink={() => setScreen("drink")} onMorning={() => setScreen("morning")} />}
      {screen === "drink"    && <DrinkScreen   onSave={() => setScreen("morning")} />}
      {screen === "morning"  && <MorningScreen onDone={() => setScreen("complete")} />}
      {screen === "complete" && <CompleteScreen onReset={() => setScreen("home")} />}
    </>
  );
}
