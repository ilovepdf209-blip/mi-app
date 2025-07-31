import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import app from '../firebase';
import { Search, Download, Eye, Edit, Trash2, Plus, Truck, Car, Calendar, Building2, User, Filter } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/validations';

interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  año: number;
  tipo: 'sedan' | 'suv' | 'van' | 'camioneta' | 'bus' | 'moto';
  color: string;
  conductor: string;
  empresa: string;
  estado: 'activo' | 'mantenimiento' | 'inactivo';
  fechaRegistro: Date;
  capacidad: number;
  combustible: string;
  kilometraje: number;
  documentos: string[];
}

const AdminVehiculos: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  useEffect(() => {
    loadVehiculos();
  }, []);

  const loadVehiculos = async () => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      const vehiculosSnapshot = await getDocs(collection(db, 'vehiculos'));
      const vehiculosData: Vehiculo[] = [];
      
      vehiculosSnapshot.forEach((doc) => {
        const data = doc.data();
        vehiculosData.push({
          id: doc.id,
          placa: data.placa || 'Sin placa',
          marca: data.marca || 'Sin marca',
          modelo: data.modelo || 'Sin modelo',
          año: data.año || data.anio || 2020,
          tipo: data.tipo || 'sedan',
          color: data.color || 'Sin color',
          conductor: data.conductor || 'Sin conductor',
          empresa: data.empresa || 'Sin empresa',
          estado: data.estado || 'activo',
          fechaRegistro: data.createdAt ? new Date(data.createdAt.toDate()) : new Date(),
          capacidad: data.capacidad || 4,
          combustible: data.combustible || 'Gasolina',
          kilometraje: data.kilometraje || 0,
          documentos: data.documentos || [],
        });
      });
      
      setVehiculos(vehiculosData);
    } catch (error) {
      console.error('Error cargando vehículos:', error);
      // Datos de ejemplo si falla la carga
      setVehiculos([
        {
          id: '1',
          placa: 'ABC123',
          marca: 'Toyota',
          modelo: 'Corolla',
          año: 2020,
          tipo: 'sedan',
          color: 'Blanco',
          conductor: 'Carlos Mendoza',
          empresa: 'Transporte Rápido S.A.',
          estado: 'activo',
          fechaRegistro: new Date('2024-01-15'),
          capacidad: 4,
          combustible: 'Gasolina',
          kilometraje: 45000,
          documentos: ['SOAT', 'Técnico-mecánica', 'Seguro'],
        },
        {
          id: '2',
          placa: 'XYZ789',
          marca: 'Honda',
          modelo: 'Civic',
          año: 2019,
          tipo: 'sedan',
          color: 'Negro',
          conductor: 'Ana Rodríguez',
          empresa: 'Viajes Seguros Ltda.',
          estado: 'activo',
          fechaRegistro: new Date('2024-02-20'),
          capacidad: 4,
          combustible: 'Gasolina',
          kilometraje: 32000,
          documentos: ['SOAT', 'Técnico-mecánica'],
        },
        {
          id: '3',
          placa: 'DEF456',
          marca: 'Ford',
          modelo: 'Transit',
          año: 2021,
          tipo: 'van',
          color: 'Azul',
          conductor: 'Pedro López',
          empresa: 'Transporte Rápido S.A.',
          estado: 'mantenimiento',
          fechaRegistro: new Date('2024-03-10'),
          capacidad: 12,
          combustible: 'Diesel',
          kilometraje: 28000,
          documentos: ['SOAT', 'Técnico-mecánica', 'Seguro'],
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditVehiculo = (vehiculo: Vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setShowModal(true);
  };

  const handleDeleteVehiculo = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      try {
        const db = getFirestore(app);
        await deleteDoc(doc(db, 'vehiculos', id));
        setVehiculos(vehiculos.filter(v => v.id !== id));
      } catch (error) {
        console.error('Error eliminando vehículo:', error);
        alert('Error al eliminar el vehículo');
      }
    }
  };

  const filteredVehiculos = vehiculos.filter(vehiculo => {
    const matchesSearch = 
      vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.conductor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.empresa.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = filterTipo === 'todos' || vehiculo.tipo === filterTipo;
    const matchesEstado = filterEstado === 'todos' || vehiculo.estado === filterEstado;
    
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const exportVehiculos = () => {
    const headers = ['Placa', 'Marca', 'Modelo', 'Año', 'Tipo', 'Color', 'Conductor', 'Empresa', 'Estado', 'Capacidad', 'Combustible', 'Kilometraje', 'Fecha Registro'];
    const csvContent = [
      headers.join(','),
      ...filteredVehiculos.map(v => [
        v.placa,
        v.marca,
        v.modelo,
        v.año,
        v.tipo,
        v.color,
        v.conductor,
        v.empresa,
        v.estado,
        v.capacidad,
        v.combustible,
        v.kilometraje,
        formatDate(v.fechaRegistro)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'vehiculos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'sedan':
      case 'suv':
        return <Car className="w-4 h-4" />;
      case 'van':
      case 'camioneta':
      case 'bus':
        return <Truck className="w-4 h-4" />;
      default:
        return <Car className="w-4 h-4" />;
    }
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
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Vehículos</h1>
        <p className="text-slate-400">Administra la flota de vehículos de la plataforma</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Vehículos</p>
              <p className="text-2xl font-bold text-white">{vehiculos.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Vehículos Activos</p>
              <p className="text-2xl font-bold text-white">{vehiculos.filter(v => v.estado === 'activo').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">En Mantenimiento</p>
              <p className="text-2xl font-bold text-white">{vehiculos.filter(v => v.estado === 'mantenimiento').length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Capacidad Total</p>
              <p className="text-2xl font-bold text-white">{vehiculos.reduce((sum, v) => sum + v.capacidad, 0)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por placa, marca, modelo, conductor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="todos">Todos los tipos</option>
          <option value="sedan">Sedán</option>
          <option value="suv">SUV</option>
          <option value="van">Van</option>
          <option value="camioneta">Camioneta</option>
          <option value="bus">Bus</option>
          <option value="moto">Moto</option>
        </select>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="mantenimiento">Mantenimiento</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Agregar Vehículo
        </button>
        <button
          onClick={exportVehiculos}
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
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Vehículo</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Placa</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Conductor</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Empresa</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Capacidad</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Kilometraje</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Estado</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredVehiculos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                    No hay vehículos registrados
                  </td>
                </tr>
              ) : (
                filteredVehiculos.map((vehiculo) => (
                  <tr key={vehiculo.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center">
                          {getTipoIcon(vehiculo.tipo)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{vehiculo.marca} {vehiculo.modelo}</p>
                          <p className="text-slate-400 text-sm">{vehiculo.año} • {vehiculo.color}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-700/50 rounded-lg text-white font-mono text-sm">
                        {vehiculo.placa}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <p className="text-white">{vehiculo.conductor}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-green-400" />
                        <p className="text-slate-400">{vehiculo.empresa}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-400" />
                        <p className="text-white">{vehiculo.capacidad} pasajeros</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{vehiculo.kilometraje.toLocaleString()} km</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        vehiculo.estado === 'activo' 
                          ? 'bg-green-500/20 text-green-400'
                          : vehiculo.estado === 'mantenimiento'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {vehiculo.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditVehiculo(vehiculo)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditVehiculo(vehiculo)}
                          className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehiculo(vehiculo.id)}
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
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedVehiculo ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
            </h2>
            <p className="text-slate-400 mb-6">
              {selectedVehiculo ? 'Modifica la información del vehículo' : 'Completa la información del nuevo vehículo'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Placa</label>
                <input
                  type="text"
                  defaultValue={selectedVehiculo?.placa || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Marca</label>
                <input
                  type="text"
                  defaultValue={selectedVehiculo?.marca || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Modelo</label>
                <input
                  type="text"
                  defaultValue={selectedVehiculo?.modelo || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Año</label>
                <input
                  type="number"
                  defaultValue={selectedVehiculo?.año || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Tipo</label>
                <select
                  defaultValue={selectedVehiculo?.tipo || 'sedan'}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="sedan">Sedán</option>
                  <option value="suv">SUV</option>
                  <option value="van">Van</option>
                  <option value="camioneta">Camioneta</option>
                  <option value="bus">Bus</option>
                  <option value="moto">Moto</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Color</label>
                <input
                  type="text"
                  defaultValue={selectedVehiculo?.color || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Conductor</label>
                <input
                  type="text"
                  defaultValue={selectedVehiculo?.conductor || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Empresa</label>
                <input
                  type="text"
                  defaultValue={selectedVehiculo?.empresa || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Capacidad</label>
                <input
                  type="number"
                  defaultValue={selectedVehiculo?.capacidad || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Combustible</label>
                <select
                  defaultValue={selectedVehiculo?.combustible || 'Gasolina'}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Eléctrico">Eléctrico</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Kilometraje</label>
                <input
                  type="number"
                  defaultValue={selectedVehiculo?.kilometraje || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Estado</label>
                <select
                  defaultValue={selectedVehiculo?.estado || 'activo'}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="activo">Activo</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="inactivo">Inactivo</option>
                </select>
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
                {selectedVehiculo ? 'Actualizar' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVehiculos; 