import React, { useState } from 'react';
import { X, CheckCircle, FileText, User, Phone, Glasses, Layers, FileDown, AlertCircle } from 'lucide-react';
import { ServiceOrder } from '../types';
import { exportOrderToPDF } from '../utils/pdfExport';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: ServiceOrder) => void;
  initialValues?: {
    dnpOD?: number;
    dnpOE?: number;
    altOD?: number;
    altOE?: number;
    lenteNome?: string;
    lentePreco?: number;
  };
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialValues,
}) => {
  if (!isOpen) return null;

  const [cliente, setCliente] = useState('');
  const [telefone, setTelefone] = useState('(16) 9');
  const [laboratorio, setLaboratorio] = useState('Essilor Digital Hub');
  const [armacao, setArmacao] = useState('Ray-Ban RB5154 Clubmaster');
  const [lente, setLente] = useState(initialValues?.lenteNome || 'Varilux Physio 360 1.67 BlueUV');
  const [total, setTotal] = useState<number>(initialValues?.lentePreco ? initialValues.lentePreco + 650 : 1850);
  const [dnpOD, setDnpOD] = useState<number>(initialValues?.dnpOD || 32.5);
  const [dnpOE, setDnpOE] = useState<number>(initialValues?.dnpOE || 32.5);
  const [altOD, setAltOD] = useState<number>(initialValues?.altOD || 19.0);
  const [altOE, setAltOE] = useState<number>(initialValues?.altOE || 19.0);
  const [observacoes, setObservacoes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const buildOrderObject = (): ServiceOrder | null => {
    if (!cliente.trim()) {
      setErrorMessage('Por favor, informe o nome do paciente / cliente.');
      return null;
    }

    setErrorMessage('');
    return {
      id: `OS-${Math.floor(1000 + Math.random() * 9000)}`,
      cliente,
      telefone,
      laboratorio,
      armacao,
      lente,
      status: 'aguardando_armacao',
      dnpOD,
      dnpOE,
      altOD,
      altOE,
      total: Number(total) || 0,
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
      observacoes,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = buildOrderObject();
    if (!newOrder) return;
    onSave(newOrder);
    onClose();
  };

  const handleSaveAndExport = () => {
    const newOrder = buildOrderObject();
    if (!newOrder) return;
    onSave(newOrder);
    exportOrderToPDF(newOrder);
    onClose();
  };

  return (
    <div id="order-modal-backdrop" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div id="order-modal-content" className="bg-[#0b1120] w-full max-w-2xl rounded-3xl shadow-[0_0_50px_rgba(0,255,249,0.15)] border border-cyan-500/30 overflow-hidden my-8 text-white">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#020a1c] via-[#051838] to-[#030f25] border-b border-slate-800 text-white p-5 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-[0_0_10px_rgba(0,255,249,0.15)]">
              <FileText className="w-5 h-5 text-[#00FFF9]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Emissão de Ordem de Serviço Óptica</h3>
              <p className="text-xs text-slate-400">B-15 Optidados • Integração de Laboratório</p>
            </div>
          </div>
          <button
            id="btn-close-order-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Nome Completo do Cliente *</label>
              <div className="relative">
                <input
                  id="modal-input-cliente"
                  type="text"
                  required
                  placeholder="Ex: Ana Paula Ribeiro"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-slate-100 placeholder-slate-500 focus:bg-slate-950 focus:border-cyan-400 outline-none"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">WhatsApp / Telefone *</label>
              <div className="relative">
                <input
                  id="modal-input-telefone"
                  type="text"
                  required
                  placeholder="(16) 99999-0000"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-slate-100 placeholder-slate-500 focus:bg-slate-950 focus:border-cyan-400 outline-none"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Laboratório Surfaçador</label>
              <select
                id="modal-select-lab"
                value={laboratorio}
                onChange={(e) => setLaboratorio(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-slate-100 focus:bg-slate-950 focus:border-cyan-400 outline-none"
              >
                <option value="Essilor Digital Hub">Essilor Digital Hub (Varilux/Eyezen)</option>
                <option value="Zeiss Vision Care">Zeiss Vision Care (SmartLife/DriveSafe)</option>
                <option value="Hoya Lab Express">Hoya Lab Express (Hoyalux/Sync)</option>
                <option value="Rodenstock FreeForm">Rodenstock FreeForm (B.I.G. Exact)</option>
                <option value="Laboratório Local Express">Laboratório Local Express</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Armação Selecionada</label>
              <div className="relative">
                <input
                  id="modal-input-armacao"
                  type="text"
                  value={armacao}
                  onChange={(e) => setArmacao(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-slate-100 focus:bg-slate-950 focus:border-cyan-400 outline-none"
                />
                <Glasses className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Bloco de Lente & Tratamentos</label>
            <div className="relative">
              <input
                id="modal-input-lente"
                type="text"
                value={lente}
                onChange={(e) => setLente(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-slate-100 focus:bg-slate-950 focus:border-cyan-400 outline-none"
              />
              <Layers className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          {/* Medidas de Montagem do Pupilômetro */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-cyan-500/30">
            <span className="text-xs font-black text-cyan-300 uppercase tracking-wider block mb-2">
              Medidas Importadas do Pupilômetro Digital
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">DNP OD (mm)</label>
                <input
                  id="modal-input-dnp-od"
                  type="number"
                  step="0.1"
                  value={dnpOD}
                  onChange={(e) => setDnpOD(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg font-black text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-bold">DNP OE (mm)</label>
                <input
                  id="modal-input-dnp-oe"
                  type="number"
                  step="0.1"
                  value={dnpOE}
                  onChange={(e) => setDnpOE(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg font-black text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Altura OD (mm)</label>
                <input
                  id="modal-input-alt-od"
                  type="number"
                  step="0.1"
                  value={altOD}
                  onChange={(e) => setAltOD(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg font-black text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Altura OE (mm)</label>
                <input
                  id="modal-input-alt-oe"
                  type="number"
                  step="0.1"
                  value={altOE}
                  onChange={(e) => setAltOE(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg font-black text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Valor Total do Pedido (R$)</label>
              <input
                id="modal-input-total"
                type="number"
                step="0.01"
                value={total}
                onChange={(e) => setTotal(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-base font-black text-[#00FFF9] font-mono focus:bg-slate-950 focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Observações Técnicas de Montagem</label>
              <input
                id="modal-input-observacoes"
                type="text"
                placeholder="Ex: Bisel fino para acetato, faceta suave"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-medium text-slate-200 placeholder-slate-500 focus:bg-slate-950 focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          {errorMessage && (
            <div id="modal-error-message" className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Botões do Modal */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              id="btn-cancel-modal"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              id="btn-submit-order-pdf"
              onClick={handleSaveAndExport}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 flex items-center space-x-1.5 cursor-pointer transition-all shadow-md"
              title="Grava a O.S. e baixa imediatamente o arquivo PDF de montagem"
            >
              <FileDown className="w-4 h-4 text-cyan-300" />
              <span>Gravar & Baixar PDF</span>
            </button>
            <button
              type="submit"
              id="btn-submit-order"
              className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-[#00FFF9] to-cyan-300 text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(0,255,249,0.25)] flex items-center space-x-1.5 cursor-pointer transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Gravar & Transmitir</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
