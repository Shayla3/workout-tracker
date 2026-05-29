import { useState, useEffect, useRef, useCallback } from "react";

const EXERCISE_POOL = [
  { name: "Push-Ups", icon: "💪", muscle: "Chest & Triceps" },
  { name: "Tricep Dips", icon: "🪑", muscle: "Triceps" },
  { name: "Pike Push-Ups", icon: "🔺", muscle: "Shoulders" },
  { name: "Diamond Push-Ups", icon: "💎", muscle: "Triceps & Chest" },
  { name: "Wide Push-Ups", icon: "↔️", muscle: "Outer Chest" },
  { name: "Squats", icon: "🦵", muscle: "Quads & Glutes" },
  { name: "Lunges", icon: "🚶", muscle: "Legs & Glutes" },
  { name: "Wall Sit", icon: "🧱", muscle: "Quads & Glutes" },
  { name: "Step-Ups", icon: "🪜", muscle: "Legs & Glutes" },
  { name: "Sumo Squats", icon: "🏋️", muscle: "Inner Thighs & Glutes" },
  { name: "Calf Raises", icon: "🦶", muscle: "Calves" },
  { name: "Glute Bridges", icon: "🌉", muscle: "Glutes & Hamstrings" },
  { name: "Donkey Kicks", icon: "🫏", muscle: "Glutes & Hamstrings" },
  { name: "Reverse Lunges", icon: "↩️", muscle: "Quads & Glutes" },
  { name: "Single-Leg Deadlift", icon: "🦩", muscle: "Hamstrings & Balance" },
  { name: "Fire Hydrants", icon: "🚒", muscle: "Hip Abductors" },
  { name: "Squat Pulses", icon: "〰️", muscle: "Quads & Glutes" },
  { name: "Plank", icon: "🧘", muscle: "Core" },
  { name: "Superman Hold", icon: "🦸", muscle: "Lower Back" },
  { name: "Crunches", icon: "🌀", muscle: "Abs" },
  { name: "Bicycle Crunches", icon: "🚲", muscle: "Obliques & Abs" },
  { name: "Leg Raises", icon: "🦵⬆️", muscle: "Lower Abs" },
  { name: "Dead Bug", icon: "🐛", muscle: "Deep Core" },
  { name: "Russian Twists", icon: "🔄", muscle: "Obliques" },
  { name: "Hollow Body Hold", icon: "🫘", muscle: "Full Core" },
  { name: "Toe Touches", icon: "👆", muscle: "Upper Abs" },
  { name: "Side Plank", icon: "📐", muscle: "Obliques & Core" },
  { name: "Flutter Kicks", icon: "🦋", muscle: "Lower Abs" },
];

function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function getDailyExercises(dateStr) {
  const seed = dateStr.split("-").reduce((acc, n) => acc * 100 + parseInt(n), 0);
  return seededShuffle(EXERCISE_POOL, seed).slice(0, 3);
}
function getTodayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ── Wheel Selector ──────────────────────────────────────────────────────────
function WheelSelector({ values, selected, onChange, label }) {
  const ITEM_H = 36, VISIBLE = 5;
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startIdx = useRef(0);
  const currentIdx = Math.max(0, values.indexOf(selected));
  const scrollToIndex = useCallback((idx, smooth = true) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({ top: idx * ITEM_H, behavior: smooth ? "smooth" : "auto" });
  }, []);
  useEffect(() => { scrollToIndex(currentIdx, false); }, []);
  const handleScroll = () => {
    if (!containerRef.current) return;
    const idx = Math.round(containerRef.current.scrollTop / ITEM_H);
    const clamped = Math.max(0, Math.min(values.length - 1, idx));
    if (values[clamped] !== selected) onChange(values[clamped]);
  };
  const onTouchStart = (e) => { isDragging.current = true; startY.current = e.touches[0].clientY; startIdx.current = currentIdx; };
  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    const delta = startY.current - e.touches[0].clientY;
    scrollToIndex(Math.max(0, Math.min(values.length - 1, Math.round(startIdx.current + delta / ITEM_H))), false);
  };
  const onTouchEnd = () => { isDragging.current = false; };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
      <div style={{ fontSize: 10, color: "#666", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ position: "relative", width: 64, height: ITEM_H * VISIBLE, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: ITEM_H * 2, left: 0, right: 0, height: ITEM_H, background: "transparent", borderTop: "1px solid #2a3040", borderBottom: "1px solid #2a3040", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: ITEM_H * 2, background: "linear-gradient(to bottom, #0d0f14, transparent)", pointerEvents: "none", zIndex: 2 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: ITEM_H * 2, background: "linear-gradient(to top, #0d0f14, transparent)", pointerEvents: "none", zIndex: 2 }} />
        <div ref={containerRef} onScroll={handleScroll} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
          style={{ height: "100%", overflowY: "scroll", scrollSnapType: "y mandatory", scrollbarWidth: "none" }}>
          <div style={{ height: ITEM_H * 2 }} />
          {values.map((v, idx) => (
            <div key={v} onClick={() => { onChange(v); scrollToIndex(idx); }} style={{
              height: ITEM_H, display: "flex", alignItems: "center", justifyContent: "center",
              scrollSnapAlign: "center", cursor: "pointer",
              fontSize: v === selected ? 18 : 14, fontWeight: v === selected ? 800 : 400,
              color: v === selected ? "#f0f0f0" : "#444", transition: "all 0.15s",
            }}>{v}</div>
          ))}
          <div style={{ height: ITEM_H * 2 }} />
        </div>
      </div>
    </div>
  );
}

