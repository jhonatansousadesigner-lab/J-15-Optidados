import React from 'react';
import { X, Award, Check, Copy, Share2, Sparkles } from 'lucide-react';

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucherCode: string;
  cashbackValue: string;
  validityDays: number;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({
  isOpen,
  onClose,
  voucherCode,
  cashbackValue,
  validityDays,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `PARABÉNS! Você ganhou um Bônus B-15 de R$ ${cashbackValue}! Use o cupom ${voucherCode} na Óptica Matriz em até ${validityDays} dias para o seu próximo óculos ou solar.`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="voucher-modal-backdrop" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div id="voucher-card" className="bg-[#0b1120] w-full max-w-md rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,255,249,0.2)] border border-cyan-500/40 relative animate-in fade-in zoom-in-95 duration-200 text-white">
        {/* Header Premium Imersivo */}
        <div className="bg-gradient-to-r from-[#020a1c] via-[#051838] to-[#030f25] border-b border-slate-800 text-white p-6 text-center relative">
          <button
            id="btn-close-voucher-modal"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl mb-2 shadow-[0_0_15px_rgba(0,255,249,0.2)]">
            <Award className="w-8 h-8 text-[#00FFF9]" />
          </div>
          <h3 className="text-xl font-black tracking-tight text-white">Voucher B-15 Bônus</h3>
          <p className="text-xs text-slate-400">Fidelização e Cashback Óptico</p>
        </div>

        {/* Corpo do Voucher */}
        <div className="p-6 text-center space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
            Crédito Exclusivo para o Cliente
          </span>
          <div className="p-4 bg-gradient-to-br from-[#061633] via-[#09224d] to-[#041129] border-2 border-dashed border-cyan-500/50 rounded-2xl shadow-[0_0_20px_rgba(0,255,249,0.15)]">
            <span className="text-4xl font-black text-[#00FFF9] font-mono drop-shadow-[0_0_12px_rgba(0,255,249,0.35)]">
              R$ {cashbackValue}
            </span>
            <p className="text-xs text-cyan-200 font-semibold mt-1">
              Válido para Óculos de Sol, 2º Par ou Armações de Grife
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block font-bold">CÓDIGO DO CUPOM:</span>
              <span id="voucher-code-display" className="font-mono font-black text-sm text-cyan-300 tracking-wider">
                {voucherCode}
              </span>
            </div>
            <button
              id="btn-copy-voucher-code"
              onClick={handleCopy}
              className="px-3 py-1.5 bg-gradient-to-r from-[#00FFF9] to-cyan-300 text-slate-950 font-black hover:brightness-110 text-xs rounded-xl flex items-center space-x-1 cursor-pointer transition-all shadow-[0_0_10px_rgba(0,255,249,0.25)]"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Regra: Válido por {validityDays} dias a contar da data de emissão na Óptica Matriz Ribeirão. Não cumulativo com liquidações gerais.
          </p>

          <button
            id="btn-send-voucher-whatsapp"
            onClick={() => {
              const msg = encodeURIComponent(
                `Olá! Parabéns, você acaba de receber seu Voucher B-15 Bônus no valor de R$ ${cashbackValue}! Use o código ${voucherCode} em até ${validityDays} dias na Óptica Matriz.`
              );
              window.open(`https://wa.me/?text=${msg}`, '_blank');
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-full text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center space-x-2 cursor-pointer transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar Voucher no WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
