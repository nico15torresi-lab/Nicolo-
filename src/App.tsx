/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wine, 
  Users, 
  Calendar, 
  Utensils, 
  ChefHat, 
  GlassWater, 
  Gift, 
  Moon, 
  Sun, 
  LogOut,
  ChevronRight,
  Check,
  PartyPopper,
  Flame,
  Sparkles
} from 'lucide-react';

// Background Components
function Balloons() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '110vh', x: `${Math.random() * 100}vw` }}
          animate={{ 
            y: '-20vh',
            x: `${(Math.random() * 100)}vw`,
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 15 + Math.random() * 10, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 20
          }}
          className="absolute opacity-20 dark:opacity-10"
        >
          <div 
            className="w-12 h-16 rounded-full" 
            style={{ backgroundColor: ['#e11d48', '#f97316', '#f472b6', '#facc15'][i % 4] }}
          />
          <div className="w-0.5 h-12 bg-charcoal/20 mx-auto" />
        </motion.div>
      ))}
    </div>
  );
}

function Fireworks() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 3 + Math.random() * 5,
            delay: i * 2
          }}
          className="absolute"
          style={{ 
            top: `${20 + Math.random() * 40}%`, 
            left: `${20 + Math.random() * 60}%` 
          }}
        >
          <Sparkles size={80} className="text-party-yellow animate-pulse" />
        </motion.div>
      ))}
    </div>
  );
}

import { 
  INITIAL_DAYS, 
  DinnerDay, 
  Participant, 
  BringingOption, 
  BRINGING_LABELS 
} from './types';

