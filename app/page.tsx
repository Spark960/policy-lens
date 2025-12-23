"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
// FIX: Imported MotionValue type
import { motion, useScroll, useSpring, useMotionValueEvent, MotionValue } from "framer-motion"; 
import { User, Tractor, Briefcase, ChevronDown, ShieldAlert, Unlock } from "lucide-react";
import ImpactChart from "@/components/ImpactChart";
import { calculateImpact, formatCurrency, cn } from "@/lib/utils";

// ... (Your Interfaces stay the same) ...
interface ImpactValue { val: number; base: number; }
interface SimulationData { student: ImpactValue; farmer: ImpactValue; pro: ImpactValue; }
interface SliderProps { label: string; value: number; onChange: (val: number) => void; color: string; disabled: boolean; }
interface PersonaCardProps { title: string; icon: React.ReactNode; data: ImpactValue; }

export default function ScrollyTellingPage() {
  // ... (Your State and Physics Engine stay the same) ...
  const fuelTaxSpring = useSpring(10, { stiffness: 40, damping: 20 });
  const importDutySpring = useSpring(10, { stiffness: 40, damping: 20 });
  const gstSpring = useSpring(12, { stiffness: 40, damping: 20 });

  const [fuelTax, setFuelTax] = useState<number>(10);
  const [importDuty, setImportDuty] = useState<number>(10);
  const [gst, setGst] = useState<number>(12);
  
  const [isFreeRoam, setIsFreeRoam] = useState<boolean>(false);

  useEffect(() => {
    if (isFreeRoam) return; 

    const unsubFuel = fuelTaxSpring.on("change", (v: number) => setFuelTax(v));
    const unsubImport = importDutySpring.on("change", (v: number) => setImportDuty(v));
    const unsubGst = gstSpring.on("change", (v: number) => setGst(v));
    return () => { unsubFuel(); unsubImport(); unsubGst(); };
  }, [fuelTaxSpring, importDutySpring, gstSpring, isFreeRoam]);

  const data: SimulationData = useMemo(() => 
    calculateImpact(fuelTax, importDuty, gst), 
  [fuelTax, importDuty, gst]);

  // ... (Your Scroll Logic stays the same) ...
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    if (latest > 0.8) {
      if (!isFreeRoam) setIsFreeRoam(true);
      return; 
    }
    if (isFreeRoam) setIsFreeRoam(false);

    if (latest < 0.2) {
      fuelTaxSpring.set(10); importDutySpring.set(10); gstSpring.set(12);
    } 
    else if (latest >= 0.2 && latest < 0.4) {
      fuelTaxSpring.set(85); importDutySpring.set(10); gstSpring.set(12);
    } 
    else if (latest >= 0.4 && latest < 0.6) {
      fuelTaxSpring.set(20); importDutySpring.set(50); gstSpring.set(28);
    }
    else if (latest >= 0.6 && latest <= 0.8) {
      fuelTaxSpring.set(15); importDutySpring.set(15); gstSpring.set(28);
    }
  });

  const handleManualChange = (
    setter: React.Dispatch<React.SetStateAction<number>>, 
    spring: MotionValue<number>, 
    val: number
  ) => {
    if (isFreeRoam) {
      setter(val);
      spring.set(val); 
    } else {
      spring.set(val);
    }
  };

  return (
      <div className="bg-[#020617] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* 1.main sec */}
      <section className="h-screen flex flex-col items-center justify-center relative border-b border-white/5 z-30 bg-[#020617]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617] to-[#020617]" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1 }}
          className="z-10 text-center px-4"
        >
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            PolicyLens
          </h1>
          <p className="text-xl text-slate-400 mt-6 max-w-lg mx-auto">
            Scroll to experience the economic ripple effect.
          </p>
        </motion.div>
        <div className="absolute bottom-10 animate-bounce text-slate-600"><ChevronDown size={32}/></div>
      </section>

      {/* 2. SPLIT LAYOUT CONTAINER */}
      <div ref={containerRef} className="relative min-h-[500vh]">
        
        {/* fixed right part */}
        <div className="hidden lg:flex fixed top-0 right-0 w-[65%] h-screen items-center justify-center p-8 bg-[#020617] z-10 border-l border-white/5">
           <div className="w-full max-w-5xl bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col">
              
              <div className="p-8 grid grid-cols-12 gap-8 h-full">
                 <div className="col-span-4 space-y-8 flex flex-col justify-center">
                    
                    {/* header */}
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center justify-between">
                         <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Policy Controls</h3>
                         <div className={cn(
                            "transition-opacity duration-500",
                            isFreeRoam ? "opacity-0" : "opacity-100"
                          )}>
                             <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                <ShieldAlert size={10} /> Auto Pilot
                             </span>
                          </div>
                      </div>
                    </div>
                    
                    <SliderControl 
                      label="Fuel Tax" 
                      value={fuelTax} 
                      disabled={!isFreeRoam} 
                      onChange={(v) => handleManualChange(setFuelTax, fuelTaxSpring, v)} 
                      color="accent-blue-500" 
                    />
                    <SliderControl 
                      label="Import Duty" 
                      value={importDuty} 
                      disabled={!isFreeRoam} 
                      onChange={(v) => handleManualChange(setImportDuty, importDutySpring, v)} 
                      color="accent-purple-500" 
                    />
                    <SliderControl 
                      label="GST" 
                      value={gst} 
                      disabled={!isFreeRoam} 
                      onChange={(v) => handleManualChange(setGst, gstSpring, v)} 
                      color="accent-pink-500" 
                    />

                    <div className={cn(
                      "mt-6 p-4 rounded-xl text-xs leading-relaxed transition-colors duration-500",
                      isFreeRoam ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-slate-400"
                    )}>
                       {isFreeRoam 
                        ? "✔ Controls Unlocked. Adjust policies freely." 
                        : "⚠ Simulation running. Scroll to continue story."}
                    </div>
                 </div>

                 <div className="col-span-8 space-y-6 flex flex-col justify-center">
                    <div className="grid grid-cols-3 gap-3">
                       <PersonaCard title="Student" icon={<User size={16}/>} data={data.student} />
                       <PersonaCard title="Farmer" icon={<Tractor size={16}/>} data={data.farmer} />
                       <PersonaCard title="Pro" icon={<Briefcase size={16}/>} data={data.pro} />
                    </div>
                    
                    <div className="bg-black/40 rounded-xl p-4 border border-white/5 h-[300px] w-full">
                       <ImpactChart data={data} />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* left col scrolly */}
        <div className="w-full lg:w-[35%] relative z-20 pointer-events-none lg:pointer-events-auto px-4 lg:pl-12 lg:pr-4 pt-[50vh]">
          
          <StoryStep>
            <h2 className="text-4xl font-bold text-white mb-4">1. The Baseline</h2>
            <p className="text-lg text-slate-400">
              The economy is stable. Taxes are moderate. <br/>
              Notice the <span className="text-emerald-400 font-bold">green chart</span> indicating healthy savings growth.
            </p>
          </StoryStep>

          <StoryStep>
            <h2 className="text-4xl font-bold text-red-500 mb-4">2. The Oil Crisis</h2>
            <p className="text-lg text-slate-300 bg-red-950/40 p-6 rounded-2xl border border-red-500/20 backdrop-blur-md shadow-xl">
              <span className="text-white font-bold block mb-2">Action: Fuel Tax hiked to 85%</span>
              Farmers suffer immediately. Transport costs spike, driving up food prices for everyone.
            </p>
          </StoryStep>

          <StoryStep>
            <h2 className="text-4xl font-bold text-purple-500 mb-4">3. The Tech Blockade</h2>
            <p className="text-lg text-slate-300 bg-purple-950/40 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-md shadow-xl">
              <span className="text-white font-bold block mb-2">Action: Import Duty hits 50%</span>
              Gadgets become luxury items. Students and Tech Professionals see their disposable income vanish.
            </p>
          </StoryStep>

          <StoryStep>
            <h2 className="text-4xl font-bold text-pink-500 mb-4">4. The Service Spike</h2>
            <p className="text-lg text-slate-300 bg-pink-950/40 p-6 rounded-2xl border border-pink-500/20 backdrop-blur-md shadow-xl">
              <span className="text-white font-bold block mb-2">Action: GST hits 28%</span>
              Services, dining, and leisure become expensive. Notice how the <span className="text-pink-400">Pro Persona</span> takes the biggest hit.
            </p>
          </StoryStep>

          <StoryStep>
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
               <Unlock size={32} />
               <h2 className="text-4xl font-bold text-white">5. Your Turn</h2>
            </div>
            <p className="text-lg text-slate-400 bg-emerald-950/40 p-6 rounded-2xl border border-emerald-500/20 backdrop-blur-md shadow-xl">
              You are now the Finance Minister. <br/>
              The sliders are unlocked. Can you find the balance?
            </p>
          </StoryStep>

          <div className="h-[50vh]"></div>
        </div>

      </div>
    </div>
  );
}

