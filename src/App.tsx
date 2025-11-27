import { useState, useEffect, useMemo, useRef } from "react";
import {
  Trash2,
  UserPlus,
  Shield,
  ShieldAlert,
  Gavel,
  RotateCw,
  AlertTriangle,
  Users,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAudio } from "./hooks/useAudio";

// Tema Moderno (Cyber/Glass)
const THEME = {
  bg: "radial-gradient(circle at 50% 0%, #2e1065 0%, #020617 70%)",
  cardBg: "rgba(30, 41, 59, 0.4)",
  cardBorder: "rgba(255, 255, 255, 0.08)",
  primary: "#8B5CF6",
  primaryGlow: "rgba(139, 92, 246, 0.5)",
  text: "#F8FAFC",
  textMuted: "#94A3B8",
  danger: "#EF4444",
  warning: "#F59E0B",
  success: "#10B981",
};

const ROLES = [
  { id: "moderator", label: "Moderador", canBan: false },
  { id: "admin", label: "Admin", canBan: true },
  { id: "manager", label: "Manager", canBan: true },
  { id: "owner", label: "Owner", canBan: true },
];

const DURATIONS = [
  { label: "1 Minuto", value: "1 min" },
  { label: "5 Minutos", value: "5 min" },
  { label: "10 Minutos", value: "10 min" },
  { label: "1 Hora", value: "1 hora" },
  { label: "1 Dia", value: "1 dia" },
  { label: "1 Semana", value: "1 semana" },
];

const WHEEL_COLORS = [
  "#8B5CF6",
  "#EF4444",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#6366F1",
  "#14B8A6",
];

