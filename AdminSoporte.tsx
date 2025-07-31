import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import app from '../firebase';
import { Search, Download, Eye, Edit, Trash2, Plus, HelpCircle, MessageCircle, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { formatDate } from '../utils/validations';

interface Ticket {
  id: string;
  numero: string;
  usuario: string;
  email: string;
  asunto: string;
  descripcion: string;
  categoria: 'tecnico' | 'facturacion' | 'viaje' | 'cuenta' | 'general';
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  estado: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';
  fechaCreacion: Date;
  fechaActualizacion: Date;
  agente: string;
  respuesta: string;
}

const AdminSoporte: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [filterPrioridad, setFilterPrioridad] = useState<string>('todos');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      const ticketsSnapshot = await getDocs(collection(db, 'tickets'));
      const ticketsData: Ticket[] = [];
      
      ticketsSnapshot.forEach((doc) => {
        const data = doc.data();
        ticketsData.push({
          id: doc.id,
          numero: data.numero || 'TKT-001',
          usuario: data.usuario || data.user || 'Usuario no especificado',
          email: data.email || 'sin@email.com',
          asunto: data.asunto || data.subject || 'Sin asunto',
          descripcion: data.descripcion || data.description || 'Sin descripción',
          categoria: data.categoria || data.category || 'general',
          prioridad: data.prioridad || data.priority || 'media',
          estado: data.estado || data.status || 'abierto',
          fechaCreacion: data.fechaCreacion ? new Date(data.fechaCreacion.toDate()) : new Date(),
          fechaActualizacion: data.fechaActualizacion ? new Date(data.fechaActualizacion.toDate()) : new Date(),
          agente: data.agente || data.agent || 'Sin asignar',
          respuesta: data.respuesta || data.response || '',
        });
      });
      
      setTickets(ticketsData);
    } catch (error) {
      console.error('Error cargando tickets:', error);
      // Datos de ejemplo si falla la carga
      setTickets([
        {
          id: '1',
          numero: 'TKT-2024-001',
          usuario: 'Juan Pérez',
          email: 'juan.perez@email.com',
          asunto: 'Problema con el pago de factura',
          descripcion: 'No puedo realizar el pago de mi factura mensual. El sistema me muestra un error.',
          categoria: 'facturacion',
          prioridad: 'alta',
          estado: 'en_proceso',
          fechaCreacion: new Date('2024-12-10'),
          fechaActualizacion: new Date('2024-12-11'),
          agente: 'Soporte Técnico',
          respuesta: 'Hemos identificado el problema. Se está trabajando en la solución.',
        },
        {
          id: '2',
          numero: 'TKT-2024-002',
          usuario: 'María García',
          email: 'maria.garcia@email.com',
          asunto: 'Cancelación de viaje',
          descripcion: 'Necesito cancelar un viaje programado para mañana.',
          categoria: 'viaje',
          prioridad: 'urgente',
          estado: 'abierto',
          fechaCreacion: new Date('2024-12-12'),
          fechaActualizacion: new Date('2024-12-12'),
          agente: 'Sin asignar',
          respuesta: '',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleDeleteTicket = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ticket?')) {
      try {
        const db = getFirestore(app);
        await deleteDoc(doc(db, 'tickets', id));
        setTickets(tickets.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error eliminando ticket:', error);
        alert('Error al eliminar el ticket');
      }
    }
  };

  const handleUpdateEstado = async (id: string, nuevoEstado: string) => {
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, 'tickets', id), {
        estado: nuevoEstado,
        fechaActualizacion: new Date()
      });
      setTickets(tickets.map(t => 
        t.id === id 
          ? { ...t, estado: nuevoEstado as any, fechaActualizacion: new Date() }
          : t
      ));
    } catch (error) {
      console.error('Error actualizando ticket:', error);
      alert('Error al actualizar el ticket');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.asunto.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = filterEstado === 'todos' || ticket.estado === filterEstado;
    const matchesPrioridad = filterPrioridad === 'todos' || ticket.prioridad === filterPrioridad;
    
    return matchesSearch && matchesEstado && matchesPrioridad;
  });

  const exportTickets = () => {
    const headers = ['Número', 'Usuario', 'Email', 'Asunto', 'Categoría', 'Prioridad', 'Estado', 'Agente', 'Fecha Creación', 'Respuesta'];
    const csvContent = [
      headers.join(','),
      ...filteredTickets.map(t => [
        t.numero,
        t.usuario,
        t.email,
        t.asunto,
        t.categoria,
        t.prioridad,
        t.estado,
        t.agente,
        formatDate(t.fechaCreacion),
        t.respuesta
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'tickets_soporte.csv');
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
        <h1 className="text-3xl font-bold text-white mb-2">Centro de Soporte</h1>
        <p className="text-slate-400">Gestiona tickets de soporte y atención al cliente</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Tickets</p>
              <p className="text-2xl font-bold text-white">{tickets.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Tickets Abiertos</p>
              <p className="text-2xl font-bold text-white">{tickets.filter(t => t.estado === 'abierto').length}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">En Proceso</p>
              <p className="text-2xl font-bold text-white">{tickets.filter(t => t.estado === 'en_proceso').length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Resueltos</p>
              <p className="text-2xl font-bold text-white">{tickets.filter(t => t.estado === 'resuelto').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
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
            placeholder="Buscar ticket..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="todos">Todos los estados</option>
          <option value="abierto">Abierto</option>
          <option value="en_proceso">En Proceso</option>
          <option value="resuelto">Resuelto</option>
          <option value="cerrado">Cerrado</option>
        </select>
        <select
          value={filterPrioridad}
          onChange={(e) => setFilterPrioridad(e.target.value)}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="todos">Todas las prioridades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="urgente">Urgente</option>
        </select>
        <button
          onClick={exportTickets}
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
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Número</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Usuario</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Asunto</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Categoría</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Prioridad</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Estado</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Agente</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Fecha</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-400">
                    No hay tickets registrados
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{ticket.numero}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white">{ticket.usuario}</p>
                        <p className="text-slate-400 text-sm">{ticket.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{ticket.asunto}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.categoria === 'tecnico' 
                          ? 'bg-blue-500/20 text-blue-400'
                          : ticket.categoria === 'facturacion'
                          ? 'bg-green-500/20 text-green-400'
                          : ticket.categoria === 'viaje'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {ticket.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.prioridad === 'urgente' 
                          ? 'bg-red-500/20 text-red-400'
                          : ticket.prioridad === 'alta'
                          ? 'bg-orange-500/20 text-orange-400'
                          : ticket.prioridad === 'media'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {ticket.prioridad}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.estado === 'abierto' 
                          ? 'bg-red-500/20 text-red-400'
                          : ticket.estado === 'en_proceso'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : ticket.estado === 'resuelto'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {ticket.estado.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-400">{ticket.agente}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{formatDate(ticket.fechaCreacion)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditTicket(ticket)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditTicket(ticket)}
                          className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTicket(ticket.id)}
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
              {selectedTicket ? 'Ver/Editar Ticket' : 'Crear Nuevo Ticket'}
            </h2>
            <p className="text-slate-400 mb-6">
              {selectedTicket ? 'Revisa y modifica la información del ticket' : 'Completa la información del nuevo ticket'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Número de Ticket</label>
                <input
                  type="text"
                  defaultValue={selectedTicket?.numero || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Usuario</label>
                <input
                  type="text"
                  defaultValue={selectedTicket?.usuario || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={selectedTicket?.email || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Categoría</label>
                <select
                  defaultValue={selectedTicket?.categoria || 'general'}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="tecnico">Técnico</option>
                  <option value="facturacion">Facturación</option>
                  <option value="viaje">Viaje</option>
                  <option value="cuenta">Cuenta</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Prioridad</label>
                <select
                  defaultValue={selectedTicket?.prioridad || 'media'}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Estado</label>
                <select
                  defaultValue={selectedTicket?.estado || 'abierto'}
                  onChange={(e) => selectedTicket && handleUpdateEstado(selectedTicket.id, e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="abierto">Abierto</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="resuelto">Resuelto</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-medium mb-2">Asunto</label>
              <input
                type="text"
                defaultValue={selectedTicket?.asunto || ''}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-medium mb-2">Descripción</label>
              <textarea
                defaultValue={selectedTicket?.descripcion || ''}
                rows={3}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-medium mb-2">Respuesta</label>
              <textarea
                defaultValue={selectedTicket?.respuesta || ''}
                rows={4}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Escribe la respuesta al ticket..."
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
                {selectedTicket ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSoporte; 