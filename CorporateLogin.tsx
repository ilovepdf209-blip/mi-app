import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import app from '../firebase';
import { BriefcaseIcon, Eye, EyeOff, Lock } from 'lucide-react';

export default function CorporateLogin() {
    const navigate = useNavigate();
    const [nit, setNit] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const auth = getAuth(app);
            const db = getFirestore(app);
            
            // Primero buscar la empresa por NIT en Firestore
            const empresasRef = collection(db, 'empresas');
            const q = query(empresasRef, where('nit', '==', nit));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                setError('Empresa no encontrada en el sistema.');
                setLoading(false);
                return;
            }
            
            const empresaDoc = querySnapshot.docs[0];
            const empresaData = empresaDoc.data();
            
            // Verificar que la empresa esté activa
            if (empresaData.estado !== 'activa') {
                setError('La empresa no está activa en el sistema.');
                setLoading(false);
                return;
            }
            
            // Usar el NIT como email para autenticación
            const email = `${nit}@empresa.com`;
            
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                // Verificar que el UID coincida con el de la empresa
                if (user.uid === empresaData.authUid) {
                    // Login exitoso - redirigir al dashboard
                    navigate('/dashboard');
                } else {
                    setError('Error de autenticación. Contacte al administrador.');
                }
            } catch (authError: any) {
                // Si el usuario no existe, crearlo automáticamente
                if (authError.code === 'auth/user-not-found') {
                    try {
                        // Crear el usuario de Firebase Auth
                        const { createUserWithEmailAndPassword } = await import('firebase/auth');
                        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                        const user = userCredential.user;
                        
                        // Actualizar el authUid en Firestore si no existe
                        if (!empresaData.authUid) {
                            await setDoc(doc(db, 'empresas', empresaDoc.id), {
                                ...empresaData,
                                authUid: user.uid
                            }, { merge: true });
                        }
                        
                        navigate('/dashboard');
                    } catch (createError: any) {
                        setError('Error al crear la cuenta. Contacte al administrador.');
                    }
                } else {
                    setError('NIT o contraseña incorrectos.');
                }
            }
        } catch (err: any) {
            console.error('Error en login:', err);
            setError('Error de conexión. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        
        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        
        try {
            const auth = getAuth(app);
            const user = auth.currentUser;
            
            if (user) {
                await updatePassword(user, newPassword);
                setShowChangePassword(false);
                setNewPassword('');
                setConfirmPassword('');
                alert('Contraseña actualizada correctamente.');
            }
        } catch (err: any) {
            setError('Error al cambiar la contraseña: ' + err.message);
        }
    };

    return (
        <div className="relative z-10 pt-32 pb-20 flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md mx-auto px-4">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-teal-500/10 rounded-full mb-4">
                           <BriefcaseIcon className="w-10 h-10 text-teal-400"/>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Portal de Empresas</h2>
                        <p className="text-white/60">Accede a tus reportes de movilidad sostenible.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-white/70">NIT (sin dígito de verificación)</label>
                            <input 
                                type="text" 
                                name="nit" 
                                required 
                                className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:outline-none transition" 
                                value={nit}
                                onChange={(e) => setNit(e.target.value)}
                                placeholder="Ej: 900123456"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/70">Contraseña</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password" 
                                    required 
                                    className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 pr-10 focus:ring-2 focus:ring-teal-500 focus:outline-none transition" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Ingresa tu contraseña"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        
                        {error && (
                            <div className="text-red-400 text-center text-sm bg-red-500/10 p-3 rounded-lg">
                                {error}
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            className="w-full mt-6 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </button>
                        
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setShowChangePassword(true)}
                                className="text-teal-400 hover:text-teal-300 text-sm font-medium flex items-center justify-center gap-2 mx-auto"
                            >
                                <Lock className="w-4 h-4" />
                                Cambiar Contraseña
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal para cambiar contraseña */}
            {showChangePassword && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Cambiar Contraseña</h3>
                            <button
                                onClick={() => setShowChangePassword(false)}
                                className="text-white/70 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Nueva Contraseña</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    required
                                    minLength={6}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Confirmar Nueva Contraseña</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    required
                                    minLength={6}
                                />
                            </div>
                            
                            {error && (
                                <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                                    {error}
                                </div>
                            )}
                            
                            <div className="flex gap-4 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowChangePassword(false)}
                                    className="px-6 py-2 text-white/70 hover:text-white transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-all"
                                >
                                    Cambiar Contraseña
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
