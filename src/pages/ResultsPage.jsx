import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateWorkoutProgram } from '../services/aiService';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import {
  Activity, Apple, BatteryCharging, Calendar, ChevronDown,
  ListRestart, Timer, Download, Target, CheckCircle2, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResultsPage() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user }  = useAuth();
  
  // Safely get state
  const state = useMemo(() => location.state || {}, [location.state]);
  const { formData, existingProgram, autoPrint } = state;

  const [program, setProgram]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [expandedDay, setExpandedDay] = useState(null);

  // Safeguard: Redirect if no data at all
  useEffect(() => {
    if (!formData && !existingProgram) {
      console.warn("ResultsPage: No form data or existing program. Redirecting to /create");
      navigate('/create');
    }
  }, [formData, existingProgram, navigate]);


  useEffect(() => {
    if (!formData && !existingProgram) return;

    let isMounted = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        let result = null;
        if (existingProgram) {
          result = existingProgram;
          if (isMounted) setSaved(true);
        } else {
          result = await generateWorkoutProgram(formData);
        }
        
        if (!isMounted) return;

        console.log("Final Program Received in Component:", result);
        setProgram(result);
        
        // Auto-expand first training day
        if (result?.schedule && Array.isArray(result.schedule)) {
          const firstTraining = result.schedule.findIndex(d => d?.type === 'Training');
          if (firstTraining !== -1) setExpandedDay(firstTraining);
        }

        // Auto-print
        if (autoPrint) {
          setTimeout(() => window.print(), 1000);
        }

        // Save to Firestore
        if (user && !existingProgram && isMounted) {
          setSaving(true);
          try {
            await addDoc(collection(db, 'programs'), {
              userId: user.uid,
              userName: user.displayName || 'Athlete',
              formData: formData || {},
              program: result,
              createdAt: serverTimestamp()
            });
            if (isMounted) setSaved(true);
          } catch (saveErr) {
            console.error("Firestore Save Error:", saveErr);
          } finally {
            if (isMounted) setSaving(false);
          }
        }
      } catch (err) {
        console.error("Program Generation Flow Error:", err);
        if (isMounted) setError(err.message || "Failed to generate program.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, [formData, existingProgram, autoPrint, user]); // Removed navigate to prevent loop if it triggers redirect


  // --- Helper Calculations ---
  const goalsDisplay = useMemo(() => {
    const goals = formData?.goals || [];
    return Array.isArray(goals) ? goals.join(', ') : (formData?.goal || 'Personal Training');
  }, [formData]);

  const stats = useMemo(() => {
    if (!program?.schedule) return { training: 0, rest: 0 };
    return {
      training: program.schedule.filter(d => d?.type === 'Training').length,
      rest: program.schedule.filter(d => d?.type === 'Rest').length
    };
  }, [program]);


  // --- Render Logic ---
  if (loading) return <LoadingSkeleton />;
  
  if (error) return <ErrorMessage error={error} onRetry={() => window.location.reload()} onBack={() => navigate('/create')} />;

  if (!program) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-white/40">Fetching your program details...</p>
      </div>
    );
  }

  // Final check for critical structure
  if (!Array.isArray(program.schedule)) {
    console.error("Render Error: program.schedule is not an array", program);
    return <ErrorMessage error="Program data is missing its schedule." onBack={() => navigate('/create')} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary/30">
      
      {/* Print-only Header */}
      <div className="hidden print:flex flex-col items-center mb-8 text-black">
        <h1 className="text-3xl font-bold">AthleteAI Training Plan</h1>
        <p className="text-lg opacity-70 mt-1">{goalsDisplay}</p>
        <div className="flex gap-4 text-sm mt-2 opacity-50">
          <span>{formData?.sport} {formData?.position ? `(${formData.position})` : ''}</span>
          <span>•</span>
          <span>{formData?.level}</span>
          <span>•</span>
          <span>{formData?.equipment}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        
        {/* Header Section */}
        <header className="text-center mb-12 no-print">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight uppercase italic italic-none bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
              Program Ready
            </h1>
            <p className="text-white/50 text-lg">{goalsDisplay}</p>

            <AnimatePresence>
              {saved && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 mt-6 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium"
                >
                  <CheckCircle2 size={16} />
                  Saved to your profile
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </header>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-10 no-print">
          <StatCard label="Training" value={stats.training} icon={<Activity size={16} className="text-primary" />} />
          <StatCard label="Recovery" value={stats.rest} icon={<BatteryCharging size={16} className="text-accent" />} />
          <StatCard label="Duration" value="1 Week" icon={<Calendar size={16} className="text-purple-400" />} />
        </div>

        {/* Primary Download Trigger */}
        <div className="flex justify-end mb-8 no-print">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold uppercase tracking-wide text-xs hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Schedule Column */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-widest flex items-center gap-3 mb-6">
              <span className="w-8 h-1 bg-primary rounded-full" />
              Weekly Timeline
            </h2>

            {program.schedule.map((day, idx) => (
              <DayRow 
                key={idx} 
                day={day} 
                index={idx} 
                isExpanded={expandedDay === idx} 
                onClick={() => day.type !== 'Rest' && setExpandedDay(expandedDay === idx ? null : idx)} 
              />
            ))}
          </div>

          {/* Tips Column */}
          <div className="space-y-6">
            
            {/* Position Module */}
            {program.positionFocus && (
              <ModuleCard title="Position Focus" icon={<Target className="text-accent" />} color="border-accent">
                <p className="text-sm font-bold text-white mb-2">{program.positionFocus.label}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {Array.isArray(program.positionFocus.muscles) && program.positionFocus.muscles.map(m => (
                    <span key={m} className="px-2 py-1 rounded-md bg-white/5 text-[10px] uppercase font-bold text-accent border border-accent/20">
                      {m}
                    </span>
                  ))}
                </div>
              </ModuleCard>
            )}

            {/* Preparation Module */}
            <ModuleCard title="Prep & Care" icon={<Activity className="text-purple-400" />} color="border-purple-500">
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1.5">Warmup</h4>
                  <p className="text-sm leading-relaxed text-white/80">{program.warmup}</p>
                </div>
                <div className="h-px bg-white/5" />
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1.5">Cooldown</h4>
                  <p className="text-sm leading-relaxed text-white/80">{program.cooldown}</p>
                </div>
              </div>
            </ModuleCard>

            {/* Support Modules */}
            <ModuleCard title="Elite Nutrition" icon={<Apple className="text-green-500" />} color="border-green-500">
              <ul className="space-y-3">
                {Array.isArray(program.nutritionTips) && program.nutritionTips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm text-white/70 leading-snug">
                    <span className="text-green-500 font-bold shrink-0">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </ModuleCard>

            <ModuleCard title="Pro Recovery" icon={<BatteryCharging className="text-blue-400" />} color="border-blue-400">
              <ul className="space-y-3">
                {Array.isArray(program.recoveryTips) && program.recoveryTips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm text-white/70 leading-snug">
                    <span className="text-blue-400 font-bold shrink-0">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </ModuleCard>

            {/* New Program Button */}
            <button
              onClick={() => navigate('/create')}
              className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest no-print"
            >
              <Plus size={18} />
              New Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-Components ---

function StatCard({ label, value, icon }) {
  return (
    <div className="card p-4 flex flex-col items-center justify-center border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 font-black mb-1">
        {icon}
        {label}
      </div>
      <div className="text-3xl font-black italic">{value}</div>
    </div>
  );
}

function ModuleCard({ title, icon, color, children }) {
  return (
    <div className={`card p-6 border-l-2 ${color} bg-white/[0.02]`}>
      <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function DayRow({ day, index, isExpanded, onClick }) {
  const isRest = day?.type === 'Rest';
  
  return (
    <div className="card p-0 overflow-hidden border-white/5 hover:border-white/10 transition-colors print:border-black/10 print:mb-4">
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isRest ? 'cursor-default opacity-50' : 'hover:bg-white/5'}`}
      >
        <div className="flex items-center gap-5">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black text-lg ${isRest ? 'bg-white/5 text-white/20' : 'bg-primary/10 text-primary'}`}>
            {index + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{day?.day || `Day ${index + 1}`}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${isRest ? 'bg-white/10 text-white/40' : 'bg-primary/20 text-primary'}`}>
                {isRest ? 'REST' : 'TRAIN'}
              </span>
            </div>
            <p className="text-sm text-white/40 font-medium">{day?.focus || (isRest ? 'Recovery & Mobility' : 'Training Session')}</p>
          </div>
        </div>
        {!isRest && (
          <ChevronDown className={`text-white/20 transition-transform ${isExpanded ? 'rotate-180' : ''} no-print`} />
        )}
      </button>

      {!isRest && (
        <>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="no-print"
              >
                <div className="px-5 pb-5 pt-2 border-t border-white/5 bg-white/[0.01]">
                  <ExerciseGrid exercises={day?.exercises || []} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="hidden print:block border-t border-black/5 bg-black/[0.01] px-5 pb-5 pt-4">
             <ExerciseGrid exercises={day?.exercises || []} isPrint />
          </div>
        </>
      )}
    </div>
  );
}

function ExerciseGrid({ exercises, isPrint }) {
  return (
    <div className="space-y-3">
      {exercises.map((ex, i) => (
        <div key={i} className={`p-4 rounded-xl flex flex-col md:flex-row justify-between gap-4 ${isPrint ? 'bg-white border border-black/10' : 'bg-white/5 border border-white/5'}`}>
          <div className="flex-1">
            <h4 className={`font-bold ${isPrint ? 'text-black' : 'text-white'}`}>{ex.name}</h4>
            <p className={`text-xs mt-1 leading-relaxed ${isPrint ? 'text-black/60' : 'text-white/40'}`}>{ex.notes}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <DataChip icon={<ListRestart size={12} />} label={`${ex.sets} × ${ex.reps}`} isPrint={isPrint} />
            <DataChip icon={<Timer size={12} />} label={ex.rest} isPrint={isPrint} />
          </div>
        </div>
      ))}
    </div>
  );
}

function DataChip({ icon, label, isPrint }) {
  return (
    <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-black tracking-widest ${isPrint ? 'border border-black/10 text-black' : 'bg-white/5 text-white/60 border border-white/5'}`}>
      {icon}
      {label}
    </div>
  );
}

function ErrorMessage({ error, onRetry, onBack }) {
  return (
    <div className="container mx-auto px-4 py-20 max-w-lg text-center">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
        <Target className="text-red-500" size={40} />
      </div>
      <h1 className="text-3xl font-black mb-4 uppercase italic">Error</h1>
      <p className="text-white/50 mb-10 leading-relaxed">{error}</p>
      <div className="space-y-4">
        {onRetry && <button onClick={onRetry} className="btn-primary w-full py-4">Retry Generation</button>}
        <button onClick={onBack} className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 font-bold uppercase tracking-widest text-xs">Return to Form</button>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl animate-pulse">
      <div className="w-64 h-12 bg-white/5 rounded mx-auto mb-10" />
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
           {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl" />)}
        </div>
        <div className="space-y-6">
           <div className="h-40 bg-white/5 rounded-xl" />
           <div className="h-64 bg-white/5 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
