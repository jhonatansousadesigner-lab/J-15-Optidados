import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  ArrowRight,
  Filter,
  Printer,
  Send,
  SlidersHorizontal,
  Clock,
  ShieldCheck,
  Glasses,
  FileDown,
  ExternalLink,
  Check
} from 'lucide-react';
import { ServiceOrder, OrderStatus } from '../types';
import { exportOrderToPDF, previewOrderPDF } from '../utils/pdfExport';

interface OrdersViewProps {
  orders: ServiceOrder[];
  onAdvanceStatus: (id: string) => void;
  onOpenNewOrderModal: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onAdvanceStatus,
  onOpenNewOrderModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [labFilter, setLabFilter] = useState('todos');
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<ServiceOrder | null>(null);
  const [justExportedId, setJustExportedId] = useState<string | null>(null);

  const handleExportPDF = (order: ServiceOrder) => {
    exportOrderToPDF(order);
    setJustExportedId(order.id);
    setTimeout(() => {
      setJustExportedId(null);
    }, 3000);
  };

  // Filtragem
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.armacao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchLab = labFilter === 'todos' || order.laboratorio === labFilter;
    return matchSearch && matchLab;
  });

  const columns: { key: OrderStatus; label: string; headerBg: string; textCol: string }[] = [
    {
      key: 'aguardando_armacao',
      label: '1. Aguardando Armação',
      headerBg: 'border-amber-500/60 bg-amber-500/10',
      textCol: 'text-amber-300',
    },
    {
      key: 'surfacagem',
      label: '2. Em Surfaçagem / Lab',
      headerBg: 'border-cyan-500/60 bg-cyan-500/10',
      textCol: 'text-cyan-300',
    },
    {
      key: 'controle_qualidade',
      label: '3. Controle de Qualidade',
      headerBg: 'border-purple-500/60 bg-purple-500/10',
      textCol: 'text-purple-300',
    },
    {
      key: 'pronto',
      label: '4. Pronto para Entrega',
      headerBg: 'border-emerald-500/60 bg-emerald-500/10',
      textCol: 'text-emerald-300',
    },
  ];

  return (
    <div id="orders-view-container" className="space-y-6">
      {/* Top Bar de Pesquisa, Filtro e Emissão */}
      <div className="bg-[#0b1120]/85 p-5 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md flex flex-wrap justify-between items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-white">Ordens de Serviço & Laboratórios Integrados</h3>
          <p className="text-xs text-slate-400">Pipeline de montagem óptica, rastreabilidade EDI e controle de qualidade</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Campo de Busca */}
          <div className="relative">
            <input
              id="input-search-orders"
              type="text"
              placeholder="Buscar cliente, O.S. ou armação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-xs font-semibold text-slate-200 placeholder-slate-500 focus:bg-slate-950 focus:border-cyan-400 outline-none w-56 sm:w-64"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>

          {/* Filtro por Laboratório */}
          <select
            id="select-lab-filter"
            value={labFilter}
            onChange={(e) => setLabFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-full text-xs font-bold text-slate-200 outline-none focus:border-cyan-400"
          >
            <option value="todos">Todos os Laboratórios</option>
            <option value="Essilor Digital Hub">Essilor Digital Hub</option>
            <option value="Zeiss Vision Care">Zeiss Vision Care</option>
            <option value="Hoya Lab Express">Hoya Lab Express</option>
            <option value="Rodenstock FreeForm">Rodenstock FreeForm</option>
          </select>

          {/* Botão Emitir O.S. */}
          <button
            id="btn-open-new-os"
            onClick={onOpenNewOrderModal}
            className="bg-gradient-to-r from-[#00FFF9] to-cyan-300 text-slate-950 hover:brightness-110 font-black py-2 px-4 rounded-full text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(0,255,249,0.25)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Emitir Nova O.S.</span>
          </button>
        </div>
      </div>

      {/* Pipeline Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colOrders = filteredOrders.filter((o) => o.status === col.key);

          return (
            <div
              key={col.key}
              id={`kanban-column-${col.key}`}
              className="bg-slate-900/40 p-4 rounded-3xl min-h-[460px] flex flex-col border border-slate-800/80 backdrop-blur-xs"
            >
              {/* Header da Coluna */}
              <div className={`p-3 rounded-2xl mb-3 border-l-4 font-black text-xs uppercase tracking-wider flex justify-between items-center ${col.headerBg} ${col.textCol}`}>
                <span>{col.label}</span>
                <span className="bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded-full text-[11px] font-bold text-slate-200 shadow-xs">
                  {colOrders.length}
                </span>
              </div>

              {/* Lista de Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colOrders.map((ordem) => (
                  <div
                    key={ordem.id}
                    id={`order-card-${ordem.id}`}
                    className="bg-[#0c1322] p-4 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-lg space-y-2.5 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                        {ordem.id}
                      </span>
                      <span className="text-xs font-black text-slate-200 font-mono">
                        R$ {ordem.total.toFixed(2)}
                      </span>
                    </div>

                    <div>
                      <p className="font-extrabold text-sm text-white leading-snug">{ordem.cliente}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{ordem.telefone}</p>
                    </div>

                    <div className="p-2.5 bg-slate-950/80 rounded-xl text-[11px] text-slate-300 space-y-1 border border-slate-800/70">
                      <p className="line-clamp-1"><strong className="text-slate-400">Armação:</strong> {ordem.armacao}</p>
                      <p className="line-clamp-1"><strong className="text-slate-400">Lente:</strong> {ordem.lente}</p>
                      <p><strong className="text-slate-400">Lab:</strong> <span className="text-cyan-400">{ordem.laboratorio}</span></p>
                      <div className="pt-1 border-t border-slate-800 flex justify-between font-mono text-[10px] text-cyan-400 font-bold">
                        <span>DNP: {ordem.dnpOD} / {ordem.dnpOE} mm</span>
                        <span>Alt: {ordem.altOD} / {ordem.altOE} mm</span>
                      </div>
                    </div>

                    {/* Ações do Card */}
                    <div className="pt-2 flex items-center justify-between gap-1 border-t border-slate-800">
                      <div className="flex items-center space-x-1">
                        <button
                          id={`btn-print-os-${ordem.id}`}
                          onClick={() => setSelectedOrderForPrint(ordem)}
                          className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 text-xs flex items-center space-x-1 cursor-pointer transition-colors"
                          title="Ver Ficha Técnica"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">Ficha</span>
                        </button>

                        <button
                          id={`btn-pdf-os-${ordem.id}`}
                          onClick={() => handleExportPDF(ordem)}
                          className={`p-1.5 rounded-lg text-xs flex items-center space-x-1 cursor-pointer transition-all ${
                            justExportedId === ordem.id
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'text-cyan-300 hover:text-cyan-200 hover:bg-cyan-950/60 border border-cyan-500/30'
                          }`}
                          title="Baixar Ordem de Serviço em PDF formatado"
                        >
                          {justExportedId === ordem.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[10px] font-bold text-emerald-300">Baixado!</span>
                            </>
                          ) : (
                            <>
                              <FileDown className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold">PDF</span>
                            </>
                          )}
                        </button>
                      </div>

                      {ordem.status !== 'pronto' ? (
                        <button
                          id={`btn-advance-status-${ordem.id}`}
                          onClick={() => onAdvanceStatus(ordem.id)}
                          className="text-xs font-bold text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 px-2.5 py-1 rounded-full flex items-center space-x-1 transition-colors cursor-pointer"
                        >
                          <span>Avançar</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          id={`btn-notify-ready-${ordem.id}`}
                          onClick={() => {
                            const msg = encodeURIComponent(
                              `Olá ${ordem.cliente}! Seus novos óculos (${ordem.armacao}) já estão prontos, conferidos e ajustados na Óptica Matriz. Aguardamos sua visita para a entrega técnica!`
                            );
                            window.open(`https://wa.me/55${ordem.telefone.replace(/\D/g, '')}?text=${msg}`, '_blank');
                          }}
                          className="text-[11px] font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-full flex items-center space-x-1 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          <span>Avisar WhatsApp</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {colOrders.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-500 italic">
                    Nenhuma ordem nesta etapa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Impressão / Ficha Técnica do Laboratório */}
      {selectedOrderForPrint && (
        <div id="print-order-modal-backdrop" className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div id="print-order-card" className="bg-[#0b1120] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,255,249,0.15)] text-white w-full max-w-lg rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-black px-2 py-0.5 rounded uppercase">
                    FICHA TÉCNICA DE MONTAGEM
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 font-semibold px-2 py-0.5 rounded">
                    PDF Pronto para Impressão
                  </span>
                </div>
                <h4 className="text-xl font-black text-white mt-1">{selectedOrderForPrint.id}</h4>
                <p className="text-xs text-slate-400">Óptica Matriz • EDI Digital B-15</p>
              </div>
              <button
                id="btn-close-print-modal"
                onClick={() => setSelectedOrderForPrint(null)}
                className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block">Cliente:</span>
                  <span className="font-bold text-white text-sm">{selectedOrderForPrint.cliente}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Laboratório Destino:</span>
                  <span className="font-bold text-cyan-400">{selectedOrderForPrint.laboratorio}</span>
                </div>
              </div>

              <div className="border border-slate-800 bg-slate-900/60 p-3 rounded-xl space-y-1 text-slate-200">
                <p><strong className="text-slate-400">Armação:</strong> {selectedOrderForPrint.armacao}</p>
                <p><strong className="text-slate-400">Lentes Solicitadas:</strong> {selectedOrderForPrint.lente}</p>
                {selectedOrderForPrint.observacoes && (
                  <p className="text-amber-400 font-semibold">
                    <strong>Obs:</strong> {selectedOrderForPrint.observacoes}
                  </p>
                )}
              </div>

              {/* Tabela de Medidas Digitais do Pupilômetro */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-center text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-bold">
                    <tr>
                      <th className="py-2">Olho</th>
                      <th className="py-2">DNP (mm)</th>
                      <th className="py-2">Altura Montagem (mm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono font-bold bg-slate-900/60">
                    <tr>
                      <td className="py-2 text-cyan-400">Direito (OD)</td>
                      <td className="py-2 text-white">{selectedOrderForPrint.dnpOD}</td>
                      <td className="py-2 text-white">{selectedOrderForPrint.altOD}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-cyan-400">Esquerdo (OE)</td>
                      <td className="py-2 text-white">{selectedOrderForPrint.dnpOE}</td>
                      <td className="py-2 text-white">{selectedOrderForPrint.altOE}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Simulação de Código de Barras EDI */}
              <div className="p-3 bg-black border border-slate-800 text-white rounded-xl text-center space-y-1 font-mono">
                <div className="h-8 bg-white/15 flex items-center justify-center tracking-widest text-[10px] text-cyan-300">
                  ||| | ||||| || |||| ||| ||||||| ||| ||
                </div>
                <span className="text-[10px] text-slate-500">EDI-B15-{selectedOrderForPrint.id}</span>
              </div>
            </div>

            {/* Ações do Modal com Exportação de PDF */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
              <button
                id="btn-print-action"
                onClick={() => {
                  window.print();
                }}
                className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 text-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
                title="Impressão direta pelo navegador"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Rápido</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  id="btn-preview-pdf-modal"
                  onClick={() => previewOrderPDF(selectedOrderForPrint)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-2 px-3 rounded-full text-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
                  title="Abrir PDF em nova aba para conferência"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Visualizar PDF</span>
                </button>

                <button
                  id="btn-export-pdf-modal"
                  onClick={() => handleExportPDF(selectedOrderForPrint)}
                  className="bg-gradient-to-r from-[#00FFF9] to-cyan-300 text-slate-950 hover:brightness-110 font-black py-2 px-4 rounded-full text-xs flex items-center space-x-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,255,249,0.25)] transition-all"
                >
                  <FileDown className="w-4 h-4 text-slate-950" />
                  <span>Baixar PDF Formatado</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
