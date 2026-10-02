import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Eye,
  Sun,
  Shield,
  Monitor,
  Car,
  Zap,
  CheckCircle2,
  HelpCircle,
  FileCheck,
  RefreshCw,
  Award
} from 'lucide-react';
import { Prescription } from '../types';

interface ConsultorViewProps {
  onSelectLensPackage: (lensName: string, lensPrice: number) => void;
}

export const ConsultorView: React.FC<ConsultorViewProps> = ({ onSelectLensPackage }) => {
  // Prescrição padrão
  const [rx, setRx] = useState<Prescription>({
    esfOD: -3.50,
    cilOD: -1.25,
    eixoOD: 180,
    esfOE: -3.75,
    cilOE: -1.00,
    eixoOE: 175,
    adicao: 2.00,
  });

  // Estilo de vida
  const [lifestyle, setLifestyle] = useState({
    computador: true,
    direcao: false,
    solar: false,
    esportes: false,
  });

  // Tratamentos visuais
  const [treatment, setTreatment] = useState({
    antirreflexo: true,
    filtroAzul: true,
    fotossensivel: false,
    intensidadeSolar: 60, // 0 a 100
  });

  // Transposição de Cilindro
  const [showTransposition, setShowTransposition] = useState(false);

  // Análise Refrativa
  const maxGrau = Math.max(Math.abs(rx.esfOD), Math.abs(rx.esfOE));
  const isMiopia = rx.esfOD < 0 || rx.esfOE < 0;
  const isPresbiopia = rx.adicao > 0;

  // Cálculo da transposição óptica
  const transporOD = {
    esf: (rx.esfOD + rx.cilOD).toFixed(2),
    cil: (-rx.cilOD).toFixed(2),
    eixo: (rx.eixoOD + 90) % 180 || 180,
  };
  const transporOE = {
    esf: (rx.esfOE + rx.cilOE).toFixed(2),
    cil: (-rx.cilOE).toFixed(2),
    eixo: (rx.eixoOE + 90) % 180 || 180,
  };

  // Cálculo das estatísticas da lente para o grau atual
  const getIndexStats = (indice: number) => {
    const grauBase = maxGrau + Math.max(Math.abs(rx.cilOD), Math.abs(rx.cilOE)) * 0.5;
    const espessuraPadrao = 2.0 + (grauBase * 0.9);
    // Redução proporcional à densidade óptica do índice
    const ratio = 1.50 / indice;
    const espessura = (espessuraPadrao * Math.pow(ratio, 1.25)).toFixed(1);
    const peso = (22 * ratio).toFixed(1);
    return { espessura, peso };
  };

  // Determinar qual lente é a ideal para a receita
  const isRecommended = (indice: number) => {
    if (maxGrau <= 2.0) return indice === 1.50 || indice === 1.59;
    if (maxGrau <= 4.0) return indice === 1.60 || indice === 1.67;
    return indice === 1.74 || indice === 1.67;
  };

  const lensPackages = [
    {
      nome: 'Resina Standard 1.50',
      indice: 1.50,
      material: 'CR-39 Orgânico',
      desc: 'Indicado para graus esféricos até 2.00 dioptrias.',
      preco: 380.00,
    },
    {
      nome: 'Policarbonato 1.59 Airwear',
      indice: 1.59,
      material: 'Poli Resistente a Impacto',
      desc: '12x mais resistente e leve. Ideal para armações de fio de nylon ou parafusadas.',
      preco: 620.00,
    },
    {
      nome: 'Alto Índice 1.67 Hi-Lux',
      indice: 1.67,
      material: 'Resina de Alta Densidade',
      desc: 'Até 40% mais fina que lentes comuns. Máxima estética para miopias moderadas e altas.',
      preco: 1150.00,
    },
    {
      nome: 'Ultra Alto Índice 1.74 ThinMax',
      indice: 1.74,
      material: 'Polímero Premium Japonês',
      desc: 'O mais fino do mundo. Elimina o efeito "olho pequeno" ou "fundo de garrafa".',
      preco: 1890.00,
    },
  ];

  return (
    <div id="consultor-view-container" className="space-y-6">
      {/* 1. Prescrição & Dioptrias */}
      <div id="prescription-section" className="bg-[#0b1120]/85 p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl shadow-[0_0_10px_rgba(0,255,249,0.15)]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">1. Prescrição Óptica & Dioptrias</h3>
              <p className="text-xs text-slate-400">Insira a dioptria da receita oftalmológica do cliente</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-toggle-transposition"
              onClick={() => setShowTransposition(!showTransposition)}
              className="text-xs font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 px-3 py-1.5 rounded-xl border border-cyan-500/30 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{showTransposition ? 'Ocultar Transposição' : 'Ver Transposição de Cilindro'}</span>
            </button>

            <span className="text-xs font-extrabold bg-indigo-950/60 text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-500/30">
              {isPresbiopia ? 'Visão: Multifocal / Perto' : 'Visão: Longe / Simples'}
            </span>
          </div>
        </div>

        {/* Grid de Inputs de Dioptrias */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-sm">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Esférico OD</label>
            <input
              id="input-esf-od"
              type="number"
              step="0.25"
              value={rx.esfOD}
              onChange={(e) => setRx({ ...rx, esfOD: parseFloat(e.target.value) || 0 })}
              className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl font-mono font-bold text-slate-100 focus:border-cyan-400 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Cilíndrico OD</label>
            <input
              id="input-cil-od"
              type="number"
              step="0.25"
              value={rx.cilOD}
              onChange={(e) => setRx({ ...rx, cilOD: parseFloat(e.target.value) || 0 })}
              className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl font-mono font-bold text-slate-100 focus:border-cyan-400 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Eixo OD (°)</label>
            <input
              id="input-eixo-od"
              type="number"
              min="0"
              max="180"
              value={rx.eixoOD}
              onChange={(e) => setRx({ ...rx, eixoOD: parseInt(e.target.value, 10) || 0 })}
              className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl font-mono font-bold text-slate-100 focus:border-cyan-400 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Esférico OE</label>
            <input
              id="input-esf-oe"
              type="number"
              step="0.25"
              value={rx.esfOE}
              onChange={(e) => setRx({ ...rx, esfOE: parseFloat(e.target.value) || 0 })}
              className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl font-mono font-bold text-slate-100 focus:border-cyan-400 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Cilíndrico OE</label>
            <input
              id="input-cil-oe"
              type="number"
              step="0.25"
              value={rx.cilOE}
              onChange={(e) => setRx({ ...rx, cilOE: parseFloat(e.target.value) || 0 })}
              className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl font-mono font-bold text-slate-100 focus:border-cyan-400 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Eixo OE (°)</label>
            <input
              id="input-eixo-oe"
              type="number"
              min="0"
              max="180"
              value={rx.eixoOE}
              onChange={(e) => setRx({ ...rx, eixoOE: parseInt(e.target.value, 10) || 0 })}
              className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl font-mono font-bold text-slate-100 focus:border-cyan-400 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-cyan-300 block mb-1">Adição (Multifocal)</label>
            <input
              id="input-adicao"
              type="number"
              step="0.25"
              min="0"
              max="4.00"
              value={rx.adicao}
              onChange={(e) => setRx({ ...rx, adicao: parseFloat(e.target.value) || 0 })}
              className="w-full p-2.5 bg-blue-950/50 border border-cyan-500/40 rounded-xl font-mono font-bold text-[#00FFF9] focus:border-cyan-400 outline-none"
            />
          </div>
        </div>

        {/* Painel de Transposição Óptica (se ativado) */}
        {showTransposition && (
          <div id="transposition-panel" className="mt-4 p-4 bg-slate-950 border border-slate-800 text-white rounded-2xl text-xs space-y-2 font-mono">
            <p className="text-[#00FFF9] font-bold uppercase tracking-wider">Cálculo de Transposição Óptica (Equivalente Cruzado):</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-slate-200">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <strong>OD Transposto:</strong> Esf: {transporOD.esf} | Cil: {transporOD.cil} | Eixo: {transporOD.eixo}°
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <strong>OE Transposto:</strong> Esf: {transporOE.esf} | Cil: {transporOE.cil} | Eixo: {transporOE.eixo}°
              </div>
            </div>
          </div>
        )}

        {/* 2. Estilo de vida & Rotina */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Rotina & Necessidades do Paciente (Neuro-Personalização)
          </p>
          <div className="flex flex-wrap gap-2.5">
            {[
              { key: 'computador', label: 'Telas & Dispositivos (+6h/dia)', icon: Monitor },
              { key: 'direcao', label: 'Direção Noturna Frequente', icon: Car },
              { key: 'solar', label: 'Ambiente Externo / Luz Solar Intensa', icon: Sun },
              { key: 'esportes', label: 'Atividades Físicas / Impacto', icon: Zap },
            ].map((item) => {
              const active = (lifestyle as any)[item.key];
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  id={`lifestyle-btn-${item.key}`}
                  onClick={() => setLifestyle({ ...lifestyle, [item.key]: !active })}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(0,255,249,0.2)]'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{active ? '✓ ' : '+ '} {item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Comparativo Tecnológico de Índices de Refração */}
      <div id="lens-index-comparison-section" className="bg-[#0b1120]/85 p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
          <div>
            <h3 className="text-lg font-black text-white">2. Comparativo Tecnológico de Índices de Refração</h3>
            <p className="text-xs text-slate-400">Estimativa biométrica de espessura de borda e peso para a prescrição atual ({maxGrau.toFixed(2)} D)</p>
          </div>
          <span className="text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full flex items-center space-x-1 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Demonstração de Alto Ticket</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {lensPackages.map((item) => {
            const stats = getIndexStats(item.indice);
            const recomendada = isRecommended(item.indice);
            const espessuraMm = parseFloat(stats.espessura);

            return (
              <div
                key={item.indice}
                id={`lens-card-${item.indice}`}
                className={`p-5 rounded-3xl border-2 flex flex-col justify-between transition-all relative ${
                  recomendada
                    ? 'border-cyan-500/60 bg-gradient-to-b from-[#071329] to-[#040c1a] shadow-[0_0_20px_rgba(0,255,249,0.15)]'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                {recomendada && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-400 text-slate-950 text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-[0_0_10px_#00FFF9] flex items-center space-x-1 whitespace-nowrap">
                    <Award className="w-3 h-3 text-slate-950" />
                    <span>Recomendação B-15</span>
                  </span>
                )}

                <div>
                  <h4 className="font-extrabold text-white text-base leading-tight">{item.nome}</h4>
                  <p className="text-[11px] font-semibold text-cyan-400 mt-0.5">{item.material}</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.desc}</p>

                  {/* Visualizador da Espessura */}
                  <div className="mt-5 space-y-2 p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400">Espessura estimada:</span>
                      <span className="text-cyan-400 font-mono font-black">{stats.espessura} mm</span>
                    </div>

                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          espessuraMm > 4.5
                            ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
                            : espessuraMm > 3.2
                            ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]'
                            : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                        }`}
                        style={{ width: `${Math.min(100, (espessuraMm / 6.5) * 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs font-bold pt-1">
                      <span className="text-slate-400">Peso aproximado:</span>
                      <span className="text-slate-200 font-mono">{stats.peso} g</span>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <span className="text-xs text-slate-500 block">Investimento Estimado</span>
                    <span className="text-xl font-black text-white font-mono">
                      R$ {item.preco.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  id={`btn-select-lens-${item.indice}`}
                  onClick={() => onSelectLensPackage(item.nome, item.preco)}
                  className={`mt-5 w-full py-2.5 rounded-full text-xs font-extrabold cursor-pointer transition-all ${
                    recomendada
                      ? 'bg-gradient-to-r from-[#00FFF9] to-cyan-300 text-slate-950 hover:brightness-110 font-black shadow-[0_0_15px_rgba(0,255,249,0.25)]'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  Selecionar e Vincular à O.S.
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Simulador Visual de Tratamentos */}
      <div id="treatments-simulator-section" className="bg-gradient-to-r from-[#051130] via-[#081840] to-[#040e26] text-white p-6 rounded-3xl shadow-2xl border border-cyan-500/30 backdrop-blur-md">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
          <div>
            <h3 className="text-xl font-black flex items-center space-x-2 text-white">
              <span>3. Demonstração Visual de Tratamentos e Filtros</span>
              <Sparkles className="w-5 h-5 text-[#00FFF9]" />
            </h3>
            <p className="text-xs text-slate-300">
              Interaja com os controles para mostrar ao cliente a eliminação de reflexos, proteção de telas e efeito fotossensível
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              id="btn-toggle-ar"
              onClick={() => setTreatment({ ...treatment, antirreflexo: !treatment.antirreflexo })}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                treatment.antirreflexo
                  ? 'bg-[#00FFF9] text-slate-950 shadow-[0_0_12px_#00FFF9] font-black'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:bg-slate-800'
              }`}
            >
              Antirreflexo Crizal/Duravision {treatment.antirreflexo ? 'LIGADO' : 'DESLIGADO'}
            </button>

            <button
              id="btn-toggle-blue-filter"
              onClick={() => setTreatment({ ...treatment, filtroAzul: !treatment.filtroAzul })}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                treatment.filtroAzul
                  ? 'bg-[#00FFF9] text-slate-950 shadow-[0_0_12px_#00FFF9] font-black'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:bg-slate-800'
              }`}
            >
              Filtro Blue Block {treatment.filtroAzul ? 'LIGADO' : 'DESLIGADO'}
            </button>

            <button
              id="btn-toggle-transitions"
              onClick={() => setTreatment({ ...treatment, fotossensivel: !treatment.fotossensivel })}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                treatment.fotossensivel
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_#fbbf24] font-black'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:bg-slate-800'
              }`}
            >
              Fotossensível UV {treatment.fotossensivel ? 'ATIVO' : 'DESLIGADO'}
            </button>
          </div>
        </div>

        {/* Controle deslizante de Sol/UV se fotossensível ativo */}
        {treatment.fotossensivel && (
          <div className="mb-4 bg-slate-900/80 border border-slate-700/80 p-3 rounded-2xl flex items-center space-x-4">
            <Sun className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-xs font-bold text-white shrink-0">Intensidade Solar UV:</span>
            <input
              id="slider-uv-intensity"
              type="range"
              min="10"
              max="100"
              value={treatment.intensidadeSolar}
              onChange={(e) => setTreatment({ ...treatment, intensidadeSolar: Number(e.target.value) })}
              className="w-full accent-amber-400"
            />
            <span className="text-xs font-mono font-bold text-amber-300">{treatment.intensidadeSolar}%</span>
          </div>
        )}

        {/* Viewport de Simulação Visual em Cenário Noturno / Direção */}
        <div
          id="treatment-simulation-viewport"
          className="relative h-56 sm:h-64 bg-slate-950 rounded-3xl overflow-hidden flex items-center justify-center border border-cyan-500/30 shadow-[0_0_25px_rgba(0,255,249,0.1)]"
        >
          {/* Cenário noturno de fundo com faróis e luzes de tráfego */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-around px-8 sm:px-16 pointer-events-none">
            {/* Farol quente ofuscante */}
            <div className={`w-16 h-16 rounded-full bg-amber-400 ${treatment.antirreflexo ? 'blur-sm opacity-50' : 'blur-xl opacity-95 scale-150 animate-pulse'}`}></div>
            {/* Tela de smartphone / LED azul */}
            <div className={`w-20 h-20 rounded-full bg-cyan-400 ${treatment.filtroAzul ? 'blur-xs opacity-20' : 'blur-lg opacity-85'}`}></div>
            {/* Farol vermelho traseiro */}
            <div className={`w-12 h-12 rounded-full bg-red-500 ${treatment.antirreflexo ? 'blur-xs opacity-60' : 'blur-md opacity-90'}`}></div>
          </div>

          {/* Lente Virtual Sobreposta */}
          <div
            id="simulated-lens-disc"
            style={{
              backgroundColor: treatment.fotossensivel
                ? `rgba(30, 41, 59, ${treatment.intensidadeSolar / 120})`
                : treatment.filtroAzul
                ? 'rgba(245, 158, 11, 0.08)'
                : 'transparent',
            }}
            className={`relative z-10 w-80 h-44 rounded-[40px] border-4 transition-all duration-500 flex flex-col items-center justify-center p-4 ${
              treatment.antirreflexo
                ? 'border-[#00FFF9]/70 shadow-[0_0_40px_rgba(0,255,249,0.35)] backdrop-blur-none'
                : 'border-white/50 bg-white/35 backdrop-blur-[2px]'
            }`}
          >
            {/* Brilho de reflexo indesejado na lente sem antirreflexo */}
            {!treatment.antirreflexo && (
              <div className="absolute inset-2 border-2 border-white/40 rounded-[36px] bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none"></div>
            )}

            <div className="text-center space-y-1.5 z-20">
              {!treatment.antirreflexo ? (
                <span className="text-white text-xs font-black bg-red-600/90 px-3 py-1 rounded-full shadow">
                  SEM TRATAMENTO: Reflexos e Fadiga Ocular
                </span>
              ) : (
                <span className="text-[#001F7E] text-xs font-black bg-[#00FFF9] px-3 py-1 rounded-full shadow">
                  ANTIRREFLEXO 99.8% LÍMPIDO
                </span>
              )}

              {treatment.filtroAzul && (
                <p className="text-[11px] font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded-full inline-block">
                  Bloqueio de Luz Azul Nociva (420nm) Ativo
                </p>
              )}

              {treatment.fotossensivel && (
                <p className="text-[11px] font-bold text-amber-200 bg-black/70 px-2 py-0.5 rounded-full block">
                  Foto-escurecimento Ativado ({treatment.intensidadeSolar}%)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
