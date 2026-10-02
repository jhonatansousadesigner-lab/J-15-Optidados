import React, { useState, useEffect } from 'react';
import { TabType, ServiceOrder } from './types';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { CockpitView } from './components/CockpitView';
import { PupilometerView } from './components/PupilometerView';
import { ConsultorView } from './components/ConsultorView';
import { OrdersView } from './components/OrdersView';
import { CrmView } from './components/CrmView';
import { OrderModal } from './components/OrderModal';
import { CheckCircle2 } from 'lucide-react';

const INITIAL_ORDERS: ServiceOrder[] = [
  {
    id: 'OS-8092',
    cliente: 'Mariana Duarte Souza',
    telefone: '(16) 99872-1102',
    laboratorio: 'Essilor Digital Hub',
    armacao: 'Ray-Ban RB5154 Clubmaster Acetato',
    lente: 'Varilux Physio 360 1.67 BlueUV',
    status: 'surfacagem',
    dnpOD: 32.5,
    dnpOE: 32.5,
    altOD: 19.5,
    altOE: 19.5,
    total: 1890.0,
    dataCriacao: '01/09/2026',
    observacoes: 'Montagem em aro fechado com bisel standard',
  },
  {
    id: 'OS-8093',
    cliente: 'Carlos Eduardo Fontes',
    telefone: '(16) 99123-4490',
    laboratorio: 'Zeiss Vision Care',
    armacao: 'Oakley Chamfer Metal Matte',
    lente: 'SmartLife Monofocal 1.60 Duravision',
    status: 'controle_qualidade',
    dnpOD: 31.0,
    dnpOE: 33.0,
    altOD: 20.0,
    altOE: 20.0,
    total: 1240.0,
    dataCriacao: '02/09/2026',
    observacoes: 'Anti-reflexo Platinum Premium',
  },
  {
    id: 'OS-8094',
    cliente: 'Beatriz Vasconcelos',
    telefone: '(16) 98834-5511',
    laboratorio: 'Hoya Lab Express',
    armacao: 'Vogue Eyewear Redondo Ouro Rosa',
    lente: 'Hoyalux iD LifeStyle 3 1.74 Hi-Vision',
    status: 'pronto',
    dnpOD: 30.5,
    dnpOE: 31.0,
    altOD: 18.5,
    altOE: 19.0,
    total: 2450.0,
    dataCriacao: '03/09/2026',
    observacoes: 'Cliente viaja amanhã. Entrega com estojo original.',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('cockpit');

  // Ordens com carregamento de localStorage para durabilidade
  const [orders, setOrders] = useState<ServiceOrder[]>(() => {
    try {
      const saved = localStorage.getItem('b15_orders');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Erro ao carregar ordens do localStorage', e);
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('b15_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Erro ao salvar ordens no localStorage', e);
    }
  }, [orders]);

  // Modal de Nova O.S.
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderModalInitials, setOrderModalInitials] = useState<{
    dnpOD?: number;
    dnpOE?: number;
    altOD?: number;
    altOE?: number;
    lenteNome?: string;
    lentePreco?: number;
  }>({});

  // Toast de feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Transferência das medidas do Pupilômetro para Nova O.S.
  const handleTransferPupilometer = (dnpOD: number, dnpOE: number, altOD: number, altOE: number) => {
    setOrderModalInitials((prev) => ({
      ...prev,
      dnpOD,
      dnpOE,
      altOD,
      altOE,
    }));
    setIsOrderModalOpen(true);
    showToast(`Medidas transferidas com sucesso (DNP: ${dnpOD} / ${dnpOE} mm)!`);
  };

  // Seleção de Lente do Consultor para Nova O.S.
  const handleSelectLensPackage = (lenteNome: string, lentePreco: number) => {
    setOrderModalInitials((prev) => ({
      ...prev,
      lenteNome,
      lentePreco,
    }));
    setIsOrderModalOpen(true);
    showToast(`Pacote ${lenteNome} selecionado para a O.S.!`);
  };

  // Salvar nova Ordem
  const handleSaveOrder = (newOrder: ServiceOrder) => {
    setOrders([newOrder, ...orders]);
    setActiveTab('os');
    showToast(`Ordem ${newOrder.id} emitida com sucesso para o laboratório!`);
  };

  // Avançar status no Kanban
  const handleAdvanceOrderStatus = (orderId: string) => {
    const nextStatusMap: Record<string, ServiceOrder['status']> = {
      aguardando_armacao: 'surfacagem',
      surfacagem: 'controle_qualidade',
      controle_qualidade: 'pronto',
    };

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId && nextStatusMap[o.status]) {
          const next = nextStatusMap[o.status];
          showToast(`O.S. ${o.id} avançou para ${next.replace('_', ' ').toUpperCase()}!`);
          return { ...o, status: next };
        }
        return o;
      })
    );
  };

  const pendingOrdersCount = orders.filter((o) => o.status !== 'pronto').length;
  const readyOrdersCount = orders.filter((o) => o.status === 'pronto').length;

  return (
    <div id="b15-optical-erp-root" className="min-h-screen bg-[#020408] text-[#e2e8f0] flex flex-col font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Immersive Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[140px]"></div>
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[140px]"></div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="global-toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-[#080e1d]/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-cyan-500/50 shadow-cyan-500/10 flex items-center space-x-2.5 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <CheckCircle2 className="w-5 h-5 text-[#00FFF9] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Institucional */}
      <Header pendingOrdersCount={pendingOrdersCount} />

      {/* Navegação por Módulos */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ordersBadgeCount={readyOrdersCount}
        crmAlertCount={2}
      />

      {/* Conteúdo Principal Dinâmico */}
      <main id="app-main-content" className="max-w-7xl mx-auto p-4 sm:p-6 flex-1 w-full relative z-10">
        {activeTab === 'cockpit' && (
          <CockpitView
            orders={orders}
            onNavigate={(tab) => setActiveTab(tab)}
            onNewOrderQuick={() => {
              setOrderModalInitials({});
              setIsOrderModalOpen(true);
            }}
          />
        )}

        {activeTab === 'pupilometro' && (
          <PupilometerView onTransferToOrder={handleTransferPupilometer} />
        )}

        {activeTab === 'consultor' && (
          <ConsultorView onSelectLensPackage={handleSelectLensPackage} />
        )}

        {activeTab === 'os' && (
          <OrdersView
            orders={orders}
            onAdvanceStatus={handleAdvanceOrderStatus}
            onOpenNewOrderModal={() => {
              setOrderModalInitials({});
              setIsOrderModalOpen(true);
            }}
          />
        )}

        {activeTab === 'crm' && <CrmView />}
      </main>

      {/* Modal de Nova O.S. */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSave={handleSaveOrder}
        initialValues={orderModalInitials}
      />
    </div>
  );
}
