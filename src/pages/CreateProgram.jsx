import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';

// ─── DATA DEFINITIONS ─────────────────────────────────────────────────────────

const SPORTS = ['Basketball', 'Football', 'Volleyball', 'Running', 'Gym'];

const POSITIONS = {
  Basketball:  ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
  Football:    ['Goalkeeper', 'Defender', 'Midfielder', 'Winger', 'Striker'],
  Volleyball:  ['Setter', 'Outside Hitter', 'Middle Blocker', 'Opposite Hitter', 'Libero', 'Defensive Specialist'],
  Running:     ['Sprinter', 'Middle Distance', 'Long Distance', 'Trail Runner'],
  Gym:         [],
};

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const GOALS = [
  'Improve Performance',
  'Build Muscle',
  'Lose Weight',
  'Increase Speed',
  'Improve Flexibility',
  'Build Endurance',
  'Injury Prevention',
];

const EQUIPMENT = [
  { id: 'gym',        label: 'Gym',           sub: 'Full gym access' },
  { id: 'court',      label: 'Court / Field', sub: 'Sport venue only' },
  { id: 'home',       label: 'Home',          sub: 'Bodyweight & minimal gear' },
  { id: 'gym+court',  label: 'Gym + Court',   sub: 'Both gym & sport venue' },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function CreateProgram() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sport:         '',
    position:      '',
    days:          '',
    level:         '',
    age:           '',
    height:        '',
    weight:        '',
    goals:         [],
    hasInjury:     'No',
    injuryDetails: '',
    equipment:     '',
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const set = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'sport') {
      setFormData(prev => ({ ...prev, sport: value, position: '' }));
    } else {
      set(name, value);
    }
  };

  const toggleGoal = goal =>
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal],
    }));

  // ── Validation ────────────────────────────────────────────────────────────

  const isValid = () => {
    const needsPosition = POSITIONS[formData.sport]?.length > 0;
    const posOk = needsPosition ? formData.position !== '' : true;
    const injuryOk = formData.hasInjury === 'Yes'
      ? formData.injuryDetails.trim() !== '' : true;

    return (
      formData.sport &&
      posOk &&
      formData.days &&
      formData.level &&
      Number(formData.age) >= 14 && Number(formData.age) <= 75 &&
      Number(formData.height) >= 100 && Number(formData.height) <= 260 &&
      Number(formData.weight) >= 30 && Number(formData.weight) <= 250 &&
      formData.goals.length > 0 &&
      injuryOk &&
      formData.equipment !== ''
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isValid()) navigate('/results', { state: { formData } });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const hasPositions = POSITIONS[formData.sport]?.length > 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="card mt-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
          <Activity className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Create Training Program</h1>
            <p className="text-white/50 text-sm mt-0.5">Your AI fitness coach will build a personalised plan</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── 1. Sport ─────────────────────────────────────────────────── */}
          <Section title="Sport">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {SPORTS.map(s => (
                <ToggleBtn
                  key={s}
                  label={s}
                  active={formData.sport === s}
                  onClick={() => setFormData(prev => ({ ...prev, sport: s, position: '' }))}
                />
              ))}
            </div>
          </Section>

          {/* ── 2. Position ──────────────────────────────────────────────── */}
          <AnimatePresence>
            {hasPositions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Section title={<>Position <span className="text-red-400">*</span></>}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {POSITIONS[formData.sport].map(p => (
                      <ToggleBtn
                        key={p}
                        label={p}
                        active={formData.position === p}
                        onClick={() => set('position', p)}
                      />
                    ))}
                  </div>
                </Section>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── 3. Training Days ─────────────────────────────────────────── */}
          <Section title={<>Training Days / Week <span className="text-red-400">*</span></>}>
            <div className="grid grid-cols-4 gap-3">
              {[3, 4, 5, 6].map(d => (
                <ToggleBtn
                  key={d}
                  label={`${d} days`}
                  active={formData.days === String(d)}
                  onClick={() => set('days', String(d))}
                />
              ))}
            </div>
          </Section>

          {/* ── 4. Fitness Level ─────────────────────────────────────────── */}
          <Section title={<>Fitness Level <span className="text-red-400">*</span></>}>
            <div className="grid grid-cols-3 gap-3">
              {LEVELS.map(l => (
                <ToggleBtn
                  key={l}
                  label={l}
                  active={formData.level === l}
                  onClick={() => set('level', l)}
                />
              ))}
            </div>
          </Section>

          {/* ── 5. Biometrics ────────────────────────────────────────────── */}
          <Section title="Your Stats">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <NumberField
                label="Age"
                name="age"
                min={14} max={75}
                placeholder="years"
                value={formData.age}
                onChange={handleChange}
              />
              <NumberField
                label="Height"
                name="height"
                min={100} max={260}
                placeholder="cm"
                value={formData.height}
                onChange={handleChange}
              />
              <NumberField
                label="Weight"
                name="weight"
                min={30} max={250}
                placeholder="kg"
                value={formData.weight}
                onChange={handleChange}
              />
            </div>
          </Section>

          <hr className="border-white/10" />

          {/* ── 6. Goals ─────────────────────────────────────────────────── */}
          <Section title={<>Goals <span className="text-red-400">*</span> <span className="text-white/40 text-xs font-normal">Pick one or more</span></>}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {GOALS.map(g => (
                <ToggleBtn
                  key={g}
                  label={g}
                  active={formData.goals.includes(g)}
                  onClick={() => toggleGoal(g)}
                />
              ))}
            </div>
            {formData.goals.length === 0 && (
              <p className="text-red-400/70 text-xs mt-2">Select at least one goal</p>
            )}
          </Section>

          {/* ── 7. Injuries ──────────────────────────────────────────────── */}
          <Section title="Injuries / Health Conditions">
            <div className="flex gap-4 mb-3">
              {['No', 'Yes'].map(val => (
                <label key={val} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="hasInjury"
                    value={val}
                    checked={formData.hasInjury === val}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <span className={formData.hasInjury === val ? 'text-white font-semibold' : 'text-white/60'}>
                    {val === 'No' ? 'None' : 'Yes — specify'}
                  </span>
                </label>
              ))}
            </div>
            <AnimatePresence>
              {formData.hasInjury === 'Yes' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input
                    type="text"
                    name="injuryDetails"
                    value={formData.injuryDetails}
                    onChange={handleChange}
                    className="input-field w-full mt-2"
                    placeholder="Describe the injury and location (e.g. left knee ligament strain)..."
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Section>

          {/* ── 8. Equipment ─────────────────────────────────────────────── */}
          <Section title={<>Available Equipment <span className="text-red-400">*</span></>}>
            <div className="grid grid-cols-2 gap-3">
              {EQUIPMENT.map(eq => (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => set('equipment', eq.id)}
                  className={`p-4 rounded-xl border text-right transition-all ${
                    formData.equipment === eq.id
                      ? 'bg-primary/20 border-primary text-white'
                      : 'border-white/10 hover:border-white/30 text-white/70'
                  }`}
                >
                  <div className="font-semibold text-sm">{eq.label}</div>
                  <div className="text-xs text-white/40 mt-0.5">{eq.sub}</div>
                </button>
              ))}
            </div>
          </Section>

          {/* ── Submit ───────────────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={!isValid()}
            className="btn-primary w-full text-lg mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate My Program ✨
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── SMALL REUSABLE COMPONENTS ─────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-3">{title}</h2>
      {children}
    </div>
  );
}

function ToggleBtn({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-center ${
        active
          ? 'bg-primary/25 border-primary text-white shadow-lg shadow-primary/20'
          : 'border-white/10 hover:border-white/30 text-white/65'
      }`}
    >
      {label}
    </button>
  );
}

function NumberField({ label, name, min, max, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-1.5">
        {label} <span className="text-red-400">*</span>
      </label>
      <input
        type="number"
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="input-field w-full"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
