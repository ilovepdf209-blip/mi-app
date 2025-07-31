import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Car,
  Route,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  DollarSign,
  MapPin,
  FileText
} from 'lucide-react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '../firebase';

interface DashboardStats {
  totalEmpresas: number;
  totalUsuarios: number;
  totalConductores: number;
  totalVehiculos: number;
  empresasActivas: number;
  usuariosActivos: number;
  conductoresActivos: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmpresas: 0,
    totalUsuarios: 0,
    totalConductores: 0,
    totalVehiculos: 0,
    empresasActivas: 0,
    usuariosActivos: 0,
    conductoresActivos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const db = getFirestore(app);
      
      // Cargar empresas
      const empresasSnapshot = await getDocs(collection(db, 'empresas'));
      const empresas = empresasSnapshot.docs.map(doc => doc.data());
      
      // Cargar usuarios
      const usuariosSnapshot = await getDocs(collection(db, 'users'));
      const usuarios = usuariosSnapshot.docs.map(doc => doc.data());
      
      // Cargar vehículos
      const vehiculosSnapshot = await getDocs(collection(db, 'vehiculos'));
      const vehiculos = vehiculosSnapshot.docs.map(doc => doc.data());

      setStats({
        totalEmpresas: empresas.length,
        totalUsuarios: usuarios.length,
        totalConductores: usuarios.filter(u => u.role === 'driver').length,
        totalVehiculos: vehiculos.length,
        empresasActivas: empresas.filter(e => e.estado === 'activa').length,
        usuariosActivos: usuarios.filter(u => u.status === 'active').length,
        conductoresActivos: usuarios.filter(u => u.role === 'driver' && u.status === 'active').length,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    trend, 
    trendValue 
  }: {
    title: string;
    value: number;
    icon: any;
    color: string;
    trend?: 'up' | 'down';
    trendValue?: number;
  }) => (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value.toLocaleString()}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-xs font-medium ${
                trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {trendValue}% vs mes anterior
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-white mt-4">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700/50 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard de Administración</h1>
            <p className="text-slate-400 mt-1">Resumen general de la plataforma</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium">Administrador</p>
              <p className="text-slate-400 text-sm">admin@viajemos.com</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Empresas"
            value={stats.totalEmpresas}
            icon={Building2}
            color="bg-gradient-to-r from-purple-600 to-pink-600"
            trend="up"
            trendValue={12}
          />
          <StatCard
            title="Total Usuarios"
            value={stats.totalUsuarios}
            icon={Users}
            color="bg-gradient-to-r from-blue-600 to-cyan-600"
            trend="up"
            trendValue={8}
          />
          <StatCard
            title="Total Conductores"
            value={stats.totalConductores}
            icon={Car}
            color="bg-gradient-to-r from-emerald-600 to-teal-600"
            trend="up"
            trendValue={15}
          />
          <StatCard
            title="Total Vehículos"
            value={stats.totalVehiculos}
            icon={Route}
            color="bg-gradient-to-r from-orange-600 to-red-600"
            trend="up"
            trendValue={20}
          />
        </div>

        {/* Estadísticas secundarias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Empresas Activas</h3>
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-emerald-400">{stats.empresasActivas}</span>
              <span className="text-slate-400 text-sm">de {stats.totalEmpresas}</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.totalEmpresas > 0 ? (stats.empresasActivas / stats.totalEmpresas) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Usuarios Activos</h3>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-blue-400">{stats.usuariosActivos}</span>
              <span className="text-slate-400 text-sm">de {stats.totalUsuarios}</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.totalUsuarios > 0 ? (stats.usuariosActivos / stats.totalUsuarios) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Conductores Activos</h3>
              <Car className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-emerald-400">{stats.conductoresActivos}</span>
              <span className="text-slate-400 text-sm">de {stats.totalConductores}</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.totalConductores > 0 ? (stats.conductoresActivos / stats.totalConductores) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Actividad Reciente</h3>
              <Calendar className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Nueva empresa registrada</p>
                  <p className="text-slate-400 text-xs">Empresa ABC Ltda. - hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Nuevo conductor verificado</p>
                  <p className="text-slate-400 text-xs">Juan Pérez - hace 4 horas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Vehículo agregado a flota</p>
                  <p className="text-slate-400 text-xs">ABC123 - Toyota Corolla - hace 6 horas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Resumen Financiero</h3>
              <DollarSign className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <span className="text-white">Ingresos del mes</span>
                <span className="text-emerald-400 font-semibold">$2,450,000</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <span className="text-white">Comisiones</span>
                <span className="text-blue-400 font-semibold">$245,000</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <span className="text-white">Viajes completados</span>
                <span className="text-purple-400 font-semibold">1,234</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <span className="text-white">Empresas facturadas</span>
                <span className="text-orange-400 font-semibold">45</span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/empresas')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all cursor-pointer"
            >
              <Building2 className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Registrar Empresa</span>
            </button>
            <button
              onClick={() => navigate('/admin/usuarios')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all cursor-pointer"
            >
              <Users className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Gestionar Usuarios</span>
            </button>
            <button
              onClick={() => navigate('/admin/vehiculos')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer"
            >
              <Car className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Ver Flotas</span>
            </button>
            <button
              onClick={() => navigate('/admin/facturacion')}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all cursor-pointer"
            >
              <FileText className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Generar Reportes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 