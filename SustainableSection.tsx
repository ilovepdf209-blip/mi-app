export default function SustainableSection() {
    return (
        <section className="w-full max-w-6xl mx-auto my-16 bg-slate-800/60 border border-white/10 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center overflow-hidden">
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center mb-4">
                    <div className="bg-emerald-500/90 rounded-lg p-2 mr-3">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">Reduce tu Huella de Carbono,<br />Viaje a Viaje</h2>
                </div>
                <p className="text-white/80 text-lg mb-8 max-w-xl">Cada vez que compartes un viaje, no solo ahorras dinero, sino que contribuyes a un planeta más saludable. Menos coches en la carretera significan menos emisiones, menos tráfico y más espacios verdes para todos.</p>
                <a href="#" className="inline-flex items-center px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg shadow-md transition-colors">
                    Aprende más
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </a>
            </div>
            <div className="flex-1 min-h-[280px] h-full w-full md:w-1/2">
                <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" alt="Bosque y puente sostenible" className="object-cover w-full h-full rounded-b-2xl md:rounded-b-none md:rounded-r-2xl" />
            </div>
        </section>
    );
}