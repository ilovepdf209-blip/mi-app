import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import app from '../firebase';
// import ChatIndicator from './Chat/ChatIndicator'; // Comentado temporalmente

type SVGProps = React.SVGProps<SVGSVGElement>;
const LogIn: React.FC<SVGProps> = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>);
const UserPlus: React.FC<SVGProps> = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>);
const Menu: React.FC<SVGProps> = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>);
const X: React.FC<SVGProps> = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        const auth = getAuth(app);
        await signOut(auth);
        setUser(null);
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="absolute top-0 left-0 right-0 z-20">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-white flex items-center gap-3 cursor-pointer">
                    <span className="text-3xl">🚗</span>
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hidden sm:block">
                        Viajemos Juntos CO
                    </span>
                </Link>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-white/80">
                    <Link to="/search" className="hover:text-white transition-colors">Buscar viaje</Link>
                    <Link to="/publish-trip" className="hover:text-white transition-colors">Publicar viaje</Link>
                    <Link to="/how-it-works" className="hover:text-white transition-colors">¿Cómo funciona?</Link>
                    <Link to="/sustainable-travel" className="hover:text-white transition-colors">Viaja Sostenible</Link>
                    <Link to="/security" className="hover:text-white transition-colors">Seguridad</Link>
                    <Link to="/corporate-login" className="hover:text-white transition-colors">Portal Empresas</Link>
                </div>

                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    {/* {user && <ChatIndicator />} Comentado temporalmente */}
                    {user ? (
                        <>
                            <Link to="/profile" className="font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2">
                                <span>Mi perfil</span>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/20 text-white/80 font-semibold py-2 px-4 rounded-lg hover:bg-white/10">
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/20 text-white/80 font-semibold py-2 px-4 rounded-lg hover:bg-white/10">
                                <LogIn className="w-4 h-4" /> Iniciar Sesión
                            </Link>
                            <Link to="/register" className="font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2">
                                <UserPlus className="w-4 h-4" /> Registrarse
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-3">
                    {user ? (
                        <Link to="/profile" className="font-semibold rounded-lg shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 text-sm">
                            Perfil
                        </Link>
                    ) : (
                        <Link to="/register" className="font-semibold rounded-lg shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 text-sm">
                            Registrarse
                        </Link>
                    )}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-slate-900/95 backdrop-blur-sm border-t border-white/10">
                    <div className="px-4 py-6 space-y-4">
                        <div className="space-y-3">
                            <Link to="/search" onClick={closeMobileMenu} className="block text-white/80 hover:text-white transition-colors py-2">Buscar viaje</Link>
                            <Link to="/publish-trip" onClick={closeMobileMenu} className="block text-white/80 hover:text-white transition-colors py-2">Publicar viaje</Link>
                            <Link to="/how-it-works" onClick={closeMobileMenu} className="block text-white/80 hover:text-white transition-colors py-2">¿Cómo funciona?</Link>
                            <Link to="/sustainable-travel" onClick={closeMobileMenu} className="block text-white/80 hover:text-white transition-colors py-2">Viaja Sostenible</Link>
                            <Link to="/security" onClick={closeMobileMenu} className="block text-white/80 hover:text-white transition-colors py-2">Seguridad</Link>
                            <Link to="/corporate-login" onClick={closeMobileMenu} className="block text-white/80 hover:text-white transition-colors py-2">Portal Empresas</Link>
                        </div>
                        
                        <div className="pt-4 border-t border-white/10">
                            {user ? (
                                <div className="space-y-3">
                                    <button onClick={handleLogout} className="w-full text-left text-white/80 hover:text-white transition-colors py-2">
                                        Cerrar sesión
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Link to="/login" onClick={closeMobileMenu} className="block text-white/80 hover:text-white transition-colors py-2">
                                        Iniciar Sesión
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}