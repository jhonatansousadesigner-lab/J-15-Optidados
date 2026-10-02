import React from 'react';
import { Eye, ShieldCheck, Store, Wifi } from 'lucide-react';

interface HeaderProps {
  pendingOrdersCount: number;
}

export const Header: React.FC<HeaderProps> = ({ pendingOrdersCount }) => {
  return (
    <header id="app-header" className="bg-[#050914]/90 backdrop-blur-xl text-white px-4 sm:px-6 py-3.5 border-b border-cyan-500/20 shadow-2xl shadow-black/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center space-x-3">
          <div id="brand-logo-container" className="bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 p-2 rounded-2xl shadow-[0_0_15px_rgba(0,255,249,0.25)] flex items-center justify-center">
            <Eye className="w-6 h-6 text-[#00FFF9]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span id="brand-title" className="font-extrabold text-2xl tracking-tight leading-none text-white drop-shadow-[0_2px_8px_rgba(0,255,249,0.3)]">
                B-15
              </span>
              <span id="brand-badge" className="text-xs bg-cyan-400/10 text-cyan-300 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border border-cyan-500/30 shadow-[0_0_10px_rgba(0,255,249,0.2)]">
                Optidados
              </span>
            </div>
            <p id="brand-subtitle" className="text-xs text-slate-400 hidden sm:block mt-0.5 font-medium">
              ERP Especializado em Gestão, Vendas e Medidas Ópticas
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div id="sync-status-badge" className="flex items-center space-x-1.5 bg-slate-900/90 px-3 py-1.5 rounded-full text-xs border border-cyan-500/30 shadow-[0_0_12px_rgba(0,255,249,0.15)] text-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#00FFF9] animate-pulse shadow-[0_0_8px_#00FFF9]"></span>
            <Wifi className="w-3.5 h-3.5 text-[#00FFF9]" />
            <span className="font-semibold text-cyan-200">Online & Sincronizado</span>
          </div>

          <div id="store-terminal-info" className="hidden md:flex items-center space-x-2 bg-slate-900/70 px-3.5 py-1.5 rounded-2xl text-xs border border-slate-800 text-slate-300">
            <Store className="w-4 h-4 text-cyan-400" />
            <div className="text-right leading-tight">
              <p className="font-bold text-slate-100">Óptica Matriz Ribeirão</p>
              <p className="text-slate-400 text-[11px] font-mono">Terminal Vendedor 04</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
