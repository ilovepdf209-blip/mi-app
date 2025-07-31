import React from 'react';
import { Link } from 'react-router-dom';

type SVGProps = React.SVGProps<SVGSVGElement>;
const Facebook: React.FC<SVGProps> = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>);
const Twitter: React.FC<SVGProps> = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9-6.1-1.4-6-6.4-6-6.4s-4.6 1.4-6.5 4.3c-.3 1.1.5 2.3-.5 3.4C8.3 21.6 3 19.3 3 19.3s-1.4-2.1.2-4.9c-.2 1.1-.5 2.3-.5 3.4C3 21.6 3 19.3 3 19.3s2.9-.6 4.9-1.9c-1.4 2.1.2 4.9-.2 4.9-1.4-2.1-4.9-1.9-4.9-1.9-2.1-1.4-4.9-.2-4.9.2-2.1 1.4.2 4.9 1.9 4.9 1.4 2.1 4.9.2 4.9-.2 1.4-2.1-.2-4.9-1.9-4.9s-4.9-.2-4.9.2c-2.1 1.4.2 4.9 1.9 4.9 1.4 2.1 4.9.2 4.9-.2 1.4-2.1-.2-4.9-1.9-4.9-1.4-2.1-4.9-1.9-4.9-1.9-2.1-1.4-4.9-.2-4.9.2C1.6 15 3 16.9 3 19.3c0 .4-.1.8-.2 1.2-.5 1.1-1.2 2.1-2.1 3-1.4 1.4-3.3 2.1-5.2 2.1-1.4 0-2.8-.3-4.1-.8-1.3-.5-2.5-1.2-3.6-2.1-1.1-.9-2.1-2-2.9-3.2-.8-1.2-1.5-2.5-2-3.8-.5-1.3-1-2.7-1.3-4.1-.3-1.4-.5-2.8-.5-4.2s.2-2.8.5-4.2.7-2.7 1.3-4.1c.5-1.3 1.2-2.5 2-3.8.8-1.2 1.8-2.3 2.9-3.2 1.1-.9 2.3-1.6 3.6-2.1 1.3-.5 2.7-.8 4.1-.8 1.9 0 3.8.3 5.5 1 1.8.7 3.4 1.7 4.9 2.9.2.2.3.4.4.6.1.2.2.5.2.7s-.1.5-.2.7c-.1.2-.3.4-.4.6s-.4.3-.6.5c-.2.1-.5.2-.7.3-.2.1-.5.1-.7.1h-.5c-1.1 0-2.1-.2-3.1-.6-.9-.4-1.8-1-2.5-1.7-.7-.7-1.3-1.5-1.7-2.5-.4-1-.6-2-.6-3.1s.2-2.1.6-3.1c.4-1 .9-1.8 1.7-2.5.7-.7 1.6-1.3 2.5-1.7 1-.4 2-.6 3.1-.6h1.1c.2 0 .5.1.7.1s.5.1.7.3.4.3.6.5c.2.2.3.4.4.6.1.2.2.5.2.7s-.1.5-.2.7c-.1.2-.2.5-.4.6-.1.2-.3.4-.6.5-.2.1-.5.2-.7.3h-1.1c-1.1 0-2.1-.2-3.1-.6-.9-.4-1.8-1-2.5-1.7-.7-.7-1.3-1.5-1.7-2.5-.4-1-.6-2-.6-3.1s.2-2.1.6-3.1c.4-1 .9-1.8 1.7-2.5s1.6-1.3 2.5-1.7c1-.4 2-.6 3.1-.6h1.1c.2 0 .5.1.7.1s.5.1.7.3.4.3.6.5c.2.2.3.4.4.6.1.2.2.5.2.7s-.1.5-.2.7c-.1.2-.2.5-.4.6-.1.2-.3.4-.6.5-.2.1-.5.2-.7.3h-1.1c-1.1 0-2.1-.2-3.1-.6-.9-.4-1.8-1-2.5-1.7-.7-.7-1.3-1.5-1.7-2.5-.4-1-.6-2-.6-3.1s.2-2.1.6-3.1c.4-1 .9-1.8 1.7-2.5s1.6-1.3 2.5-1.7c1-.4 2-.6 3.1-.6h1.1c1.1 0 2.1.2 3.1.6.9.4 1.8 1 2.5 1.7.7.7 1.3 1.5 1.7 2.5.4 1 .6 2 .6 3.1z"/></svg>);
const Instagram: React.FC<SVGProps> = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>);

export default function AppFooter() {
    return (
        <footer className="relative z-10 bg-slate-900/50 border-t border-white/10 mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-white">Sobre Nosotros</h3>
                        <ul className="space-y-2 text-white/60 text-sm">
                            <li><Link to="/about-us" className="hover:underline">Quiénes somos</Link></li>
                            <li><Link to="/how-it-works" className="hover:text-white transition-colors">¿Cómo funciona?</Link></li>
                            <li><Link to="/blog" className="hover:underline">Blog / Noticias</Link></li>
                            <li><Link to="/mision" className="hover:underline">Misión: Conectando comunidades</Link></li>

                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-white">Ayuda y Soporte</h3>
                        <ul className="space-y-2 text-white/60 text-sm">
                            <li><Link to="/faq" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contacto</Link></li>
                            <li><Link to="/security" className="hover:text-white transition-colors">Seguridad</Link></li>
                            <li><Link to="/support" className="hover:text-white transition-colors">¿Cómo podemos ayudarte?</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-white">Legal y Privacidad</h3>
                        <ul className="space-y-2 text-white/60 text-sm">
                            <li><Link to="/legal/terminos" className="hover:text-white transition-colors">Términos y condiciones</Link></li>
                            <li><Link to="/legal/privacidad" className="hover:text-white transition-colors">Política de privacidad</Link></li>
                            <li><Link to="/legal/cookies" className="hover:text-white transition-colors">Política de cookies</Link></li>
                            <li><Link to="/legal/avisos" className="hover:text-white transition-colors">Avisos legales</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-white">Síguenos</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-white/60 hover:text-white transition-colors"><Facebook className="w-6 h-6"/></a>
                            <a href="#" className="text-white/60 hover:text-white transition-colors"><Twitter className="w-6 h-6"/></a>
                            <a href="#" className="text-white/60 hover:text-white transition-colors"><Instagram className="w-6 h-6"/></a>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/50">
                    <p>&copy; {new Date().getFullYear()} Viajemos Juntos CO. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}