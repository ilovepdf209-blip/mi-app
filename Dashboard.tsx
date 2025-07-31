import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import app from '../firebase';
import Chart from 'chart.js/auto';
import { Download } from 'lucide-react';
import MagicBento from '../components/MagicBento';

// --- Iconos ---
type SVGProps = React.SVGProps<SVGSVGElement>;
const Logout: React.FC<SVGProps> = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>);
const UserPlus: React.FC<SVGProps> = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>);

// --- Datos simulados de viajes para historial ---
const travelHistoryData = [
  {
    id: 1,
    dateTime: '2025-06-22T08:00:00',
    users: ['Carlos Mendoza'],
    route: 'Medellín - Rionegro',
    distance: 45,
    co2Saved: 2.3,
    economicSaving: 130000,
    company: 'Empresa A',
    origin: 'Medellín',
    destination: 'Rionegro',
    cedula: '123456789',
  },
  {
    id: 2,
    dateTime: '2025-06-15T07:30:00',
    users: ['Laura Jiménez'],
    route: 'Envigado - Sabaneta',
    distance: 12,
    co2Saved: 0.8,
    economicSaving: 15000,
    company: 'Empresa B',
    origin: 'Envigado',
    destination: 'Sabaneta',
    cedula: '987654321',
  },
  {
    id: 3,
    dateTime: '2025-05-21T18:00:00',
    users: ['Pedro Pascal'],
    route: 'Bello - Itagüí',
    distance: 25,
    co2Saved: 1.5,
    economicSaving: 25000,
    company: 'Empresa C',
    origin: 'Bello',
    destination: 'Itagüí',
    cedula: '456789123',
  },
  {
    id: 4,
    dateTime: '2025-05-01T09:00:00',
    users: ['Carlos Mendoza', 'Laura Jiménez'],
    route: 'Rionegro - Medellín',
    distance: 45,
    co2Saved: 4.6,
    economicSaving: 130000,
    company: 'Empresa A',
    origin: 'Rionegro',
    destination: 'Medellín',
    cedula: '123456789',
  },
  {
    id: 5,
    dateTime: '2025-04-20T17:00:00',
    users: ['Ana de Armas'],
    route: 'Medellín - Envigado',
    distance: 15,
    co2Saved: 0.9,
    economicSaving: 18000,
    company: 'Empresa D',
    origin: 'Medellín',
    destination: 'Envigado',
    cedula: '321654987',
  },
  {
    id: 6,
    dateTime: '2024-07-10T10:00:00',
    users: ['Pedro Pascal'],
    route: 'Sabaneta - Medellín',
    distance: 18,
    co2Saved: 1.1,
    economicSaving: 22000,
    company: 'Empresa C',
    origin: 'Sabaneta',
    destination: 'Medellín',
    cedula: '456789123',
  },
];

const formatCurrency = (value: number) =>
  value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });

const TABS = {
  RESUMEN: 'Resumen',
  USUARIOS: 'Usuarios',
  HISTORIAL: 'Historial de viajes',
  CONFIG: 'Configuración',
};
const TAB_LIST = [TABS.RESUMEN, TABS.USUARIOS, TABS.HISTORIAL, TABS.CONFIG];

// 1. Agregar componente de tabs de periodo de tiempo
const TIME_RANGES = [
  { label: 'Día anterior', value: 'day' },
  { label: 'Última semana', value: 'week' },
  { label: '15 días', value: '15days' },
  { label: 'Mes', value: 'month' },
  { label: '6 meses', value: '6months' },
  { label: 'Año', value: 'year' },
];

function TimeRangeTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2 mb-4">
      {TIME_RANGES.map(r => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors border border-white/10
            ${value === r.value ? 'bg-fuchsia-900/60 text-fuchsia-300 border-fuchsia-500' : 'bg-slate-900/60 text-white/60 hover:text-fuchsia-300 hover:border-fuchsia-500'}`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

// 2. Datos mock para las gráficas por periodo
type PeriodoData = { labels: string[]; data: number[] };
const viajesPorPeriodo: Record<string, PeriodoData> = {
  day:   { labels: ['Ayer'], data: [18] },
  week:  { labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], data: [22, 19, 25, 18, 20, 17, 21] },
  '15days': { labels: Array.from({length: 15}, (_,i)=>`Día ${i+1}`), data: [18,20,19,22,21,17,20,19,18,21,20,22,19,18,20] },
  month: { labels: Array.from({length: 30}, (_,i)=>`Día ${i+1}`), data: Array(30).fill(0).map(()=>Math.floor(Math.random()*10+15)) },
  '6months': { labels: ['Ene','Feb','Mar','Abr','May','Jun'], data: [320, 290, 310, 330, 300, 312] },
  year: { labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'], data: [320, 290, 310, 330, 300, 312, 305, 315, 325, 310, 300, 320] },
};
const co2PorPeriodo: Record<string, PeriodoData> = {
  day:   { labels: ['Ayer'], data: [42] },
  week:  { labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], data: [50, 48, 52, 47, 49, 45, 51] },
  '15days': { labels: Array.from({length: 15}, (_,i)=>`Día ${i+1}`), data: [42,45,44,48,47,43,46,44,42,47,45,48,44,43,46] },
  month: { labels: Array.from({length: 30}, (_,i)=>`Día ${i+1}`), data: Array(30).fill(0).map(()=>Math.floor(Math.random()*10+40)) },
  '6months': { labels: ['Ene','Feb','Mar','Abr','May','Jun'], data: [900, 870, 910, 950, 920, 940] },
  year: { labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'], data: [900, 870, 910, 950, 920, 940, 930, 960, 970, 940, 920, 950] },
};

// 3. Gráfica tipo MagicBento (barras simples, sin librería externa)
function SimpleBarChart({ labels, data, color = '#a78bfa', unit = '' }: { labels: string[], data: number[], color?: string, unit?: string }) {
  // Responsive SVG bar chart
  const max = Math.max(...data, 1);
  return (
    <svg viewBox={`0 0 400 180`} width="100%" height="160">
      {data.map((v, i) => (
        <rect
          key={i}
          x={20 + i * (360 / data.length)}
          y={170 - (v / max) * 140}
          width={Math.max(18, 320 / data.length)}
          height={(v / max) * 140}
          rx="6"
          fill={color}
          opacity="0.85"
        />
      ))}
      {labels.map((l, i) => (
        <text
          key={i}
          x={28 + i * (360 / data.length)}
          y={178}
          fontSize="11"
          fill="#fff"
          textAnchor="middle"
        >{l}</text>
      ))}
      {/* Eje Y (opcional) */}
      <line x1="20" y1="30" x2="20" y2="170" stroke="#fff" strokeWidth="1" opacity="0.1" />
    </svg>
  );
}

// Componente de barras con tabs y Chart.js
function BarChartWithTabs({
  title,
  dataByPeriod,
  color,
  unit,
}: {
  title: string;
  dataByPeriod: Record<string, PeriodoData>;
  color: string;
  unit: string;
}) {
  const [range, setRange] = React.useState('week');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const { labels, data } = dataByPeriod[range];
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: unit,
            data,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1.5,
            borderRadius: 8,
            hoverBackgroundColor: '#f472b6',
            maxBarThickness: 40,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
          x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
        },
      },
    });
    // Limpieza
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [range, dataByPeriod, color, unit]);
  return (
    <div className="relative bg-[#0a0018] rounded-2xl border border-fuchsia-900/40 shadow-lg p-6 flex flex-col min-h-[340px] overflow-hidden group transition-all">
      <div className="absolute inset-0 pointer-events-none group-hover:shadow-[0_0_40px_10px_rgba(132,0,255,0.2)] transition-all duration-300" />
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <TimeRangeTabs value={range} onChange={setRange} />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full h-64"><canvas ref={chartRef}></canvas></div>
      </div>
    </div>
  );
}

// --- Componente Principal del Dashboard ---
export default function Dashboard() {
    const navigate = useNavigate();
    const auth = getAuth(app);
    const [activeTab, setActiveTab] = useState(TABS.RESUMEN);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [empresaData, setEmpresaData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    // Estado para el formulario de usuario
    const [userForm, setUserForm] = useState({
      nombres: '',
      apellidos: '',
      cedula: '',
      email: '',
      celular: '',
    });
    // Estado para la lista de usuarios
    const [allUsers, setAllUsers] = useState([
        { id: 1, nombres: 'Carlos', apellidos: 'Mendoza', cedula: '12345678', email: 'c.mendoza@tuempresa.co', celular: '3001112233' },
        { id: 2, nombres: 'Laura', apellidos: 'Jiménez', cedula: '87654321', email: 'l.jimenez@tuempresa.co', celular: '3102223344' },
      { id: 3, nombres: 'Pedro', apellidos: 'Pascal', cedula: '11223344', email: 'p.pascal@tuempresa.co', celular: '3203334455' },
      { id: 4, nombres: 'Ana', apellidos: 'de Armas', cedula: '44332211', email: 'a.dearmas@tuempresa.co', celular: '3014445566' },
    ]);

    // Cargar datos de la empresa
    useEffect(() => {
        const loadEmpresaData = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    navigate('/corporate-login');
                    return;
                }

                const db = getFirestore(app);
                const empresasRef = collection(db, 'empresas');
                const q = query(empresasRef, where('authUid', '==', user.uid));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    const empresaDoc = querySnapshot.docs[0];
                    setEmpresaData(empresaDoc.data());
                } else {
                    // Si no encuentra por authUid, buscar por email
                    const email = user.email;
                    if (email && email.includes('@empresa.com')) {
                        const nit = email.replace('@empresa.com', '');
                        const q2 = query(empresasRef, where('nit', '==', nit));
                        const querySnapshot2 = await getDocs(q2);
                        if (!querySnapshot2.empty) {
                            const empresaDoc2 = querySnapshot2.docs[0];
                            setEmpresaData(empresaDoc2.data());
                        }
                    }
                }
            } catch (error) {
                console.error('Error cargando datos de empresa:', error);
            } finally {
                setLoading(false);
            }
        };

        loadEmpresaData();
    }, [auth, navigate]);

    // Manejo de cambios en el formulario
    const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name === 'cedula') {
        // Solo permitir números
        if (!/^\d*$/.test(value)) return;
      }
      setUserForm({ ...userForm, [name]: value });
    };
    // Manejo de envío del formulario
    const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
      setAllUsers(prev => [
        ...prev,
        {
          id: prev.length + 1,
          ...userForm,
        },
      ]);
      setUserForm({ nombres: '', apellidos: '', cedula: '', email: '', celular: '' });
        setIsModalOpen(false);
    };
    
    // --- Refs para los Gráficos ---
    const barChartRef = useRef<HTMLCanvasElement>(null);
    const bubbleChartRef = useRef<HTMLCanvasElement>(null);
    const chartInstances = useRef<{ bar?: any; bubble?: any }>({});

    // --- Datos de simulación ---
    const kpiData = {
        co2Saved: "1,254 kg",
        estimatedSavings: "$2.5M",
        totalTrips: "312",
        totalKm: "8,750 km"
    };

    const peakHoursData = {
        labels: ['6-9 AM', '9-12 PM', '12-3 PM', '3-6 PM', '6-9 PM'],
        data: [120, 200, 150, 250, 180]
    };

    const routeHeatmapData = [
        { x: 10, y: 20, r: 25, label: 'Medellín - Rionegro' },
        { x: 30, y: 40, r: 15, label: 'Envigado - Sabaneta' },
        { x: 50, y: 60, r: 30, label: 'Bello - Itagüí' },
        { x: 70, y: 80, r: 20, label: 'Rionegro - Medellín' },
    ];

    // --- Estado y lógica de filtros para historial de viajes ---
    const [filters, setFilters] = React.useState({
        name: '',
        cedula: '',
        origin: '',
        destination: '',
        date: '',
        company: '',
    });
    const filteredTravels = travelHistoryData.filter((t) => {
        const nameMatch = filters.name === '' || t.users.some(u => u.toLowerCase().includes(filters.name.toLowerCase()));
        const cedulaMatch = filters.cedula === '' || t.cedula.includes(filters.cedula);
        const originMatch = filters.origin === '' || t.origin.toLowerCase().includes(filters.origin.toLowerCase());
        const destinationMatch = filters.destination === '' || t.destination.toLowerCase().includes(filters.destination.toLowerCase());
        const dateMatch = filters.date === '' || t.dateTime.startsWith(filters.date);
        const companyMatch = filters.company === '' || t.company.toLowerCase().includes(filters.company.toLowerCase());
        return nameMatch && cedulaMatch && originMatch && destinationMatch && dateMatch && companyMatch;
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };
    const clearFilters = () => {
        setFilters({ name: '', cedula: '', origin: '', destination: '', date: '', company: '' });
    };
    const downloadCSV = () => {
        const header = 'Fecha y Hora,Usuario(s),Cédula,Empresa,Ruta,Origen,Destino,Distancia,CO2 Ahorrado,Ahorro\n';
        const rows = filteredTravels.map(t =>
            [
                formatDate(t.dateTime),
                t.users.join(' / '),
                t.cedula,
                t.company,
                t.route,
                t.origin,
                t.destination,
                `${t.distance} km`,
                `${t.co2Saved} kg`,
                formatCurrency(t.economicSaving)
            ].join(',')
        ).join('\n');
        const csv = header + rows;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'historial_viajes.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Descarga de usuarios en CSV
    const downloadUsersCSV = () => {
      const header = 'Nombres,Apellidos,Cédula,Email,Celular\n';
      const rows = allUsers.map(u => [u.nombres, u.apellidos, u.cedula, u.email, u.celular].join(','));
      const csv = header + rows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'usuarios_registrados.csv';
      a.click();
      URL.revokeObjectURL(url);
    };

    // --- Efecto para Renderizar Gráficos ---
    useEffect(() => {
        if (activeTab !== 'Resumen') return;

        // Destruye los gráficos anteriores para evitar duplicados
        if (chartInstances.current.bar) chartInstances.current.bar.destroy();
        if (chartInstances.current.bubble) chartInstances.current.bubble.destroy();

        // Gráfico de Barras: Horarios Pico
        if (barChartRef.current) {
            const barCtx = barChartRef.current.getContext('2d');
            if (barCtx) {
                chartInstances.current.bar = new Chart(barCtx, {
                    type: 'bar',
                    data: {
                        labels: peakHoursData.labels,
                        datasets: [{
                            label: 'Número de Viajes',
                            data: peakHoursData.data,
                            backgroundColor: 'rgba(45, 212, 191, 0.6)',
                            borderColor: 'rgba(45, 212, 191, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                            x: { grid: { color: 'rgba(255, 255, 255, 0.1)' } }
                        }
                    }
                });
            }
        }

        // Gráfico de Burbujas: Mapa de Calor de Rutas
        if (bubbleChartRef.current) {
            const bubbleCtx = bubbleChartRef.current.getContext('2d');
            if (bubbleCtx) {
                chartInstances.current.bubble = new Chart(bubbleCtx, {
                    type: 'bubble',
                    data: {
                        datasets: [{
                            label: 'Rutas Populares',
                            data: routeHeatmapData,
                            backgroundColor: 'rgba(139, 92, 246, 0.6)',
                            borderColor: 'rgba(139, 92, 246, 1)',
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { display: false },
                            x: { display: false }
                        }
                    }
                });
            }
        }

    }, [activeTab]); // Se vuelve a ejecutar si la pestaña activa cambia

    const kpiCards = [
      {
        color: '#060010',
        title: kpiData.co2Saved,
        description: 'Total CO₂ Ahorrado',
        label: 'Sostenibilidad',
      },
      {
        color: '#060010',
        title: kpiData.estimatedSavings,
        description: 'Ahorro Estimado Total',
        label: 'Finanzas',
      },
      {
        color: '#060010',
        title: kpiData.totalTrips,
        description: 'Total de Viajes',
        label: 'Movilidad',
      },
      {
        color: '#060010',
        title: kpiData.totalKm,
        description: 'Total Kilómetros Recorridos',
        label: 'Distancia',
      },
    ];

    const [viajesRange, setViajesRange] = useState('week');
    const [co2Range, setCo2Range] = useState('week');

    const renderContent = () => {
        if (activeTab === TABS.RESUMEN) {
            return (
                <div className="space-y-16 animate-fade-in">
                    {/* Sección de Métricas */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold text-white mb-8">Métricas de Sostenibilidad y Eficiencia</h2>
                    <MagicBento
                      cards={kpiCards}
                      textAutoHide={true}
                      enableStars={true}
                      enableSpotlight={true}
                      enableBorderGlow={true}
                      enableTilt={true}
                      enableMagnetism={true}
                      clickEffect={true}
                      spotlightRadius={300}
                      particleCount={12}
                      glowColor="132, 0, 255"
                    />
                    </div>
                    
                    {/* Sección de Gráficos */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-white mb-8">Análisis de Tendencias</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <BarChartWithTabs
                          title="Cantidad de Viajes"
                          dataByPeriod={viajesPorPeriodo}
                          color="rgba(45, 212, 191, 0.6)"
                          unit="Viajes"
                        />
                        <BarChartWithTabs
                          title="kgCO₂ Ahorrados"
                          dataByPeriod={co2PorPeriodo}
                          color="rgba(139, 92, 246, 0.6)"
                          unit="kgCO₂"
                        />
                        </div>
                    </div>
                </div>
            );
        }
        if (activeTab === TABS.USUARIOS) {
            return (
                <div className="space-y-8">
                  <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-12">
                      <h2 className="text-3xl font-bold text-white">Gestión de Usuarios</h2>
                      <div className="flex gap-4">
                        <button onClick={downloadUsersCSV} className="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all duration-300 text-base shadow-lg hover:shadow-xl">
                          <Download className="w-5 h-5" /> Descargar Usuarios
                        </button>
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all duration-300 text-base shadow-lg hover:shadow-xl">
                          <UserPlus className="w-5 h-5" /> Añadir Usuario
                        </button>
                      </div>
                    </div>
                    {/* MagicBento container para la tabla de usuarios */}
                    <div className="relative bg-[#0a0018] rounded-2xl border border-fuchsia-900/40 shadow-lg p-10 overflow-x-auto group transition-all">
                      <div className="absolute inset-0 pointer-events-none group-hover:shadow-[0_0_40px_10px_rgba(132,0,255,0.2)] transition-all duration-300" />
                      <table className="w-full text-left">
                        <thead className="bg-slate-900/80 text-sm uppercase text-white/60">
                          <tr>
                            <th className="px-6 py-4 font-semibold">Nombres</th>
                            <th className="px-6 py-4 font-semibold">Apellidos</th>
                            <th className="px-6 py-4 font-semibold">Cédula</th>
                            <th className="px-6 py-4 font-semibold">Email</th>
                            <th className="px-6 py-4 font-semibold">Celular</th>
                          </tr>
                        </thead>
                        <tbody className="text-base divide-y divide-slate-700/50">
                          {allUsers.map(user => (
                            <tr key={user.id} className="hover:bg-slate-800/40 transition-colors duration-200">
                              <td className="px-6 py-4 font-medium whitespace-nowrap">{user.nombres}</td>
                              <td className="px-6 py-4 font-medium whitespace-nowrap">{user.apellidos}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{user.cedula}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{user.celular}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Modal para añadir usuario con MagicBento style */}
                  {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                      <div className="relative bg-[#0a0018] rounded-2xl border border-fuchsia-900/40 shadow-2xl p-10 w-full max-w-lg animate-fade-in">
                        <div className="absolute inset-0 pointer-events-none group-hover:shadow-[0_0_40px_10px_rgba(132,0,255,0.2)] transition-all duration-300" />
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white text-2xl font-bold transition-colors duration-300">&times;</button>
                        <h3 className="text-3xl font-bold mb-8 text-center text-white">Añadir Nuevo Usuario</h3>
                        <form onSubmit={handleAddUser} className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium mb-3 text-white/80">Nombres</label>
                              <input name="nombres" value={userForm.nombres} onChange={handleUserFormChange} required className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-3 text-white/80">Apellidos</label>
                              <input name="apellidos" value={userForm.apellidos} onChange={handleUserFormChange} required className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-3 text-white/80">Cédula</label>
                            <input name="cedula" value={userForm.cedula} onChange={handleUserFormChange} required className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" maxLength={15} inputMode="numeric" pattern="[0-9]*" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-3 text-white/80">Correo Electrónico</label>
                            <input name="email" type="email" value={userForm.email} onChange={handleUserFormChange} required className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-3 text-white/80">Celular</label>
                            <input name="celular" value={userForm.celular} onChange={handleUserFormChange} required className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" />
                          </div>
                          <button type="submit" className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white font-bold py-4 rounded-xl mt-6 text-lg shadow-lg hover:from-fuchsia-400 hover:to-cyan-300 transition-all duration-300 hover:shadow-xl">Registrar Usuario</button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
            );
        }
        if (activeTab === TABS.HISTORIAL) {
            return (
                <div className="space-y-8">
                  <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">Historial de Viajes</h2>
                    {/* MagicBento container para filtros y tabla */}
                    <div className="relative bg-[#0a0018] rounded-2xl border border-fuchsia-900/40 shadow-lg p-10 mb-10 group transition-all">
                      <div className="absolute inset-0 pointer-events-none group-hover:shadow-[0_0_40px_10px_rgba(132,0,255,0.2)] transition-all duration-300" />
                      {/* Filtros */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
                        <div className="flex flex-col gap-2">
                          <input name="name" value={filters.name} onChange={handleChange} placeholder="Nombre o Apellido" className="bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <input name="cedula" value={filters.cedula} onChange={handleChange} placeholder="Cédula" className="bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <input name="origin" value={filters.origin} onChange={handleChange} placeholder="Origen" className="bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <input name="destination" value={filters.destination} onChange={handleChange} placeholder="Destino" className="bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <input name="date" value={filters.date} onChange={handleChange} placeholder="Fecha" type="date" className="bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <input name="company" value={filters.company} onChange={handleChange} placeholder="Empresa" className="bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" />
                        </div>
                      </div>
                      
                      {/* Botones de acción */}
                      <div className="flex gap-4 mb-8">
                        <button onClick={clearFilters} className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300">Limpiar Filtros</button>
                        <button onClick={downloadCSV} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl">
                          <Download className="w-5 h-5" /> Descargar CSV
                        </button>
                      </div>
                      {/* Tabla */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-slate-900/80 text-sm uppercase text-white/60">
                            <tr>
                              <th className="px-4 py-4 font-semibold whitespace-normal">Fecha y Hora</th>
                              <th className="px-4 py-4 font-semibold whitespace-normal">Usuario(s)</th>
                              <th className="px-4 py-4 font-semibold whitespace-normal">Cédula</th>
                              <th className="px-4 py-4 font-semibold whitespace-normal">Empresa</th>
                              <th className="px-4 py-4 font-semibold whitespace-normal">Ruta</th>
                              <th className="px-4 py-4 font-semibold whitespace-normal">Origen</th>
                              <th className="px-4 py-4 font-semibold whitespace-normal">Destino</th>
                              <th className="px-4 py-4 font-semibold whitespace-normal">Distancia</th>
                              <th className="px-4 py-4 font-semibold whitespace-normal">CO₂ Ahorrado</th>
                              <th className="px-4 py-4 font-semibold whitespace-normal">Ahorro</th>
                            </tr>
                          </thead>
                          <tbody className="text-base divide-y divide-slate-700/50">
                            {filteredTravels.length === 0 ? (
                              <tr>
                                <td colSpan={10} className="py-12 text-center text-white/60 text-lg">No se encontraron viajes con los filtros seleccionados.</td>
                              </tr>
                            ) : (
                              filteredTravels.map(t => (
                                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors duration-200">
                                  <td className="px-4 py-4 align-top break-words">{formatDate(t.dateTime)}</td>
                                  <td className="px-4 py-4 align-top font-medium break-words">{t.users.join(', ')}</td>
                                  <td className="px-4 py-4 align-top break-words">{t.cedula}</td>
                                  <td className="px-4 py-4 align-top break-words">{t.company}</td>
                                  <td className="px-4 py-4 align-top break-words">{t.route}</td>
                                  <td className="px-4 py-4 align-top break-words">{t.origin}</td>
                                  <td className="px-4 py-4 align-top break-words">{t.destination}</td>
                                  <td className="px-4 py-4 align-top break-words">{t.distance} km</td>
                                  <td className="px-4 py-4 align-top text-emerald-400 break-words font-medium">{t.co2Saved} kg</td>
                                  <td className="px-4 py-4 align-top text-purple-400 break-words font-medium">{formatCurrency(t.economicSaving)}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
            );
        }
        if (activeTab === TABS.CONFIG) {
            return <div className="text-white/70">Configuración - Contenido no implementado.</div>;
        }
        return <div className="text-white/70">{activeTab} - Contenido no implementado.</div>;
    };

    if (loading) {
        return (
            <div className="relative z-10 pt-32 pb-20 flex items-center justify-center min-h-screen">
                <div className="text-white text-xl">Cargando datos de la empresa...</div>
            </div>
        );
    }

    return (
        <div className="relative z-10 min-h-screen bg-slate-900">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header con mejor espaciado */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Dashboard Corporativo</h1>
                        <p className="text-white/70 text-lg">{empresaData?.razonSocial || 'Cargando empresa...'}</p>
                    </div>
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 bg-red-500/20 text-red-400 font-semibold py-3 px-6 rounded-xl hover:bg-red-500/30 transition-all duration-300 border border-red-500/30">
                       <Logout className="w-5 h-5" /> Salir
                   </button>
                </div>

                {/* Tabs con mejor espaciado */}
                <div className="flex border-b border-slate-700/50 mb-12">
                   {TAB_LIST.map(tab => (
                       <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 px-6 text-sm font-medium transition-all duration-300 whitespace-nowrap border-b-2 ${activeTab === tab ? 'border-teal-400 text-teal-400' : 'border-transparent text-white/60 hover:text-white hover:border-white/30'}`}>{tab}</button>
                   ))}
                </div>

                {/* Contenido principal con mejor espaciado */}
                <div className="space-y-12">
                  {renderContent()}
                     </div>
            </div>
        </div>
    );
}