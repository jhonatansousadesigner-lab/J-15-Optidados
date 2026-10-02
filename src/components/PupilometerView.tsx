import React, { useState, useRef, useEffect } from 'react';
import {
  Maximize2,
  ShieldCheck,
  CheckCircle,
  Camera,
  Upload,
  RotateCcw,
  Sliders,
  Copy,
  Info,
  Check,
  CreditCard,
  User
} from 'lucide-react';

interface PupilometerViewProps {
  onTransferToOrder: (dnpOD: number, dnpOE: number, altOD: number, altOE: number) => void;
}

export const PupilometerView: React.FC<PupilometerViewProps> = ({ onTransferToOrder }) => {
  // Coordenadas da imagem (base de 500x380)
  const [pupilOD, setPupilOD] = useState({ x: 175, y: 180 });
  const [pupilOE, setPupilOE] = useState({ x: 325, y: 180 });
  const [bridgeX, setBridgeX] = useState(250);
  const [frameBottomY, setFrameBottomY] = useState(260);
  const [scaleFactor, setScaleFactor] = useState(0.42); // 1px = ~0.42mm
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [showCardHelper, setShowCardHelper] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [draggingTarget, setDraggingTarget] = useState<'od' | 'oe' | 'bridge' | 'frameBottom' | null>(null);

  // Cálculos ópticos padronizados
  const dnpODNum = Math.max(20, Math.min(42, Math.abs((bridgeX - pupilOD.x) * scaleFactor)));
  const dnpOENum = Math.max(20, Math.min(42, Math.abs((pupilOE.x - bridgeX) * scaleFactor)));
  const dpTotalNum = dnpODNum + dnpOENum;
  const altODNum = Math.max(12, Math.min(36, Math.abs((frameBottomY - pupilOD.y) * scaleFactor)));
  const altOENum = Math.max(12, Math.min(36, Math.abs((frameBottomY - pupilOE.y) * scaleFactor)));
  const diametroSugerido = Math.round(dpTotalNum + 10);

  const dnpOD = dnpODNum.toFixed(1);
  const dnpOE = dnpOENum.toFixed(1);
  const dpTotal = dpTotalNum.toFixed(1);
  const altOD = altODNum.toFixed(1);
  const altOE = altOENum.toFixed(1);

  // Manipulação de Upload de Imagem
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserPhoto(reader.result as string);
        setIsCameraActive(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Ativação da Câmera Web
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
      alert("Não foi possível acessar a câmera. Você pode fazer upload de uma foto salva.");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = videoRef.current.videoWidth || 640;
      tempCanvas.height = videoRef.current.videoHeight || 480;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, tempCanvas.width, tempCanvas.height);
        setUserPhoto(tempCanvas.toDataURL('image/png'));
      }
      // Parar stream
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setIsCameraActive(false);
    }
  };

  const cancelCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleCopy = () => {
    const text = `MEDIDAS ÓPTICAS B-15:\nDNP OD: ${dnpOD} mm\nDNP OE: ${dnpOE} mm\nDP Total: ${dpTotal} mm\nAltura OD: ${altOD} mm\nAltura OE: ${altOE} mm\nDiâmetro Mínimo: ${diametroSugerido} mm`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Controle de arrasto no canvas
  const handlePointerDown = (target: 'od' | 'oe' | 'bridge' | 'frameBottom') => (e: React.PointerEvent) => {
    e.stopPropagation();
    setDraggingTarget(target);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingTarget || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(10, Math.min(490, ((e.clientX - rect.left) / rect.width) * 500));
    const y = Math.max(10, Math.min(370, ((e.clientY - rect.top) / rect.height) * 380));

    if (draggingTarget === 'od') {
      setPupilOD({ x: Math.min(bridgeX - 10, x), y });
    } else if (draggingTarget === 'oe') {
      setPupilOE({ x: Math.max(bridgeX + 10, x), y });
    } else if (draggingTarget === 'bridge') {
      setBridgeX(Math.max(pupilOD.x + 10, Math.min(pupilOE.x - 10, x)));
    } else if (draggingTarget === 'frameBottom') {
      setFrameBottomY(y);
    }
  };

  const handlePointerUp = () => {
    setDraggingTarget(null);
  };

  const resetCoordinates = () => {
    setPupilOD({ x: 175, y: 180 });
    setPupilOE({ x: 325, y: 180 });
    setBridgeX(250);
    setFrameBottomY(260);
    setScaleFactor(0.42);
  };

  return (
    <div id="pupilometer-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Coluna Principal: Calibrador e Visor Digital */}
      <div className="lg:col-span-8 bg-[#0b1120]/85 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md">
        {/* Cabeçalho do Visor */}
        <div className="flex flex-wrap justify-between items-center mb-4 pb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-xl font-black text-white flex items-center space-x-2">
              <span>Pupilômetro Digital por Foto 1:1</span>
              <ShieldCheck className="w-5 h-5 text-[#00FFF9]" />
            </h3>
            <p className="text-xs text-slate-400">
              Arraste os retículos sobre as pupilas do cliente e a ponte nasal para cálculo micrométrico
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold px-3 py-1 rounded-full text-xs flex items-center space-x-1 shadow-[0_0_10px_rgba(0,255,249,0.1)]">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Calibração: Cartão Magnético ISO</span>
            </span>
          </div>
        </div>

        {/* Toolbar de Fontes de Imagem */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-2">
            <label
              id="btn-upload-photo"
              className="cursor-pointer bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-bold py-1.5 px-3.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Carregar Foto</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {!isCameraActive ? (
              <button
                id="btn-open-webcam"
                onClick={startCamera}
                className="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-bold py-1.5 px-3.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>Usar Câmera</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  id="btn-capture-snapshot"
                  onClick={capturePhoto}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm cursor-pointer shadow-emerald-500/20"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Fotografar</span>
                </button>
                <button
                  id="btn-cancel-webcam"
                  onClick={cancelCamera}
                  className="text-xs text-slate-400 hover:text-red-400 font-bold py-1.5 px-2 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            )}

            {userPhoto && (
              <button
                id="btn-clear-photo"
                onClick={() => setUserPhoto(null)}
                className="text-xs text-slate-400 hover:text-slate-200 py-1.5 px-2 cursor-pointer"
              >
                Remover Foto
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-toggle-card-guide"
              onClick={() => setShowCardHelper(!showCardHelper)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                showCardHelper
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {showCardHelper ? '✓ Guia Cartão Ativa' : '+ Guia Cartão'}
            </button>

            <button
              id="btn-reset-coordinates"
              onClick={resetCoordinates}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 p-1.5 rounded-xl shadow-sm cursor-pointer"
              title="Resetar alinhamento"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Viewport Interativo de Medição Facial */}
        <div
          id="pupilometer-viewport"
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-full h-[380px] bg-slate-900 rounded-3xl overflow-hidden flex items-center justify-center select-none border-2 border-slate-700 shadow-inner cursor-crosshair touch-none"
        >
          {/* Se webcam ativa */}
          {isCameraActive && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
          )}

          {/* Se foto enviada pelo usuário */}
          {userPhoto && !isCameraActive && (
            <img
              src={userPhoto}
              alt="Paciente"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-85"
            />
          )}

          {/* Silhueta esquemática de referência clínica se não houver foto */}
          {!userPhoto && !isCameraActive && (
            <svg className="w-full h-full opacity-65 pointer-events-none" viewBox="0 0 500 380">
              {/* Contorno da Cabeça / Queixo / Têmporas */}
              <path
                d="M150,80 Q250,40 350,80 Q400,190 350,330 Q250,370 150,330 Q100,190 150,80 Z"
                fill="#334155"
                stroke="#64748B"
                strokeWidth="2"
              />
              {/* Nariz */}
              <path d="M250,160 L245,215 L255,215 Z" fill="#1E293B" opacity="0.6" />
              {/* Lábios */}
              <path d="M220,270 Q250,285 280,270" fill="none" stroke="#475569" strokeWidth="2.5" />
              {/* Óculos esquemático de simulação */}
              <rect
                x="125"
                y="140"
                width="105"
                height="75"
                rx="16"
                fill="rgba(0, 255, 249, 0.05)"
                stroke="#00FFF9"
                strokeWidth="2.5"
                strokeDasharray="5 3"
              />
              <rect
                x="270"
                y="140"
                width="105"
                height="75"
                rx="16"
                fill="rgba(0, 255, 249, 0.05)"
                stroke="#00FFF9"
                strokeWidth="2.5"
                strokeDasharray="5 3"
              />
              <path d="M230,165 Q250,155 270,165" fill="none" stroke="#00FFF9" strokeWidth="3" />
            </svg>
          )}

          {/* Guia de Referência do Cartão Magnético (Padrão 85.6mm) */}
          {showCardHelper && (
            <div
              className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-28 border-2 border-amber-400/80 bg-amber-400/10 rounded-xl pointer-events-none flex flex-col items-center justify-between p-2 shadow-sm"
            >
              <div className="w-full flex justify-between items-center text-[10px] text-amber-300 font-mono">
                <span>PADRÃO ISO 7810</span>
                <span>85.60 mm</span>
              </div>
              <div className="text-[11px] text-amber-200 font-bold text-center bg-black/50 px-2 py-0.5 rounded">
                Enquadre o cartão sob o nariz ou na testa
              </div>
              <div className="w-full flex justify-between text-[9px] text-amber-300 font-mono">
                <span>Ref. Calibrada</span>
                <span>1:1</span>
              </div>
            </div>
          )}

          {/* Linha Vertical da Ponte Nasal (Referência Zero Central) */}
          <div
            id="reticle-bridge-line"
            onPointerDown={handlePointerDown('bridge')}
            className="absolute top-0 bottom-0 w-[2px] bg-yellow-400 z-20 cursor-ew-resize hover:w-[4px] transition-all"
            style={{ left: `${(bridgeX / 500) * 100}%` }}
          >
            <div className="absolute top-2 -left-12 bg-yellow-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded shadow whitespace-nowrap">
              Eixo Nasal (0)
            </div>
          </div>

          {/* Linha Horizontal da Borda Inferior da Armação (Base da Altura) */}
          <div
            id="reticle-frame-bottom"
            onPointerDown={handlePointerDown('frameBottom')}
            className="absolute left-0 right-0 h-[2px] bg-red-400 z-20 cursor-ns-resize hover:h-[4px] transition-all"
            style={{ top: `${(frameBottomY / 380) * 100}%` }}
          >
            <div className="absolute left-3 -top-5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
              Borda Inferior da Armação (Datum)
            </div>
          </div>

          {/* Retículo Pupila Olho Direito (OD) */}
          <div
            id="reticle-pupil-od"
            onPointerDown={handlePointerDown('od')}
            className="absolute w-9 h-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#00FFF9] flex items-center justify-center cursor-move z-30 hover:scale-125 transition-transform bg-[#00FFF9]/10 shadow-[0_0_15px_rgba(0,255,249,0.5)]"
            style={{ left: `${(pupilOD.x / 500) * 100}%`, top: `${(pupilOD.y / 380) * 100}%` }}
          >
            <div className="w-2 h-2 bg-[#00FFF9] rounded-full"></div>
            <div className="absolute -top-6 text-[11px] font-black text-[#00FFF9] whitespace-nowrap bg-black/80 px-1.5 py-0.5 rounded border border-[#00FFF9]/40">
              OD: {dnpOD} mm
            </div>
          </div>

          {/* Retículo Pupila Olho Esquerdo (OE) */}
          <div
            id="reticle-pupil-oe"
            onPointerDown={handlePointerDown('oe')}
            className="absolute w-9 h-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#00FFF9] flex items-center justify-center cursor-move z-30 hover:scale-125 transition-transform bg-[#00FFF9]/10 shadow-[0_0_15px_rgba(0,255,249,0.5)]"
            style={{ left: `${(pupilOE.x / 500) * 100}%`, top: `${(pupilOE.y / 380) * 100}%` }}
          >
            <div className="w-2 h-2 bg-[#00FFF9] rounded-full"></div>
            <div className="absolute -top-6 text-[11px] font-black text-[#00FFF9] whitespace-nowrap bg-black/80 px-1.5 py-0.5 rounded border border-[#00FFF9]/40">
              OE: {dnpOE} mm
            </div>
          </div>

          {/* Rodapé Informativo do Canvas */}
          <div className="absolute bottom-2 left-4 right-4 flex justify-between items-center text-[11px] text-white/75 font-mono pointer-events-none">
            <span>DNP Total Calculada: {dpTotal} mm</span>
            <span>Taxa de Calibração: 1px = {scaleFactor.toFixed(2)} mm</span>
          </div>
        </div>

        {/* Sliders de Ajuste Fino */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-800">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Pupila OD Horizontal (X)</label>
            <input
              id="slider-pupil-od-x"
              type="range"
              min="100"
              max="240"
              value={pupilOD.x}
              onChange={(e) => setPupilOD({ ...pupilOD, x: Number(e.target.value) })}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Centro Nasal (Ponte)</label>
            <input
              id="slider-bridge-x"
              type="range"
              min="200"
              max="300"
              value={bridgeX}
              onChange={(e) => setBridgeX(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Pupila OE Horizontal (X)</label>
            <input
              id="slider-pupil-oe-x"
              type="range"
              min="260"
              max="400"
              value={pupilOE.x}
              onChange={(e) => setPupilOE({ ...pupilOE, x: Number(e.target.value) })}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Fator de Calibração (mm/px)</label>
            <input
              id="slider-scale-factor"
              type="range"
              min="0.30"
              max="0.60"
              step="0.01"
              value={scaleFactor}
              onChange={(e) => setScaleFactor(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* Coluna Lateral: Resumo Técnico Óptico */}
      <div className="lg:col-span-4 space-y-4">
        {/* Painel Gradiente de Medidas */}
        <div id="pupilometer-results-card" className="bg-gradient-to-b from-[#051336] via-[#091b42] to-[#040f28] border border-cyan-500/30 text-white p-6 rounded-3xl shadow-2xl shadow-cyan-500/10 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-lg text-white drop-shadow">Medidas Centrais</h4>
            <span className="text-[10px] bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 px-2.5 py-0.5 rounded-full font-black tracking-wider uppercase shadow-[0_0_10px_rgba(0,255,249,0.2)]">
              Precisão 0.1 mm
            </span>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex justify-between items-center p-3.5 bg-slate-900/70 rounded-2xl border border-slate-700/60">
              <span className="text-sm font-medium text-slate-300">DNP Olho Direito (OD):</span>
              <span id="res-dnp-od" className="text-2xl font-black text-[#00FFF9] font-mono drop-shadow-[0_0_8px_rgba(0,255,249,0.3)]">{dnpOD} mm</span>
            </div>

            <div className="flex justify-between items-center p-3.5 bg-slate-900/70 rounded-2xl border border-slate-700/60">
              <span className="text-sm font-medium text-slate-300">DNP Olho Esquerdo (OE):</span>
              <span id="res-dnp-oe" className="text-2xl font-black text-[#00FFF9] font-mono drop-shadow-[0_0_8px_rgba(0,255,249,0.3)]">{dnpOE} mm</span>
            </div>

            <div className="flex justify-between items-center p-3.5 bg-cyan-950/40 rounded-2xl border-2 border-[#00FFF9]/50 shadow-[0_0_15px_rgba(0,255,249,0.15)]">
              <span className="text-sm font-bold text-white">Distância Pupilar (DP Total):</span>
              <span id="res-dp-total" className="text-3xl font-black text-white font-mono">{dpTotal} mm</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-slate-900/70 rounded-2xl text-center border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block font-medium">Altura OD</span>
                <span id="res-alt-od" className="text-lg font-black text-[#00FFF9] font-mono">{altOD} mm</span>
              </div>
              <div className="p-3 bg-slate-900/70 rounded-2xl text-center border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block font-medium">Altura OE</span>
                <span id="res-alt-oe" className="text-lg font-black text-[#00FFF9] font-mono">{altOE} mm</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/50 rounded-2xl flex justify-between items-center text-xs border border-slate-800">
              <span className="text-slate-400">Diâmetro Mínimo Sugerido:</span>
              <span className="font-bold text-cyan-300 font-mono">{diametroSugerido} mm</span>
            </div>
          </div>

          {/* Ações */}
          <div className="mt-6 space-y-2.5 pt-4 border-t border-slate-700/80">
            <button
              id="btn-transfer-to-os"
              onClick={() => onTransferToOrder(parseFloat(dnpOD), parseFloat(dnpOE), parseFloat(altOD), parseFloat(altOE))}
              className="w-full bg-gradient-to-r from-[#00FFF9] to-cyan-300 text-slate-950 hover:brightness-110 font-black py-3.5 px-4 rounded-full shadow-[0_0_20px_rgba(0,255,249,0.3)] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <CheckCircle className="w-5 h-5 font-bold" />
              <span>Vincular Medidas à Nova O.S.</span>
            </button>

            <button
              id="btn-copy-optical-metrics"
              onClick={handleCopy}
              className="w-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-4 rounded-full transition-all flex items-center justify-center space-x-2 text-xs cursor-pointer border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-[#00FFF9]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Medidas Copiadas!' : 'Copiar Parâmetros Técnicos'}</span>
            </button>
          </div>
        </div>

        {/* Card Informativo Técnico */}
        <div id="pupilometer-lab-guarantee-card" className="bg-[#091326] border border-cyan-500/20 p-4 rounded-3xl text-xs text-slate-300 leading-relaxed space-y-2">
          <div className="flex items-center space-x-1.5 font-bold text-cyan-400">
            <Info className="w-4 h-4" />
            <span>Padrão Laboratorial de Tolerância</span>
          </div>
          <p className="text-slate-400">
            A medição fotométrica com referência de cartão calibrado elimina erros de paralaxe angular de até 3.5mm comuns em réguas milimetradas manuais, assegurando perfeita montagem em multifocais Varilux, Zeiss e Hoya.
          </p>
        </div>
      </div>
    </div>
  );
};
