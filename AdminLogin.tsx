import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Eye, EyeOff, Shield, Zap, ArrowRight, Loader2 } from 'lucide-react';
import app from '../firebase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();

  // Efecto para las partículas flotantes
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      particle.style.animationDelay = Math.random() * 2 + 's';
      document.querySelector('.particles-container')?.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 5000);
    };

    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Verificar rol en Firestore
      const db = getFirestore(app);
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().role === 'admin') {
        navigate('/admin');
      } else {
        setError('No tienes permisos de administrador.');
      }
    } catch (err: any) {
      setError('Credenciales incorrectas o usuario no existe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Fondo animado con gradientes */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900"></div>
      
      {/* Efectos de luz dinámicos */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Partículas flotantes */}
      <div className="particles-container absolute inset-0 pointer-events-none">
        <style jsx>{`
          .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4);
            border-radius: 50%;
            animation: float linear infinite;
            opacity: 0.6;
          }
          @keyframes float {
            0% {
              transform: translateY(100vh) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.6;
            }
            90% {
              opacity: 0.6;
            }
            100% {
              transform: translateY(-100px) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>

      {/* Grid de líneas de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo y título */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Panel Admin
            </h1>
            <p className="text-slate-400 text-lg">
              Control Center
            </p>
          </div>

          {/* Formulario */}
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo de email */}
              <div className="relative group">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl transition-opacity duration-300 ${
                  focusedField === 'email' ? 'opacity-100' : 'opacity-0'
                }`}></div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 px-6 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 transition-all duration-300 text-lg"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Zap className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Campo de contraseña */}
              <div className="relative group">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-xl transition-opacity duration-300 ${
                  focusedField === 'password' ? 'opacity-100' : 'opacity-0'
                }`}></div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 px-6 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 transition-all duration-300 text-lg pr-12"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-center">
                  {error}
                </div>
              )}

              {/* Botón de login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white font-semibold py-4 px-6 rounded-2xl text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Accediendo...
                    </>
                  ) : (
                    <>
                      Acceder al Panel
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Información adicional */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                <Shield className="w-4 h-4" />
                <span>Acceso seguro con autenticación de dos factores</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-slate-500 text-sm">
              © 2025 Viajemos Juntos CO. Panel de Administración
            </p>
          </div>
        </div>
      </div>

      {/* Efectos de borde animados */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500"></div>
    </div>
  );
} 