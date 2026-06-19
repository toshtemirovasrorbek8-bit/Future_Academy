import React, { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, MessageSquare, Send, Award, Clock, Play } from "lucide-react";
import { Message, UserProfile } from "../types";

interface CallInterfaceProps {
  userProfile: UserProfile;
  onProfileUpdate: (updated: Partial<UserProfile>) => void;
  selectedPlanName?: string;
}

export default function CallInterface({ userProfile, onProfileUpdate, selectedPlanName }: CallInterfaceProps) {
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'connected' | 'ended'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isLoudspeaker, setIsLoudspeaker] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLolaSpeaking, setIsLolaSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const ringtoneOscRef = useRef<OscillatorNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio context for ringtones
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  // Play synthetic telephone beep using Web Audio API
  const startBeeping = () => {
    initAudio();
    if (!audioCtxRef.current) return;

    const ctx = audioCtxRef.current;
    let isBeepActive = true;

    const playBeepCycle = () => {
      if (!isBeepActive || callState !== 'ringing') return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // Standard US dial tone / European ring frequency
      osc.frequency.setTargetAtTime(480, ctx.currentTime, 0.1); 

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.2);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      setTimeout(() => {
        try {
          osc.stop();
        } catch (e) {}
      }, 1500);
    };

    // Trigger ringtone every 3.5 seconds
    playBeepCycle();
    const ringInterval = setInterval(() => {
      if (callState === 'ringing') {
        playBeepCycle();
      } else {
        clearInterval(ringInterval);
      }
    }, 3800);

    return () => {
      isBeepActive = false;
      clearInterval(ringInterval);
    };
  };

  // Speak Lola's response using the Web Speech Synthesis API
  const speakText = (text: string) => {
    if (!isLoudspeaker || typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    // Cancel any current utterance
    window.speechSynthesis.cancel();

    // Custom text formatting: clean up markdown for smoother speaking
    const cleanedText = text
      .replace(/[\*\#\_]/g, "")
      .replace(/Mock/gi, "Mok")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    
    // Find an appropriate voice (prefer Turkish or standard Turkic/Uzbek reader, or general soft woman voice)
    const voices = window.speechSynthesis.getVoices();
    const trVoice = voices.find(v => v.lang.startsWith("tr") || v.lang.startsWith("uz") || v.lang.startsWith("ru"));
    const enVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Luz"));
    
    if (trVoice) {
      utterance.voice = trVoice;
    } else if (enVoice) {
      utterance.voice = enVoice;
    }
    
    utterance.rate = 1.05; // Slightly faster for conversational realism
    utterance.pitch = 1.1; // Friendly and upbeat
    
    utterance.onstart = () => {
      setIsLolaSpeaking(true);
    };
    utterance.onend = () => {
      setIsLolaSpeaking(false);
    };
    utterance.onerror = () => {
      setIsLolaSpeaking(false);
      setSpeechError(true);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Start simulated phone call
  const handleStartCall = () => {
    setCallState('ringing');
    setSeconds(0);
    setSpeechError(false);
    
    // Web Speech API initializes voices
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }

    // Start synthetic dial ring
    const stopRing = startBeeping();

    // Auto-connect call after 3 seconds of ringing
    setTimeout(() => {
      if (stopRing) stopRing();
      setCallState('connected');
      
      // Setup default welcome message from Lola
      const welcomeMsg: Message = {
        id: "welcome",
        sender: "lola",
        text: `Salom! Future Academy Kelajak Akademiyasiga xush kelibsiz! Shaxsiy sun'iy intellekt maslahatchingiz Lolaman. \n\nHozirda qanday yo'nalishlarni o'rganishni istaysiz? Bizda Sun'iy Intellekt, Fullstack JS va Kiberxavfsizlik kurslari mavjud!`,
        timestamp: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages([welcomeMsg]);
      speakText(welcomeMsg.text);

      // Start duration stopwatch timer
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }, 2800);
  };

  // Hang up the phone
  const handleEndCall = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsLolaSpeaking(false);
    setCallState('ended');
    setTimeout(() => {
      setCallState('idle');
      setMessages([]);
    }, 2000);
  };

  // Intercept volume / loudspeaker toggles
  const toggleLoudspeaker = () => {
    setIsLoudspeaker(!isLoudspeaker);
    if (isLoudspeaker && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsLolaSpeaking(false);
    } else if (messages.length > 0) {
      const lastLolaMsg = [...messages].reverse().find(m => m.sender === 'lola');
      if (lastLolaMsg) speakText(lastLolaMsg.text);
    }
  };

  // Send user message through standard HTTP request (server-side Gemini process)
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsgText = inputText.trim();
    setInputText("");

    const newMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, newMsg]);
    setIsLoading(true);

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Mute Lola if user starts inputting text
    }

    try {
      const response = await fetch("/api/consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          history: messages,
          userProfile: {
            ...userProfile,
            activeSaaSTariff: selectedPlanName || "Sotib olinmagan"
          }
        })
      });

      const data = await response.json();
      
      const lolaMsgText = data.response || "Muloqotda qandaydir uzilish yuz berdi. Iltimos, yana bir bor qayta yozib ko'ring.";
      
      const lolaMsg: Message = {
        id: `lola-${Date.now()}`,
        sender: "lola",
        text: lolaMsgText,
        timestamp: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, lolaMsg]);
      speakText(lolaMsgText);

      // Simple auto-registration detection in conversational flow
      if (
        lolaMsgText.toLowerCase().includes("id-karta") ||
        lolaMsgText.toLowerCase().includes("virtual") ||
        lolaMsgText.toLowerCase().includes("ro'yxat") ||
        lolaMsgText.toLowerCase().includes("yozildingiz")
      ) {
        if (!userProfile.isRegistered) {
          onProfileUpdate({ isRegistered: true, level: "AI Innovator" });
        }
      }

    } catch (err) {
      console.error(err);
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "lola",
        text: "Tizimda biroz nosozlik bo'ldi. Lekin men siz bilanman! O'quv markazimizning rasmiy +998 (71) 200-50-50 raqamiga ham qo'ng'iroq qilishingiz mumkin.",
        timestamp: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="call-interface-container" className="w-full max-w-md mx-auto bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/10 flex flex-col h-[650px]">
      
      {/* Dialer Header Status */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2.5 h-2.5 rounded-full ${callState === 'connected' ? 'bg-emerald-500 animate-pulse' : callState === 'ringing' ? 'bg-amber-500 animate-ping' : 'bg-slate-500'}`} />
          <span className="text-xs text-slate-400 font-mono tracking-widest text-uppercase">
            {callState === 'idle' && "OFLAYN ALOQA"}
            {callState === 'ringing' && "QO'NG'IROQ KETMOQDA..."}
            {callState === 'connected' && "JONLI ALOQA"}
            {callState === 'ended' && "ALOQA TUGATILDI"}
          </span>
        </div>
        
        {/* Call clock timer */}
        {callState === 'connected' && (
          <div className="flex items-center space-x-1 text-cyan-400 font-mono text-sm bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(seconds)}</span>
          </div>
        )}
      </div>

      {/* Main Call View Area */}
      <div className="flex-1 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 flex flex-col justify-between overflow-y-auto relative custom-scrollbar">
        
        {callState === 'idle' && (
          <div className="flex flex-col items-center justify-center text-center py-12 flex-1">
            <div className="w-24 h-24 rounded-full bg-cyan-950/80 border border-cyan-400/30 flex items-center justify-center mb-6 relative shadow-lg shadow-cyan-500/10">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping" />
              <Phone className="w-10 h-10 text-cyan-400" />
            </div>
            
            <h3 className="text-xl font-sans font-semibold text-slate-100 mb-2">Simulyator: AI Lola bilan Suvday Jonli Ovozli Muloqot</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-6">
              Bizning sun'iy intellekt maslahatchimiz Lola bilan qo'ng'iroq orqali ulaning. Kurslar, SaaS tariflari va registratsiya haqida to'liq so'rang.
            </p>
            
            {/* Real human styled number */}
            <div className="bg-slate-950/80 px-5 py-3 rounded-2xl border border-slate-800 flex items-center justify-center space-x-3 mb-6">
              <span className="text-xs text-slate-500 font-mono">ASOSIY RAQAM</span>
              <span className="text-lg font-mono font-bold text-cyan-400">+998 (71) 200-50-50</span>
            </div>

            <button
              onClick={handleStartCall}
              id="btn-start-call"
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full font-bold transition duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 shadow-lg shadow-cyan-500/20"
            >
              <Phone className="w-5 h-5 fill-current" />
              <span>Lola-ga qo'ng'iroq qilish</span>
            </button>
          </div>
        )}

        {callState === 'ringing' && (
          <div className="flex flex-col items-center justify-center text-center flex-1">
            <div className="w-28 h-28 rounded-full bg-amber-950/40 border border-amber-400/40 flex items-center justify-center mb-6 animate-pulse">
              <Phone className="w-12 h-12 text-amber-400 animate-bounce" />
            </div>
            
            <h4 className="text-2xl font-bold text-slate-100 mb-1">AI Maslahatchi Lola</h4>
            <span className="text-sm text-cyan-400 font-mono mb-6">+998 (99) 888-77-66</span>
            
            <p className="text-xs font-mono text-slate-500 animate-pulse tracking-wide uppercase">
              RINGTON SYNTHESIZER BEPING...
            </p>
          </div>
        )}

        {callState === 'connected' && (
          <div className="flex flex-col h-full justify-between">
            {/* Active voice Waveform or messaging thread */}
            <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar pr-1 space-y-3 min-h-[250px] max-h-[350px]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[85%] ${m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div className="flex items-center space-x-1.5 mb-1 text-slate-500">
                    <span className="text-[10px] font-mono capitalize">
                      {m.sender === 'user' ? 'Siz' : 'Lola (Future AI)'}
                    </span>
                    <span className="text-[10px] font-mono">•</span>
                    <span className="text-[10px] font-mono">{m.timestamp}</span>
                  </div>
                  
                  <div
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-cyan-500 text-slate-950 rounded-tr-none'
                        : 'bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex space-x-1.5 items-center p-3 bg-slate-800/40 rounded-2xl w-24 border border-slate-800/60">
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce" />
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Lola Voice Animated Waveform */}
            <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/80 mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-850 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
                  AI
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Lola nutq holati</h5>
                  <p className="text-[10px] text-slate-400">
                    {isLolaSpeaking ? "Nutq faol (Web Speech)" : "Sizni tinglamoqda..."}
                  </p>
                </div>
              </div>

              {/* Cyan Pulse waveform */}
              <div className="flex items-center space-x-1 h-6 pr-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                  <div
                    key={bar}
                    className={`w-0.75 bg-cyan-400 rounded-full transition-all duration-300 ${
                      isLolaSpeaking
                        ? 'animate-pulse'
                        : 'bg-slate-600'
                    }`}
                    style={{
                      height: isLolaSpeaking ? `${Math.floor(Math.random() * 20) + 4}px` : '4px',
                      animationDelay: `${bar * 0.1}s`,
                      animationDuration: '0.4s'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* In-Call Text Input Form */}
            <form onSubmit={handleSendMessage} className="flex space-x-2 border-t border-slate-800 pt-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Savolingizni yozing..."
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-2.5 rounded-xl transition duration-200"
              >
                <Send className="w-4 h-4 fill-current" />
              </button>
            </form>
          </div>
        )}

        {callState === 'ended' && (
          <div className="flex flex-col items-center justify-center text-center py-12 flex-1 animate-pulse">
            <div className="w-20 h-20 rounded-full bg-red-950/30 border border-red-500/30 flex items-center justify-center mb-6">
              <PhoneOff className="w-8 h-8 text-red-500" />
            </div>
            <h4 className="text-xl font-bold text-slate-100 mb-1">Muloqot yakunlandi</h4>
            <p className="text-sm text-slate-400">
              Future Academy bilan bo'lgan suhbat uchun tashakkur! Obunangiz faollashtirildi.
            </p>
          </div>
        )}
      </div>

      {/* Call Controls Footer Buttons */}
      {callState !== 'idle' && (
        <div className="bg-slate-950 border-t border-slate-800 p-5 flex items-center justify-around">
          
          {/* Mute button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition duration-200 ${
              isMuted
                ? 'bg-red-500/20 border-red-500/30 text-red-400'
                : 'bg-slate-850 hover:bg-slate-800 border-slate-800 text-slate-400'
            }`}
            title="Mikrofonni o'chirish"
            disabled={callState === 'ended'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* HANG UP Red Button */}
          <button
            onClick={handleEndCall}
            id="btn-hang-up"
            className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 transition duration-200 transform hover:scale-105 active:scale-95"
            title="Aloqani uzish"
          >
            <PhoneOff className="w-6 h-6 fill-current" />
          </button>

          {/* Loudspeaker synthesis volume toggle */}
          <button
            onClick={toggleLoudspeaker}
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition duration-200 ${
              isLoudspeaker
                ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                : 'bg-slate-850 hover:bg-slate-800 border-slate-800 text-slate-400'
            }`}
            title="Sintetik ovoz (Ovoz chiqaruvchi)"
            disabled={callState === 'ended'}
          >
            {isLoudspeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

        </div>
      )}

      {/* Text-To-Speech alert status */}
      {isLoudspeaker && speechError && (
        <div className="bg-amber-950/20 px-4 py-2 border-t border-amber-900/30 text-center">
          <p className="text-[10px] text-amber-400 leading-snug">
            Ovoz chiqarish tizimi o'chirilgan yoki brauzer uni qo'llab quvvatlamaydi. Oflayn matn muloqoti davom etmoqda.
          </p>
        </div>
      )}
    </div>
  );
}
