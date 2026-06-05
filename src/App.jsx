import { useState, useEffect } from "react";

const DRINKS = [
  { key: "beer",   label: "ビール",              sub: "350ml / 5%",  ml: 350, pct: 0.05 },
  { key: "chu5",   label: "チューハイ 5%",        sub: "350ml / 5%",  ml: 350, pct: 0.05 },
  { key: "chu9",   label: "チューハイ 9%",        sub: "500ml / 9%",  ml: 500, pct: 0.09, strong: true },
  { key: "wine",   label: "ワイン",               sub: "120ml / 12%", ml: 120, pct: 0.12 },
  { key: "sake",   label: "日本酒",               sub: "180ml / 15%", ml: 180, pct: 0.15 },
  { key: "whisky", label: "ウイスキー",            sub: "30ml / 40%",  ml: 30,  pct: 0.40 },
];

const TIMES = ["19〜21時", "21〜23時", "23時以降", "深夜0時以降"];
const MOODS = [
  { key: "great",  label: "絶好調", icon: "😄" },
  { key: "ok",     label: "まあまあ", icon: "😐" },
  { key: "tired",  label: "眠い",   icon: "😴" },
  { key: "bad",    label: "つらい", icon: "🤕" },
];
const SYMPTOMS = ["頭痛", "胃もたれ", "だるい", "口が乾く", "なし"];
const FOCUS    = ["低", "やや低", "普通", "高い"];

function calcAlcohol(counts) {
  return DRINKS.reduce((sum, d) => sum + (counts[d.key] || 0) * Math.round(d.ml * d.pct * 0.8), 0);
}

function alcoholComment(g) {
  if (g === 0)  return { text: "適量の目安は 20g / 日", color: "#888" };
  if (g <= 20)  return { text: "適量範囲内です",         color: "#1a9e60" };
  if (g <= 40)  return { text: "少し多めです",           color: "#c97a00" };
  return              { text: "飲みすぎかも",            color: "#c0392b" };
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function yesterdayLabel() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" });
}
function todayLabel() {
  return new Date().toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" });
}

const base = {
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  minHeight: "100vh",
  background: "#f5f4f0",
  display: "flex",
  justifyContent: "center",
  padding: "32px 16px 64px",
};

const card = {
  background: "#fff",
  borderRadius: 16,
  border: "0.5px solid rgba(0,0,0,0.1)",
  padding: "32px 24px 36px",
  width: "100%",
  maxWidth: 360,
};

const sectionLabel = {
  fontSize: 10,
  letterSpacing: "0.1em",
  color: "#aaa",
  textTransform: "uppercase",
  marginBottom: 12,
};

const divider = {
  border: "none",
  borderTop: "0.5px solid rgba(0,0,0,0.08)",
  margin: "24px 0",
};

