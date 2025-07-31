import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Download, Eye, User, Car, CreditCard, Wallet, Building, Search } from 'lucide-react';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import app from '../firebase';

// Tipos de datos
interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'passenger' | 'driver' | 'admin';
  estado: 'activo' | 'pendiente' | 'inactivo';
  telefono: string;
  ciudad: string;
  fechaRegistro: Date;
  preferencias: {
    idioma: string;
    notificaciones: boolean;
    tema: string;
  };
  billetera: {
    balance: number;
    totalGastado: number;
    totalGanado: number;
  };
  banco?: {
    nombre: string;
    tipoCuenta: string;
    numeroCuenta: string;
  };
  verificaciones: {
    email: boolean;
    telefono: boolean;
    documento: boolean;
  };
}

interface Conductor extends Usuario {
  vehiculo: {
    placa: string;
    marca: string;
    modelo: string;
    color: string;
    tipo: string;
  };
  documentos: {
    licencia: string;
    soat: string;
    tecnomecanica: string;
  };
  estadisticas: {
    viajesCompletados: number;
    calificacionPromedio: number;
    kilometrosRecorridos: number;
  };
}

const AdminUsuarios: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'conductores'>('usuarios');
  const [selectedUser, setSelectedUser] = useState<Usuario | Conductor | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);

  useEffect(() => {
    loadUsuarios();
    loadConductores();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      const usuariosSnapshot = await getDocs(collection(db, 'users'));
      const usuariosData: Usuario[] = [];
      
      usuariosSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.role === 'passenger') {
          usuariosData.push({ 
            id: doc.id, 
            nombre: data.name || data.nombre || 'Usuario',
            email: data.email || '',
            rol: 'passenger',
            estado: data.status || 'activo',
            telefono: data.phone || data.telefono || '',
            ciudad: data.city || data.ciudad || 'Sin especificar',
            fechaRegistro: data.createdAt ? new Date(data.createdAt.toDate()) : new Date(),
            billetera: data.billetera || { balance: 0, totalGastado: 0, totalGanado: 0 },
            verificaciones: data.verificaciones || { email: false, telefono: false, documento: false },
            preferencias: data.preferencias || { idioma: 'Español', notificaciones: true, tema: 'Oscuro' }
          } as Usuario);
        }
      });
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      // Si hay error, usar datos de ejemplo
      setUsuarios([
        {
          id: '1',
          nombre: 'Juan Pérez',
          email: 'juanperez@email.com',
          rol: 'passenger',
          estado: 'activo',
          telefono: '3001234567',
          ciudad: 'Medellín',
          fechaRegistro: new Date('2024-01-15'),
          preferencias: {
            idioma: 'Español',
            notificaciones: true,
            tema: 'Oscuro',
          },
          billetera: {
            balance: 150000,
            totalGastado: 450000,
            totalGanado: 0,
          },
          banco: {
            nombre: 'Bancolombia',
            tipoCuenta: 'Ahorros',
            numeroCuenta: '1234567890',
          },
          verificaciones: {
            email: true,
            telefono: true,
            documento: false,
          },
        },
        {
          id: '2',
          nombre: 'Ana Gómez',
          email: 'ana@email.com',
          rol: 'passenger',
          estado: 'activo',
          telefono: '3109876543',
          ciudad: 'Bogotá',
          fechaRegistro: new Date('2024-02-20'),
          preferencias: {
            idioma: 'Español',
            notificaciones: false,
            tema: 'Claro',
          },
          billetera: {
            balance: 75000,
            totalGastado: 320000,
            totalGanado: 0,
          },
          verificaciones: {
            email: true,
            telefono: false,
            documento: true,
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadConductores = async () => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      const conductoresSnapshot = await getDocs(collection(db, 'users'));
      const conductoresData: Conductor[] = [];
      
      conductoresSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.role === 'driver') {
          conductoresData.push({ 
            id: doc.id, 
            nombre: data.name || data.nombre || 'Conductor',
            email: data.email || '',
            rol: 'driver',
            estado: data.status || 'activo',
            telefono: data.phone || data.telefono || '',
            ciudad: data.city || data.ciudad || 'Sin especificar',
            fechaRegistro: data.createdAt ? new Date(data.createdAt.toDate()) : new Date(),
            billetera: data.billetera || { balance: 0, totalGastado: 0, totalGanado: 0 },
            verificaciones: data.verificaciones || { email: false, telefono: false, documento: false },
            preferencias: data.preferencias || { idioma: 'Español', notificaciones: true, tema: 'Oscuro' },
            vehiculo: data.vehiculo || { placa: '', marca: '', modelo: '', color: '', tipo: '' },
            documentos: data.documentos || { licencia: 'Pendiente', soat: 'Pendiente', tecnomecanica: 'Pendiente' },
            estadisticas: data.estadisticas || { viajesCompletados: 0, calificacionPromedio: 0, kilometrosRecorridos: 0 }
          } as Conductor);
        }
      });
      setConductores(conductoresData);
    } catch (error) {
      console.error('Error cargando conductores:', error);
      // Si hay error, usar datos de ejemplo
      setConductores([
        {
          id: '3',
          nombre: 'Carlos Ruiz',
          email: 'carlos@email.com',
          rol: 'driver',
          estado: 'activo',
          telefono: '3201234567',
          ciudad: 'Medellín',
          fechaRegistro: new Date('2024-01-10'),
          preferencias: {
            idioma: 'Español',
            notificaciones: true,
            tema: 'Oscuro',
          },
          billetera: {
            balance: 250000,
            totalGastado: 0,
            totalGanado: 1200000,
          },
          banco: {
            nombre: 'BBVA',
            tipoCuenta: 'Corriente',
            numeroCuenta: '0987654321',
          },
          verificaciones: {
            email: true,
            telefono: true,
            documento: true,
          },
          vehiculo: {
            placa: 'ABC123',
            marca: 'Toyota',
            modelo: 'Corolla',
            color: 'Blanco',
            tipo: 'Automóvil',
          },
          documentos: {
            licencia: 'Vigente',
            soat: 'Vigente',
            tecnomecanica: 'Vigente',
          },
          estadisticas: {
            viajesCompletados: 45,
            calificacionPromedio: 4.8,
            kilometrosRecorridos: 2500,
          },
        },
        {
          id: '4',
          nombre: 'María López',
          email: 'maria@email.com',
          rol: 'driver',
          estado: 'activo',
          telefono: '3159876543',
          ciudad: 'Bogotá',
          fechaRegistro: new Date('2024-02-05'),
          preferencias: {
            idioma: 'Español',
            notificaciones: true,
            tema: 'Oscuro',
          },
          billetera: {
            balance: 180000,
            totalGastado: 0,
            totalGanado: 980000,
          },
          verificaciones: {
            email: true,
            telefono: true,
            documento: true,
          },
          vehiculo: {
            placa: 'XYZ789',
            marca: 'Honda',
            modelo: 'Civic',
            color: 'Negro',
            tipo: 'Automóvil',
          },
          documentos: {
            licencia: 'Vigente',
            soat: 'Vigente',
            tecnomecanica: 'Vigente',
          },
          estadisticas: {
            viajesCompletados: 32,
            calificacionPromedio: 4.9,
            kilometrosRecorridos: 1800,
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: Usuario | Conductor) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;

    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, 'users', userId));
      
      setUsuarios(usuarios.filter(u => u.id !== userId));
      setConductores(conductores.filter(c => c.id !== userId));
      
      alert('Usuario eliminado exitosamente.');
    } catch (error: any) {
      console.error('Error eliminando usuario:', error);
      alert('Error al eliminar el usuario: ' + error.message);
    }
  };

  const filteredUsuarios = usuarios.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.telefono.includes(searchTerm) ||
    (user as any).cedula?.includes(searchTerm)
  );

  const filteredConductores = conductores.filter(conductor =>
    conductor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conductor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conductor.telefono.includes(searchTerm) ||
    conductor.vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conductor as any).cedula?.includes(searchTerm)
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const exportUsuarios = () => {
    const csvContent = [
      ['Nombre', 'Email', 'Teléfono', 'Ciudad', 'Rol', 'Estado', 'Balance'],
      ...usuarios.map(user => [
        user.nombre,
        user.email,
        user.telefono,
        user.ciudad,
        user.rol,
        user.estado,
        formatCurrency(user.billetera.balance)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportConductores = () => {
    const csvContent = [
      ['Nombre', 'Email', 'Teléfono', 'Ciudad', 'Placa', 'Marca', 'Modelo', 'Viajes Completados', 'Calificación'],
      ...conductores.map(conductor => [
        conductor.nombre,
        conductor.email,
        conductor.telefono,
        conductor.ciudad,
        conductor.vehiculo.placa,
        conductor.vehiculo.marca,
        conductor.vehiculo.modelo,
        conductor.estadisticas.viajesCompletados.toString(),
        conductor.estadisticas.calificacionPromedio.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conductores.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-white mt-4">Cargando usuarios...</p>
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
            <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
            <p className="text-slate-400 mt-1">Administra usuarios y conductores de la plataforma</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium">Administrador</p>
              <p className="text-slate-400 text-sm">admin@viajemos.com</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

  <div className="p-8">
        {/* Controles */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={activeTab === 'usuarios' ? exportUsuarios : exportConductores}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
          >
            <Download className="w-5 h-5" />
            Exportar {activeTab === 'usuarios' ? 'Usuarios' : 'Conductores'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 mb-8">
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`py-3 px-6 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'usuarios'
                ? 'border-b-2 border-blue-400 text-blue-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <User className="w-5 h-5" />
            Usuarios ({usuarios.length})
          </button>
          <button
            onClick={() => setActiveTab('conductores')}
            className={`py-3 px-6 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'conductores'
                ? 'border-b-2 border-emerald-400 text-emerald-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Car className="w-5 h-5" />
            Conductores ({conductores.length})
          </button>
        </div>

        {activeTab === 'usuarios' && (
          <div className="bg-slate-800/80 rounded-xl shadow-xl overflow-hidden border border-slate-700/50">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-900/80">
                  <tr className="text-white/80 text-left">
                    <th className="py-4 px-6">Usuario</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Teléfono</th>
                    <th className="py-4 px-6">Billetera</th>
                    <th className="py-4 px-6">Verificaciones</th>
                    <th className="py-4 px-6">Estado</th>
                    <th className="py-4 px-6">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredUsuarios.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No hay usuarios registrados</p>
                        <p className="text-sm mt-2">Los usuarios aparecerán aquí cuando se registren</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsuarios.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-700/40 transition">
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-white font-medium">{user.nombre}</p>
                            <p className="text-slate-400 text-sm">{user.ciudad}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-white/80">{user.email}</td>
                        <td className="py-4 px-6 text-white/80">{user.telefono}</td>
                        <td className="py-4 px-6">
                          <span className="text-emerald-400 font-semibold">
                            {formatCurrency(user.billetera.balance)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-1">
                            {user.verificaciones.email && (
                              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                            )}
                            {user.verificaciones.telefono && (
                              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                            )}
                            {user.verificaciones.documento && (
                              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.estado === 'activo' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : user.estado === 'pendiente'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {user.estado.charAt(0).toUpperCase() + user.estado.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-yellow-400 hover:bg-yellow-400/20 rounded-lg transition">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'conductores' && (
          <div className="bg-slate-800/80 rounded-xl shadow-xl overflow-hidden border border-slate-700/50">
    <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-900/80">
          <tr className="text-white/80 text-left">
                    <th className="py-4 px-6">Conductor</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Vehículo</th>
                    <th className="py-4 px-6">Documentos</th>
                    <th className="py-4 px-6">Estadísticas</th>
                    <th className="py-4 px-6">Estado</th>
                    <th className="py-4 px-6">Acciones</th>
          </tr>
        </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredConductores.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No hay conductores registrados</p>
                        <p className="text-sm mt-2">Los conductores aparecerán aquí cuando se registren</p>
                      </td>
                    </tr>
                  ) : (
                    filteredConductores.map((conductor) => (
                      <tr key={conductor.id} className="hover:bg-slate-700/40 transition">
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-white font-medium">{conductor.nombre}</p>
                            <p className="text-slate-400 text-sm">{conductor.ciudad}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-white/80">{conductor.email}</td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-white font-medium">{conductor.vehiculo.placa}</p>
                            <p className="text-slate-400 text-sm">{conductor.vehiculo.marca} {conductor.vehiculo.modelo}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-1">
                            {conductor.documentos.licencia === 'Vigente' && (
                              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                            )}
                            {conductor.documentos.soat === 'Vigente' && (
                              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                            )}
                            {conductor.documentos.tecnomecanica === 'Vigente' && (
                              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-white text-sm">{conductor.estadisticas.viajesCompletados} viajes</p>
                            <p className="text-emerald-400 text-sm">⭐ {conductor.estadisticas.calificacionPromedio}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            conductor.estado === 'activo' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : conductor.estado === 'pendiente'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {conductor.estado.charAt(0).toUpperCase() + conductor.estado.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditUser(conductor)}
                              className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-yellow-400 hover:bg-yellow-400/20 rounded-lg transition">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(conductor.id)}
                              className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
              </td>
            </tr>
                    ))
                  )}
        </tbody>
      </table>
    </div>
          </div>
        )}
      </div>

      {/* Modal de detalles del usuario */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Detalles del Usuario</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Información Personal</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-400 text-sm">Nombre</p>
                      <p className="text-white">{selectedUser.nombre}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Email</p>
                      <p className="text-white">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Teléfono</p>
                      <p className="text-white">{selectedUser.telefono}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Ciudad</p>
                      <p className="text-white">{selectedUser.ciudad}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Información Financiera</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-400 text-sm">Balance Actual</p>
                      <p className="text-emerald-400 font-semibold">{formatCurrency(selectedUser.billetera.balance)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Total Gastado</p>
                      <p className="text-white">{formatCurrency(selectedUser.billetera.totalGastado)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Total Ganado</p>
                      <p className="text-white">{formatCurrency(selectedUser.billetera.totalGanado)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedUser.rol === 'driver' && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Información del Vehículo</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-slate-400 text-sm">Placa</p>
                      <p className="text-white">{(selectedUser as Conductor).vehiculo.placa}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Marca y Modelo</p>
                      <p className="text-white">{(selectedUser as Conductor).vehiculo.marca} {(selectedUser as Conductor).vehiculo.modelo}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Color</p>
                      <p className="text-white">{(selectedUser as Conductor).vehiculo.color}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Tipo</p>
                      <p className="text-white">{(selectedUser as Conductor).vehiculo.tipo}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 bg-slate-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  </div>
);
};

export default AdminUsuarios; 