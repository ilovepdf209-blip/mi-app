import React from 'react';

const BlogNoticias: React.FC = () => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 to-purple-900">
    <div className="max-w-5xl w-full p-6 mt-10 mb-10 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-pink-400 mb-6">
        Conéctate con 'viajemos juntos': Novedades, Consejos y Más
      </h1>
      <p className="text-center text-white/80 mb-10 max-w-2xl">
        En esta sección, encontrarás artículos e información relevante sobre:
      </p>
      <div className="grid md:grid-cols-3 gap-8 w-full">
        <div className="bg-slate-800/80 rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80" alt="Novedades" className="rounded-lg mb-4 w-full object-cover h-40" />
          <h2 className="text-xl font-semibold text-white mb-2 text-center">Novedades de la Plataforma</h2>
          <p className="text-white/80 mb-4 text-center">Actualizaciones, nuevas funcionalidades y mejoras en "viajemos juntos".</p>
          <a href="#" className="text-pink-400 font-semibold hover:underline">Leer más →</a>
        </div>
        <div className="bg-slate-800/80 rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Consejos de Viaje" className="rounded-lg mb-4 w-full object-cover h-40" />
          <h2 className="text-xl font-semibold text-white mb-2 text-center">Consejos de Viaje</h2>
          <p className="text-white/80 mb-4 text-center">Consejos para Viajeros y Conductores: cómo sacar el máximo provecho a la app, consejos de seguridad, y cómo hacer de cada viaje una gran experiencia.</p>
          <a href="#" className="text-pink-400 font-semibold hover:underline">Leer más →</a>
        </div>
        <div className="bg-slate-800/80 rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="Sostenibilidad" className="rounded-lg mb-4 w-full object-cover h-40" />
          <h2 className="text-xl font-semibold text-white mb-2 text-center">Sostenibilidad</h2>
          <p className="text-white/80 mb-4 text-center">Movilidad Sostenible en Antioquia: noticias sobre iniciativas locales, impacto del carpooling y cómo contribuimos a un transporte más verde.</p>
          <a href="#" className="text-pink-400 font-semibold hover:underline">Leer más →</a>
        </div>
      </div>
    </div>
  </div>
);

export default BlogNoticias; 