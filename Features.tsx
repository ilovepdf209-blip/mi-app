import React from 'react';

// Tipos e Iconos
type SVGProps = React.SVGProps<SVGSVGElement>;
const DollarSign: React.FC<SVGProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const Users: React.FC<SVGProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const RouteIcon: React.FC<SVGProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3"></circle><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path><circle cx="18" cy="5" r="3"></circle></svg>;
const ChevronRight: React.FC<SVGProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>;

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


export default function Features() {
    const heroCards = [
        { id: 1, title: "Ahorra en cada Viaje", description: "Comparte los gastos de tu viaje, desde el combustible hasta los peajes.", icon: <DollarSign className="w-8 h-8" />, gradient: "from-emerald-400 to-cyan-600", buttonText: "Descubre cómo", stats: { number: "70%", label: "AHORRO PROMEDIO" } },
        { id: 2, title: "Conecta y Comparte", description: "Encuentra compañeros de ruta para tus trayectos diarios o escapadas de fin de semana.", icon: <Users className="w-8 h-8" />, gradient: "from-purple-500 to-indigo-700", buttonText: "Encuentra Viajes", stats: { number: "15K+", label: "USUARIOS" } },
        { id: 3, title: "Publica tu Viaje", description: "Publica los asientos libres de tu coche y cubre tus gastos de gasolina y peajes.", icon: <RouteIcon className="w-8 h-8" />, gradient: "from-blue-500 to-purple-700", buttonText: "Publica Ahora", stats: { number: "2min", label: "PARA PUBLICAR" } },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {heroCards.map((card) => (
                <div key={card.id} className="group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-lg shadow-xl hover:shadow-2xl rounded-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="p-8 relative z-10 flex flex-col h-full">
                         <div className="flex items-start justify-between mb-6">
                            <div className={`p-3.5 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                                <div className="text-white">{card.icon}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white mb-1">{card.stats.number}</div>
                                <div className="text-xs text-white/60 font-medium uppercase">{card.stats.label}</div>
                            </div>
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
                            <p className="text-white/70 text-sm h-16">{card.description}</p>
                        </div>
                        <ActionButton className={`w-full mt-4 bg-gradient-to-r ${card.gradient} text-white border-0 !py-2.5`}>
                           {card.buttonText} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </ActionButton>
                    </div>
                </div>
            ))}
        </div>
    );
}