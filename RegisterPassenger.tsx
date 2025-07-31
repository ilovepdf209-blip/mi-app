import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithRedirect, getRedirectResult, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import app from '../firebase';
import { GoogleLoginButton } from '../components/GoogleLoginButton';

// --- Iconos ---
const AppleLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.6,3.2C16,2,14.2,2,12.9,2.1c-1.6,0-3.3,1-4.1,2.4c-1.6,2.7-0.5,6.6,1.4,8.8c0.9,1,2,1.6,3.2,1.6 c1.2,0,2.1-0.6,3.1-1.6c1.7-1.7,2.2-4.2,1.3-6.4C17.7,6.3,17.7,3.3,17.6,3.2z M13.1,11.5c-0.6,0.6-1.4,1-2.2,1 c-0.9,0-1.7-0.4-2.3-1.1c-1.2-1.3-1.6-3.2-1-4.8c0.6-1.5,2.1-2.5,3.7-2.5c0.1,0,0.2,0,0.3,0c1.4,0.1,2.6,1.1,3,2.4 C15.1,9.3,14.3,10.9,13.1,11.5z"/>
    </svg>
);

export default function RegisterPassenger() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- NUEVO: Login/registro con Google ---
    const handleGoogle = async () => {
        setError(null);
        setLoading(true);
        try {
            const auth = getAuth(app);
            const provider = new GoogleAuthProvider();
            await signInWithRedirect(auth, provider);
        } catch (err: any) {
            setError(err.message || 'Error con Google');
            setLoading(false);
        }
    };

    useEffect(() => {
        const auth = getAuth(app);

        getRedirectResult(auth)
            .then(async (result) => {
                if (result && result.user) {
                    const user = result.user;
                    const db = getFirestore(app);
                    const userRef = doc(db, 'users', user.uid);
                    const userSnap = await getDoc(userRef);
                    if (!userSnap.exists()) {
                        await setDoc(userRef, {
                            name: user.displayName || "Usuario Google",
                            email: user.email,
                            role: 'passenger',
                            createdAt: new Date(),
                        });
                    }
                    navigate('/profile');
                }
            })
            .catch((err) => {
                // Puedes mostrar el error si quieres
            })
            .finally(() => setLoading(false));

        // Refuerzo: si el usuario está autenticado pero no tiene documento, créalo
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const db = getFirestore(app);
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        name: user.displayName || "Usuario Google",
                        email: user.email,
                        role: 'passenger',
                        createdAt: new Date(),
                    });
                }
                navigate('/profile');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const form = e.currentTarget;
        const name = (form.name as any).value;
        const email = (form.email as any).value;
        const password = (form.password as any).value;
        const confirmPassword = (form.confirmPassword as any).value;
        if (!name || !email || !password || !confirmPassword) {
            setError('Todos los campos son obligatorios');
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }
        try {
            const auth = getAuth(app);
            await createUserWithEmailAndPassword(auth, email, password);
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    await updateProfile(user, { displayName: name });
                    const db = getFirestore(app);
                    await setDoc(doc(db, 'users', user.uid), {
                        name,
                        email,
                        role: 'passenger',
                        createdAt: serverTimestamp(),
                    });
                    navigate('/profile');
                }
            });
        } catch (err: any) {
            setError(err.message || 'Error al registrar usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative z-10 pt-32 pb-20 flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md mx-auto px-4">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                    <h2 className="text-3xl font-bold text-center text-white mb-2">Crear Cuenta de Pasajero</h2>
                    <p className="text-center text-white/60 mb-8">Completa tus datos para empezar a viajar.</p>
                    <div className="space-y-4 mb-6">
                        <button type="button" onClick={handleGoogle} disabled={loading} className="w-full bg-white text-gray-800 font-semibold py-2.5 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50">
                            <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C41.38,36.142,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                            Continuar con Google
                        </button>
                        <button type="button" disabled className="w-full bg-black text-white font-semibold py-2.5 rounded-lg shadow-md flex items-center justify-center gap-3 opacity-60 cursor-not-allowed">
                            <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#000" d="M24 4C12.955 4 4 12.955 4 24s8.955 20,20 20 20-8.955 20-20S35.045 4 24 4zm0 36c-8.837 0-16-7.163-16-16S15.163 8 24 8s16 7.163 16 16-7.163 16-16 16z"/></svg>
                            Continuar con Apple
                        </button>
                    </div>
                     <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-slate-600"></div>
                        <span className="flex-shrink mx-4 text-slate-400 text-xs">O REGÍSTRATE CON CORREO</span>
                        <div className="flex-grow border-t border-slate-600"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div><label className="text-sm font-medium text-white/70">Nombre completo</label><input type="text" name="name" required className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" /></div>
                        <div><label className="text-sm font-medium text-white/70">Correo Electrónico</label><input type="email" name="email" required className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" /></div>
                        <div><label className="text-sm font-medium text-white/70">Contraseña</label><input type="password" name="password" required className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" /></div>
                        <div><label className="text-sm font-medium text-white/70">Confirmar contraseña</label><input type="password" name="confirmPassword" required className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" /></div>
                        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2.5 px-6 rounded-lg mt-6 disabled:opacity-50">{loading ? 'Registrando...' : 'Crear Cuenta'}</button>
                        <p className="text-sm text-center text-white/50">¿Ya tienes cuenta? <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300">Inicia Sesión</Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
}
