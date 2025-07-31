import React from 'react';

const valores = [
  {
    titulo: 'Colaborativa',
    descripcion: 'Fomentamos la cultura de compartir, donde conductores y pasajeros se benefician mutuamente, optimizando recursos y haciendo los viajes más amigables.'
  },
  {
    titulo: 'Accesible',
    descripcion: 'Buscamos que más personas puedan acceder a opciones de transporte asequibles y seguras, reduciendo las barreras económicas y geográficas.'
  },
  {
    titulo: 'Eficiente',
    descripcion: 'Facilitamos conexiones directas y personalizadas, reduciendo tiempos de viaje y la dependencia de rutas fijas que no siempre se ajustan a las necesidades individuales.'
  },
  {
    titulo: 'Sostenible',
    descripcion: 'Estamos comprometidos con el medio ambiente. Cada asiento ocupado en un viaje compartido significa potencialmente un auto menos en la vía, contribuyendo a la reducción de la congestión y las emisiones de CO₂.'
  },
  {
    titulo: 'Local',
    descripcion: 'Nuestro corazón está en Antioquia. Entendemos las particularidades de nuestra región y enfocamos nuestros esfuerzos en resolver los desafíos de movilidad que enfrentamos aquí.'
  },
  {
    titulo: 'Confiable',
    descripcion: 'Construimos un entorno de confianza a través de la verificación de usuarios, sistemas de calificación y un soporte cercano, para que cada viaje sea una experiencia segura y agradable.'
  }
];

const Mision: React.FC = () => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 py-10">
    <div className="max-w-3xl w-full bg-slate-900/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-pink-400 mb-6">
        Nuestra Misión: <span className="block text-2xl md:text-3xl text-white mt-2">Tejer Conexiones, Transformar la Movilidad en Antioquia</span>
      </h1>
      <p className="text-white/90 text-center mb-4">
        En "viajemos juntos", creemos que la movilidad va más allá de simplemente trasladarse de un punto A a un punto B. Se trata de conectar personas, crear oportunidades y construir una comunidad más fuerte y sostenible en nuestra querida Antioquia.
      </p>
      <p className="text-white/90 text-center mb-8">
        <span className="font-semibold">Nuestra misión</span> es conectar comunidades a través de una plataforma de viajes compartidos que sea:
      </p>
      <div className="grid md:grid-cols-3 gap-6 w-full mb-8">
        {valores.map((valor) => (
          <div key={valor.titulo} className="bg-slate-800/80 rounded-xl shadow-lg p-5 flex flex-col items-center border border-pink-400/20 hover:scale-105 transition-transform">
            <h3 className="text-lg font-bold text-pink-400 mb-2 text-center">{valor.titulo}</h3>
            <p className="text-white/80 text-center text-sm">{valor.descripcion}</p>
          </div>
        ))}
      </div>
      <p className="text-white/90 text-center font-semibold">
        "viajemos juntos" es una herramienta para tejer lazos, facilitar encuentros, apoyar la economía local y movernos hacia un futuro donde la movilidad sea un pilar del desarrollo y bienestar de todas nuestras comunidades en Antioquia.
      </p>
    </div>
  </div>
);

export default Mision; 