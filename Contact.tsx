import React, { useState } from 'react';

export default function Contact() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:soporte@viajemosjuntos.co?subject=Contacto%20desde%20la%20web&body=Nombre:%20${encodeURIComponent(nombre)}%0ACorreo:%20${encodeURIComponent(correo)}%0AMensaje:%20${encodeURIComponent(mensaje)}`;
    window.location.href = mailto;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-2">
      <div className="w-full max-w-4xl bg-slate-800/80 rounded-2xl shadow-2xl p-8 md:p-12 border border-white/10">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-pink-400 mb-8">Contáctanos</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-bold text-white mb-4">Información General y Soporte</h2>
            <ul className="text-white/80 text-sm mb-6 space-y-2">
              <li><span className="font-semibold">✉️</span> info@viajemosjuntos.co</li>
              <li><span className="font-semibold">🛟</span> soporte@viajemosjuntos.co</li>
            </ul>
            <h2 className="font-bold text-white mb-4">Servicios Corporativos</h2>
            <ul className="text-white/80 text-sm mb-6 space-y-2">
              <li><span className="font-semibold">🏢</span> corporativo@viajemosjuntos.co</li>
            </ul>
            <h2 className="font-bold text-white mb-4">Redes Sociales</h2>
            <ul className="text-white/80 text-sm space-y-2">
              <li><span className="font-semibold">📘</span> /ViajemosJuntosCO</li>
              <li><span className="font-semibold">📸</span> @ViajemosJuntosCO</li>
            </ul>
          </div>
          <form onSubmit={handleSubmit} className="bg-slate-900/60 rounded-xl p-6 border border-slate-700 flex flex-col gap-4">
            <h2 className="font-bold text-white mb-2">Envíanos un Mensaje</h2>
            <input
              type="text"
              placeholder="Tu Nombre"
              className="bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Tu Correo"
              className="bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              required
            />
            <textarea
              placeholder="Mensaje"
              className="bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[100px]"
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              required
            />
            <button type="submit" className="mt-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-2 rounded-lg shadow-lg hover:scale-105 transition-all">Enviar Mensaje</button>
          </form>
        </div>
      </div>
    </div>
  );
} 