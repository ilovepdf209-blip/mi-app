import React from 'react';

const LegalAvisos: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-2">
    <div className="w-full max-w-2xl bg-slate-800/80 rounded-2xl shadow-2xl p-8 md:p-12 border border-white/10 text-white">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Avisos Legales Importantes</h1>
      <h2 className="text-xl font-bold mt-8 mb-2">Naturaleza de la Plataforma</h2>
      <p className="mb-4">"viajemos juntos" es una plataforma tecnológica que actúa únicamente como intermediaria para facilitar el carpooling. No es una empresa de transporte. El contrato de viaje se celebra exclusivamente entre conductor y pasajero.</p>
      <h2 className="text-xl font-bold mt-8 mb-2">Responsabilidad del Usuario</h2>
      <p className="mb-4">Cada usuario es responsable de sus acciones y de la información que proporciona. Los conductores deben cumplir con todas las leyes de tránsito y tener sus seguros al día.</p>
      <h2 className="text-xl font-bold mt-8 mb-2">Cálculo de Huella de Carbono</h2>
      <p className="mb-4">Las cifras de emisiones de CO₂ son estimaciones con fines informativos y de concienciación, basadas en datos estándar y la información del vehículo proporcionada.</p>
      <h2 className="text-xl font-bold mt-8 mb-2">Contacto Legal</h2>
      <p>Para cualquier consulta legal, puedes contactarnos a través del formulario de contacto.</p>
    </div>
  </div>
);

export default LegalAvisos; 