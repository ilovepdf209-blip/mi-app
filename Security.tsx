export default function Security() {
    return (
        <div className="relative z-10 pt-32 pb-20 flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-2xl mx-auto px-4">
                <div className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 sm:p-12">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">Tu Seguridad, Nuestra Prioridad en Cada Viaje</h1>
                    <p className="text-white/80 text-center mb-8">En "viajemos juntos", nos tomamos la seguridad muy en serio. Hemos implementado múltiples medidas y ofrecemos herramientas para que cada viaje compartido sea una experiencia confiable y tranquila.</p>
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-2">Nuestro Compromiso con la Seguridad</h2>
                        <ul className="text-white/80 space-y-2">
                            <li><span className="font-semibold text-purple-300">Verificación de Perfiles:</span> Implementamos procesos para verificar la identidad de nuestros usuarios y promovemos la validación de la documentación del vehículo.</li>
                            <li><span className="font-semibold text-pink-300">Sistema de Calificaciones y Reseñas:</span> Después de cada viaje, la comunidad se califica mutuamente, construyendo una red de confianza.</li>
                            <li><span className="font-semibold text-cyan-300">Comunicación Segura:</span> Usa nuestro chat interno para compartir sin exponer tu número personal hasta que sea necesario.</li>
                            <li><span className="font-semibold text-emerald-300">Soporte Dedicado:</span> Nuestro equipo está disponible para ayudarte a gestionar cualquier incidente.</li>
                        </ul>
                    </div>
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-2">Consejos de Seguridad para Todos</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="bg-slate-700/60 rounded-lg p-4">
                                <span className="font-semibold text-white">Completa tu Perfil:</span> Un perfil detallado y verificado inspira más confianza.
                            </div>
                            <div className="bg-slate-700/60 rounded-lg p-4">
                                <span className="font-semibold text-white">Revisa Calificaciones:</span> Tómate un momento para conocer la experiencia de otros con el usuario.
                            </div>
                            <div className="bg-slate-700/60 rounded-lg p-4">
                                <span className="font-semibold text-white">Comunícate con Claridad:</span> Confirma todos los detalles del viaje antes de salir.
                            </div>
                            <div className="bg-slate-700/60 rounded-lg p-4">
                                <span className="font-semibold text-white">Confirma la Identidad:</span> Asegúrate que la persona y el vehículo coincidan con el perfil.
                            </div>
                            <div className="bg-slate-700/60 rounded-lg p-4">
                                <span className="font-semibold text-white">Elige Lugares Seguros:</span> Acuerda puntos de encuentro públicos, bien iluminados y concurridos.
                            </div>
                            <div className="bg-slate-700/60 rounded-lg p-4">
                                <span className="font-semibold text-white">Confía en tus Instintos:</span> Si algo no te parece bien, tienes derecho a cancelar el viaje.
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 p-4 rounded-lg border border-purple-500 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-center">
                        <span className="font-bold text-purple-300">Viaja con Confianza</span>
                        <p className="text-white/70 mt-2">Tu colaboración reportando cualquier incidente o comportamiento inadecuado es fundamental para mantener una comunidad segura para todos.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