const StoryStep = ({ children }: { children: React.ReactNode }) => (
  <div className="h-screen flex flex-col justify-center pointer-events-auto">
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ margin: "-50% 0px -50% 0px" }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  </div>
);

const SliderControl = ({ label, value, onChange, color, disabled }: SliderProps) => (
  <div className={cn("transition-opacity duration-300", disabled && "opacity-60 grayscale-[0.5]")}>
    <div className="flex justify-between mb-2">
      <label className="text-slate-300 text-xs font-bold">{label}</label>
      <span className="font-mono text-white text-xs bg-white/10 px-2 py-0.5 rounded">
        {Math.round(value)}%
      </span>
    </div>
    <input 
      type="range" min="0" max="100" value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer ${color}`}
      style={{ pointerEvents: disabled ? 'none' : 'auto' }}
    />
  </div>
);

const PersonaCard = ({ title, icon, data }: PersonaCardProps) => {
  const diff = data.val - data.base;
  const isBad = diff > 2000;
  
  return (
    <div className={cn(
      "p-3 rounded-xl border transition-all duration-500 flex flex-col items-center text-center",
      isBad ? "bg-red-500/10 border-red-500/30" : "bg-white/5 border-white/10"
    )}>
      <div className={cn("mb-2 p-2 rounded-full", isBad ? "bg-red-500/20 text-red-400" : "bg-white/10 text-slate-300")}>
        {icon}
      </div>
      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">{title}</div>
      <div className="text-sm font-mono font-bold text-white">
        {formatCurrency(data.val)}
      </div>
    </div>
  );
};