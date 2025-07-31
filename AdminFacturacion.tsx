import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import app from '../firebase';
import { Search, Download, Eye, Edit, Trash2, Plus, FileText, DollarSign, Calendar, Building2, CreditCard } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/validations';

interface Factura {
  id: string;
  numero: string;
  empresa: string;
  cliente: string;
  fecha: Date;
  fechaVencimiento: Date;
  monto: number;
  estado: 'pendiente' | 'pagada' | 'vencida' | 'cancelada';
  concepto: string;
  metodoPago: string;
  descuento: number;
  impuestos: number;
}

const AdminFacturacion: React.FC = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadFacturas();
  }, []);

  const loadFacturas = async () => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      const facturasSnapshot = await getDocs(collection(db, 'facturas'));
      const facturasData: Factura[] = [];
      
      facturasSnapshot.forEach((doc) => {
        const data = doc.data();
        facturasData.push({
          id: doc.id,
          numero: data.numero || 'FAC-001',
          empresa: data.empresa || 'Empresa no especificada',
          cliente: data.cliente || 'Cliente no especificado',
          fecha: data.fecha ? new Date(data.fecha.toDate()) : new Date(),
          fechaVencimiento: data.fechaVencimiento ? new Date(data.fechaVencimiento.toDate()) : new Date(),
          monto: data.monto || 0,
          estado: data.estado || 'pendiente',
          concepto: data.concepto || 'Servicio de transporte',
          metodoPago: data.metodoPago || 'Transferencia bancaria',
          descuento: data.descuento || 0,
          impuestos: data.impuestos || 0,
        });
      });
      
      setFacturas(facturasData);
    } catch (error) {
      console.error('Error cargando facturas:', error);
      // Datos de ejemplo si falla la carga
      setFacturas([
        {
          id: '1',
          numero: 'FAC-2024-001',
          empresa: 'Transporte Rápido S.A.',
          cliente: 'Carlos Mendoza',
          fecha: new Date('2024-12-01'),
          fechaVencimiento: new Date('2024-12-31'),
          monto: 2500000,
          estado: 'pagada',
          concepto: 'Servicios de transporte - Diciembre 2024',
          metodoPago: 'Transferencia bancaria',
          descuento: 100000,
          impuestos: 475000,
        },
        {
          id: '2',
          numero: 'FAC-2024-002',
          empresa: 'Viajes Seguros Ltda.',
          cliente: 'Ana Rodríguez',
          fecha: new Date('2024-12-05'),
          fechaVencimiento: new Date('2025-01-05'),
          monto: 1800000,
          estado: 'pendiente',
          concepto: 'Servicios de transporte - Diciembre 2024',
          metodoPago: 'Pendiente',
          descuento: 0,
          impuestos: 342000,
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFactura = (factura: Factura) => {
    setSelectedFactura(factura);
    setShowModal(true);
  };

  const handleDeleteFactura = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta factura?')) {
      try {
        const db = getFirestore(app);
        await deleteDoc(doc(db, 'facturas', id));
        setFacturas(facturas.filter(f => f.id !== id));
      } catch (error) {
        console.error('Error eliminando factura:', error);
        alert('Error al eliminar la factura');
      }
    }
  };

  const filteredFacturas = facturas.filter(factura =>
    factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    factura.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    factura.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportFacturas = () => {
    const headers = ['Número', 'Empresa', 'Cliente', 'Fecha', 'Vencimiento', 'Monto', 'Estado', 'Concepto', 'Método Pago', 'Descuento', 'Impuestos'];
    const csvContent = [
      headers.join(','),
      ...filteredFacturas.map(f => [
        f.numero,
        f.empresa,
        f.cliente,
        formatDate(f.fecha),
        formatDate(f.fechaVencimiento),
        formatCurrency(f.monto),
        f.estado,
        f.concepto,
        f.metodoPago,
        formatCurrency(f.descuento),
        formatCurrency(f.impuestos)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'facturas.csv');
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
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Facturación</h1>
        <p className="text-slate-400">Administra facturas y pagos de la plataforma</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Facturas</p>
              <p className="text-2xl font-bold text-white">{facturas.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Facturas Pagadas</p>
              <p className="text-2xl font-bold text-white">{facturas.filter(f => f.estado === 'pagada').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Facturas Pendientes</p>
              <p className="text-2xl font-bold text-white">{facturas.filter(f => f.estado === 'pendiente').length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Ingresos Totales</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(facturas.filter(f => f.estado === 'pagada').reduce((sum, f) => sum + f.monto, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-400" />
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
            placeholder="Buscar factura..."
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
          Crear Factura
        </button>
        <button
          onClick={exportFacturas}
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
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Empresa</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Cliente</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Fecha</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Vencimiento</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Monto</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Estado</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredFacturas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                    No hay facturas registradas
                  </td>
                </tr>
              ) : (
                filteredFacturas.map((factura) => (
                  <tr key={factura.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{factura.numero}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-400" />
                        <p className="text-white">{factura.empresa}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{factura.cliente}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{formatDate(factura.fecha)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{formatDate(factura.fechaVencimiento)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{formatCurrency(factura.monto)}</p>
                      {factura.descuento > 0 && (
                        <p className="text-green-400 text-sm">-{formatCurrency(factura.descuento)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        factura.estado === 'pagada' 
                          ? 'bg-green-500/20 text-green-400'
                          : factura.estado === 'pendiente'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : factura.estado === 'vencida'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {factura.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditFactura(factura)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditFactura(factura)}
                          className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFactura(factura.id)}
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
              {selectedFactura ? 'Editar Factura' : 'Crear Nueva Factura'}
            </h2>
            <p className="text-slate-400 mb-6">
              {selectedFactura ? 'Modifica la información de la factura' : 'Completa la información de la nueva factura'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Número de Factura</label>
                <input
                  type="text"
                  defaultValue={selectedFactura?.numero || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Empresa</label>
                <input
                  type="text"
                  defaultValue={selectedFactura?.empresa || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Cliente</label>
                <input
                  type="text"
                  defaultValue={selectedFactura?.cliente || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Monto</label>
                <input
                  type="number"
                  defaultValue={selectedFactura?.monto || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Fecha de Vencimiento</label>
                <input
                  type="date"
                  defaultValue={selectedFactura?.fechaVencimiento.toISOString().split('T')[0] || ''}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Estado</label>
                <select
                  defaultValue={selectedFactura?.estado || 'pendiente'}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="pagada">Pagada</option>
                  <option value="vencida">Vencida</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-medium mb-2">Concepto</label>
              <textarea
                defaultValue={selectedFactura?.concepto || ''}
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
                {selectedFactura ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFacturacion; 