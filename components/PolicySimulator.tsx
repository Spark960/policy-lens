"use client";
//backup ai gen thing if your retarded brain fails
import React, { useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, User, Tractor, Briefcase, ChevronDown, Zap, ShieldAlert } from "lucide-react";

// --- TYPE DEFINITIONS (This fixes the ESLint errors) ---
interface ImpactData {
  val: number;
  base: number;
}

interface SliderProps {
  label: string;
  value: number;
  setValue: (value: number) => void; // Correct type for useState setter
  min: number;
  max: number;
  color: string;
  desc: string;
}

interface PersonaCardProps {
  title: string;
  icon: React.ReactNode; // Type for Lucide icons
  data: ImpactData;
  color: string;
  gradient: string;
}

// --- LOGIC ENGINE ---
const calculateImpact = (fuelTax: number, importDuty: number, gst: number) => {
  const baseStudent = 12000;
  const baseFarmer = 18000;
  const basePro = 55000;

  const farmerImpact = baseFarmer + (fuelTax * 180) + (gst * 25);
  const studentImpact = baseStudent + (importDuty * 120) + (gst * 60) + (fuelTax * 15);
  const proImpact = basePro + (gst * 300) + (fuelTax * 60) + (importDuty * 50);

  return { 
    student: { val: studentImpact, base: baseStudent }, 
    farmer: { val: farmerImpact, base: baseFarmer }, 
    pro: { val: proImpact, base: basePro } 
  };
};

export default function PolicySimulator() {
  const [fuelTax, setFuelTax] = useState<number>(10);
  const [importDuty, setImportDuty] = useState<number>(10);
  const [gst, setGst] = useState<number>(12);

  const data = useMemo(() => calculateImpact(fuelTax, importDuty, gst), [fuelTax, importDuty, gst]);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-emerald-500/30">
      
      {/* HERO SECTION */}
      <motion.div 
        style={{ opacity, scale, y }}
        className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-indigo-500/10 via-[#020617] to-[#020617] z-0" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-center px-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-6 font-medium">
            <Zap size={14} /> FINHACK 2025: SOCIAL IMPACT
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent mb-6">
            PolicyLens
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            The economy isn&apos;t just numbers on a screen. It&apos;s the cost of milk, 
            the price of a phone, and the savings of a farmer.
          </p>
          <p className="text-emerald-400 mt-4 font-medium animate-pulse">
            Scroll to simulate the impact ↓
          </p>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 text-slate-500"
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.div>

      {/* SIMULATOR DASHBOARD */}
      <div className="relative z-20 bg-[#020617] min-h-screen border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT: CONTROLS */}
            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-10">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-white">
                  <ShieldAlert className="text-emerald-500" /> Adjust Policy
                </h2>
                <div className="space-y-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                  <SliderControl 
                    label="Fuel Tax (Excise)" 
                    value={fuelTax} 
                    setValue={setFuelTax} 
                    min={0} max={100} 
                    color="accent-blue-500"
                    desc="Impacts transport & food prices."
                  />
                  <SliderControl 
                    label="Import Duty" 
                    value={importDuty} 
                    setValue={setImportDuty} 
                    min={0} max={60} 
                    color="accent-purple-500"
                    desc="Impacts electronics & tech goods."
                  />
                  <SliderControl 
                    label="GST (Services)" 
                    value={gst} 
                    setValue={setGst} 
                    min={5} max={28} 
                    color="accent-pink-500"
                    desc="Impacts dining, movies & services."
                  />
                </div>
              </div>
            </div>

            {/* RIGHT: VISUALIZATION */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PersonaCard 
                  title="Student" 
                  icon={<User className="w-6 h-6" />} 
                  data={data.student} 
                  color="text-purple-400"
                  gradient="from-purple-500/20 to-purple-500/0"
                />
                <PersonaCard 
                  title="Farmer" 
                  icon={<Tractor className="w-6 h-6" />} 
                  data={data.farmer} 
                  color="text-emerald-400"
                  gradient="from-emerald-500/20 to-emerald-500/0"
                />
                <PersonaCard 
                  title="Pro" 
                  icon={<Briefcase className="w-6 h-6" />} 
                  data={data.pro} 
                  color="text-blue-400"
                  gradient="from-blue-500/20 to-blue-500/0"
                />
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 h-100 relative overflow-hidden">
                <h3 className="text-lg font-medium text-slate-300 mb-6 pl-2 border-l-4 border-indigo-500">
                  Real-time Expenditure Projection
                </h3>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={[
                    { name: 'Base', cost: 100 },
                    { name: 'Impact', cost: 100 + (data.student.val - data.student.base)/100 + (data.farmer.val - data.farmer.base)/150 },
                    { name: 'Future', cost: 110 + (data.pro.val - data.pro.base)/400 }
                  ]}>
                    <defs>
                      <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorCost)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- TYPED SUBCOMPONENTS ---
function SliderControl({ label, value, setValue, min, max, color, desc }: SliderProps) {
  return (
    <div>
      <div className="flex justify-between mb-3">
        <label className="text-slate-200 font-medium">{label}</label>
        <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded text-sm">{value}%</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className={`w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer ${color}`}
      />
      <p className="text-xs text-slate-500 mt-2 font-light tracking-wide">{desc}</p>
    </div>
  );
}

function PersonaCard({ title, icon, data, color, gradient }: PersonaCardProps) {
  const percentChange = ((data.val - data.base) / data.base) * 100;
  const isHigh = percentChange > 15;

  return (
    <motion.div 
      className={`relative overflow-hidden p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 ${isHigh ? 'ring-1 ring-red-500/50' : ''}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20`} />
      
      <div className="relative z-10 flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-white/10 ${color}`}>{icon}</div>
        <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full bg-black/20 ${percentChange > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
           {percentChange > 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
           {Math.abs(percentChange).toFixed(1)}%
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <div className="text-2xl font-mono font-bold text-white mt-1">
          ₹{Math.floor(data.val).toLocaleString()}
        </div>
        <div className="h-1 w-full bg-slate-700 mt-4 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentChange + 20, 100)}%` }}
            className={`h-full ${isHigh ? 'bg-red-500' : 'bg-emerald-500'}`}
          />
        </div>
      </div>
    </motion.div>
  );
}