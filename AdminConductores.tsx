import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import app from '../firebase';
import { Search, Download, Eye, Edit, Trash2, Plus, Car, User, Phone, Mail, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/validations';

interface Conductor {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  cedula: string;
  licencia: string;
  vehiculo: string;
  empresa: string;
  estado: 'activo' | 'inactivo' | 'suspendido';
  fechaRegistro: Date;
  viajesCompletados: number;
  calificacion: number;
  saldo: number;
}

const AdminConductores: React.FC = () => {
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConductor, setSelectedConductor] = useState<Conductor | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadConductores();
  }, []);

  const loadConductores = async () => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      const conductoresSnapshot = await getDocs(collection(db, 'conductores'));
      const conductoresData: Conductor[] = [];
      
      conductoresSnapshot.forEach((doc) => {
        const data = doc.data();
        conductoresData.push({
          id: doc.id,
          nombre: data.nombre || data.name || 'Conductor',
          email: data.email || 'sin@email.com',
          telefono: data.telefono || data.phone || 'Sin teléfono',
          cedula: data.cedula || 'Sin cédula',
          licencia: data.licencia || 'Sin licencia',
          vehiculo: data.vehiculo || data.car || 'Sin vehículo',
          empresa: data.empresa || 'Independiente',
          estado: data.estado || 'activo',
          fechaRegistro: data.createdAt ? new Date(data.createdAt.toDate()) : new Date(),
          viajesCompletados: data.viajesCompletados || 0,
          calificacion: data.calificacion || 0,
          saldo: data.saldo || 0,
        });
      });
      
      setConductores(conductoresData);
    } catch (error) {
      console.error('Error cargando conductores:', error);
      // Datos de ejemplo si falla la carga
      setConductores([
        {
          id: '1',
          nombre: 'Carlos Mendoza',
          email: 'carlos.mendoza@email.com',
          telefono: '+57 300 123 4567',
          cedula: '79.123.456',
          licencia: 'C1-123456',
          vehiculo: 'Toyota Corolla 2020',
          empresa: 'Transporte Rápido S.A.',
          estado: 'activo',
          fechaRegistro: new Date('2024-01-15'),
          viajesCompletados: 45,
          calificacion: 4.8,
          saldo: 1250000,
        },
        {
          id: '2',
          nombre: 'Ana Rodríguez',
          email: 'ana.rodriguez@email.com',
          telefono: '+57 310 987 6543',
          cedula: '52.987.654',
          licencia: 'C1-654321',
          vehiculo: 'Honda Civic 2019',
          empresa: 'Viajes Seguros Ltda.',
          estado: 'activo',
          fechaRegistro: new Date('2024-02-20'),
          viajesCompletados: 32,
          calificacion: 4.9,
          saldo: 890000,
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditConductor = (conductor: Conductor) => {
    setSelectedConductor(conductor);
    setShowModal(true);
  };

  const handleDeleteConductor = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este conductor?')) {
      try {
        const db = getFirestore(app);
        await deleteDoc(doc(db, 'conductores', id));
        setConductores(conductores.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error eliminando conductor:', error);
        alert('Error al eliminar el conductor');
      }
    }
  };

  const filteredConductores = conductores.filter(conductor =>
    conductor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conductor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conductor.cedula.includes(searchTerm) ||
    conductor.telefono.includes(searchTerm) ||
    conductor.licencia.includes(searchTerm) ||
    conductor.vehiculo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportConductores = () => {
    const headers = ['Nombre', 'Email', 'Teléfono', 'Cédula', 'Licencia', 'Vehículo', 'Empresa', 'Estado', 'Viajes Completados', 'Calificación', 'Saldo', 'Fecha Registro'];
    const csvContent = [
      headers.join(','),
      ...filteredConductores.map(c => [
        c.nombre,
        c.email,
        c.telefono,
        c.cedula,
        c.licencia,
        c.vehiculo,
        c.empresa,
        c.estado,
        c.viajesCompletados,
        c.calificacion,
        formatCurrency(c.saldo),
        formatDate(c.fechaRegistro)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'conductores.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Conductores</h1>
        <p className="text-slate-400">Administra conductores y sus vehículos en la plataforma</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Conductores</p>
              <p className="text-2xl font-bold text-white">{conductores.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Conductores Activos</p>
              <p className="text-2xl font-bold text-white">{conductores.filter(c => c.estado === 'activo').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Viajes</p>
              <p className="text-2xl font-bold text-white">{conductores.reduce((sum, c) => sum + c.viajesCompletados, 0)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Calificación Promedio</p>
              <p className="text-2xl font-bold text-white">
                {(conductores.reduce((sum, c) => sum + c.calificacion, 0) / conductores.length || 0).toFixed(1)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <span className="text-yellow-400 text-lg">★</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar conductor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Agregar Conductor
        </button>
        <button
          onClick={exportConductores}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200"
        >
          <Download className="w-5 h-5" />
          Exportar
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Conductor</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Contacto</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Vehículo</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Empresa</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Viajes</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Calificación</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Estado</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredConductores.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                    No hay conductores registrados
                  </td>
                </tr>
              ) : (
                filteredConductores.map((conductor) => (
                  <tr key={conductor.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{conductor.nombre}</p>
                        <p className="text-slate-400 text-sm">{conductor.cedula}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white">{conductor.email}</p>
                        <p className="text-slate-400 text-sm">{conductor.telefono}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white">{conductor.vehiculo}</p>
                        <p className="text-slate-400 text-sm">{conductor.licencia}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{conductor.empresa}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{conductor.viajesCompletados}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-white">{conductor.calificacion}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        conductor.estado === 'activo' 
                          ? 'bg-green-500/20 text-green-400' 
                          : conductor.estado === 'suspendido'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {conductor.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditConductor(conductor)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditConductor(conductor)}
                          className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteConductor(conductor.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl mx-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedConductor ? 'Editar Conductor' : 'Agregar Conductor'}
            </h2>
            <p className="text-slate-400 mb-6">
              {selectedConductor ? 'Modifica la información del conductor' : 'Completa la información del nuevo conductor'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Nombre Completo</label>
                <input
                  type="text"
                  defaultValue={selectedConductor?.nombre || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={selectedConductor?.email || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Teléfono</label>
                <input
                  type="tel"
                  defaultValue={selectedConductor?.telefono || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Cédula</label>
                <input
                  type="text"
                  defaultValue={selectedConductor?.cedula || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Licencia</label>
                <input
                  type="text"
                  defaultValue={selectedConductor?.licencia || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Vehículo</label>
                <input
                  type="text"
                  defaultValue={selectedConductor?.vehiculo || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 text-slate-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                {selectedConductor ? 'Actualizar' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConductores; 