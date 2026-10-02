import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Award,
  Sparkles,
  Maximize2,
  Send,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileDown
} from 'lucide-react';
import { ServiceOrder, TabType } from '../types';
import { exportOrderToPDF } from '../utils/pdfExport';

interface CockpitViewProps {
  orders: ServiceOrder[];
  onNavigate: (tab: TabType) => void;
  onNewOrderQuick: () => void;
}

export const CockpitView: React.FC<CockpitViewProps> = ({
  orders,
  onNavigate,
  onNewOrderQuick,
}) => {
  const totalVendas = orders.reduce((acc, curr) => acc + curr.total, 4580);
  const ticketMedio = totalVendas / (orders.length + 3);
  const comissao = totalVendas * 0.035;
  const prontosParaEntrega = orders.filter((o) => o.status === 'pronto').length;

  return (
    <div id="cockpit-view-container" className="space-y-6">
      {/* Alerta de Ação Imediata se houver óculos prontos */}
      {prontosParaEntrega > 0 && (
        <div
          id="alert-ready-orders-banner"
          className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.1)] backdrop-blur-md"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 text-slate-950 p-2 rounded-xl shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              <CheckCircle2 className="w-5 h-5 font-bold" />
            </div>
            <div>
              <p className="font-bold text-sm text-emerald-100">
                {prontosParaEntrega} óculos prontos aguardando retirada pelo cliente!
              </p>
              <p className="text-xs text-emerald-300/80">
                Notifique via WhatsApp para garantir uma entrega com alta avaliação e fidelização.
              </p>
            </div>
          </div>
          <button
            id="btn-alert-view-ready-orders"
            onClick={() => onNavigate('os')}
            className="text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-full cursor-pointer transition-all shadow-[0_0_12px_rgba(16,185,129,0.4)]"
          >
            Ver Pedidos Prontos
          </button>
        </div>
      )}

      {/* Grid de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Vendas Hoje */}
        <div id="metric-card-vendas" className="bg-[#0b1120]/80 rounded-3xl p-5 border border-slate-800 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Vendas Hoje</p>
              <h3 id="val-vendas-hoje" className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono tracking-tight">
                R$ {totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-400 mt-2 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-400" /> +14.2% vs ontem
              </span>
            </div>
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-2xl shadow-[0_0_12px_rgba(0,255,249,0.15)]">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 2: Meta Mensal */}
        <div id="metric-card-meta" className="bg-[#0b1120]/80 rounded-3xl p-5 border border-slate-800 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Meta Mensal da Loja</p>
              <h3 id="val-meta-percentual" className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono tracking-tight">
                82.4%
              </h3>
              <div className="w-36 bg-slate-800/80 h-2 rounded-full mt-3 overflow-hidden border border-slate-700">
                <div id="bar-meta-progresso" className="bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_8px_#00FFF9] h-full rounded-full transition-all" style={{ width: '82.4%' }}></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">Faltam R$ 14.800 para bater a meta</p>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-2xl shadow-[0_0_12px_rgba(59,130,246,0.15)]">
              <Percent className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 3: Comissão */}
        <div id="metric-card-comissao" className="bg-[#0b1120]/80 rounded-3xl p-5 border border-slate-800 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Comissão do Vendedor</p>
              <h3 id="val-comissao" className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 font-mono tracking-tight">
                R$ {comissao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-slate-400 mt-2">Regra: 3.5% sobre Lentes + Armações</p>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl shadow-[0_0_12px_rgba(16,185,129,0.15)]">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 4: Ticket Médio */}
        <div id="metric-card-ticket" className="bg-[#0b1120]/80 rounded-3xl p-5 border border-slate-800 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Ticket Médio Óptico</p>
              <h3 id="val-ticket-medio" className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1 font-mono tracking-tight">
                R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <span className="inline-flex items-center text-xs font-semibold text-cyan-300 mt-2 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                Jornada 20/20 Ativa
              </span>
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-2xl shadow-[0_0_12px_rgba(99,102,241,0.15)]">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas de Alta Conversão */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card Ação 1: Pupilômetro */}
        <div
          id="action-card-pupilometro"
          onClick={() => onNavigate('pupilometro')}
          className="cursor-pointer bg-gradient-to-br from-[#051133] via-[#091e4a] to-[#042845] border border-cyan-500/40 text-white p-6 rounded-3xl shadow-2xl shadow-cyan-500/10 hover:border-cyan-400 hover:shadow-cyan-500/25 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(0,255,249,0.2)]">
                Inovação Clínica
              </span>
              <Maximize2 className="w-5 h-5 text-[#00FFF9] group-hover:rotate-45 transition-transform" />
            </div>
            <h4 className="text-xl font-bold mt-4 leading-snug text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Medição Facial & Pupilômetro via Foto</h4>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              DNP milimétrico (OD/OE) e altura de montagem calculados por referência fotográfica 1:1, evitando refações em multifocais.
            </p>
          </div>
          <button
            id="btn-quick-pupilometro"
            className="mt-6 bg-gradient-to-r from-[#00FFF9] to-cyan-300 text-slate-950 hover:brightness-110 font-black py-2.5 px-5 rounded-full self-start flex items-center space-x-2 text-xs transition-all shadow-[0_0_15px_rgba(0,255,249,0.3)] cursor-pointer"
          >
            <span>Iniciar Medição Digital</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card Ação 2: Consultor 20/20 */}
        <div
          id="action-card-consultor"
          onClick={() => onNavigate('consultor')}
          className="cursor-pointer bg-[#0b1120]/80 p-6 rounded-3xl border border-slate-800 shadow-xl hover:border-cyan-500/40 hover:shadow-cyan-500/10 backdrop-blur-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Venda de Alto Valor
              </span>
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <h4 className="text-xl font-bold text-white mt-4 leading-snug">Consultor de Lentes 20/20</h4>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Demonstração visual interativa de espessura de borda, peso e tratamentos antirreflexo/luz azul para encantamento do cliente.
            </p>
          </div>
          <button
            id="btn-quick-consultor"
            className="mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-full self-start flex items-center space-x-2 text-xs transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
          >
            <span>Abrir Simulador 20/20</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card Ação 3: CRM B-15 */}
        <div
          id="action-card-crm"
          onClick={() => onNavigate('crm')}
          className="cursor-pointer bg-[#0b1120]/80 p-6 rounded-3xl border border-slate-800 shadow-xl hover:border-emerald-500/40 hover:shadow-emerald-500/10 backdrop-blur-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Fidelização & Cashback
              </span>
              <Send className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="text-xl font-bold text-white mt-4 leading-snug">Pós-Venda & B-15 Bônus</h4>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Automação de lembretes de receitas médicas a vencer e geração de cupons de bônus para compras de solares ou 2º par.
            </p>
          </div>
          <button
            id="btn-quick-crm"
            className="mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-5 rounded-full self-start flex items-center space-x-2 text-xs transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
          >
            <span>Ver Clientes & Cashback</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Seção Inferior: Ordens Recentes & Dicas do Especialista */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Pedidos em Andamento */}
        <div id="recent-orders-card" className="lg:col-span-2 bg-[#0b1120]/80 p-6 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-base font-bold text-white">Acompanhamento Rápido de Produção</h4>
              <p className="text-xs text-slate-400">Ordens de serviço em trânsito com os laboratórios parceiros</p>
            </div>
            <button
              id="btn-view-all-orders"
              onClick={() => onNavigate('os')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
            >
              Ver Todas ({orders.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {orders.slice(0, 3).map((order) => {
              const statusMap: Record<string, { label: string; color: string }> = {
                aguardando_armacao: { label: 'Aguardando Armação', color: 'bg-amber-500/10 border border-amber-500/30 text-amber-300' },
                surfacagem: { label: 'Surfaçagem / Lab', color: 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300' },
                controle_qualidade: { label: 'Controle de Qualidade', color: 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300' },
                pronto: { label: 'Pronto p/ Retirada', color: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' },
              };
              const statusInfo = statusMap[order.status] || { label: order.status, color: 'bg-slate-800 text-slate-300' };

              return (
                <div key={order.id} className="py-3.5 flex flex-wrap items-center justify-between gap-2 hover:bg-slate-800/40 px-2.5 rounded-xl transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-100">{order.cliente}</span>
                      <span className="text-xs font-mono font-bold text-slate-500">({order.id})</span>
                    </div>
                    <p className="text-xs text-slate-400">{order.armacao} • {order.laboratorio}</p>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <span className="text-xs font-mono font-extrabold text-slate-200">
                      R$ {order.total.toFixed(2)}
                    </span>
                    <button
                      id={`btn-cockpit-pdf-${order.id}`}
                      onClick={() => exportOrderToPDF(order)}
                      className="p-1.5 text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/60 border border-cyan-500/20 rounded-lg text-xs flex items-center space-x-1 cursor-pointer transition-colors"
                      title={`Exportar ${order.id} em PDF formatado`}
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">PDF</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Dica de Neurociência & Fechamento Óptico */}
        <div id="pro-tip-card" className="bg-gradient-to-br from-slate-900 via-[#0a1224] to-[#040d1e] border border-cyan-500/30 text-white p-6 rounded-3xl shadow-xl shadow-cyan-500/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#00FFF9] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Dica B-15 Optidados</span>
            </div>
            <h4 className="text-lg font-bold mt-3 text-white drop-shadow">A Regra dos Dois Olhares</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Ao apresentar lentes com tratamento antirreflexo de 99.8% de transmissão luminosa, mostre primeiro o reflexo incômodo em uma lente comum sem tratamento. O cérebro do cliente percebe o contraste imediatamente, facilitando o fechamento do ticket superior.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Terminal calibrado</span>
            <span className="font-mono text-[#00FFF9] font-bold">ISO 13666</span>
          </div>
        </div>
      </div>
    </div>
  );
};
