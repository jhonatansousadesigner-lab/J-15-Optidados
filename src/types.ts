export type TabType = 'cockpit' | 'pupilometro' | 'consultor' | 'os' | 'crm';

export interface Prescription {
  esfOD: number;
  cilOD: number;
  eixoOD: number;
  esfOE: number;
  cilOE: number;
  eixoOE: number;
  adicao: number;
}

export type OrderStatus = 'aguardando_armacao' | 'surfacagem' | 'controle_qualidade' | 'pronto';

export interface ServiceOrder {
  id: string;
  cliente: string;
  telefone: string;
  laboratorio: string;
  armacao: string;
  lente: string;
  status: OrderStatus;
  dnpOD: number;
  dnpOE: number;
  altOD: number;
  altOE: number;
  total: number;
  dataCriacao: string;
  observacoes?: string;
}

export interface CrmContact {
  id: string;
  nome: string;
  telefone: string;
  diasVencimento: number;
  ultimaCompra: string;
  valorCompra: number;
  cashback: number;
  dataReceita: string;
  statusNotificacao?: 'pendente' | 'enviado';
}

export interface LensComparison {
  nome: string;
  indice: number;
  recomendada: boolean;
  desc: string;
  material: string;
  espessura: string;
  peso: string;
  precoEstimado: number;
}
