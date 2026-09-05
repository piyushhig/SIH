import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  User,
  Sparkles,
  CheckCircle2,
  Radio,
  Activity,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Layers,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin@landguard.ai');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null);

  // Live telemetry rotating ticker
  const [telemetryIndex, setTelemetryIndex] = useState(0);
  const telemetryStats = [
    { label: 'Parcels Monitored', value: '1,428', delta: '+12 this week', icon: Layers },
    { label: 'Early Warnings Resolved', value: '84', delta: '89.4% resolution rate', icon: ShieldCheck },
    { label: 'Acquisition Capital Protected', value: '₹4,280 Cr', delta: '9 key corridors', icon: TrendingUp },
    { label: 'Active Hotspot Sensors', value: '13 Nodes', delta: 'All districts nominal', icon: Radio },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryIndex((prev) => (prev + 1) % telemetryStats.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [telemetryStats.length]);

  const proceedWithLogin = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onLogin();
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your email or username');
      return;
    }
    setError('');
    proceedWithLogin();
  };

  const handleDemoLogin = () => {
    setUsername('admin@landguard.ai');
    setPassword('••••••••');
    proceedWithLogin();
  };

  return (
    <div className="min-h-screen w-full bg-[#070B14] flex flex-col justify-between text-slate-100 font-sans relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Background Layer 1: Ambient Glowing Radial Orbs (Slow drifting via Motion) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft Blue Orb top-left */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            opacity: [0.18, 0.28, 0.18],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-32 -left-32 w-96 h-96 sm:w-[540px] sm:h-[540px] rounded-full bg-blue-600/30 blur-[130px]"
        />

        {/* Indigo / Purple Orb bottom-right */}
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -30, 0],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 sm:w-[580px] sm:h-[580px] rounded-full bg-indigo-600/25 blur-[140px]"
        />

        {/* Center Cyan Accent Accent Glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.08, 0.16, 0.08],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-500/20 blur-[120px]"
        />

        {/* High-precision grid mesh */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Subtle radial vignette overlay */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#070B14]/60 to-[#070B14]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-mono text-xs font-bold text-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.35)]">
            LG
          </div>
          <div>
            <span className="font-mono font-bold text-sm tracking-widest text-white block leading-none">
              LANDGUARD AI
            </span>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
              Infrastructure Risk OS
            </span>
          </div>
        </div>

        {/* Demo Tag */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            <span className="hidden sm:inline">DEMO ENVIRONMENT •</span> SIMULATED DATA
          </span>
        </div>
      </header>

      {/* Split Screen Workspace */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* LEFT PANEL: The Authentication Form (~45% width) */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:mx-0">
            {/* Glow backdrop behind form */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-blue-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={
                  isTransitioning
                    ? { opacity: 0, scale: 0.96, y: -16 }
                    : { opacity: 1, y: 0, scale: 1 }
                }
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800/90 rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
              >
                {/* Header inside card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="space-y-1.5"
                >
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-800/60 text-blue-300 font-mono text-[11px] mb-1">
                    <Activity className="w-3 h-3 text-blue-400" />
                    <span>Portfolio Access Gateway</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
                    System Authentication
                  </h1>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Access project corridors, predictive cadastral risk indexes, and SLA mitigation workflows.
                  </p>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3 bg-rose-950/80 border border-rose-800/90 rounded-lg text-xs text-rose-200 font-mono flex items-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {/* Username Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.4 }}
                    className="space-y-1.5"
                  >
                    <label
                      htmlFor="login-username"
                      className="block text-[11px] font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between"
                    >
                      <span>Authorized Identity</span>
                      {focusedField === 'username' && (
                        <span className="text-blue-400 text-[10px] lowercase font-normal">verified</span>
                      )}
                    </label>
                    <div className="relative group/input">
                      <User
                        className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                          focusedField === 'username' ? 'text-blue-400 scale-105' : 'text-slate-500'
                        }`}
                      />
                      <input
                        id="login-username"
                        type="text"
                        value={username}
                        onFocus={() => setFocusedField('username')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="admin@landguard.ai"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/90 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono transition-all duration-200"
                      />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.26, duration: 0.4 }}
                    className="space-y-1.5"
                  >
                    <label
                      htmlFor="login-password"
                      className="block text-[11px] font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between"
                    >
                      <span>Security Key / Password</span>
                      {focusedField === 'password' && (
                        <span className="text-blue-400 text-[10px] lowercase font-normal">protected</span>
                      )}
                    </label>
                    <div className="relative group/input">
                      <Lock
                        className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                          focusedField === 'password' ? 'text-blue-400 scale-105' : 'text-slate-500'
                        }`}
                      />
                      <input
                        id="login-password"
                        type="password"
                        value={password}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/90 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono transition-all duration-200"
                      />
                    </div>
                  </motion.div>

                  {/* Primary Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.34, duration: 0.4 }}
                  >
                    <button
                      type="submit"
                      disabled={isTransitioning}
                      className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.45)]"
                    >
                      {isTransitioning ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 animate-spin text-white" />
                          <span>Initializing Portfolio Intelligence...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to Dashboard</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </motion.div>
                </form>

                {/* Quick Demo Access Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.4 }}
                  className="pt-4 border-t border-slate-800/80 text-center space-y-3"
                >
                  <button
                    type="button"
                    disabled={isTransitioning}
                    onClick={handleDemoLogin}
                    className="w-full py-2.5 px-3.5 bg-slate-950/70 hover:bg-slate-800/90 active:scale-[0.99] border border-slate-700/70 hover:border-slate-600 text-slate-200 hover:text-white rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs group"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Demo Login (Instant Prototype Access)</span>
                  </button>
                  <p className="text-[11px] text-slate-400 font-sans">
                    One-click access with simulated corridor data for evaluation.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT PANEL: Visual Showcase & Radar Intelligence Panel (~55% width) */}
          <div className="lg:col-span-7 w-full space-y-8 pl-0 lg:pl-4">
            
            {/* Tagline & Headline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/70 text-blue-300 font-mono text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                <span>PREDICTIVE LAND GOVERNANCE ENGINE</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-mono tracking-tight leading-tight">
                SEE RISK EARLY <span className="text-blue-400">→</span> KNOW WHY <span className="text-blue-400">→</span> ACT BEFORE SLIPPAGE
              </h2>

              <p className="text-sm text-slate-400 font-sans max-w-xl leading-relaxed">
                Autonomous geospatial and cadastral intelligence identifying legal objections, valuation bottlenecks, and statutory delays across national corridors before project milestones lapse.
              </p>
            </motion.div>

            {/* Showcase Visual: Interactive Radar Scan & Ambient Risk Node Matrix */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="relative p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              {/* Radar Grid Circles in background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-80 h-80 rounded-full border border-blue-500/40" />
                <div className="w-56 h-56 rounded-full border border-blue-500/50 absolute" />
                <div className="w-32 h-32 rounded-full border border-blue-500/60 absolute" />
                {/* Crosshairs */}
                <div className="w-full h-px bg-blue-500/30 absolute" />
                <div className="h-full w-px bg-blue-500/30 absolute" />
              </div>

              {/* Radar Rotating Sweep Line */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 origin-center pointer-events-none opacity-30"
              >
                <div className="w-1/2 h-1/2 bg-gradient-to-br from-blue-500/40 via-blue-500/0 to-transparent rounded-tl-full" />
              </motion.div>

              {/* Header inside showcase */}
              <div className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
                  <span className="font-mono font-bold text-xs text-slate-200 tracking-wider">
                    NATIONAL CORRIDOR RADAR
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  SYNCHRONIZED
                </span>
              </div>

              {/* Floating Ambient Corridor Risk Nodes */}
              <div className="relative z-10 py-5 space-y-3">
                {/* Node 1: Palghar (Floating) */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-950/80 border border-rose-900/60 shadow-lg"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <div>
                      <div className="font-mono text-xs font-bold text-slate-100 flex items-center gap-2">
                        <span>Palghar DFC Segment</span>
                        <span className="text-[10px] text-rose-400 bg-rose-950 px-1.5 py-0.2 rounded border border-rose-800 font-mono">
                          RISK 88
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans">
                        MLRC Section 36A Tribal Land Restriction • SLA Sanction Pending
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-rose-400 shrink-0">+54d delay</span>
                </motion.div>

                {/* Node 2: Thane North Viaduct (Floating offset) */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-950/80 border border-rose-900/40 shadow-lg"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div>
                      <div className="font-mono text-xs font-bold text-slate-100 flex items-center gap-2">
                        <span>Thane Bullet Train Node (MAHSR)</span>
                        <span className="text-[10px] text-rose-400 bg-rose-950 px-1.5 py-0.2 rounded border border-rose-800 font-mono">
                          RISK 86
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans">
                        CRZ-I Coastal Mangrove Clearance Injunction • 18 Parcels
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-rose-400 shrink-0">+52d delay</span>
                </motion.div>

                {/* Node 3: Bharuch Chemical Crossing (Floating offset) */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-950/80 border border-amber-900/40 shadow-lg"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div>
                      <div className="font-mono text-xs font-bold text-slate-100 flex items-center gap-2">
                        <span>Bharuch PCPIR Link</span>
                        <span className="text-[10px] text-amber-400 bg-amber-950 px-1.5 py-0.2 rounded border border-amber-800 font-mono">
                          RISK 82
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans">
                        GETCO 400kV Power Line Footprint Re-routing
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400 shrink-0">+48d delay</span>
                </motion.div>
              </div>

              {/* Cycling Animated Telemetry Pill */}
              <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">Live Telemetry:</span>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={telemetryIndex}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                      className="inline-flex items-center gap-2 font-mono text-xs text-slate-200"
                    >
                      <strong className="text-white font-bold">{telemetryStats[telemetryIndex].value}</strong>
                      <span className="text-slate-400">{telemetryStats[telemetryIndex].label}</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/60">
                        {telemetryStats[telemetryIndex].delta}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[10px] text-blue-400">
                  <MapPin className="w-3 h-3" />
                  <span>9 States Connected</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-slate-500 text-xs font-mono max-w-7xl w-full mx-auto px-4 py-6 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>LANDGUARD AI • Decision Support System for Infrastructure Land Acquisition</span>
        <span className="text-slate-600">Simulated corridor datasets strictly for product evaluation</span>
      </footer>
    </div>
  );
};