function DrinkScreen({ onSave }) {
  const [counts, setCounts] = useState({});
  const [time, setTime]     = useState(null);
  const [saved, setSaved]   = useState(false);

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
    <div style={base}>
      <div style={card}>
        <p style={{ fontSize: 11, letterSpacing: "0.08em", color: "#bbb", margin: "0 0 4px", textTransform: "uppercase" }}>
          {yesterdayLabel()} — 昨夜
        </p>
        <p style={{ fontSize: 22, fontWeight: 500, margin: "0 0 28px", color: "#111", lineHeight: 1.3 }}>
          何を飲みましたか？
        </p>

        <hr style={divider} />

        <p style={sectionLabel}>種類と本数</p>

        {DRINKS.map(d => {
          const cnt = counts[d.key] || 0;
          return (
            <div key={d.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
              <div>
                <span style={{ fontSize: 14, color: "#111" }}>{d.label}</span>
                {d.strong && (
                  <span style={{ fontSize: 10, color: "#c97a00", border: "0.5px solid #c97a00", borderRadius: 4, padding: "1px 5px", marginLeft: 6 }}>STRONG</span>
                )}
                <div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>{d.sub}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button onClick={() => change(d.key, -1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "0.5px solid rgba(0,0,0,0.15)", background: "transparent", fontSize: 16, color: "#888", cursor: "pointer" }}>−</button>
                <span style={{ fontSize: 18, fontWeight: cnt > 0 ? 500 : 400, color: cnt > 0 ? "#111" : "#ccc", minWidth: 18, textAlign: "center" }}>{cnt}</span>
                <button onClick={() => change(d.key, 1)}  style={{ width: 28, height: 28, borderRadius: "50%", border: "0.5px solid rgba(0,0,0,0.15)", background: "transparent", fontSize: 16, color: "#888", cursor: "pointer" }}>+</button>
              </div>
            </div>
          );
        })}

        <div style={{ paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 12, color: "#888" }}>純アルコール量</span>
          <span>
            <span style={{ fontSize: 20, fontWeight: 500, color: "#111" }}>{total}</span>
            <span style={{ fontSize: 12, color: "#888", marginLeft: 3 }}>g</span>
          </span>
        </div>
        <div style={{ textAlign: "right", marginTop: 3 }}>
          <span style={{ fontSize: 11, color: comment.color }}>{comment.text}</span>
        </div>

        <hr style={divider} />

        <p style={sectionLabel}>飲んだ時間帯</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 28 }}>
          {TIMES.map(t => (
            <button key={t} onClick={() => setTime(t)} style={{ padding: "10px 0", borderRadius: 8, border: time === t ? "1px solid #111" : "0.5px solid rgba(0,0,0,0.12)", background: "transparent", fontSize: 12, color: time === t ? "#111" : "#888", fontWeight: time === t ? 500 : 400, cursor: "pointer" }}>
              {t}
            </button>
          ))}
        </div>

        <button onClick={handleSave} style={{ width: "100%", padding: 14, borderRadius: 8, border: "0.5px solid #111", background: saved ? "#111" : "transparent", color: saved ? "#fff" : "#111", fontSize: 14, letterSpacing: "0.04em", cursor: "pointer", transition: "background 0.2s, color 0.2s" }}>
          {saved ? "記録しました" : "記録する"}
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
    <div style={base}>
      <div style={card}>
        <p style={{ fontSize: 11, letterSpacing: "0.08em", color: "#bbb", margin: "0 0 4px", textTransform: "uppercase" }}>
          {todayLabel()}
        </p>
        <p style={{ fontSize: 22, fontWeight: 500, margin: "0 0 28px", color: "#111", lineHeight: 1.3 }}>
          Good morning.
        </p>

        <hr style={divider} />

        <p style={sectionLabel}>今日の調子</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
          {MOODS.map(m => (
            <button key={m.key} onClick={() => setMood(m.key)} style={{ padding: "14px 8px", borderRadius: 8, border: mood === m.key ? "1px solid #111" : "0.5px solid rgba(0,0,0,0.1)", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 22 }}>{m.icon}</span>
              <span style={{ fontSize: 12, color: mood === m.key ? "#111" : "#888", fontWeight: mood === m.key ? 500 : 400 }}>{m.label}</span>
            </button>
          ))}
        </div>

        <p style={sectionLabel}>症状</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {SYMPTOMS.map(s => {
            const on = symptoms.includes(s);
            return (
              <button key={s} onClick={() => toggleSymptom(s)} style={{ padding: "6px 14px", borderRadius: 20, border: on ? "1px solid #111" : "0.5px solid rgba(0,0,0,0.12)", background: "transparent", fontSize: 13, color: on ? "#111" : "#888", cursor: "pointer" }}>
                {s}
              </button>
            );
          })}
        </div>

        <p style={sectionLabel}>集中力</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 6, marginBottom: 28 }}>
          {FOCUS.map(f => (
            <button key={f} onClick={() => setFocus(f)} style={{ padding: "10px 0", borderRadius: 8, border: focus === f ? "1px solid #111" : "0.5px solid rgba(0,0,0,0.12)", background: "transparent", fontSize: 12, color: focus === f ? "#111" : "#888", fontWeight: focus === f ? 500 : 400, cursor: "pointer" }}>
              {f}
            </button>
          ))}
        </div>

        <button onClick={handleSave} style={{ width: "100%", padding: 14, borderRadius: 8, border: "0.5px solid #111", background: saved ? "#111" : "transparent", color: saved ? "#fff" : "#111", fontSize: 14, letterSpacing: "0.04em", cursor: "pointer", transition: "background 0.2s, color 0.2s" }}>
          {saved ? "記録しました" : "記録する"}
        </button>
        <p style={{ textAlign: "center", fontSize: 11, color: "#ccc", marginTop: 8 }}>所要時間：約20秒</p>
      </div>
    </div>
  );
}

function CompleteScreen({ onReset }) {
  return (
    <div style={{ ...base, alignItems: "center" }}>
      <div style={{ ...card, textAlign: "center", padding: "48px 24px" }}>
        <p style={{ fontSize: 32, marginBottom: 16 }}>✓</p>
        <p style={{ fontSize: 20, fontWeight: 500, color: "#111", marginBottom: 8 }}>記録完了</p>
        <p style={{ fontSize: 13, color: "#aaa", marginBottom: 32 }}>データが蓄積されると<br />相関グラフが見えてくるよ</p>
        <button onClick={onReset} style={{ padding: "10px 28px", borderRadius: 8, border: "0.5px solid rgba(0,0,0,0.15)", background: "transparent", fontSize: 13, color: "#888", cursor: "pointer" }}>
          最初に戻る
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ onDrink, onMorning }) {
  return (
    <div style={{ ...base, alignItems: "flex-start" }}>
      <div style={{ ...card }}>
        <p style={{ fontSize: 11, letterSpacing: "0.08em", color: "#bbb", margin: "0 0 4px", textTransform: "uppercase" }}>Drink Log</p>
        <p style={{ fontSize: 22, fontWeight: 500, color: "#111", margin: "0 0 6px" }}>飲酒×コンディション</p>
        <p style={{ fontSize: 13, color: "#aaa", margin: "0 0 32px" }}>記録を続けると、自分のパターンが見えてくる。</p>

        <hr style={divider} />

        <p style={sectionLabel}>記録する</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={onDrink} style={{ width: "100%", padding: "16px 20px", borderRadius: 10, border: "0.5px solid rgba(0,0,0,0.12)", background: "transparent", textAlign: "left", cursor: "pointer" }}>
            <p style={{ fontSize: 15, fontWeight: 500, color: "#111", margin: "0 0 2px" }}>🍺 昨夜の飲酒</p>
            <p style={{ fontSize: 12, color: "#aaa", margin: 0 }}>種類・本数・時間帯を入力</p>
          </button>
          <button onClick={onMorning} style={{ width: "100%", padding: "16px 20px", borderRadius: 10, border: "0.5px solid rgba(0,0,0,0.12)", background: "transparent", textAlign: "left", cursor: "pointer" }}>
            <p style={{ fontSize: 15, fontWeight: 500, color: "#111", margin: "0 0 2px" }}>☀️ 今朝のコンディション</p>
            <p style={{ fontSize: 12, color: "#aaa", margin: 0 }}>調子・症状・集中力を記録</p>
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
