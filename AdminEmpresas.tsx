import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Download, Upload, Car, Building2, FileText, Users, Settings } from 'lucide-react';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../firebase';

interface Empresa {
  id: string;
  nit: string;
  razonSocial: string;
  tipoPersona: 'juridica' | 'natural';
  codigoVerificacion: string;
  nombreContacto: string;
  email: string;
  celular: string;
  telefono: string;
  cargo: string;
  direccion: string;
  parametroFacturacion: string;
  plazoFacturacion: number;
  estado: 'activa' | 'pendiente' | 'inactiva';
  createdAt: Date;
  authUid?: string;
}

interface Vehiculo {
  id: string;
  empresaId: string;
  placa: string;
  marca: string;
  tipoVehiculo: 'suv' | 'van' | 'automovil' | 'bus' | 'camion' | 'moto';
  modelo: string;
  linea: string;
  kilometraje: number;
  tipoCombustible: 'gasolina' | 'diesel' | 'electrico' | 'hibrido' | 'gas';
  createdAt: Date;
}

const AdminEmpresas: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'empresas' | 'flotas'>('empresas');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showFleetModal, setShowFleetModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'individual' | 'archivo'>('individual');
  const [loading, setLoading] = useState(false);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  const [empresaForm, setEmpresaForm] = useState({
    nit: '',
    razonSocial: '',
    tipoPersona: 'juridica' as 'juridica' | 'natural',
    codigoVerificacion: '',
    nombreContacto: '',
    email: '',
    celular: '',
    telefono: '',
    cargo: '',
    direccion: '',
    parametroFacturacion: '',
    plazoFacturacion: 30,
  });

  const [vehiculoForm, setVehiculoForm] = useState({
    placa: '',
    marca: '',
    tipoVehiculo: 'automovil' as 'suv' | 'van' | 'automovil' | 'bus' | 'camion' | 'moto',
    modelo: '',
    linea: '',
    kilometraje: 0,
    tipoCombustible: 'gasolina' as 'gasolina' | 'diesel' | 'electrico' | 'hibrido' | 'gas',
  });

  useEffect(() => {
    loadEmpresas();
    loadVehiculos();
  }, []);

  const loadEmpresas = async () => {
    try {
      const db = getFirestore(app);
      const empresasSnapshot = await getDocs(collection(db, 'empresas'));
      const empresasData: Empresa[] = [];
      empresasSnapshot.forEach((doc) => {
        empresasData.push({ id: doc.id, ...doc.data() } as Empresa);
      });
      setEmpresas(empresasData);
    } catch (error) {
      console.error('Error cargando empresas:', error);
    }
  };

  const loadVehiculos = async () => {
    try {
      const db = getFirestore(app);
      const vehiculosSnapshot = await getDocs(collection(db, 'vehiculos'));
      const vehiculosData: Vehiculo[] = [];
      vehiculosSnapshot.forEach((doc) => {
        vehiculosData.push({ id: doc.id, ...doc.data() } as Vehiculo);
      });
      setVehiculos(vehiculosData);
    } catch (error) {
      console.error('Error cargando vehículos:', error);
    }
  };

  const validateNIT = (nit: string): boolean => {
    return /^\d{9,10}$/.test(nit);
  };

  const validatePlaca = (placa: string): boolean => {
    return /^[A-Z]{3}\d{3}$/.test(placa);
  };

  const handleEmpresaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateNIT(empresaForm.nit)) {
        alert('NIT inválido. Debe tener 9-10 dígitos.');
        return;
      }

      const db = getFirestore(app);
      const auth = getAuth(app);

      // Verificar si ya existe una empresa con este NIT
      const empresasSnapshot = await getDocs(collection(db, 'empresas'));
      const empresaExistente = empresasSnapshot.docs.find(doc => doc.data().nit === empresaForm.nit);
      
      if (empresaExistente) {
        alert('Ya existe una empresa con este NIT.');
        return;
      }

      // Crear usuario de Firebase Auth
      const email = `${empresaForm.nit}@empresa.com`;
      const password = empresaForm.nit; // NIT como contraseña inicial
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Agregar empresa a Firestore
      const empresaData = {
        ...empresaForm,
        estado: 'activa' as const,
        createdAt: new Date(),
        authUid: user.uid,
      };

      await addDoc(collection(db, 'empresas'), empresaData);
      
      setEmpresaForm({
        nit: '',
        razonSocial: '',
        tipoPersona: 'juridica',
        codigoVerificacion: '',
        nombreContacto: '',
        email: '',
        celular: '',
        telefono: '',
        cargo: '',
        direccion: '',
        parametroFacturacion: '',
        plazoFacturacion: 30,
      });
      
      setShowRegisterModal(false);
      loadEmpresas();
      alert('Empresa registrada exitosamente.');
    } catch (error) {
      console.error('Error registrando empresa:', error);
      alert('Error al registrar la empresa.');
    } finally {
      setLoading(false);
    }
  };

  const handleVehiculoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validatePlaca(vehiculoForm.placa)) {
        alert('Placa inválida. Debe tener formato AAA123.');
        return;
      }

      const db = getFirestore(app);

      // Verificar si ya existe un vehículo con esta placa
      const vehiculosSnapshot = await getDocs(collection(db, 'vehiculos'));
      const vehiculoExistente = vehiculosSnapshot.docs.find(doc => doc.data().placa === vehiculoForm.placa);
      
      if (vehiculoExistente) {
        alert('Ya existe un vehículo con esta placa.');
        return;
      }

      // Agregar vehículo a Firestore
      const vehiculoData = {
        ...vehiculoForm,
        empresaId: selectedEmpresa?.id || '',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'vehiculos'), vehiculoData);
      
      setVehiculoForm({
        placa: '',
        marca: '',
        tipoVehiculo: 'automovil',
        modelo: '',
        linea: '',
        kilometraje: 0,
        tipoCombustible: 'gasolina',
      });
      
      setShowFleetModal(false);
      loadVehiculos();
      alert('Vehículo registrado exitosamente.');
    } catch (error) {
      console.error('Error registrando vehículo:', error);
      alert('Error al registrar el vehículo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmpresa = async (empresaId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta empresa?')) return;

    try {
      const db = getFirestore(app);
      
      // Eliminar vehículos asociados
      const vehiculosSnapshot = await getDocs(collection(db, 'vehiculos'));
      const vehiculosEmpresa = vehiculosSnapshot.docs.filter(doc => doc.data().empresaId === empresaId);
      
      for (const vehiculoDoc of vehiculosEmpresa) {
        await deleteDoc(vehiculoDoc.ref);
      }
      
      // Eliminar empresa
      await deleteDoc(doc(db, 'empresas', empresaId));
      
      loadEmpresas();
      loadVehiculos();
      alert('Empresa eliminada exitosamente.');
    } catch (error) {
      console.error('Error eliminando empresa:', error);
      alert('Error al eliminar la empresa.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const requiredHeaders = ['placa', 'marca', 'tipoVehiculo', 'modelo', 'linea', 'kilometraje', 'tipoCombustible'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        alert(`Faltan las siguientes columnas: ${missingHeaders.join(', ')}`);
        return;
      }

      const vehiculosToAdd = [];
      const errors = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(',').map(v => v.trim());
        const rowData: any = {};
        headers.forEach((header, index) => {
          rowData[header] = values[index] || '';
        });

        // Validar placa
        if (!validatePlaca(rowData.placa)) {
          errors.push(`Línea ${i + 1}: Placa inválida - ${rowData.placa}`);
          continue;
        }

        // Verificar si la placa ya existe
        const vehiculoExistente = vehiculos.find(v => v.placa === rowData.placa);
        if (vehiculoExistente) {
          errors.push(`Línea ${i + 1}: Placa ya existe - ${rowData.placa}`);
          continue;
        }

        vehiculosToAdd.push({
          ...rowData,
          empresaId: selectedEmpresa?.id || '',
          kilometraje: parseInt(rowData.kilometraje) || 0,
          createdAt: new Date(),
        });
      }

      if (errors.length > 0) {
        alert(`Errores encontrados:\n${errors.join('\n')}`);
        return;
      }

      try {
        const db = getFirestore(app);
        for (const vehiculo of vehiculosToAdd) {
          await addDoc(collection(db, 'vehiculos'), vehiculo);
        }
        
        loadVehiculos();
        alert(`${vehiculosToAdd.length} vehículos importados exitosamente.`);
      } catch (error) {
        console.error('Error importando vehículos:', error);
        alert('Error al importar los vehículos.');
      }
    };
    reader.readAsText(file);
  };

  const getVehiculosByEmpresa = (empresaId: string) => {
    return vehiculos.filter(v => v.empresaId === empresaId);
  };

  const exportEmpresas = () => {
    const csvContent = [
      ['NIT', 'Razón Social', 'Tipo Persona', 'Contacto', 'Email', 'Celular', 'Teléfono', 'Cargo', 'Dirección', 'Facturación', 'Plazo', 'Estado'],
      ...empresas.map(empresa => [
        empresa.nit,
        empresa.razonSocial,
        empresa.tipoPersona,
        empresa.nombreContacto,
        empresa.email,
        empresa.celular,
        empresa.telefono,
        empresa.cargo,
        empresa.direccion,
        empresa.parametroFacturacion,
        empresa.plazoFacturacion.toString(),
        empresa.estado
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'empresas.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header con información del admin */}
      <div className="bg-slate-800/50 border-b border-slate-700/50 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
            <p className="text-slate-400 mt-1">Gestión de empresas y flotas de transporte</p>
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
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Empresas</p>
                <p className="text-3xl font-bold text-white">{empresas.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Vehículos</p>
                <p className="text-3xl font-bold text-white">{vehiculos.length}</p>
              </div>
              <Car className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Empresas Activas</p>
                <p className="text-3xl font-bold text-white">{empresas.filter(e => e.estado === 'activa').length}</p>
              </div>
              <Settings className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Controles principales */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Registrar Empresa
            </button>
            <button
              onClick={() => setShowFleetModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg"
            >
              <Car className="w-5 h-5" />
              Registrar Flota
            </button>
          </div>
          <button
            onClick={exportEmpresas}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
          >
            <Download className="w-5 h-5" />
            Exportar Datos
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 mb-8">
          <button
            onClick={() => setActiveTab('empresas')}
            className={`py-3 px-6 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'empresas'
                ? 'border-b-2 border-purple-400 text-purple-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Building2 className="w-5 h-5" />
            Empresas ({empresas.length})
          </button>
          <button
            onClick={() => setActiveTab('flotas')}
            className={`py-3 px-6 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'flotas'
                ? 'border-b-2 border-cyan-400 text-cyan-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Car className="w-5 h-5" />
            Flotas de Transporte ({vehiculos.length})
          </button>
        </div>

        {activeTab === 'empresas' && (
          <div className="bg-slate-800/80 rounded-xl shadow-xl overflow-hidden border border-slate-700/50">
    <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-900/80">
          <tr className="text-white/80 text-left">
                    <th className="py-4 px-6">NIT</th>
                    <th className="py-4 px-6">Razón Social</th>
                    <th className="py-4 px-6">Contacto</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Facturación</th>
                    <th className="py-4 px-6">Estado</th>
                    <th className="py-4 px-6">Acciones</th>
          </tr>
        </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {empresas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No hay empresas registradas</p>
                        <p className="text-sm mt-2">Haz clic en "Registrar Empresa" para comenzar</p>
                      </td>
                    </tr>
                  ) : (
                    empresas.map((empresa) => (
                      <tr key={empresa.id} className="hover:bg-slate-700/40 transition">
                        <td className="py-4 px-6 text-white font-medium">{empresa.nit}</td>
                        <td className="py-4 px-6 text-white">{empresa.razonSocial}</td>
                        <td className="py-4 px-6 text-white/80">{empresa.nombreContacto}</td>
                        <td className="py-4 px-6 text-white/80">{empresa.email}</td>
                        <td className="py-4 px-6 text-white/80">
                          {empresa.parametroFacturacion} - {empresa.plazoFacturacion} días
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            empresa.estado === 'activa' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : empresa.estado === 'pendiente'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {empresa.estado.charAt(0).toUpperCase() + empresa.estado.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteEmpresa(empresa.id)}
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

        {activeTab === 'flotas' && (
          <div className="bg-slate-800/80 rounded-xl shadow-xl overflow-hidden border border-slate-700/50">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-900/80">
                  <tr className="text-white/80 text-left">
                    <th className="py-4 px-6">Placa</th>
                    <th className="py-4 px-6">Marca</th>
                    <th className="py-4 px-6">Modelo</th>
                    <th className="py-4 px-6">Tipo</th>
                    <th className="py-4 px-6">Combustible</th>
                    <th className="py-4 px-6">Kilometraje</th>
                    <th className="py-4 px-6">Empresa</th>
                    <th className="py-4 px-6">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {vehiculos.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No hay vehículos registrados</p>
                        <p className="text-sm mt-2">Haz clic en "Registrar Flota" para comenzar</p>
                      </td>
                    </tr>
                  ) : (
                    vehiculos.map((vehiculo) => {
                      const empresa = empresas.find(e => e.id === vehiculo.empresaId);
                      return (
                        <tr key={vehiculo.id} className="hover:bg-slate-700/40 transition">
                          <td className="py-4 px-6 text-white font-medium">{vehiculo.placa}</td>
                          <td className="py-4 px-6 text-white">{vehiculo.marca}</td>
                          <td className="py-4 px-6 text-white/80">{vehiculo.modelo}</td>
                          <td className="py-4 px-6 text-white/80">{vehiculo.tipoVehiculo}</td>
                          <td className="py-4 px-6 text-white/80">{vehiculo.tipoCombustible}</td>
                          <td className="py-4 px-6 text-white/80">{vehiculo.kilometraje.toLocaleString()} km</td>
                          <td className="py-4 px-6 text-white/80">{empresa?.razonSocial || 'Sin empresa'}</td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              <button className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Registrar Empresa */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Registrar Nueva Empresa</h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleEmpresaSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">NIT (sin dígito de verificación)</label>
                  <input
                    type="text"
                    value={empresaForm.nit}
                    onChange={(e) => setEmpresaForm({...empresaForm, nit: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    pattern="[0-9]{9,10}"
                    title="NIT debe tener 9-10 dígitos"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Razón Social</label>
                  <input
                    type="text"
                    value={empresaForm.razonSocial}
                    onChange={(e) => setEmpresaForm({...empresaForm, razonSocial: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Tipo de Persona</label>
                  <select
                    value={empresaForm.tipoPersona}
                    onChange={(e) => setEmpresaForm({...empresaForm, tipoPersona: e.target.value as 'juridica' | 'natural'})}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    required
                  >
                    <option value="juridica">Jurídica</option>
                    <option value="natural">Natural</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Código de Verificación</label>
                  <input
                    type="text"
                    value={empresaForm.codigoVerificacion}
                    onChange={(e) => setEmpresaForm({...empresaForm, codigoVerificacion: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Nombre del Contacto</label>
                  <input
                    type="text"
                    value={empresaForm.nombreContacto}
                    onChange={(e) => setEmpresaForm({...empresaForm, nombreContacto: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={empresaForm.email}
                    onChange={(e) => setEmpresaForm({...empresaForm, email: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Celular</label>
                  <input
                    type="tel"
                    value={empresaForm.celular}
                    onChange={(e) => setEmpresaForm({...empresaForm, celular: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={empresaForm.telefono}
                    onChange={(e) => setEmpresaForm({...empresaForm, telefono: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Cargo</label>
                  <input
                    type="text"
                    value={empresaForm.cargo}
                    onChange={(e) => setEmpresaForm({...empresaForm, cargo: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">Dirección</label>
                  <input
                    type="text"
                    value={empresaForm.direccion}
                    onChange={(e) => setEmpresaForm({...empresaForm, direccion: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Parámetro de Facturación</label>
                  <input
                    type="text"
                    value={empresaForm.parametroFacturacion}
                    onChange={(e) => setEmpresaForm({...empresaForm, parametroFacturacion: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Plazo de Facturación (días)</label>
                  <input
                    type="number"
                    value={empresaForm.plazoFacturacion}
                    onChange={(e) => setEmpresaForm({...empresaForm, plazoFacturacion: parseInt(e.target.value)})}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Registrando...' : 'Registrar Empresa'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 bg-slate-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Flota */}
      {showFleetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Registrar Vehículo</h3>
              <button
                onClick={() => setShowFleetModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setUploadMethod('individual')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    uploadMethod === 'individual'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Registro Individual
                </button>
                <button
                  onClick={() => setUploadMethod('archivo')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    uploadMethod === 'archivo'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Cargar Archivo CSV
                </button>
              </div>
            </div>

            {uploadMethod === 'individual' ? (
              <form onSubmit={handleVehiculoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Placa</label>
                    <input
                      type="text"
                      value={vehiculoForm.placa}
                      onChange={(e) => setVehiculoForm({...vehiculoForm, placa: e.target.value.toUpperCase()})}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                      pattern="[A-Z]{3}[0-9]{3}"
                      title="Placa debe tener formato AAA123"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Marca</label>
                    <input
                      type="text"
                      value={vehiculoForm.marca}
                      onChange={(e) => setVehiculoForm({...vehiculoForm, marca: e.target.value})}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Tipo de Vehículo</label>
                    <select
                      value={vehiculoForm.tipoVehiculo}
                      onChange={(e) => setVehiculoForm({...vehiculoForm, tipoVehiculo: e.target.value as any})}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                      required
                    >
                      <option value="automovil">Automóvil</option>
                      <option value="suv">SUV</option>
                      <option value="van">Van</option>
                      <option value="bus">Bus</option>
                      <option value="camion">Camión</option>
                      <option value="moto">Motocicleta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Modelo</label>
                    <input
                      type="text"
                      value={vehiculoForm.modelo}
                      onChange={(e) => setVehiculoForm({...vehiculoForm, modelo: e.target.value})}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Línea</label>
                    <input
                      type="text"
                      value={vehiculoForm.linea}
                      onChange={(e) => setVehiculoForm({...vehiculoForm, linea: e.target.value})}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Kilometraje</label>
                    <input
                      type="number"
                      value={vehiculoForm.kilometraje}
                      onChange={(e) => setVehiculoForm({...vehiculoForm, kilometraje: parseInt(e.target.value)})}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Tipo de Combustible</label>
                    <select
                      value={vehiculoForm.tipoCombustible}
                      onChange={(e) => setVehiculoForm({...vehiculoForm, tipoCombustible: e.target.value as any})}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-cyan-500 focus:outline-none"
                      required
                    >
                      <option value="gasolina">Gasolina</option>
                      <option value="diesel">Diesel</option>
                      <option value="electrico">Eléctrico</option>
                      <option value="hibrido">Híbrido</option>
                      <option value="gas">Gas</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Registrando...' : 'Registrar Vehículo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFleetModal(false)}
                    className="flex-1 bg-slate-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h4 className="text-white font-medium mb-4">Instrucciones para el archivo CSV:</h4>
                  <ul className="text-slate-300 text-sm space-y-2">
                    <li>• El archivo debe contener las siguientes columnas: placa, marca, tipoVehiculo, modelo, linea, kilometraje, tipoCombustible</li>
                    <li>• Las placas deben tener formato AAA123</li>
                    <li>• Los tipos de vehículo válidos son: automovil, suv, van, bus, camion, moto</li>
                    <li>• Los tipos de combustible válidos son: gasolina, diesel, electrico, hibrido, gas</li>
                  </ul>
                </div>
                
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-white font-medium mb-2">Arrastra tu archivo CSV aquí</p>
                  <p className="text-slate-400 text-sm mb-4">o haz clic para seleccionar</p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-all cursor-pointer"
                  >
                    Seleccionar Archivo
                  </label>
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => setShowFleetModal(false)}
                    className="flex-1 bg-slate-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmpresas; 