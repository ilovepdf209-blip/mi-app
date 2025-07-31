import React from 'react';

const LegalPrivacidad: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-2">
    <div className="w-full max-w-2xl bg-slate-800/80 rounded-2xl shadow-2xl p-8 md:p-12 border border-white/10 text-white">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Política de Privacidad y Tratamiento de Datos Personales</h1>
      <p className="text-sm text-white/60 mb-4">Última actualización: 07 de Junio, 2024</p>
      <p className="mb-4">En "viajemos juntos", valoramos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política explica cómo recopilamos, usamos, compartimos y protegemos tu información.</p>
      <h2 className="text-xl font-bold mt-8 mb-2">Datos que Recopilamos</h2>
      <p>Información de registro (nombre, contacto, identificación), datos de perfil, información de viajes (rutas, horarios), datos de vehículos (conductores), datos de ubicación (con tu consentimiento), calificaciones, comunicaciones con soporte, información de pago (a través de pasarelas seguras), y datos de uso de la plataforma.</p>
      <h2 className="text-xl font-bold mt-8 mb-2">Finalidades del Tratamiento</h2>
      <p>Utilizamos tus datos para prestar y mejorar nuestros servicios, verificar tu identidad, facilitar la comunicación, procesar pagos, calcular la huella de carbono, enviar notificaciones y cumplir con obligaciones legales.</p>
      <h2 className="text-xl font-bold mt-8 mb-2">Tus Derechos (ARCO)</h2>
      <p>Tienes derecho a conocer, actualizar, rectificar tus datos, y demás derechos consagrados en la Ley 1581 de 2012. Puedes contactarnos para ejercerlos.</p>
      <h2 className="text-xl font-bold mt-8 mb-2">Medidas de Seguridad</h2>
      <p>Implementamos medidas técnicas y organizativas para proteger tu información contra accesos no autorizados, pérdida o alteración.</p>
      <h2 className="text-xl font-bold mt-8 mb-2">Contacto</h2>
      <p>Para ejercer tus derechos o resolver dudas sobre privacidad, contáctanos a través del formulario de contacto.</p>
    </div>
  </div>
);

export default LegalPrivacidad; 