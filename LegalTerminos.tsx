import React from 'react';

const LegalTerminos: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-2">
    <div className="w-full max-w-2xl bg-slate-800/80 rounded-2xl shadow-2xl p-8 md:p-12 border border-white/10 text-white">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Términos y Condiciones de Uso de 'viajemos juntos'</h1>
      <p className="text-sm text-white/60 mb-4">Última actualización: 07 de Junio, 2024</p>
      <p className="mb-4">Bienvenido/a a "viajemos juntos". Al utilizar nuestra plataforma (sitio web y aplicación móvil), aceptas estos Términos y Condiciones. Por favor, léelos con atención.</p>
      <h2 className="text-xl font-bold mt-8 mb-2">Definición del Servicio</h2>
      <p className="mb-4">"viajemos juntos" es una plataforma tecnológica que actúa como intermediaria para conectar a conductores que disponen de asientos libres en sus vehículos particulares con usuarios que desean compartir un trayecto específico y sus gastos asociados (carpooling). No somos una empresa de transporte ni ofrecemos servicios de taxi. El acuerdo de viaje se establece directamente entre el conductor y el pasajero.</p>
      <h2 className="text-xl font-bold mt-8 mb-2">Uso de la Plataforma</h2>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li><b>Registro y Verificación:</b> Debes proporcionar información veraz y mantenerla actualizada. Nos reservamos el derecho de verificar tu identidad.</li>
        <li><b>Conductores:</b> Deben poseer licencia vigente, SOAT, revisión técnico-mecánica al día, y publicar viajes con la intención genuina de compartir gastos, no de lucrarse.</li>
        <li><b>Pasajeros:</b> Deben comportarse respetuosamente y cumplir con el pago de la contribución acordada.</li>
      </ul>
      <h2 className="text-xl font-bold mt-8 mb-2">Limitación de Responsabilidad</h2>
      <p className="mb-4">Como intermediarios, no somos responsables por incidentes ocurridos durante los viajes, la conducta de los usuarios, ni por la exactitud de toda la información publicada por ellos.</p>
      <h2 className="text-xl font-bold mt-8 mb-2">Modificaciones</h2>
      <p className="mb-4">Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cambios importantes a través de la plataforma.</p>
      <h2 className="text-xl font-bold mt-8 mb-2">Contacto</h2>
      <p>Para consultas sobre estos términos, contáctanos a través del formulario de contacto.</p>
    </div>
  </div>
);

export default LegalTerminos; 