import React, { useState, useEffect } from 'react';
import { Leaf, Zap, Users, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Componente para una tarjeta de beneficio individual
const BenefitCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`
        bg-gray-800/30 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 
        transform transition-all duration-500 ease-in-out
        hover:bg-cyan-400/10 hover:border-cyan-400/50 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
    >
      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-900/50 border border-cyan-500/30 rounded-full shadow-inner shadow-cyan-500/10">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-cyan-300">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default function SustainableTravel() {
  const navigate = useNavigate();
  const benefits = [
    {
      icon: <Leaf className="w-8 h-8 text-green-400" />,
      title: "Reduce tu Huella",
      description: "Cada viaje compartido disminuye las emisiones de CO2, combatiendo el cambio climático un kilómetro a la vez.",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Ahorra Energía",
      description: "Menos autos en la carretera significa un menor consumo de combustibles fósiles y un gran paso hacia la eficiencia energética.",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Conecta Comunidades",
      description: "Fomenta una comunidad más unida y reduce la congestión del tráfico en nuestras ciudades.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-white overflow-hidden relative">
      {/* Fondo de partículas animadas */}
      <div className="absolute inset-0 z-0">
        <div id="stars1" className="absolute w-full h-full"></div>
        <div id="stars2" className="absolute w-full h-full"></div>
        <div id="stars3" className="absolute w-full h-full"></div>
      </div>
      {/* Contenedor principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8 pt-40">
        <div className="w-full max-w-6xl mx-auto">
          <header className="text-center mb-12 md:mb-20">
            <div className="inline-block bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-4">
                <p className="text-cyan-300 text-sm font-medium flex items-center">
                    <Globe className="w-4 h-4 mr-2" /> Un Planeta, Un Futuro
                </p>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-4">
              Viaje <span className="text-cyan-400">Sostenible</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300">
              Cada viaje compartido reduce la huella de carbono, disminuye el tráfico y contribuye a un planeta más saludable. <br className="hidden md:block" />
              <span className="font-semibold text-cyan-300">Gracias por ser parte del cambio.</span>
            </p>
          </header>

          <main>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <BenefitCard
                  key={index}
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                  delay={index * 200 + 300}
                />
              ))}
            </div>
          </main>

          <footer className="text-center mt-16 md:mt-24">
             <button
                className="bg-cyan-500 text-gray-900 font-bold py-3 px-8 rounded-full transform transition-all duration-300 ease-in-out hover:bg-cyan-400 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
                onClick={() => navigate('/search')}
             >
                Explora Viajes Disponibles
             </button>
          </footer>
        </div>
      </div>
      {/* Estilos para las partículas de fondo. No es ideal en JSX pero funciona para demos */}
      <style>{`
        @keyframes move-twink-back {
            from {background-position:0 0;}
            to {background-position:-10000px 5000px;}
        }
        #stars1 {
          background: transparent url(https://www.script-tutorials.com/demos/360/images/stars.png) repeat top center;
          animation: move-twink-back 200s linear infinite;
        }
        #stars2 {
          background: transparent url(https://www.script-tutorials.com/demos/360/images/twinkling.png) repeat top center;
          animation: move-twink-back 150s linear infinite;
        }
        #stars3 {
          background: transparent url(https://www.script-tutorials.com/demos/360/images/clouds.png) repeat top center;
          animation: move-twink-back 100s linear infinite;
        }
      `}</style>
    </div>
  );
}
