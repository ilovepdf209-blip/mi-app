import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import app from '../firebase';
import { Search, Download, Eye, Edit, Trash2, Plus, Route, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/validations';

interface Viaje {
  id: string;
  origen: string;
  destino: string;
  fecha: Date;
  precio: number;
  asientosDisponibles: number;
  asientosTotales: number;
  conductor: string;
  empresa: string;
  estado: 'programado' | 'en_curso' | 'completado' | 'cancelado';
  pasajeros: string[];
  descripcion: string;
}

const AdminViajes: React.FC = () => {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedViaje, setSelectedViaje] = useState<Viaje | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadViajes();
  }, []);

  const loadViajes = async () => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      const viajesSnapshot = await getDocs(collection(db, 'viajes'));
      const viajesData: Viaje[] = [];
      
      viajesSnapshot.forEach((doc) => {
        const data = doc.data();
        viajesData.push({
          id: doc.id,
          origen: data.origen || 'Origen no especificado',
          destino: data.destino || 'Destino no especificado',
          fecha: data.fecha ? new Date(data.fecha.toDate()) : new Date(),
          precio: data.precio || 0,
          asientosDisponibles: data.asientosDisponibles || 0,
          asientosTotales: data.asientosTotales || 0,
          conductor: data.conductor || 'Conductor no asignado',
          empresa: data.empresa || 'Empresa no especificada',
          estado: data.estado || 'programado',
          pasajeros: data.pasajeros || [],
          descripcion: data.descripcion || 'Sin descripción',
        });
      });
      
      setViajes(viajesData);
    } catch (error) {
      console.error('Error cargando viajes:', error);
      // Datos de ejemplo si falla la carga
      setViajes([
        {
          id: '1',
          origen: 'Bogotá, Colombia',
          destino: 'Medellín, Colombia',
          fecha: new Date('2024-12-15T08:00:00'),
          precio: 85000,
          asientosDisponibles: 3,
          asientosTotales: 4,
          conductor: 'Carlos Mendoza',
          empresa: 'Transporte Rápido S.A.',
          estado: 'programado',
          pasajeros: ['Juan Pérez', 'María García'],
          descripcion: 'Viaje directo con parada en La Dorada',
        },
        {
          id: '2',
          origen: 'Cali, Colombia',
          destino: 'Bogotá, Colombia',
          fecha: new Date('2024-12-16T14:30:00'),
          precio: 95000,
          asientosDisponibles: 1,
          asientosTotales: 4,
          conductor: 'Ana Rodríguez',
          empresa: 'Viajes Seguros Ltda.',
          estado: 'en_curso',
          pasajeros: ['Pedro López', 'Laura Martínez', 'Carlos Ruiz'],
          descripcion: 'Viaje con aire acondicionado y WiFi',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditViaje = (viaje: Viaje) => {
    setSelectedViaje(viaje);
    setShowModal(true);
  };

  const handleDeleteViaje = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este viaje?')) {
      try {
        const db = getFirestore(app);
        await deleteDoc(doc(db, 'viajes', id));
        setViajes(viajes.filter(v => v.id !== id));
      } catch (error) {
        console.error('Error eliminando viaje:', error);
        alert('Error al eliminar el viaje');
      }
    }
  };

  const filteredViajes = viajes.filter(viaje =>
    viaje.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    viaje.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
    viaje.conductor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportViajes = () => {
    const headers = ['Origen', 'Destino', 'Fecha', 'Precio', 'Asientos Disponibles', 'Conductor', 'Empresa', 'Estado', 'Pasajeros', 'Descripción'];
    const csvContent = [
      headers.join(','),
      ...filteredViajes.map(v => [
        v.origen,
        v.destino,
        formatDate(v.fecha),
        formatCurrency(v.precio),
        v.asientosDisponibles,
        v.conductor,
        v.empresa,
        v.estado,
        v.pasajeros.join('; '),
        v.descripcion
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'viajes.csv');
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
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Viajes</h1>
        <p className="text-slate-400">Administra viajes y rutas en la plataforma</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Viajes</p>
              <p className="text-2xl font-bold text-white">{viajes.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Route className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Viajes Activos</p>
              <p className="text-2xl font-bold text-white">{viajes.filter(v => v.estado === 'en_curso').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Pasajeros</p>
              <p className="text-2xl font-bold text-white">{viajes.reduce((sum, v) => sum + v.pasajeros.length, 0)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Ingresos Totales</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(viajes.reduce((sum, v) => sum + (v.precio * (v.asientosTotales - v.asientosDisponibles)), 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-400" />
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
            placeholder="Buscar viaje..."
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
          Crear Viaje
        </button>
        <button
          onClick={exportViajes}
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
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Ruta</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Fecha</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Precio</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Asientos</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Conductor</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Empresa</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Estado</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredViajes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                    No hay viajes registrados
                  </td>
                </tr>
              ) : (
                filteredViajes.map((viaje) => (
                  <tr key={viaje.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-400" />
                          <p className="text-white font-medium">{viaje.origen}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4 text-red-400" />
                          <p className="text-slate-400">{viaje.destino}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{formatDate(viaje.fecha)}</p>
                      <p className="text-slate-400 text-sm">{viaje.fecha.toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{formatCurrency(viaje.precio)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white">{viaje.asientosDisponibles}/{viaje.asientosTotales}</p>
                        <div className="w-full bg-slate-600 rounded-full h-2 mt-1">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(viaje.asientosDisponibles / viaje.asientosTotales) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{viaje.conductor}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-400">{viaje.empresa}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        viaje.estado === 'programado' 
                          ? 'bg-blue-500/20 text-blue-400'
                          : viaje.estado === 'en_curso'
                          ? 'bg-green-500/20 text-green-400'
                          : viaje.estado === 'completado'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {viaje.estado.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditViaje(viaje)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditViaje(viaje)}
                          className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteViaje(viaje.id)}
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
              {selectedViaje ? 'Editar Viaje' : 'Crear Nuevo Viaje'}
            </h2>
            <p className="text-slate-400 mb-6">
              {selectedViaje ? 'Modifica la información del viaje' : 'Completa la información del nuevo viaje'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Origen</label>
                <input
                  type="text"
                  defaultValue={selectedViaje?.origen || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Destino</label>
                <input
                  type="text"
                  defaultValue={selectedViaje?.destino || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Fecha</label>
                <input
                  type="datetime-local"
                  defaultValue={selectedViaje?.fecha.toISOString().slice(0, 16) || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Precio</label>
                <input
                  type="number"
                  defaultValue={selectedViaje?.precio || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Asientos Totales</label>
                <input
                  type="number"
                  defaultValue={selectedViaje?.asientosTotales || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Estado</label>
                <select
                  defaultValue={selectedViaje?.estado || 'programado'}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="programado">Programado</option>
                  <option value="en_curso">En Curso</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-medium mb-2">Descripción</label>
              <textarea
                defaultValue={selectedViaje?.descripcion || ''}
                rows={3}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 text-slate-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                {selectedViaje ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminViajes; 