// Constants for credentials - easily editable
const AUTH_USERNAME = 'amici';
const AUTH_PASSWORD = 'mariolina2024';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [days, setDays] = useState<DinnerDay[]>(() => {
    const saved = localStorage.getItem('mariolina_bookings');
    if (!saved) return INITIAL_DAYS;
    try {
      const parsedSaved: DinnerDay[] = JSON.parse(saved);
      // Merge logic: ensure all INITIAL_DAYS are present, keep bookings for matching dates
      return INITIAL_DAYS.map(initialDay => {
        const savedDay = parsedSaved.find(sd => sd.date === initialDay.date);
        return savedDay ? savedDay : initialDay;
      });
    } catch (e) {
      return INITIAL_DAYS;
    }
  });
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [bookingStatus, setBookingStatus] = useState<{
    name: string;
    bringing: BringingOption | '';
  }>({ name: '', bringing: '' });

  // Persistence
  useEffect(() => {
    localStorage.setItem('mariolina_bookings', JSON.stringify(days));
  }, [days]);

  // Login handling
  const handleLogin = (u: string, p: string) => {
    if (u === AUTH_USERNAME && p === AUTH_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Credenziali errate, ma con affetto.');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleBooking = (e: FormEvent) => {
    e.preventDefault();
    if (selectedDayIndex === null || !bookingStatus.name || !bookingStatus.bringing) return;

    const newParticipant: Participant = {
      id: Math.random().toString(36).substr(2, 9),
      name: bookingStatus.name,
      bringing: bookingStatus.bringing as BringingOption,
    };

    const updatedDays = [...days];
    updatedDays[selectedDayIndex].participants.push(newParticipant);
    setDays(updatedDays);
    
    // Reset form
    setBookingStatus({ name: '', bringing: '' });
    setSelectedDayIndex(null);
    alert('Prenotazione confermata! Mariolina sarebbe fiera (forse).');
  };

  const handleCancelBooking = (dayDate: string, participantId: string) => {
    const firstCheck = confirm('Sicuro di voler scappare? La fame degli altri ricadrà sulla tua coscienza.');
    if (firstCheck) {
      const secondCheck = confirm('PROPRIO SICURO? Mariolina ne soffrirà molto (e anche il tuo stomaco). Ultima occasione per restare!');
      if (secondCheck) {
        setDays(prev => prev.map(day => {
          if (day.date === dayDate) {
            return {
              ...day,
              participants: day.participants.filter(p => p.id !== participantId)
            };
          }
          return day;
        }));
      }
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${isDarkMode ? 'dark bg-cream text-charcoal' : 'bg-cream text-charcoal'}`}>
      <Balloons />
      <Fireworks />
      <div className="relative z-10 max-w-7xl mx-auto min-h-screen flex flex-col p-6 md:p-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="text-terracotta animate-pulse" size={32} />
              <PartyPopper className="text-wine" size={32} />
              <Flame className="text-terracotta animate-pulse" size={32} />
            </div>
            <h1 id="main-title" className="text-4xl md:text-7xl font-black text-wine dark:text-terracotta leading-tight drop-shadow-xl">
              FESTA TOTAL! <br/> <span className="text-3xl md:text-5xl opacity-80">(In attesa di Mariolina)</span>
            </h1>
            <p id="main-subtitle" className="text-lg md:text-xl opacity-95 mt-4 font-serif italic max-w-2xl text-charcoal/90 leading-relaxed bg-white/20 dark:bg-black/20 p-4 rounded-2xl backdrop-blur-sm border border-wine/10">
              Per un mese sarò senza la mia dolce metà, quindi ho deciso di trasformare la casa in un club! 🎉 <br className="hidden md:block"/> 
              Compagnia, risate e cibo a volontà. Scegliete una sera e dichiarate la vostra specialità!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-3 border border-border rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="p-3 border border-border rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-wine"
              title="Esci"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-12 flex-1 items-stretch">
          {/* Sidebar: Chi c'è già */}
          <aside className="lg:w-80 flex flex-col gap-6 lg:border-r border-border lg:pr-12">
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-wine" size={20} />
              <h3 className="text-sm uppercase tracking-widest font-black opacity-50">Squadra d'Assalto</h3>
            </div>
            
            <div className="flex-1 space-y-4">
              {days.flatMap(d => d.participants.map(p => ({ ...p, date: d.date }))).length > 0 ? (
                days.map(day => day.participants.map((p) => (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCancelBooking(day.date, p.id)}
                    className={`relative group p-4 border-l-4 ${day.participants.length % 2 === 0 ? 'border-wine' : 'border-terracotta'} bg-surface/50 dark:bg-surface/5 shadow-md rounded-r-xl cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors`}
                  >
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10">
                      <span className="text-[10px] font-black leading-none">×</span>
                    </div>
                    <p className="font-bold text-sm tracking-tight">{day.date} • {p.name}</p>
                    <p className="text-[10px] italic opacity-70 mt-1 uppercase font-black text-wine">Specialità: {BRINGING_LABELS[p.bringing]}</p>
                  </motion.div>
                )).flat()).flat()
              ) : (
                <div className="p-8 rounded-2xl border-2 border-dashed border-wine/20 text-center italic opacity-60 text-sm">
                  C'è un eco terribile... <br/> Nessun coraggioso si è ancora palesato.
                </div>
              )}
            </div>

            <div className="mt-auto p-6 rounded-2xl border-2 border-terracotta/30 text-center italic bg-terracotta/5 shadow-inner">
              <p className="text-sm font-bold text-terracotta">"Porta il vino, che per piangere c'è sempre tempo!"</p>
            </div>
          </aside>

          {/* Main: Booking Grid & Form */}
          <div className="flex-1 space-y-12 min-w-0">
            {/* Days Selection */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl italic font-bold text-wine">Scegli il tuo destino</h2>
                <p className="text-xs opacity-60 italic font-bold uppercase tracking-widest text-terracotta">Scorri per le date d'oro</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-wine/40">
                {days.map((day, idx) => {
                  const isFull = day.participants.length >= day.maxParticipants;
                  const isSelected = selectedDayIndex === idx;
                  return (
                    <motion.button
                      key={day.date}
                      whileHover={!isFull ? { y: -4, scale: 1.02 } : {}}
                      onClick={() => !isFull && setSelectedDayIndex(idx)}
                      className={`relative p-6 rounded-3xl text-left transition-all border text-charcoal bg-surface shadow-md ${
                        isSelected 
                          ? 'border-wine bg-wine/5 ring-2 ring-wine shadow-xl' 
                          : 'border-border hover:border-wine/40'
                      } ${isFull ? 'opacity-40 grayscale cursor-not-allowed bg-black/5' : ''}`}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className={`text-[10px] uppercase tracking-widest font-black ${isFull ? 'text-wine' : 'text-terracotta'}`}>
                            {isFull ? 'TROPPO TARDI' : 'LIBERTÀ TOTALE'}
                          </span>
                          {!isFull && <Flame size={14} className="text-terracotta animate-pulse" />}
                        </div>
                        <p className="text-2xl font-bold font-serif dark:text-white">{day.date}</p>
                        <p className="text-sm mt-3 font-sans font-bold">
                          Posti: <span className={`text-lg ${isFull ? 'text-wine' : 'text-wine'}`}>
                            {day.maxParticipants - day.participants.length}
                          </span> / 6
                        </p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-4 right-4 text-wine">
                          <Check size={24} strokeWidth={4} />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {/* Booking Details Form */}
            <AnimatePresence mode="wait">
              {selectedDayIndex !== null && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface p-8 md:p-12 rounded-3xl shadow-xl border border-border"
                >
                  <h2 className="text-3xl italic mb-10 font-black text-wine">Dichiara il tuo contributo <br className="md:hidden"/> (senza vergogna)</h2>
                  
                  <form onSubmit={handleBooking} className="space-y-12">
                    <div className="flex flex-col gap-4">
                      <label className="text-xs font-black opacity-60 uppercase tracking-widest text-wine">Come ti chiamano i tuoi fan?</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Inserisci il tuo nome d'arte..." 
                        value={bookingStatus.name}
                        onChange={(e) => setBookingStatus({...bookingStatus, name: e.target.value})}
                        className="p-4 border-b-4 border-wine/10 bg-transparent text-2xl font-serif outline-none focus:border-wine transition-all placeholder:text-charcoal/20 font-bold" 
                      />
                    </div>

                    <div className="flex flex-col gap-6">
                      <label className="text-xs font-black opacity-60 uppercase tracking-widest text-wine">Cosa porti? (Si accettano solo risposte giuste)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {(Object.keys(BRINGING_LABELS) as BringingOption[]).map((opt) => (
                          <label 
                            key={opt}
                            className={`p-4 border-2 rounded-2xl text-center text-sm font-bold transition-all cursor-pointer select-none flex items-center justify-center min-h-[70px] ${
                              bookingStatus.bringing === opt 
                                ? 'bg-wine text-white border-wine shadow-xl shadow-wine/30 scale-[1.05]' 
                                : 'bg-surface border-border hover:border-wine/40 hover:bg-wine/5'
                            }`}
                          >
                            <input 
                              required
                              type="radio" 
                              name="bringing" 
                              className="hidden"
                              value={opt}
                              checked={bookingStatus.bringing === opt}
                              onChange={() => setBookingStatus({...bookingStatus, bringing: opt})}
                            />
                            {BRINGING_LABELS[opt]}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 pt-6">
                      <button 
                        type="submit"
                        className="flex-1 bg-wine text-white py-5 rounded-full font-sans font-bold text-sm uppercase tracking-widest shadow-xl shadow-wine/20 hover:scale-[1.02] active:scale-100 transition-all cursor-pointer"
                      >
                        Conferma Prenotazione
                      </button>
                      <button 
                        type="button"
                        onClick={() => setSelectedDayIndex(null)}
                        className="px-8 py-5 rounded-full font-sans font-bold text-sm uppercase tracking-widest border border-border hover:bg-black/5 transition-all"
                      >
                        Annulla
                      </button>
                    </div>
                  </form>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-12 border-t border-border text-center space-y-6">
          <p className="text-lg italic opacity-70">"Anche senza Mariolina, non possiamo certo smettere di mangiare insieme."</p>
          <div className="flex flex-col gap-2">
            <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40 italic">© 2024 • Il Triste Mese • Made with love and hunger</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function BringingIcon({ type }: { type: BringingOption }) {
  switch (type) {
    case 'antipasto': return <Utensils size={24} />;
    case 'piatto principale': return <ChefHat size={24} />;
    case 'dolci': return <Utensils size={24} className="rotate-45" />;
    case 'super alcolici': return <GlassWater size={24} />;
    case 'vino/birra': return <Wine size={24} />;
    case 'regalo per la casa': return <Gift size={24} />;
  }
}

function Login({ onLogin, isDarkMode, toggleTheme }: { 
  onLogin: (u: string, p: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 flex items-center justify-center p-6 ${isDarkMode ? 'dark bg-cream' : 'bg-cream'}`}>
      <Balloons />
      <button 
        onClick={toggleTheme}
        className="absolute top-8 right-8 p-3 border border-border rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors z-20"
      >
        {isDarkMode ? <Sun size={20} className="text-charcoal" /> : <Moon size={20} className="text-charcoal" />}
      </button>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl bg-surface p-8 md:p-12 rounded-[2rem] shadow-2xl border border-border space-y-8 text-center z-10"
      >
        <div className="space-y-6">
          <div className="relative h-72 rounded-2xl overflow-hidden shadow-2xl group border-4 border-wine/20">
            <img 
              src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200" 
              alt="L'Ultima Cena Ironica"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wine/90 via-wine/20 to-transparent flex items-end p-6 justify-center">
              <span className="text-white font-serif italic text-2xl drop-shadow-lg text-center leading-tight">
                "L'ultima cena... <br/> prima della carestia post-Mariolina"
              </span>
            </div>
            <div className="absolute top-4 left-4 animate-bounce">
              <PartyPopper size={48} className="text-party-yellow drop-shadow-md" />
            </div>
            <div className="absolute top-4 right-4 animate-pulse">
              <Flame size={48} className="text-terracotta drop-shadow-md" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-5xl italic font-black text-wine dark:text-terracotta">Fermi tutti!</h2>
            <p className="text-sm opacity-80 font-serif italic font-bold">Identificatevi prima di svuotare la dispensa.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-left">
            <label className="text-[10px] uppercase font-black tracking-widest opacity-60 text-wine ml-2">Codice Agente</label>
            <input 
              required
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-wine/10 bg-black/5 dark:bg-white/5 focus:bg-surface outline-none focus:ring-4 focus:ring-wine/10 focus:border-wine transition-all font-bold"
              placeholder="Username"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-[10px] uppercase font-black tracking-widest opacity-60 text-wine ml-2">Parola d'Ordine</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-wine/10 bg-black/5 dark:bg-white/5 focus:bg-surface outline-none focus:ring-4 focus:ring-wine/10 focus:border-wine transition-all font-bold"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="md:col-span-2 bg-wine text-white py-6 rounded-full font-sans font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-wine/40 hover:scale-[1.05] active:scale-95 transition-all cursor-pointer mt-4"
          >
            Entra nel Convivio
          </button>
        </form>
        
        <p className="text-xs italic opacity-60 pt-6 border-t border-wine/10 font-bold">
          "La fame non aspetta, entra subito e dichiara le tue intenzioni."
        </p>
      </motion.div>
    </div>
  );
}
