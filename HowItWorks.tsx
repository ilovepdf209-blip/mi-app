import { useNavigate } from 'react-router-dom';
// Elimino la importación de React si no se usa

// --- Iconos (Simulación de Lucide) ---
const Users: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const Car: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16.5 17.5 13H22v-2h-4.5l-3.5 3.5"/><path d="M8 18H2v-2h6"/><path d="M10 18.5 14 13l-4-5.5H2v2h5.5l2 3-2.5 2.5"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/></svg>);

// --- Componentes UI Simulados ---
type ActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string };
const ActionButton: React.FC<ActionButtonProps> = ({ children, className = '', ...props }) => (
    <button 
      className={`font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </button>
);

type InfoPageProps = {
  title: string;
  children: React.ReactNode;
  cta?: boolean;
};
const InfoPage: React.FC<InfoPageProps> = ({ title, children, cta = true }) => {
    const navigate = useNavigate();
    return (
        <div className="relative z-10 pt-32 pb-20 min-h-[80vh] flex flex-col items-center justify-center">
            <div className="w-full max-w-5xl mx-auto px-4">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 sm:p-12 flex flex-col items-center">
                    <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-12">{title}</h1>
                    <div className="prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed space-y-4 w-full">{children}</div>
                    {cta && (
                      <div className="flex flex-col items-center justify-center w-full mt-12 pt-8 border-t border-white/10">
                        <h2 className="text-3xl font-bold text-white mb-4">¿Listo para tu próximo viaje?</h2>
                        <p className="text-white/70 mb-6 max-w-xl mx-auto text-center">Empieza hoy mismo a buscar tu compañero de ruta ideal o publica los asientos libres en tu vehículo.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                          <ActionButton onClick={() => navigate('/search')} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 w-full sm:w-auto">¡Buscar un viaje!</ActionButton>
                          <ActionButton onClick={() => navigate('/publish-trip')} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 w-full sm:w-auto">¡Publicar viaje!</ActionButton>
                        </div>
                      </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Componente Principal de "Cómo Funciona" ---
const HowItWorksPage: React.FC = () => (
    <InfoPage title="Así de Fácil es Moverte con 'viajemos juntos'">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Para Pasajeros */}
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Users className="w-8 h-8 text-cyan-400" /> Para Pasajeros</h2>
                <ol className="relative border-l-2 border-cyan-500/30 space-y-8 pl-8">
                   {[{title: "Regístrate y Crea tu Perfil", desc: "Descarga la app (o accede desde nuestra web), completa tu perfil y verifica tu identidad. ¡Un perfil completo genera más confianza en la comunidad!"}, {title: "Busca tu Viaje", desc: "Ingresa tu punto de origen, destino y la fecha en la que deseas viajar. Nuestra plataforma te mostrará los viajes disponibles que coinciden con tu ruta."}, {title: "Elige tu Conductor", desc: "Revisa los perfiles de los conductores, las calificaciones de otros usuarios, los detalles del vehículo y la contribución sugerida para los gastos del viaje."}, {title: "Reserva tu Asiento", desc: "Una vez encuentres el viaje ideal, solicita la reserva. Algunos conductores aceptan automáticamente, otros revisan cada solicitud."}, {title: "Confirma y Viaja", desc: "Cuando el conductor acepte, recibirás una confirmación. Coordina los últimos detalles a través de nuestro chat seguro y ¡listo para viajar!"}, {title: "Paga tu Contribución", desc: "La contribución para los gastos del viaje se realiza según lo acordado."}, {title: "Califica tu Experiencia", desc: "Después del viaje, califica al conductor. Tu opinión es vital para mantener una comunidad segura y confiable."}].map((item, i) => (
                        <li key={i} className="relative">
                            <div className="absolute -left-[34px] w-4 h-4 bg-cyan-400 rounded-full mt-1.5 border-4 border-slate-900"></div>
                            <h4 className="font-semibold text-lg text-white">{item.title}</h4>
                            <p className="text-sm text-white/70">{item.desc}</p>
                        </li>
                   ))}
                </ol>
            </div>
            {/* Para Conductores */}
             <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Car className="w-8 h-8 text-purple-400" /> Para Conductores</h2>
                <ol className="relative border-l-2 border-purple-500/30 space-y-8 pl-8">
                   {[{title: "Regístrate y Verifica", desc: "Completa tu perfil, verifica tu identidad y registra los datos de tu vehículo (crucial para la seguridad y el cálculo de la huella de carbono)."}, {title: "Publica tu Viaje", desc: "Indica tu ruta, fecha, hora de salida y el número de asientos disponibles."}, {title: "Establece la Contribución", desc: "Nuestra plataforma te ayudará a calcular una contribución justa para compartir los gastos del viaje (combustible, peajes, etc.)."}, {title: "Gestiona las Solicitudes", desc: "Recibe notificaciones cuando los pasajeros soliciten reservar. Puedes aceptar o rechazar las solicitudes."}, {title: "Comunícate y Viaja", desc: "Utiliza nuestro chat seguro para coordinar los detalles finales con tus pasajeros."}, {title: "Recibe la Contribución", desc: "Los pasajeros realizarán el aporte a los gastos según lo acordado."}, {title: "Califica a tus Pasajeros", desc: "Tu feedback también es importante para la comunidad."}].map((item, i) => (
                        <li key={i} className="relative">
                            <div className="absolute -left-[34px] w-4 h-4 bg-purple-400 rounded-full mt-1.5 border-4 border-slate-900"></div>
                            <h4 className="font-semibold text-lg text-white">{item.title}</h4>
                            <p className="text-sm text-white/70">{item.desc}</p>
                        </li>
                   ))}
                </ol>
            </div>
        </div>
         <p className="mt-12 text-center text-lg font-semibold">¡Así de simple! "viajemos juntos" te conecta para que tus viajes sean más eficientes y colaborativos.</p>
    </InfoPage>
);

export default HowItWorksPage;
