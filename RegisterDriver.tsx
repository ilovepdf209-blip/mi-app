import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from '../firebase';
import { uploadFileAndGetURL } from '../firebase';

// --- Icono ---
const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

// --- Componente de Botón ---
const ActionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
    <button 
      className={`font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </button>
);

// --- Componente Principal ---
export default function RegisterDriver() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const progress = (step / 3) * 100;

    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    // --- NUEVO: Manejo de archivos seleccionados ---
    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        licencia: null,
        matricula: null,
        soat: null,
        rtm: null,
        cedula: null,
    });
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const name = e.target.name;
        setFiles(prev => ({ ...prev, [name]: file || null }));
        const label = document.getElementById(`${name}-label`);
        if (file && label) {
          label.textContent = file.name;
        }
    };

    // --- NUEVO: Manejo de datos de formulario ---
    const [formData, setFormData] = useState<any>({});
    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- NUEVO: Registro real al finalizar ---
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const auth = getAuth(app);
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: formData.nombres + ' ' + formData.apellidos });
            // Subir documentos a Storage y obtener URLs
            const docUrls: { [key: string]: string } = {};
            for (const key of Object.keys(files)) {
                const file = files[key];
                if (file) {
                    const ext = file.name.split('.').pop();
                    const path = `drivers/${user.uid}/documentos/${key}.${ext}`;
                    docUrls[`${key}Url`] = await uploadFileAndGetURL(file, path);
                }
            }
            const db = getFirestore(app);
            await setDoc(doc(db, 'users', user.uid), {
                name: formData.nombres + ' ' + formData.apellidos,
                email: formData.email,
                phone: formData.celular,
                city: formData.ciudad,
                role: 'driver',
                createdAt: new Date(),
                ...docUrls,
            });
            navigate('/profile');
        } catch (err: any) {
            setError(err.message || 'Error al registrar usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-4">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                {/* Columna de la Imagen */}
                <div className="hidden lg:block relative">
                    <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop" alt="Casa moderna con un coche aparcado" className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                     <div className="absolute bottom-8 left-8 text-white">
                        <h2 className="text-4xl font-bold">Conviértete en Conductor</h2>
                        <p className="text-white/70 mt-2 max-w-md">Únete a nuestra comunidad y empieza a generar ingresos compartiendo tus viajes.</p>
                    </div>
                </div>

                {/* Columna del Formulario */}
                <div className="p-8">
                   <h2 className="text-3xl font-bold text-center text-white mb-2">Registro de Conductor</h2>
                   
                   {/* Barra de Progreso */}
                   <div className="my-8">
                      <div className="relative h-2 bg-slate-700 rounded-full">
                        <div className="absolute top-0 left-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
                      </div>
                      <div className="flex justify-between text-xs text-white/50 mt-2">
                        <span className={step >= 1 ? 'text-purple-400 font-bold' : ''}>Info Personal</span>
                        <span className={step >= 2 ? 'text-purple-400 font-bold' : ''}>Vehículo</span>
                        <span className={step >= 3 ? 'text-purple-400 font-bold' : ''}>Documentos</span>
                      </div>
                   </div>
                    
                    <form onSubmit={handleRegister}>
                        {/* Paso 1: Información Personal */}
                        {step === 1 && (
                            <div className="space-y-4 animate-fade-in">
                                <h3 className="text-xl font-semibold text-white/90">Paso 1: Cuéntanos sobre ti</h3>
                                <div>
                                  <label className="text-sm font-medium text-white/70">Correo electrónico</label>
                                  <input
                                    type="email"
                                    required
                                    name="email"
                                    className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3"
                                    onChange={handleInput}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-white/70">Contraseña</label>
                                  <input
                                    type="password"
                                    required
                                    name="password"
                                    className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3"
                                    onChange={handleInput}
                                  />
                                </div>
                                <div><label className="text-sm font-medium text-white/70">Número de celular</label><input type="tel" required name="celular" className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" onChange={handleInput} /></div>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div><label className="text-sm font-medium text-white/70">Nombres</label><input type="text" required name="nombres" className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3" onChange={handleInput} /></div>
                                  <div><label className="text-sm font-medium text-white/70">Apellidos</label><input type="text" required name="apellidos" className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3" onChange={handleInput} /></div>
                                </div>
                                <div><label className="text-sm font-medium text-white/70">Ciudad de registro</label><input type="text" required name="ciudad" className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3" onChange={handleInput} /></div>
                                <div className="pt-4 flex justify-end">
                                  <ActionButton onClick={nextStep} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">Siguiente</ActionButton>
                                </div>
                            </div>
                        )}

                        {/* Paso 2: Datos del Vehículo */}
                        {step === 2 && (
                            <div className="space-y-4 animate-fade-in">
                                <h3 className="text-xl font-semibold text-white/90">Paso 2: Datos de tu vehículo</h3>
                                 <div className="grid md:grid-cols-2 gap-4">
                                     <div><label className="text-sm font-medium text-white/70">Marca</label><select className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3" name="marca" onChange={handleInput}><option>Chevrolet</option></select></div>
                                     <div><label className="text-sm font-medium text-white/70">Año</label><select className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3" name="anio" onChange={handleInput}><option>2025</option></select></div>
                                 </div>
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div><label className="text-sm font-medium text-white/70">Modelo</label><input type="text" placeholder="Selecciona un modelo" name="modelo" className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3" onChange={handleInput} /></div>
                                     <div><label className="text-sm font-medium text-white/70">Versión</label><input type="text" name="version" className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3" onChange={handleInput} /></div>
                                </div>
                                <div><label className="text-sm font-medium text-white/70">Tipo de Combustible</label><select className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3" name="combustible" onChange={handleInput}><option>Gasolina</option></select></div>
                                <div className="pt-4 flex justify-between">
                                  <ActionButton onClick={prevStep} type="button" className="bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/20">Anterior</ActionButton>
                                  <ActionButton onClick={nextStep} type="button" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">Siguiente</ActionButton>
                                </div>
                            </div>
                        )}
                        
                        {/* Paso 3: Documentación */}
                        {step === 3 && (
                          <div className="space-y-4 animate-fade-in">
                            <h3 className="text-xl font-semibold text-white/90">Paso 3: Documentación</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                              {/* Licencia */}
                              <div className="space-y-1">
                                <label className="text-sm font-medium text-white/70">Licencia de Conducción</label>
                                <label htmlFor="licencia" className="w-full bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-lg py-2 px-3 flex items-center justify-center gap-2 cursor-pointer hover:border-purple-500 transition-colors">
                                  <UploadIcon className="w-5 h-5 text-white/70"/> <span id="licencia-label" className="text-sm text-white/70">Seleccionar archivo</span>
                                </label>
                                <input id="licencia" name="licencia" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg"/>
                              </div>
                              {/* Matrícula */}
                              <div className="space-y-1">
                                <label className="text-sm font-medium text-white/70">Matrícula del Vehículo</label>
                                <label htmlFor="matricula" className="w-full bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-lg py-2 px-3 flex items-center justify-center gap-2 cursor-pointer hover:border-purple-500 transition-colors">
                                  <UploadIcon className="w-5 h-5 text-white/70"/> <span id="matricula-label" className="text-sm text-white/70">Seleccionar archivo</span>
                                </label>
                                <input id="matricula" name="matricula" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg"/>
                              </div>
                              {/* SOAT */}
                              <div className="space-y-1">
                                <label className="text-sm font-medium text-white/70">SOAT</label>
                                <label htmlFor="soat" className="w-full bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-lg py-2 px-3 flex items-center justify-center gap-2 cursor-pointer hover:border-purple-500 transition-colors">
                                  <UploadIcon className="w-5 h-5 text-white/70"/> <span id="soat-label" className="text-sm text-white/70">Seleccionar archivo</span>
                                </label>
                                <input id="soat" name="soat" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg"/>
                              </div>
                              {/* RTM */}
                              <div className="space-y-1">
                                <label className="text-sm font-medium text-white/70">Revisión Técnico-Mecánica</label>
                                <label htmlFor="rtm" className="w-full bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-lg py-2 px-3 flex items-center justify-center gap-2 cursor-pointer hover:border-purple-500 transition-colors">
                                  <UploadIcon className="w-5 h-5 text-white/70"/> <span id="rtm-label" className="text-sm text-white/70">Seleccionar archivo</span>
                                </label>
                                <input id="rtm" name="rtm" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg"/>
                              </div>
                              {/* Cédula */}
                              <div className="space-y-1 sm:col-span-2">
                                <label className="text-sm font-medium text-white/70">Adjuntar Cédula</label>
                                <label htmlFor="cedula" className="w-full bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-lg py-2 px-3 flex items-center justify-center gap-2 cursor-pointer hover:border-purple-500 transition-colors">
                                  <UploadIcon className="w-5 h-5 text-white/70"/> <span id="cedula-label" className="text-sm text-white/70">Seleccionar archivo</span>
                                </label>
                                <input id="cedula" name="cedula" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg"/>
                              </div>
                            </div>
                            <div className="pt-4 flex justify-between">
                              <ActionButton onClick={prevStep} type="button" className="bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/20">Anterior</ActionButton>
                              <ActionButton onClick={handleRegister} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">{loading ? 'Registrando...' : 'Finalizar Registro'}</ActionButton>
                            </div>
                          </div>
                        )}
                    </form>
                </div>
            </div>
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        </div>
    );
}
