import React from 'react';

// Se define el tipo para los props del botón.
// Es buena práctica tener componentes reutilizables como este en su propio archivo.
interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, className, ...props }) => (
    <button 
      className={`font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </button>
);


export default function ActionCards() {
    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Card 1: Publicar */}
            {/* Se añadieron las clases de transición y efecto hover a este div */}
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-center transition-all duration-300 hover:-translate-y-2">
               <div className="p-8 flex-1">
                 <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">Ahorra compartiendo los gastos de tu viaje</h3>
                 <p className="text-white/70 mb-6">Publica los asientos libres de tu coche y cubre tus gastos de gasolina y peajes. Es fácil, rápido y seguro.</p>
                 <ActionButton className="bg-gradient-to-r from-purple-600 to-pink-600 text-white !py-2.5">
                    Publicar mi viaje ahora
                 </ActionButton>
               </div>
               <img src="https://images.unsplash.com/photo-1533560699268-45607a710185?q=80&w=1974&auto=format&fit=crop" alt="Persona conduciendo un coche" className="w-full md:w-1/3 h-48 md:h-full object-cover"/>
            </div>

            {/* Card 2: Descubrir */}
            {/* Se añadieron las clases de transición y efecto hover a este div */}
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-center transition-all duration-300 hover:-translate-y-2">
                <img src="https://images.unsplash.com/photo-1618828232320-746979245136?q=80&w=1964&auto=format&fit=crop" alt="Personas en un viaje por carretera" className="w-full md:w-1/3 h-48 md:h-full object-cover"/>
               <div className="p-8 flex-1">
                 <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3">Descubre Colombia, asiento a asiento</h3>
                 <p className="text-white/70 mb-6">Desde la montaña hasta la costa, encuentra viajes a miles de destinos. Conoce gente nueva y explora el país de una forma económica y sostenible.</p>
                 <ActionButton className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white !py-2.5">
                    Encontrar un viaje
                 </ActionButton>
               </div>
            </div>
        </div>
    );
}