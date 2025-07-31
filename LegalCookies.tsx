import React from 'react';

const LegalCookies: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-2">
    <div className="w-full max-w-2xl bg-slate-800/80 rounded-2xl shadow-2xl p-8 md:p-12 border border-white/10 text-white">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Política de Cookies de 'viajemos juntos'</h1>
      <p className="text-sm text-white/60 mb-4">Última actualización: 07 de Junio, 2024</p>
      <h2 className="text-xl font-bold mt-8 mb-2">¿Qué son las Cookies?</h2>
      <p className="mb-4">Son pequeños archivos de texto que los sitios web que visitas colocan en tu dispositivo para almacenar información sobre tu navegación.</p>
      <h2 className="text-xl font-bold mt-8 mb-2">¿Cómo las Utilizamos?</h2>
      <p className="mb-2">Usamos cookies para funciones esenciales, mejora del rendimiento, personalización y, ocasionalmente, para publicidad relevante (con tu consentimiento).</p>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li><b>Cookies Esenciales:</b> Para que la plataforma funcione (ej. mantener tu sesión iniciada).</li>
        <li><b>Cookies de Análisis:</b> Para entender cómo se usa la plataforma y mejorarla (ej. Google Analytics).</li>
        <li><b>Cookies de Personalización:</b> Para recordar tus preferencias y adaptar la experiencia.</li>
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-2">¿Cómo Puedes Gestionarlas?</h2>
      <p>La mayoría de los navegadores te permiten ver, gestionar y eliminar cookies. Ten en cuenta que si bloqueas ciertas cookies, algunas funcionalidades de "viajemos juntos" podrían no operar correctamente.</p>
    </div>
  </div>
);

export default LegalCookies; 