import React from 'react';
import { Link } from 'react-router-dom';

export default function Support() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-2">
      <div className="w-full max-w-3xl bg-slate-800/80 rounded-2xl shadow-2xl p-8 md:p-12 border border-white/10">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-pink-400 mb-4">Estamos Aquí para Ti: Soporte 'viajemos juntos'</h1>
        <p className="text-center text-white/80 mb-10">En "viajemos juntos", tu experiencia es nuestra prioridad. Si tienes alguna pregunta, inconveniente o necesitas asistencia, nuestro equipo de soporte está listo para ayudarte.</p>
        <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">Canales de Soporte</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-700">
            <h3 className="font-semibold text-white mb-2">Centro de Ayuda en la App/Web</h3>
            <p className="text-white/70 text-sm mb-2">Encuentra respuestas a las preguntas más comunes en nuestra sección de <Link to="/faq" className="text-purple-400 hover:underline">Preguntas Frecuentes (FAQ)</Link>.</p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-700">
            <h3 className="font-semibold text-white mb-2">Correo Electrónico</h3>
            <p className="text-white/70 text-sm mb-2">Escríbenos a <a href="mailto:soporte@viajemosjuntos.co" className="text-purple-400 hover:underline">soporte@viajemosjuntos.co</a>. Nos esforzamos por responder en 24-48 horas hábiles.</p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-700">
            <h3 className="font-semibold text-white mb-2">Formulario de Contacto Web</h3>
            <p className="text-white/70 text-sm mb-2">Envíanos tus consultas detalladas a través de nuestro <Link to="/contact" className="text-purple-400 hover:underline">formulario de contacto</Link>.</p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-700">
            <h3 className="font-semibold text-white mb-2">Redes Sociales</h3>
            <p className="text-white/70 text-sm mb-2">También puedes contactarnos a través de nuestros perfiles, aunque para soporte técnico te recomendamos los canales anteriores.</p>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-white/60 hover:text-white transition-colors" aria-label="Facebook"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
              <a href="#" className="text-white/60 hover:text-white transition-colors" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 