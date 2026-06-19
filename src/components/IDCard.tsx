import React from "react";
import { UserProfile } from "../types";
import { Award, ShieldCheck, QrCode, Sparkles } from "lucide-react";

interface IDCardProps {
  userProfile: UserProfile;
}

export default function IDCard({ userProfile }: IDCardProps) {
  return (
    <div id="futuristic-id-card" className="relative w-full max-w-sm mx-auto bg-slate-950/80 border border-cyan-400/40 rounded-2xl p-6 overflow-hidden shadow-2xl backdrop-blur-md">
      
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
      
      {/* Cyberpunk corner brackets */}
      <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400/60" />
      <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400/60" />
      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400/60" />
      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400/60" />

      {/* Header */}
      <div className="flex justify-between items-start border-b border-cyan-500/20 pb-4 mb-4">
        <div>
          <h4 className="text-sm font-black text-cyan-400 tracking-wider">FUTURE ACADEMY</h4>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">SaaS Virtual Identity</span>
        </div>
        <div className="flex items-center space-x-1 text-cyan-400">
          <Award className="w-4 h-4 animate-spin-slow" />
          <span className="text-[10px] font-mono font-bold">VERIFIED</span>
        </div>
      </div>

      {/* Core card layout */}
      <div className="flex space-x-4">
        {/* Avatar Placeholder */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center relative">
            <img 
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${userProfile.name || "Default"}`} 
              alt="User Virtual Avatar" 
              className="w-16 h-16"
            />
            {userProfile.isRegistered && (
              <div className="absolute bottom-0 inset-x-0 bg-cyan-500/80 text-[8px] font-mono text-center text-slate-950 font-bold py-0.5">
                FAOL
              </div>
            )}
          </div>
          <span className="text-[8px] font-mono text-slate-500 mt-2">ID CARD NO</span>
          <span className="text-[10px] font-mono text-cyan-400/80 font-semibold">{userProfile.idCardNumber}</span>
        </div>

        {/* User Details */}
        <div className="flex-1 space-y-2">
          <div>
            <label className="text-[8px] font-mono text-slate-500 uppercase block">Talaba Ismi</label>
            <span className="text-sm font-bold text-slate-100 block truncate">{userProfile.name || "Noma'lum Talaba"}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8px] font-mono text-slate-500 uppercase block">Telefon</label>
              <span className="text-[10px] font-mono text-slate-300 font-semibold block truncate">{userProfile.phone || "+998 (--) --- -- --"}</span>
            </div>
            <div>
              <label className="text-[8px] font-mono text-slate-500 uppercase block">Darajangiz</label>
              <span className="text-[10px] font-mono text-purple-400 font-bold block truncate">{userProfile.level}</span>
            </div>
          </div>

          <div>
            <label className="text-[8px] font-mono text-slate-500 uppercase block">Elektron Pochta</label>
            <span className="text-[10px] font-mono text-slate-300 block truncate">{userProfile.email || "pochta@academy.uz"}</span>
          </div>
        </div>
      </div>

      {/* Footer info/QR code representation */}
      <div className="mt-4 pt-4 border-t border-cyan-500/10 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[9px] font-mono text-slate-400">Tizim holati: Innovator</span>
          </div>
          <p className="text-[8px] text-slate-500 leading-none">Kelajak Akademiyasining rasmiy a'zosi</p>
        </div>

        {/* Pseudo QR code representing blockchain verify */}
        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded p-1 flex items-center justify-center">
          <QrCode className="w-8 h-8 text-cyan-400/70" />
        </div>
      </div>

      {/* Interactive holographic light beam effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent -translate-x-full animate-hologram pointer-events-none" />
    </div>
  );
}
