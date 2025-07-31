import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import app from '../firebase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const auth = getAuth(app);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Lógica para crear documento en Firestore si no existe
            const db = getFirestore(app);
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    name: user.displayName || 'Usuario',
                    email: user.email,
                    role: 'passenger', // Puedes ajustar según el flujo
                    createdAt: new Date(),
                });
                // Si el usuario es nuevo, lo mandamos a /profile
                navigate('/profile');
            } else {
                // Si el usuario ya existe, revisamos el rol
                const data = userSnap.data();
                if (data.role === 'admin') {
                    navigate('/admin');
                } else {
            navigate('/profile');
                }
            }
        } catch (err) {
            setError('Correo o contraseña incorrectos');
        }
    };

    return (
        <div className="relative z-10 pt-40 pb-20 flex items-center justify-center">
            <div className="w-full max-w-md mx-auto px-4">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                    <h2 className="text-3xl font-bold text-center text-white mb-2">Bienvenido de Vuelta</h2>
                    <p className="text-center text-white/60 mb-8">Inicia sesión para continuar tu viaje.</p>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-sm font-medium text-white/70">Correo Electrónico</label>
                            <input type="email" name="email" required className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/70">Contraseña</label>
                            <input type="password" name="password" required className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        {error && <div className="text-red-400 text-center text-sm">{error}</div>}
                        <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2.5 px-6 rounded-lg">
                            Iniciar Sesión
                        </button>
                        <p className="text-sm text-center text-white/50">
                            ¿No tienes cuenta?{' '}
                            <Link to="/register" className="font-semibold text-purple-400 hover:text-purple-300">
                                Regístrate
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