export default function App() {
  const { playSpinSound, playWinSound, playSound, setVolume, setEnabled, isEnabled } = useAudio();
  const [volume, setVolumeState] = useState(0.5);

  // Config States
  const [role, setRole] = useState(ROLES[3]);
  const [mode, setMode] = useState("timeout");
  const [duration, setDuration] = useState("random");
  const [snakeMode, setSnakeMode] = useState(false);

  // Participants
  const [names, setNames] = useState<string[]>([]);
  const [newName, setNewName] = useState("");

  // Wheel State
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [finalPunishment, setFinalPunishment] = useState("");

  const wheelNames = useMemo(() => {
    if (!snakeMode || names.length === 0) return names;
    const result: string[] = [];
    names.forEach((name) => {
      result.push(name);
      result.push("Snake");
    });
    return result;
  }, [names, snakeMode]);

  useEffect(() => {
    if (!role.canBan && mode === "ban") setMode("timeout");
  }, [role]);

  useEffect(() => setVolume(volume), [volume, setVolume]);

  const addName = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      setNames([...names, newName.trim()]);
      setNewName("");
      playSound("click");
    } else {
      playSound("error");
    }
  };

  const removeName = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
    playSound("click");
  };

  const spinWheel = () => {
    if (isSpinning || wheelNames.length < 2) {
      playSound("error");
      return;
    }

    setIsSpinning(true);
    setWinner(null);
    setShowModal(false);

    playSpinSound();

    const minSpins = 5;
    const randomDegrees = Math.floor(Math.random() * 360);
    const newRotation = rotation + minSpins * 360 + randomDegrees;

    setRotation(newRotation);

    setTimeout(() => {
      const segmentAngle = 360 / wheelNames.length;
      const normalizedRotation = ((newRotation % 360) + 360) % 360;

      // CORREÇÃO PRINCIPAL: cálculo correto do segmento sob o ponteiro (topo = 0°)
      const pointerAngle = (360 - normalizedRotation + 360) % 360;
      let winningIndex = Math.floor(pointerAngle / segmentAngle);

      // Segurança extra
      winningIndex = ((winningIndex % wheelNames.length) + wheelNames.length) % wheelNames.length;

      const selectedPerson = wheelNames[winningIndex];
      setWinner(selectedPerson);

      // Definição da punição
      if (mode === "ban") {
        setFinalPunishment("BANIDO PERMANENTEMENTE");
      } else {
        if (duration === "random") {
          const rand = DURATIONS[Math.floor(Math.random() * DURATIONS.length)].label;
          setFinalPunishment(`Castigo de ${rand}`);
        } else {
          const selected = DURATIONS.find((d) => d.value === duration)?.label || duration;
          setFinalPunishment(`Castigo de ${selected}`);
        }
      }

      setIsSpinning(false);
      setShowModal(true);

      setTimeout(() => playWinSound(), 100);
    }, 4000);
  };

  const reset = () => {
    setNames([]);
    setRotation(0);
    setWinner(null);
    playSound("click");
  };

  return (
    <div
      className="min-h-screen font-sans selection:bg-purple-500 selection:text-white pb-20 text-slate-100"
      style={{ background: THEME.bg }}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-xl bg-slate-900/40 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-600 blur-lg opacity-50 group-hover:opacity-100 transition-opacity rounded-full"></div>
              <div className="relative bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl border border-white/10 shadow-lg">
                <Gavel className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                Roleta WebSec
              </h1>
              <span className="text-xs text-violet-400 font-medium tracking-widest uppercase">
                Moderation Tool v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-xl border border-white/10 backdrop-blur-md">
              <Shield className="w-4 h-4 text-violet-400 ml-2" />
              <select
                className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-200 outline-none cursor-pointer pr-8"
                value={role.id}
                onChange={(e) => {
                  const selected = ROLES.find((r) => r.id === e.target.value);
                  if (selected) {
                    setRole(selected);
                    playSound("click");
                  }
                }}
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-slate-200">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10 backdrop-blur-md">
              <button
                onClick={() => {
                  setEnabled(!isEnabled);
                  playSound("click");
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isEnabled ? (
                  <Volume2 className="w-4 h-4 text-violet-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
              </button>
              {isEnabled && (
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => {
                    setVolumeState(parseFloat(e.target.value));
                    playSound("click");
                  }}
                  className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Painel esquerdo */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tipo de punição + duração */}
          <div
            className="rounded-2xl p-6 border shadow-2xl backdrop-blur-md transition-transform hover:scale-[1.01]"
            style={{ backgroundColor: THEME.cardBg, borderColor: THEME.cardBorder }}
          >
            <h2 className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Tipo de Punição
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => {
                  setMode("timeout");
                  playSound("click");
                }}
                className={`relative group overflow-hidden flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                  mode === "timeout"
                    ? "border-amber-500/50 bg-amber-500/10 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                    : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                <Clock
                  className={`w-8 h-8 mb-2 ${
                    mode === "timeout" ? "scale-110" : "group-hover:scale-110"
                  } transition-transform`}
                />
                <span className="font-bold">Castigo</span>
              </button>

              <button
                onClick={() => role.canBan && (setMode("ban"), playSound("click"))}
                disabled={!role.canBan}
                className={`relative group overflow-hidden flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                  mode === "ban"
                    ? "border-red-500/50 bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    : !role.canBan
                    ? "border-white/5 bg-black/20 text-slate-700 cursor-not-allowed"
                    : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                <ShieldAlert
                  className={`w-8 h-8 mb-2 ${
                    mode === "ban" ? "scale-110" : "group-hover:scale-110"
                  } transition-transform`}
                />
                <span className="font-bold">BAN</span>
              </button>
            </div>

            <div
              className={`transition-all ${
                mode === "ban" ? "opacity-20 pointer-events-none blur-sm" : ""
              }`}
            >
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Duração da Pena
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setDuration("random");
                    playSound("click");
                  }}
                  className={`p-3 text-sm rounded-lg border transition-all ${
                    duration === "random"
                      ? "bg-violet-600 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                      : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" /> Aleatório
                  </span>
                </button>
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => {
                      setDuration(d.value);
                      playSound("click");
                    }}
                    className={`p-3 text-sm rounded-lg border transition-all ${
                      duration === d.value
                        ? "bg-amber-500 border-amber-400 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                        : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de participantes */}
          <div
            className="rounded-2xl p-6 border shadow-2xl backdrop-blur-md flex flex-col h-[480px]"
            style={{ backgroundColor: THEME.cardBg, borderColor: THEME.cardBorder }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm uppercase tracking-wider font-bold text-slate-400 flex items-center gap-2">
                <Users className="w-4 h-4" /> Participantes
              </h2>
              <span className="text-xs font-bold bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full border border-violet-500/20">
                {wheelNames.length}
              </span>
            </div>

            <div
              onClick={() => {
                setSnakeMode(!snakeMode);
                playSound("click");
              }}
              className={`group flex items-center justify-between mb-4 p-4 rounded-xl border cursor-pointer transition-all ${
                snakeMode
                  ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : "bg-white/5 border-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    snakeMode ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
                  }`}
                >
                  <span className="text-lg">Snake</span>
                </div>
                <div>
                  <p
                    className={`text-sm font-bold ${
                      snakeMode ? "text-emerald-400" : "text-slate-300"
                    }`}
                  >
                    Modo Snake
                  </p>
                  <p className="text-xs text-slate-500">Intercala com Snake</p>
                </div>
              </div>
              <div
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  snakeMode ? "bg-emerald-500" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${
                    snakeMode ? "left-7" : "left-1"
                  }`}
                />
              </div>
            </div>

            <form onSubmit={addName} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Adicionar participante..."
                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-black/40 transition-all"
              />
              <button
                type="submit"
                disabled={isSpinning}
                className="bg-violet-600 hover:bg-violet-500 text-white p-3 rounded-xl disabled:opacity-50 transition-all shadow-lg hover:shadow-violet-500/25 active:scale-95"
              >
                <UserPlus className="w-5 h-5" />
              </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 -mr-2 custom-scrollbar">
              {names.map((name, idx) => (
                <div
                  key={idx}
                  className="group flex justify-between items-center p-3 pl-4 rounded-xl border border-transparent hover:border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <span className="truncate font-medium text-slate-300">{name}</span>
                  <button
                    onClick={() => removeName(idx)}
                    disabled={isSpinning}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {names.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-slate-600 gap-2">
                  <Users className="w-8 h-8 opacity-20" />
                  <p className="text-sm">Lista vazia</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={reset}
                disabled={isSpinning}
                className="w-full text-xs font-bold text-slate-500 hover:text-slate-300 uppercase tracking-wider transition-colors py-2"
              >
                Limpar Lista
              </button>
            </div>
          </div>
        </div>

        {/* Roleta */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center min-h-[500px] relative perspective-1000">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/20 blur-[100px] rounded-full pointer-events-none"></div>

          {/* Setinha fixa no topo */}
          <div className="absolute top-[8%] lg:top-[5%] left-1/2 -translate-x-1/2 z-20 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-t-[50px] border-t-white relative z-10"></div>
          </div>

          <div className="relative w-[320px] h-[320px] md:w-[550px] md:h-[550px] transition-all duration-300">
            <div className="absolute inset-0 rounded-full border-[16px] border-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-900 overflow-hidden ring-1 ring-white/10">
              {wheelNames.length < 2 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4">
                  <AlertTriangle className="w-12 h-12 opacity-20" />
                  <p className="font-bold text-xl uppercase tracking-widest text-center px-10">
                    {names.length === 1 && snakeMode ? "Pronto..." : "Mínimo 2 participantes"}
                  </p>
                </div>
              ) : (
                <div
                  className="w-full h-full rounded-full relative"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning ? "transform 4s cubic-bezier(0.15, 0, 0.15, 1)" : "none",
                  }}
                >
                  <div
                    className="absolute inset-0 w-full h-full rounded-full opacity-90"
                    style={{
                      background: `conic-gradient(from 0deg, ${wheelNames
                        .map((_, i) => {
                          const start = (i / wheelNames.length) * 100;
                          const end = ((i + 1) / wheelNames.length) * 100;
                          return `${WHEEL_COLORS[i % WHEEL_COLORS.length]} ${start}% ${end}%`;
                        })
                        .join(", ")})`,
                    }}
                  />

                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>

                  {wheelNames.map((name, i) => {
                    const sliceAngle = 360 / wheelNames.length;
                    const midAngle = sliceAngle * i + sliceAngle / 2;

                    return (
                      <div
                        key={i}
                        className="absolute w-full h-[50%] top-0 left-0 flex justify-center items-center pt-10 pb-4"
                        style={{
                          transform: `rotate(${midAngle}deg)`,
                          transformOrigin: "bottom center",
                        }}
                      >
                        <span
                          className="text-white font-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] whitespace-nowrap truncate text-sm md:text-xl uppercase tracking-wide"
                          style={{
                            writingMode: "vertical-rl",
                            textOrientation: "mixed",
                            maxHeight: "75%",
                          }}
                        >
                          {name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 rounded-full bg-slate-900 border-4 border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center z-20">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-slate-800 to-black flex items-center justify-center shadow-inner">
                <Gavel className="w-8 h-8 text-violet-500 opacity-80" />
              </div>
            </div>
          </div>

          <button
            onClick={spinWheel}
            disabled={isSpinning || wheelNames.length < 2}
            className={`mt-12 px-16 py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all transform active:scale-95 flex items-center gap-3 ${
              isSpinning
                ? "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border border-white/5"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:-translate-y-1 border border-white/10"
            }`}
          >
            {isSpinning ? (
              <>
                <RotateCw className="animate-spin" /> Processando...
              </>
            ) : (
              "RODAR"
            )}
          </button>
        </div>
      </main>

      {/* Modal do Vencedor */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-slate-900/90 border border-white/10 rounded-3xl p-10 max-w-md w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
            <div
              className="absolute inset-0 opacity-20 mix-blend-overlay"
              style={{ backgroundColor: mode === "ban" ? THEME.danger : THEME.warning }}
            ></div>
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 blur-[50px] rounded-full"></div>

            <div className="relative z-10">
              <div
                className="mx-auto w-24 h-24 rounded-2xl flex items-center justify-center mb-6 shadow-2xl rotate-3"
                style={{
                  background:
                    mode === "ban"
                      ? "linear-gradient(135deg, #ef4444, #991b1b)"
                      : "linear-gradient(135deg, #f59e0b, #b45309)",
                  color: "white",
                }}
              >
                {mode === "ban" ? <Gavel size={48} /> : <AlertTriangle size={48} />}
              </div>

              <h3 className="uppercase tracking-[0.2em] text-xs font-bold text-slate-400 mb-2">
                Veredito Final
              </h3>
              <div className="text-5xl font-black mb-8 text-white drop-shadow-lg break-words leading-tight">
                {winner}
              </div>

              <div className="bg-black/40 rounded-xl p-6 border border-white/5 mb-8 backdrop-blur-md">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                  Sentença Aplicada
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: mode === "ban" ? "#fca5a5" : "#fcd34d" }}
                >
                  {finalPunishment}
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowModal(false);
                    playSound("click");
                  }}
                  className="px-8 py-3 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    spinWheel();
                  }}
                  className="px-8 py-3 rounded-xl font-bold bg-white text-black hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <RotateCw size={18} /> Rodar de novo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