const REPS_VALUES = Array.from({ length: 100 }, (_, i) => i + 1);
const SETS_VALUES = Array.from({ length: 10 }, (_, i) => i + 1);
const WEIGHT_VALUES = ["BW", ...Array.from({ length: 250 }, (_, i) => `${i + 1}`)];

// ── Exercise Picker Sheet ───────────────────────────────────────────────────
function ExercisePickerSheet({ title, subtitle, currentExercises, onPick, onClose }) {
  const usedNames = new Set(currentExercises.map(e => e.name));
  const available = EXERCISE_POOL.filter(e => !usedNames.has(e.name));
  const [search, setSearch] = useState("");
  const filtered = available.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.muscle.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ flex: 1, background: "rgba(0,0,0,0.6)" }} />
      <div style={{ background: "#13161e", borderRadius: "20px 20px 0 0", padding: "20px 0 40px", maxHeight: "75vh", display: "flex", flexDirection: "column", border: "1.5px solid #1e2130", borderBottom: "none" }}>
        <div style={{ padding: "0 20px 14px", borderBottom: "1px solid #1e2130" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
              {subtitle && <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{subtitle}</div>}
            </div>
            <button onClick={onClose} style={{ background: "#1e2130", border: "none", color: "#888", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search exercises..."
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #1e2130", background: "#0d0f14", color: "#f0f0f0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ overflowY: "auto", padding: "8px 16px" }}>
          {filtered.length === 0 && <div style={{ textAlign: "center", color: "#444", fontSize: 13, padding: "24px 0" }}>No exercises found</div>}
          {filtered.map((ex) => (
            <button key={ex.name} onClick={() => onPick(ex)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, background: "none", border: "none", padding: "12px 8px", cursor: "pointer", borderBottom: "1px solid #1a1d26", textAlign: "left" }}>
              <span style={{ fontSize: 22, width: 32 }}>{ex.icon}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#f0f0f0" }}>{ex.name}</div>
                <div style={{ fontSize: 12, color: "#555" }}>{ex.muscle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Mini Line Chart ─────────────────────────────────────────────────────────
function MiniLineChart({ data, color = "#4caf93", label }) {
  if (!data || data.length < 2) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 120, color: "#444", fontSize: 12 }}>
      Not enough data yet
    </div>
  );
  const W = 340, H = 120, PAD = { top: 12, right: 12, bottom: 28, left: 36 };
  const vals = data.map(d => d.value);
  const minV = Math.min(...vals), maxV = Math.max(...vals);
  const range = maxV - minV || 1;
  const xStep = (W - PAD.left - PAD.right) / (data.length - 1);
  const toX = i => PAD.left + i * xStep;
  const toY = v => PAD.top + (1 - (v - minV) / range) * (H - PAD.top - PAD.bottom);
  const pathD = data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(d.value).toFixed(1)}`).join(" ");
  const areaD = `${pathD} L${toX(data.length - 1).toFixed(1)},${H - PAD.bottom} L${toX(0).toFixed(1)},${H - PAD.bottom} Z`;

  // Y axis ticks
  const ticks = [minV, minV + range / 2, maxV].map(v => ({ v: Math.round(v), y: toY(v) }));
  // X axis labels — show first, middle, last
  const xLabels = [0, Math.floor((data.length - 1) / 2), data.length - 1].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H, display: "block" }}>
      <defs>
        <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {ticks.map(t => (
        <g key={t.v}>
          <line x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y} stroke="#1e2130" strokeWidth="1" />
          <text x={PAD.left - 4} y={t.y + 4} textAnchor="end" fill="#555" fontSize="9">{t.v}</text>
        </g>
      ))}
      {/* Area fill */}
      <path d={areaD} fill={`url(#grad-${label})`} />
      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {data.map((d, i) => (
        <circle key={i} cx={toX(i)} cy={toY(d.value)} r="3" fill={color} />
      ))}
      {/* X labels */}
      {xLabels.map(i => (
        <text key={i} x={toX(i)} y={H - 6} textAnchor="middle" fill="#555" fontSize="9">{data[i].date}</text>
      ))}
    </svg>
  );
}

// ── Multi-Line Volume Chart ─────────────────────────────────────────────────
function MultiLineChart({ exercises, selectedName, onSelect }) {
  const COLORS = ["#4caf93","#f9a825","#e85d2e","#7c6af7","#2ee8d8","#f97b8a","#a8e64a"];
  const W = 340, H = 150, PAD = { top: 12, right: 12, bottom: 28, left: 36 };

  // Gather all values for global min/max
  const allVals = exercises.flatMap(e => e.points.map(p => p.value));
  const minV = Math.min(...allVals), maxV = Math.max(...allVals);
  const range = maxV - minV || 1;

  // Gather all unique dates in order
  const allDates = [...new Set(exercises.flatMap(e => e.points.map(p => p.fullDate)))].sort();
  if (allDates.length < 2) return null;

  const toX = (dateStr) => {
    const idx = allDates.indexOf(dateStr);
    return PAD.left + (idx / (allDates.length - 1)) * (W - PAD.left - PAD.right);
  };
  const toY = (v) => PAD.top + (1 - (v - minV) / range) * (H - PAD.top - PAD.bottom);

  const ticks = [minV, minV + range / 2, maxV].map(v => ({ v: Math.round(v), y: toY(v) }));
  const xLabelIdxs = [0, Math.floor((allDates.length - 1) / 2), allDates.length - 1].filter((v, i, a) => a.indexOf(v) === i);
  const toShortDate = (str) => { const d = new Date(str + "T12:00:00"); return `${d.getMonth()+1}/${d.getDate()}`; };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H, display: "block" }}>
      <defs>
        {exercises.map((e, idx) => (
          <linearGradient key={e.name} id={`mgrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS[idx % COLORS.length]} stopOpacity="0.15" />
            <stop offset="100%" stopColor={COLORS[idx % COLORS.length]} stopOpacity="0.0" />
          </linearGradient>
        ))}
      </defs>
      {/* Grid */}
      {ticks.map(t => (
        <g key={t.v}>
          <line x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y} stroke="#1e2130" strokeWidth="1" />
          <text x={PAD.left - 4} y={t.y + 4} textAnchor="end" fill="#555" fontSize="9">{t.v}</text>
        </g>
      ))}
      {/* X labels */}
      {xLabelIdxs.map(i => (
        <text key={i} x={toX(allDates[i])} y={H - 6} textAnchor="middle" fill="#555" fontSize="9">{toShortDate(allDates[i])}</text>
      ))}
      {/* Lines per exercise — dimmed unless selected */}
      {exercises.map((e, idx) => {
        const color = COLORS[idx % COLORS.length];
        const isSelected = e.name === selectedName;
        const pts = e.points;
        const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.fullDate).toFixed(1)},${toY(p.value).toFixed(1)}`).join(" ");
        const areaD = `${pathD} L${toX(pts[pts.length-1].fullDate).toFixed(1)},${H-PAD.bottom} L${toX(pts[0].fullDate).toFixed(1)},${H-PAD.bottom} Z`;
        return (
          <g key={e.name} onClick={() => onSelect(e.name)} style={{ cursor: "pointer" }}>
            {isSelected && <path d={areaD} fill={`url(#mgrad-${idx})`} />}
            <path d={pathD} fill="none" stroke={color} strokeWidth={isSelected ? 2.5 : 1} strokeOpacity={isSelected ? 1 : 0.3} strokeLinecap="round" strokeLinejoin="round" />
            {isSelected && pts.map((p, i) => (
              <circle key={i} cx={toX(p.fullDate)} cy={toY(p.value)} r="3" fill={color} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ── Progress View ───────────────────────────────────────────────────────────
function ProgressView({ history }) {
  const exerciseMap = {};
  [...history].reverse().forEach(entry => {
    entry.exercises.forEach(ex => {
      if (!exerciseMap[ex.name]) exerciseMap[ex.name] = { name: ex.name, icon: ex.icon, entries: [] };
      exerciseMap[ex.name].entries.push({
        date: entry.date,
        volume: ex.reps * ex.sets,
        weight: ex.useWeight && ex.weight !== "BW" ? Number(ex.weight) : null,
      });
    });
  });

  const exercises = Object.values(exerciseMap);
  const [selected, setSelected] = useState(exercises[0]?.name || null);
  const [metric, setMetric] = useState("volume");
  const [displayMode, setDisplayMode] = useState("chart");

  useEffect(() => {
    if (!selected && exercises.length > 0) setSelected(exercises[0].name);
  }, [exercises.length]);

  if (exercises.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#444", fontSize: 14, marginTop: 60, padding: "0 24px" }}>
        Complete workouts to see your progress here.
      </div>
    );
  }

  const ex = exerciseMap[selected];
  const entries = ex?.entries || [];

  const toChartDate = (dateStr) => {
    const d = new Date(dateStr + "T12:00:00");
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const volumeChartData = entries.map(e => ({ date: toChartDate(e.date), value: e.volume, fullDate: e.date }));
  const weightChartData = entries.filter(e => e.weight !== null).map(e => ({ date: toChartDate(e.date), value: e.weight, fullDate: e.date }));

  const chartData = metric === "volume" ? volumeChartData : weightChartData;
  const metricColor = metric === "volume" ? "#4caf93" : "#f9a825";
  const metricLabel = metric === "volume" ? "Volume (reps × sets)" : "Weight (kg)";

  const formatShortDate = (str) => {
    const d = new Date(str + "T12:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Multi-line volume chart data — all exercises for overview
  const allVolumeData = exercises.map(e => ({
    name: e.name,
    icon: e.icon,
    points: exerciseMap[e.name].entries.map(en => ({ date: toChartDate(en.date), value: en.volume, fullDate: en.date })),
  })).filter(e => e.points.length >= 2);

  return (
    <div style={{ padding: "0 16px" }}>

      {/* ── All-Exercise Volume Overview Chart ── */}
      {allVolumeData.length > 0 && (
        <div style={{ background: "#13161e", borderRadius: 20, border: "1.5px solid #1e2130", padding: "16px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>📊 Volume Over Time</div>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 12 }}>All exercises — reps × sets per session</div>
          <MultiLineChart exercises={allVolumeData} selectedName={selected} onSelect={setSelected} />
          {/* Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {allVolumeData.map((e, idx) => {
              const COLORS = ["#4caf93","#f9a825","#e85d2e","#7c6af7","#2ee8d8","#f97b8a","#a8e64a"];
              const color = COLORS[idx % COLORS.length];
              return (
                <button key={e.name} onClick={() => setSelected(e.name)} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: selected === e.name ? "#1e2130" : "transparent",
                  border: `1px solid ${selected === e.name ? color : "#1e2130"}`,
                  borderRadius: 20, padding: "4px 10px", cursor: "pointer",
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                  <span style={{ fontSize: 11, color: selected === e.name ? "#f0f0f0" : "#666", fontWeight: selected === e.name ? 700 : 400 }}>{e.icon} {e.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Exercise selector pills */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 4 }}>
        {exercises.map(e => (
          <button key={e.name} onClick={() => setSelected(e.name)} style={{
            flexShrink: 0, padding: "7px 14px", borderRadius: 20,
            border: `1.5px solid ${selected === e.name ? "#4caf93" : "#1e2130"}`,
            background: selected === e.name ? "#131d18" : "transparent",
            color: selected === e.name ? "#4caf93" : "#666",
            fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
          }}>
            {e.icon} {e.name}
          </button>
        ))}
      </div>

      {ex && (
        <div style={{ background: "#13161e", borderRadius: 20, border: "1.5px solid #1e2130", padding: "18px 16px", marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{ex.icon} {ex.name}</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{entries.length} session{entries.length !== 1 ? "s" : ""} recorded</div>
            </div>
            <div style={{ display: "flex", background: "#0d0f14", borderRadius: 8, padding: 2, gap: 2 }}>
              {["chart", "table"].map(m => (
                <button key={m} onClick={() => setDisplayMode(m)} style={{
                  padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                  background: displayMode === m ? "#1e2130" : "transparent",
                  color: displayMode === m ? "#f0f0f0" : "#555", fontSize: 11, fontWeight: 600,
                }}>{m === "chart" ? "📈" : "📋"}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {[["volume", "📊 Volume"], ["weight", "⚖️ Weight"]].map(([m, lbl]) => (
              <button key={m} onClick={() => setMetric(m)} style={{
                flex: 1, padding: "8px", borderRadius: 10, border: "none", cursor: "pointer",
                background: metric === m ? (m === "volume" ? "#131d18" : "#1a1800") : "#0d0f14",
                color: metric === m ? (m === "volume" ? "#4caf93" : "#f9a825") : "#555",
                fontSize: 12, fontWeight: 700,
                outline: metric === m ? `1.5px solid ${m === "volume" ? "#4caf9344" : "#f9a82544"}` : "none",
              }}>{lbl}</button>
            ))}
          </div>

          {chartData.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[
                ["Latest", chartData[chartData.length - 1].value],
                ["Best", Math.max(...chartData.map(d => d.value))],
                ["Sessions", chartData.length],
              ].map(([l, v]) => (
                <div key={l} style={{ flex: 1, background: "#0d0f14", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: metricColor }}>{v}</div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2, textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
                </div>
              ))}
            </div>
          )}

          {displayMode === "chart" && (
            chartData.length < 2
              ? <div style={{ textAlign: "center", color: "#444", fontSize: 12, padding: "24px 0" }}>
                  {metric === "weight" ? "No weight data recorded yet." : "Need at least 2 sessions to show a chart."}
                </div>
              : <div style={{ background: "#0d0f14", borderRadius: 12, padding: "12px 8px 4px" }}>
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 4, paddingLeft: 8, textTransform: "uppercase", letterSpacing: 1 }}>{metricLabel}</div>
                  <MiniLineChart data={chartData} color={metricColor} label={`${selected}-${metric}`} />
                </div>
          )}

          {displayMode === "table" && (
            <div style={{ background: "#0d0f14", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "8px 12px", borderBottom: "1px solid #1a1d26" }}>
                {["Date", "Volume", "Weight"].map(h => (
                  <div key={h} style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1, textAlign: h === "Date" ? "left" : "right" }}>{h}</div>
                ))}
              </div>
              {[...entries].reverse().map((e, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "10px 12px", borderBottom: "1px solid #131620", background: i % 2 === 0 ? "transparent" : "#0a0c10" }}>
                  <div style={{ fontSize: 12, color: "#888" }}>{formatShortDate(e.date)}</div>
                  <div style={{ fontSize: 12, color: "#4caf93", textAlign: "right", fontWeight: 700 }}>{e.volume}</div>
                  <div style={{ fontSize: 12, color: e.weight ? "#f9a825" : "#333", textAlign: "right", fontWeight: e.weight ? 700 : 400 }}>
                    {e.weight ? `${e.weight} kg` : "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Confetti ────────────────────────────────────────────────────────────────
const RAINBOW = ["#FF0000","#FF4500","#FF7F00","#FFD700","#ADFF2F","#00FF7F","#00CED1","#1E90FF","#8A2BE2","#FF1493"];

function drawStar(ctx, cx, cy, r, rot) {
  const spikes = 5, inner = r * 0.45;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes - Math.PI / 2 + rot;
    const radius = i % 2 === 0 ? r : inner;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

function Confetti({ active }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particles = useRef([]);
  const startTime = useRef(null);
  const DURATION = 3000;

  useEffect(() => {
    if (!active) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      particles.current = [];
      startTime.current = null;
      const canvas = canvasRef.current;
      if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    startTime.current = performance.now();

    particles.current = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 300,
      vx: (Math.random() - 0.5) * 2.45,
      vy: 1.05 + Math.random() * 2.45,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.105,
      size: 4 + Math.random() * 7,
      color: RAINBOW[Math.floor(Math.random() * RAINBOW.length)],
      opacity: 1,
      gravity: 0.056 + Math.random() * 0.049,
      sway: Math.random() * 0.028,
      swayOff: Math.random() * Math.PI * 2,
    }));

    const draw = (now) => {
      const elapsed = now - startTime.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.current.forEach(p => {
        p.vy += p.gravity;
        p.x += p.vx + Math.sin(now * 0.002 + p.swayOff) * p.sway;
        p.y += p.vy;
        p.rot += p.rotV;

        // Fade out over final 1s of the 3s window
        const fadeStart = DURATION - 1000;
        if (elapsed > fadeStart) {
          p.opacity = Math.max(0, 1 - (elapsed - fadeStart) / 1000);
        }
        if (p.opacity <= 0 || p.y > canvas.height + 20) return;
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        drawStar(ctx, p.x, p.y, p.size, p.rot);
        ctx.restore();
      });

      if (alive && elapsed < DURATION + 500) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [active]);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0, pointerEvents: "none",
      zIndex: 299, width: "100%", height: "100%",
    }} />
  );
}

// ── Main App ────────────────────────────────────────────────────────────────
export default function WorkoutTracker() {
  const today = getTodayStr();
  const defaultExercises = getDailyExercises(today);
  const storageKey = `workout-${today}`;
  const historyKey = "workout-history";

  const loadState = () => {
    try { const raw = localStorage.getItem(storageKey); if (raw) return JSON.parse(raw); } catch {}
    return defaultExercises.map((e) => ({ ...e, sets: 3, reps: 10, weight: "BW", useWeight: false, done: false }));
  };

  const [items, setItems] = useState(loadState);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(historyKey)) || []; } catch { return []; }
  });
  const [view, setView] = useState("today");
  const [celebrate, setCelebrate] = useState(false);
  const [swapIndex, setSwapIndex] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const update = (i, field, value) => setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  const toggle = (i) => update(i, "done", !items[i].done);
  const handleSwap = (index, newEx) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...newEx, sets: item.sets, reps: item.reps, weight: item.weight, useWeight: item.useWeight, done: false } : item));
    setSwapIndex(null);
  };
  const handleAdd = (exercise) => {
    setItems(prev => [...prev, { ...exercise, sets: 3, reps: 10, weight: "BW", useWeight: false, done: false }]);
    setShowAdd(false);
  };
  const handleRemove = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const handleCompleteDay = () => {
    const completed = items.map(item => ({ ...item, done: true }));
    setItems(completed);
    const entry = { date: today, exercises: completed };
    const existing = history.find((h) => h.date === today);
    const newHistory = existing
      ? history.map(h => h.date === today ? entry : h)
      : [entry, ...history].slice(0, 90);
    setHistory(newHistory);
    localStorage.setItem(historyKey, JSON.stringify(newHistory));
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 3500);
  };

  const doneCount = items.filter((i) => i.done).length;
  const total = items.length;
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  const weightLabel = (item) => item.weight === "BW" ? "Bodyweight" : `${item.weight} kg`;
  const formatDate = (str) => {
    const d = new Date(str + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f14", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#f0f0f0", maxWidth: 420, margin: "0 auto", padding: "0 0 80px" }}>
      {celebrate && (
        <>
          <Confetti active={celebrate} />
          <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#f9a825,#ff6f00)", color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 28px", borderRadius: "0 0 16px 16px", zIndex: 300, textAlign: "center", boxShadow: "0 4px 24px #f9a82566", animation: "slideDown 0.4s ease", whiteSpace: "nowrap" }}>
            🏆 All done! Great work today!
          </div>
        </>
      )}

      {/* Header */}
      <div style={{ padding: "52px 24px 24px", background: "linear-gradient(180deg,#13161e 0%,#0d0f14 100%)" }}>
        <div style={{ fontSize: 12, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{formatDate(today)}</div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>Daily Workout</div>
        {view === "today" && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginBottom: 8 }}>
              <span>{doneCount}/{total} complete</span>
              <span style={{ color: pct === 100 ? "#4caf93" : "#888" }}>{pct}%</span>
            </div>
            <div style={{ background: "#1e2130", borderRadius: 99, height: 6 }}>
              <div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: pct === 100 ? "linear-gradient(90deg,#4caf93,#2ee8b0)" : "linear-gradient(90deg,#e85d2e,#f9a825)", transition: "width 0.5s cubic-bezier(.4,0,.2,1)" }} />
            </div>
          </div>
        )}
      </div>

      {/* Tabs — now 3 */}
      <div style={{ display: "flex", padding: "0 24px", gap: 6, marginBottom: 8 }}>
        {[["today","Today"], ["history","History"], ["progress","Progress"]].map(([t, lbl]) => (
          <button key={t} onClick={() => setView(t)} style={{
            flex: 1, padding: "10px 4px", borderRadius: 10, border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 600, transition: "all 0.2s",
            background: view === t ? "#1e2130" : "transparent",
            color: view === t ? "#f0f0f0" : "#666",
          }}>{lbl}</button>
        ))}
      </div>

      {/* ── TODAY ── */}
      {view === "today" && (
        <div style={{ padding: "0 16px" }}>
          {items.map((item, i) => (
            <div key={`${item.name}-${i}`} style={{ background: item.done ? "#131d18" : "#13161e", border: `1.5px solid ${item.done ? "#4caf9344" : "#1e2130"}`, borderRadius: 20, marginBottom: 12, padding: "18px 20px", transition: "all 0.3s" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 22, marginBottom: 2 }}>{item.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{item.muscle}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {!item.done && <button onClick={() => setSwapIndex(i)} style={{ background: "#1a1d26", border: "1px solid #2a3040", borderRadius: 8, padding: "6px 10px", color: "#888", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>⇄ Swap</button>}
                  <button onClick={() => toggle(i)} style={{ width: 38, height: 38, borderRadius: "50%", border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", background: item.done ? "#4caf93" : "#1e2130", color: item.done ? "#fff" : "#444" }}>
                    {item.done ? "✓" : "○"}
                  </button>
                </div>
              </div>

              {!item.done && (
                <>
                  <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={() => update(i, "useWeight", !item.useWeight)} style={{ display: "flex", alignItems: "center", gap: 6, background: item.useWeight ? "#1a2a1a" : "#1a1d26", border: `1px solid ${item.useWeight ? "#4caf9355" : "#2a3040"}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: item.useWeight ? "#4caf93" : "#666", fontSize: 12, fontWeight: 600 }}>
                      <span>⚖️</span>{item.useWeight ? "Weight on" : "Add weight"}
                    </button>
                    {item.useWeight && <span style={{ fontSize: 12, color: "#888" }}>{weightLabel(item)}</span>}
                  </div>
                  <div style={{ marginTop: 12, background: "#0d0f14", borderRadius: 14, padding: "12px 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <WheelSelector values={REPS_VALUES} selected={item.reps} onChange={(v) => update(i, "reps", v)} label="Reps" />
                    <div style={{ color: "#333", fontSize: 22, fontWeight: 300, margin: "20px 2px 0" }}>×</div>
                    <WheelSelector values={SETS_VALUES} selected={item.sets} onChange={(v) => update(i, "sets", v)} label="Sets" />
                    {item.useWeight && (
                      <>
                        <div style={{ color: "#333", fontSize: 18, fontWeight: 300, margin: "20px 2px 0" }}>@</div>
                        <WheelSelector values={WEIGHT_VALUES} selected={item.weight} onChange={(v) => update(i, "weight", v)} label="kg" />
                      </>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingLeft: 8 }}>
                      <button onClick={() => toggle(i)} style={{ padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer", background: "#e85d2e", color: "#fff", fontWeight: 700, fontSize: 13, marginTop: 20 }}>Done</button>
                    </div>
                  </div>
                  {i >= 3 && <div style={{ marginTop: 10, textAlign: "right" }}><button onClick={() => handleRemove(i)} style={{ background: "none", border: "none", color: "#5a2020", cursor: "pointer", fontSize: 12 }}>✕ Remove</button></div>}
                </>
              )}

              {item.done && (
                <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center", flexWrap: "wrap" }}>
                  {[["Reps", item.reps], ["Sets", item.sets]].map(([l, v]) => (
                    <div key={l} style={{ background: "#0d160e", borderRadius: 8, padding: "6px 12px", fontSize: 13, color: "#4caf93" }}>
                      <span style={{ color: "#668" }}>{l} </span>{v}
                    </div>
                  ))}
                  {item.useWeight && <div style={{ background: "#0d160e", borderRadius: 8, padding: "6px 12px", fontSize: 13, color: "#4caf93" }}><span style={{ color: "#668" }}>⚖️ </span>{weightLabel(item)}</div>}
                  <button onClick={() => update(i, "done", false)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 12, marginLeft: "auto" }}>Edit</button>
                  {i >= 3 && <button onClick={() => handleRemove(i)} style={{ background: "none", border: "none", color: "#5a2020", cursor: "pointer", fontSize: 12 }}>Remove</button>}
                </div>
              )}
            </div>
          ))}
          <button onClick={() => setShowAdd(true)} style={{ width: "100%", padding: "16px", borderRadius: 16, border: "1.5px dashed #2a3040", background: "transparent", color: "#4caf93", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>+</span> Add Exercise
          </button>
          <div style={{ textAlign: "center", color: "#333", fontSize: 12 }}>Scroll wheels to set reps & sets</div>
          <button onClick={handleCompleteDay} style={{ width: "100%", padding: "16px", borderRadius: 16, border: "none", background: "linear-gradient(135deg,#1a2a1a,#1e3020)", color: "#4caf93", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
            ✓ Complete Day
          </button>
        </div>
      )}

      {/* ── HISTORY ── */}
      {view === "history" && (
        <div style={{ padding: "0 16px" }}>
          {history.length === 0
            ? <div style={{ textAlign: "center", color: "#444", fontSize: 14, marginTop: 40 }}>No completed workouts yet.<br />Finish today's session to start your streak!</div>
            : history.map((entry) => (
              <div key={entry.date} style={{ background: "#13161e", borderRadius: 16, marginBottom: 10, padding: "16px 20px", border: "1.5px solid #1e2130" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 10 }}>{formatDate(entry.date)}</div>
                {entry.exercises.map((ex, ei) => (
                  <div key={ei} style={{ padding: "8px 0", borderBottom: "1px solid #1a1d26" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14 }}>{ex.icon} {ex.name}</span>
                      <span style={{ fontSize: 13, color: "#4caf93" }}>{ex.reps}×{ex.sets}</span>
                    </div>
                    {ex.useWeight && <div style={{ fontSize: 12, color: "#556", marginTop: 2 }}>⚖️ {ex.weight === "BW" ? "Bodyweight" : `${ex.weight} kg`}</div>}
                  </div>
                ))}
              </div>
            ))
          }
        </div>
      )}

      {/* ── PROGRESS ── */}
      {view === "progress" && <ProgressView history={history} />}

      {swapIndex !== null && <ExercisePickerSheet title="Swap Exercise" subtitle={`Replacing: ${items[swapIndex]?.icon} ${items[swapIndex]?.name}`} currentExercises={items} onPick={(ex) => handleSwap(swapIndex, ex)} onClose={() => setSwapIndex(null)} />}
      {showAdd && <ExercisePickerSheet title="Add Exercise" subtitle="Pick one to add to today's workout" currentExercises={items} onPick={handleAdd} onClose={() => setShowAdd(false)} />}

      <style>{`
        @keyframes slideDown { from { transform: translateX(-50%) translateY(-100%); } to { transform: translateX(-50%) translateY(0); } }
        * { -webkit-tap-highlight-color: transparent; }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
