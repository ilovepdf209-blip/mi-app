import React from 'react';

const AboutUs: React.FC = () => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 to-purple-900">
    <div className="bg-slate-900/80 rounded-2xl shadow-2xl p-8 max-w-2xl w-full mt-10 mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-pink-400 mb-6">
        Sobre 'viajemos juntos': Movilidad Inteligente y Sostenible para Antioquia
      </h1>
      <p className="text-white/90 mb-4">
        Bienvenido a "viajemos juntos", la plataforma que está transformando la manera en que nos movemos por Antioquia. Nacimos de una necesidad real y de una pasión por optimizar nuestros viajes, hacerlos más económicos y, al mismo tiempo, cuidar nuestro planeta.
      </p>
      <p className="text-white/90 mb-4">
        Somos un equipo con profunda experiencia en los sectores de transporte y turismo en Colombia, y con un conocimiento especializado en el impacto ambiental de nuestros desplazamientos. Entendemos los desafíos de movilidad que enfrentan los antioqueños día a día: desde los altos costos de los peajes y el combustible hasta la necesidad de conexiones más directas y eficientes entre nuestros municipios.
      </p>
      <p className="text-white/90 mb-4">
        "viajemos juntos" es más que una aplicación; es una comunidad. Conectamos a conductores que tienen asientos libres en sus vehículos con pasajeros que se dirigen en la misma dirección. Nuestro modelo se basa en compartir los gastos del viaje de manera justa y transparente, haciendo cada trayecto más accesible para todos.
      </p>
      <p className="text-white/90 mb-4">
        Además, estamos comprometidos con un futuro más verde. Creemos que cada viaje compartido es un paso hacia la reducción de nuestra huella de carbono. Por ello, integramos herramientas para que tanto usuarios como empresas puedan ser conscientes de su impacto y contribuir activamente a la sostenibilidad de nuestra región.
      </p>
      <p className="text-white font-semibold mt-6">
        Nuestra misión es simple: hacer que viajar por Antioquia sea más inteligente, económico, colaborativo y sostenible.
      </p>
    </div>
  </div>
);

export default AboutUs; 