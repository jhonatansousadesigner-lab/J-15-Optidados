import React from 'react';
import { Activity, Maximize2, Sparkles, FileText, Users } from 'lucide-react';
import { TabType } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  ordersBadgeCount?: number;
  crmAlertCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  ordersBadgeCount = 0,
  crmAlertCount = 0,
}) => {
  const tabs = [
    { id: 'cockpit' as TabType, label: 'Cockpit do Vendedor', icon: Activity },
    { id: 'pupilometro' as TabType, label: 'Pupilômetro via Foto', icon: Maximize2, badge: 'IA Foto' },
    { id: 'consultor' as TabType, label: 'Jornada 20/20 & Consultor', icon: Sparkles },
    { id: 'os' as TabType, label: 'Ordens & Laboratórios', icon: FileText, count: ordersBadgeCount },
    { id: 'crm' as TabType, label: 'Pós-Venda & B-15 Bônus', icon: Users, count: crmAlertCount },
  ];

  return (
    <nav id="app-navigation-bar" className="bg-[#020408]/85 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/50 sticky top-[61px] z-40">
      <div className="max-w-7xl mx-auto px-4 flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap cursor-pointer select-none ${
                active
                  ? 'bg-gradient-to-r from-blue-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_16px_rgba(0,255,249,0.25)] scale-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-[#00FFF9]' : 'text-slate-400'}`} />
              <span className={active ? 'font-bold' : ''}>{tab.label}</span>

              {tab.badge && !active && (
                <span className="text-[10px] bg-cyan-950/90 text-cyan-300 border border-cyan-500/30 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {tab.badge}
                </span>
              )}

              {typeof tab.count === 'number' && tab.count > 0 && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    active ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-red-500/90 text-white shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
