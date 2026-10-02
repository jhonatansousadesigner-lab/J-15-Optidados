import { jsPDF } from 'jspdf';
import { ServiceOrder } from '../types';

/**
 * Mapeamento amigável de status da Ordem de Serviço
 */
const STATUS_LABELS: Record<string, string> = {
  aguardando_armacao: '1. AGUARDANDO ARMAÇÃO',
  surfacagem: '2. SURFAÇAGEM DIGITAL',
  controle_qualidade: '3. CONTROLE DE QUALIDADE',
  pronto: '4. PRONTO PARA ENTREGA',
};

/**
 * Constrói o documento PDF formatado de alta qualidade com as medidas do paciente e detalhes da O.S.
 */
export function buildServiceOrderPDF(order: ServiceOrder): jsPDF {
  // Configuração do documento A4 em milímetros
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  let y = margin;

  // ==========================================
  // 1. CABEÇALHO CORPORATIVO / TIMBRADO ÓPTICO
  // ==========================================
  // Barra superior em azul escuro nobre
  doc.setFillColor(3, 15, 38); // #030f26
  doc.rect(margin, y, contentWidth, 24, 'F');

  // Detalhe sutil ciano no rodapé do cabeçalho
  doc.setFillColor(0, 255, 249); // #00FFF9
  doc.rect(margin, y + 23, contentWidth, 1, 'F');

  // Título e Subtítulo
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('B-15 OPTIDADOS', margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(165, 243, 252); // cyan-200
  doc.text('SISTEMA INTEGRADO DE GESTÃO ÓPTICA & LABORATÓRIO DIGITAL', margin + 6, y + 15);
  doc.text('ÓPTICA MATRIZ • PROTOCOLO EDI B-15 V.4.2', margin + 6, y + 19.5);

  // Bloco da Direita: Número da O.S.
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 255, 249);
  doc.text(`O.S. Nº ${order.id}`, margin + contentWidth - 6, y + 9, { align: 'right' });

  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  doc.text(`Emissão: ${order.dataCriacao || dataAtual} às ${horaAtual}`, margin + contentWidth - 6, y + 15, { align: 'right' });
  doc.text(`Status: ${STATUS_LABELS[order.status] || order.status.toUpperCase()}`, margin + contentWidth - 6, y + 19.5, { align: 'right' });

  y += 28;

  // ==========================================
  // 2. DADOS DO PACIENTE & ROTEAMENTO DE LABORATÓRIO
  // ==========================================
  // Barra de título da seção
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 6.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('1. IDENTIFICAÇÃO DO PACIENTE & LABORATÓRIO DESTINO', margin + 4, y + 4.5);

  y += 6.5;

  // Container dos dados
  const clientBoxHeight = 24;
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentWidth, clientBoxHeight, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, clientBoxHeight, 'S');

  // Coluna 1: Paciente & Telefone
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('NOME DO PACIENTE / CLIENTE:', margin + 4, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(order.cliente || 'Consumidor', margin + 4, y + 11.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('TELEFONE / WHATSAPP:', margin + 4, y + 17);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(order.telefone || 'Não informado', margin + 4, y + 21.5);

  // Linha divisória vertical
  doc.setDrawColor(241, 245, 249);
  doc.line(margin + 92, y + 2, margin + 92, y + clientBoxHeight - 2);

  // Coluna 2: Laboratório & Protocolo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('LABORATÓRIO SURFAÇADOR / MONTAGEM:', margin + 96, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(2, 132, 199); // sky-600
  doc.text(order.laboratorio || 'Laboratório Matriz', margin + 96, y + 11.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('CÓDIGO PROTOCOLO EDI:', margin + 96, y + 17);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`EDI-B15-${order.id}`, margin + 96, y + 21.5);

  y += clientBoxHeight + 5;

  // ==========================================
  // 3. MEDIDAS BIOMÉTRICAS DO PUPILÔMETRO DIGITAL
  // ==========================================
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 6.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. MEDIÇÕES BIOMÉTRICAS DE MONTAGEM (PUPILÔMETRO DIGITAL)', margin + 4, y + 4.5);

  y += 6.5;

  // Tabela de Medidas Pupilotecnológicas
  const tableHeaderHeight = 7;
  const colWidths = [42, 35, 40, 35, 30]; // total = 182mm
  const headers = ['OLHO / LADO', 'DNP (MM)', 'ALTURA MONTAGEM', 'DP TOTAL', 'DIÂMETRO ÚTIL'];

  // Cabeçalho da tabela
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, contentWidth, tableHeaderHeight, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);

  let curX = margin;
  headers.forEach((h, idx) => {
    const align = idx === 0 ? 'left' : 'center';
    const textX = idx === 0 ? curX + 4 : curX + colWidths[idx] / 2;
    doc.text(h, textX, y + 4.7, { align });
    curX += colWidths[idx];
  });

  y += tableHeaderHeight;

  // Linhas de dados
  const dpTotal = (order.dnpOD + order.dnpOE).toFixed(1);
  const rows = [
    {
      olho: 'Olho Direito (OD)',
      dnp: `${order.dnpOD.toFixed(1)} mm`,
      alt: `${order.altOD.toFixed(1)} mm`,
      dp: `${dpTotal} mm`,
      diametro: 'Ø 65 / 70 mm',
    },
    {
      olho: 'Olho Esquerdo (OE)',
      dnp: `${order.dnpOE.toFixed(1)} mm`,
      alt: `${order.altOE.toFixed(1)} mm`,
      dp: '(Simetria Central)',
      diametro: 'Ø 65 / 70 mm',
    },
  ];

  const rowHeight = 7.5;
  rows.forEach((row, rIdx) => {
    // Fundo zebrado
    doc.setFillColor(rIdx % 2 === 0 ? 255 : 248, 250, 252);
    doc.rect(margin, y, contentWidth, rowHeight, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, rowHeight, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(2, 132, 199); // Azul para Olho
    doc.text(row.olho, margin + 4, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);

    let cellX = margin + colWidths[0];
    doc.text(row.dnp, cellX + colWidths[1] / 2, y + 5, { align: 'center' });
    cellX += colWidths[1];

    doc.text(row.alt, cellX + colWidths[2] / 2, y + 5, { align: 'center' });
    cellX += colWidths[2];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(row.dp, cellX + colWidths[3] / 2, y + 5, { align: 'center' });
    cellX += colWidths[3];

    doc.text(row.diametro, cellX + colWidths[4] / 2, y + 5, { align: 'center' });

    y += rowHeight;
  });

  // Nota de calibração laboratorial
  doc.setFillColor(239, 246, 255); // blue-50
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setDrawColor(191, 219, 254);
  doc.rect(margin, y, contentWidth, 6, 'S');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(30, 64, 175);
  doc.text(
    '✓ Medições capturadas e calibradas via Pupilômetro Digital por Cartão Magnético B-15 (Tolerância: ±0.25mm - ISO 13666).',
    margin + 4,
    y + 4
  );

  y += 10;

  // ==========================================
  // 4. ESPECIFICAÇÃO DE ARMAÇÃO, LENTES & VALORES
  // ==========================================
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 6.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. ESPECIFICAÇÃO DE ARMAÇÃO, BLOCOS DE LENTE & TRATAMENTOS', margin + 4, y + 4.5);

  y += 6.5;

  const productBoxHeight = 32;
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentWidth, productBoxHeight, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, productBoxHeight, 'S');

  // Armação
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('ARMAÇÃO SELECIONADA:', margin + 4, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(order.armacao || 'Não especificada', margin + 4, y + 11.5);

  // Lente
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('LENTES & TRATAMENTOS ÓPTICOS:', margin + 4, y + 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(2, 132, 199);
  doc.text(order.lente || 'Não especificada', margin + 4, y + 23.5);

  // Observações Técnicas
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('OBSERVAÇÕES TÉCNICAS / MONTAGEM:', margin + 4, y + 29);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text(order.observacoes || 'Montagem padrão conforme medidas pupilométricas B-15.', margin + 55, y + 29);

  // Valor Total na lateral direita
  doc.setFillColor(248, 250, 252);
  doc.rect(margin + 128, y + 3, 50, 26, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin + 128, y + 3, 50, 26, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('VALOR TOTAL DA O.S.', margin + 153, y + 9, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(16, 185, 129); // emerald-600
  doc.text(`R$ ${order.total.toFixed(2)}`, margin + 153, y + 17, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Garantia Óptica 12 Meses', margin + 153, y + 23, { align: 'center' });

  y += productBoxHeight + 5;

  // ==========================================
  // 5. CHECKLIST DE CONFERÊNCIA & CONTROLE DE QUALIDADE (LAB)
  // ==========================================
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 6.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('4. CONTROLE DE QUALIDADE ÓPTICA & CONFERÊNCIA DE MONTAGEM (ISO 8980)', margin + 4, y + 4.5);

  y += 6.5;

  const checklistBoxHeight = 22;
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentWidth, checklistBoxHeight, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, checklistBoxHeight, 'S');

  // Itens de checklist
  const checksCol1 = [
    '[   ] Dioptria aferida no lensômetro digital (Esf / Cil / Eixo)',
    '[   ] Centro óptico alinhado à DNP/Altura da receita',
    '[   ] Tratamento antirreflexo e proteção UV conferidos',
  ];
  const checksCol2 = [
    '[   ] Biselamento e tensão de encaixe no aro sem deformação',
    '[   ] Ajuste anatômico de hastes e ângulo pantoscópico',
    '[   ] Higienização ultra-sônica e polimento final',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  checksCol1.forEach((chk, cIdx) => {
    doc.text(chk, margin + 4, y + 5.5 + cIdx * 5.5);
  });

  checksCol2.forEach((chk, cIdx) => {
    doc.text(chk, margin + 94, y + 5.5 + cIdx * 5.5);
  });

  y += checklistBoxHeight + 6;

  // ==========================================
  // 6. CAMPOS DE ASSINATURA & TERMO DE RETIRADA
  // ==========================================
  const sigBoxHeight = 26;
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, sigBoxHeight, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, sigBoxHeight, 'S');

  const sigWidth = 52;
  const sigY = y + 16;

  // Assinatura 1: Responsável Técnico
  doc.setDrawColor(148, 163, 184);
  doc.line(margin + 6, sigY, margin + 6 + sigWidth, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text('Óptico Responsável Técnico', margin + 6 + sigWidth / 2, sigY + 4, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text('CRÓO / Matrícula', margin + 6 + sigWidth / 2, sigY + 7.5, { align: 'center' });

  // Assinatura 2: Controle de Qualidade Lab
  const sig2X = margin + 65;
  doc.setDrawColor(148, 163, 184);
  doc.line(sig2X, sigY, sig2X + sigWidth, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text('Laboratório / Surfaçagem', sig2X + sigWidth / 2, sigY + 4, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text('Conferência Final', sig2X + sigWidth / 2, sigY + 7.5, { align: 'center' });

  // Assinatura 3: Cliente / Recebimento
  const sig3X = margin + 124;
  doc.setDrawColor(148, 163, 184);
  doc.line(sig3X, sigY, sig3X + sigWidth, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text('Assinatura do Paciente / Cliente', sig3X + sigWidth / 2, sigY + 4, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text('Recebimento & Ajuste Anatômico', sig3X + sigWidth / 2, sigY + 7.5, { align: 'center' });

  y += sigBoxHeight + 5;

  // ==========================================
  // 7. CÓDIGO DE BARRAS VETORIAL EDI & RODAPÉ
  // ==========================================
  // Fundo do código de barras
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, contentWidth, 18, 'F');

  // Desenho de barras simuladas EDI
  const barcodeY = y + 3;
  const barcodeHeight = 8;
  const barcodeStartX = margin + 35;
  const barcodeWidth = 112;

  // Renderiza padrão estilizado de barras vetoriais
  doc.setFillColor(0, 255, 249); // #00FFF9
  const pattern = [2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 1, 4, 2, 1, 2, 3, 1, 2];
  let barX = barcodeStartX;
  pattern.forEach((w, pIdx) => {
    if (pIdx % 2 === 0) {
      doc.rect(barX, barcodeY, w * 0.9, barcodeHeight, 'F');
    }
    barX += w * 1.35;
  });

  // Texto do código de barras
  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`*EDI-B15-${order.id}-${order.cliente.substring(0, 3).toUpperCase()}*`, margin + contentWidth / 2, y + 14.5, {
    align: 'center',
  });

  y += 21;

  // Nota de rodapé legal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Ficha técnica gerada via B-15 Optidados • Óptica Matriz Ribeirão • Documento homologado para surfaçagem e montagem laboratorial.',
    margin + contentWidth / 2,
    y,
    { align: 'center' }
  );

  return doc;
}

/**
 * Dispara o download direto do arquivo PDF formatado para o usuário
 */
export function exportOrderToPDF(order: ServiceOrder): void {
  const doc = buildServiceOrderPDF(order);
  const cleanId = order.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Ordem_Servico_${cleanId}.pdf`;
  doc.save(filename);
}

/**
 * Abre o PDF gerado em uma nova guia do navegador para visualização / impressão direta
 */
export function previewOrderPDF(order: ServiceOrder): void {
  const doc = buildServiceOrderPDF(order);
  const blobUrl = doc.output('bloburl');
  if (typeof window !== 'undefined') {
    window.open(blobUrl, '_blank');
  }
}
