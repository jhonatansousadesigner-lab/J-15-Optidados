import React, { useState } from 'react';
import {
  Users,
  Percent,
  Send,
  Sparkles,
  Calendar,
  Phone,
  CheckCircle,
  Clock,
  Plus,
  AlertTriangle,
  Gift
} from 'lucide-react';
import { CrmContact } from '../types';
import { VoucherModal } from './VoucherModal';

export const CrmView: React.FC = () => {
  // Estado da Calculadora de Bônus Cashback
  const [bonusCompra, setBonusCompra] = useState<number>(1450);
  const [bonusPercentual, setBonusPercentual] = useState<number>(15);
  const [validityDays, setValidityDays] = useState<number>(45);

  const cashbackGerado = ((bonusCompra * bonusPercentual) / 100).toFixed(2);

  // Modal do Voucher
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('B15-BONUS-9821');

  // Base de Clientes do CRM
  const [crmList, setCrmList] = useState<CrmContact[]>([
    {
      id: 'crm-1',
      nome: 'Fernando Albuquerque',
      telefone: '(16) 99871-3344',
      diasVencimento: -14,
      ultimaCompra: 'Varilux Comfort 1.59 Airwear',
      valorCompra: 1200.0,
      cashback: 180.0,
      dataReceita: '20/08/2025',
      statusNotificacao: 'pendente',
    },
    {
      id: 'crm-2',
      nome: 'Juliana Mendes Reis',
      telefone: '(16) 99128-5522',
      diasVencimento: 5,
      ultimaCompra: 'Crizal Sapphire 1.67 Hi-Lux',
      valorCompra: 1460.0,
      cashback: 220.0,
      dataReceita: '08/09/2025',
      statusNotificacao: 'pendente',
    },
    {
      id: 'crm-3',
      nome: 'Roberto Calheiros',
      telefone: '(16) 98845-6677',
      diasVencimento: 22,
      ultimaCompra: 'Transitions Gen S 1.50 Crizal',
      valorCompra: 970.0,
      cashback: 145.0,
      dataReceita: '25/09/2025',
      statusNotificacao: 'pendente',
    },
    {
      id: 'crm-4',
      nome: 'Camila Peixoto Prado',
      telefone: '(16) 99777-1122',
      diasVencimento: -45,
      ultimaCompra: 'Zeiss SmartLife Monofocal 1.60',
      valorCompra: 1100.0,
      cashback: 165.0,
      dataReceita: '15/07/2025',
      statusNotificacao: 'enviado',
    },
  ]);

  const handleGenerateVoucher = () => {
    const code = `B15-${Math.floor(1000 + Math.random() * 9000)}-OPT`;
    setVoucherCode(code);
    setIsVoucherOpen(true);
  };

  const handleSendWhatsApp = (item: CrmContact) => {
    const saudacao = item.diasVencimento < 0
      ? `sua receita médica completou mais de 1 ano de validade. Cuidar da sua saúde visual é prioridade!`
      : `sua receita óptica vence em ${item.diasVencimento} dias.`;

    const texto = encodeURIComponent(
      `Olá ${item.nome}! Tudo bem? Aqui é da Óptica Matriz Ribeirão. Constatamos em nosso sistema B-15 Optidados que ${saudacao} Você possui R$ ${item.cashback.toFixed(2)} de saldo B-15 Bônus disponível para renovar sua visão conosco. Que tal agendarmos sua visita?`
    );

    window.open(`https://wa.me/55${item.telefone.replace(/\D/g, '')}?text=${texto}`, '_blank');

    // Marcar como enviado
    setCrmList(
      crmList.map((c) => (c.id === item.id ? { ...c, statusNotificacao: 'enviado' } : c))
    );
  };

  return (
    <div id="crm-view-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Coluna 1: Simulador B-15 Bônus (Cashback) */}
      <div id="crm-bonus-simulator" className="lg:col-span-4 bg-[#0b1120]/85 p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl shadow-[0_0_10px_rgba(0,255,249,0.15)]">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-lg text-white">Simulador B-15 Bônus</h3>
            <p className="text-xs text-slate-400">Geração de cashback para 2º par</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Configure a taxa de fidelização para conceder ao cliente crédito imediato para compra de solar, lentes digitais ou armação para familiares.
        </p>

        <div>
          <label className="text-xs font-bold text-slate-400 block mb-1">Valor da Compra Atual (R$)</label>
          <input
            id="input-bonus-compra"
            type="number"
            value={bonusCompra}
            onChange={(e) => setBonusCompra(parseFloat(e.target.value) || 0)}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-2xl font-black text-xl text-white font-mono focus:bg-slate-950 focus:border-cyan-400 outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 block mb-1">% de Retorno em Bônus (Cashback)</label>
          <select
            id="select-bonus-percentual"
            value={bonusPercentual}
            onChange={(e) => setBonusPercentual(Number(e.target.value))}
            className="w-full p-3 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl font-bold text-sm focus:bg-slate-950 focus:border-cyan-400 outline-none"
          >
            <option value={10}>10% Cashback (Linha Standard)</option>
            <option value={15}>15% Cashback (Padrão Recomendado B-15)</option>
            <option value={20}>20% Cashback (Linha Premium / Multifocais)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 block mb-1">Validade do Cupom</label>
          <select
            id="select-bonus-validade"
            value={validityDays}
            onChange={(e) => setValidityDays(Number(e.target.value))}
            className="w-full p-3 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl font-bold text-sm focus:bg-slate-950 focus:border-cyan-400 outline-none"
          >
            <option value={30}>30 Dias</option>
            <option value={45}>45 Dias (Recomendado)</option>
            <option value={60}>60 Dias</option>
          </select>
        </div>

        {/* Card do Crédito Calculado */}
        <div className="p-5 bg-gradient-to-br from-[#061633] via-[#09224d] to-[#041129] border border-cyan-500/30 rounded-3xl text-center shadow-[0_0_20px_rgba(0,255,249,0.1)]">
          <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider block">
            Bônus Gerado para o Cliente
          </span>
          <h4 id="val-cashback-gerado" className="text-4xl font-black text-[#00FFF9] mt-1 font-mono drop-shadow-[0_0_10px_rgba(0,255,249,0.3)]">
            R$ {cashbackGerado}
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Válido por {validityDays} dias na Óptica Matriz
          </p>
        </div>

        <button
          id="btn-generate-voucher-modal"
          onClick={handleGenerateVoucher}
          className="w-full bg-gradient-to-r from-[#00FFF9] to-cyan-300 text-slate-950 hover:brightness-110 font-black py-3 rounded-full text-xs shadow-[0_0_15px_rgba(0,255,249,0.25)] transition-all cursor-pointer flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Emitir Voucher Digital</span>
        </button>
      </div>

      {/* Coluna 2: Campanhas Automáticas de Pós-Venda */}
      <div id="crm-campaigns-section" className="lg:col-span-8 bg-[#0b1120]/85 p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h3 className="font-black text-xl text-white">Campanhas Automáticas de Pós-Venda</h3>
            <p className="text-xs text-slate-400">
              Notificações de saúde visual baseadas na data de vencimento da receita médica (365 dias)
            </p>
          </div>
          <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>WhatsApp Conectado</span>
          </span>
        </div>

        {/* Tabela de Notificações */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Última Prescrição</th>
                <th className="pb-3">Status da Receita</th>
                <th className="pb-3">Crédito Bônus</th>
                <th className="pb-3 text-right">Ação Rápida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {crmList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4">
                    <p className="font-bold text-white text-sm">{item.nome}</p>
                    <p className="text-[11px] text-slate-400">{item.telefone}</p>
                  </td>

                  <td className="py-4">
                    <p className="text-slate-200 font-semibold">{item.ultimaCompra}</p>
                    <p className="text-[10px] text-slate-500">Emissão: {item.dataReceita}</p>
                  </td>

                  <td className="py-4">
                    {item.diasVencimento < 0 ? (
                      <span className="text-red-400 font-bold bg-red-950/50 border border-red-500/30 px-2.5 py-1 rounded-full inline-flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        <span>Vencida há {Math.abs(item.diasVencimento)} dias</span>
                      </span>
                    ) : (
                      <span className="text-amber-300 font-bold bg-amber-950/50 border border-amber-500/30 px-2.5 py-1 rounded-full inline-flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>Vence em {item.diasVencimento} dias</span>
                      </span>
                    )}
                  </td>

                  <td className="py-4 font-black text-[#00FFF9] text-sm font-mono">
                    R$ {item.cashback.toFixed(2)}
                  </td>

                  <td className="py-4 text-right">
                    <button
                      id={`btn-send-whatsapp-${item.id}`}
                      onClick={() => handleSendWhatsApp(item)}
                      className={`font-bold py-1.5 px-3 rounded-full inline-flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer text-xs ${
                        item.statusNotificacao === 'enviado'
                          ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{item.statusNotificacao === 'enviado' ? 'Reenviar' : 'Enviar WhatsApp'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumo de Conversão do CRM */}
        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <span className="text-slate-500 block font-bold">Taxa de Recompra Óptica</span>
            <span className="text-lg font-black text-cyan-300 font-mono">34.8%</span>
          </div>
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <span className="text-slate-500 block font-bold">Créditos de Bônus Ativos</span>
            <span className="text-lg font-black text-emerald-400 font-mono">R$ 710,00</span>
          </div>
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <span className="text-slate-500 block font-bold">Tempo Médio de Retorno</span>
            <span className="text-lg font-black text-slate-200 font-mono">11.2 Meses</span>
          </div>
        </div>
      </div>

      {/* Modal do Voucher */}
      <VoucherModal
        isOpen={isVoucherOpen}
        onClose={() => setIsVoucherOpen(false)}
        voucherCode={voucherCode}
        cashbackValue={cashbackGerado}
        validityDays={validityDays}
      />
    </div>
  );
};
