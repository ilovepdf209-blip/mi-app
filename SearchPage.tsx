import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

interface Trip { id: number; from: string; to: string; driver: string; date: string; time: string; seats: number; price: number; avatar: string; }

const availableTrips: Trip[] = [
    {id:1, from: "Medellín, Antioquia", to: "Bogotá, D.C.", driver: "Diana Garcia", date: "Julio 7, 2025", time: "3:26 PM", seats: 3, price: 95000, avatar: "DG" },
    {id:2, from: "Cali, Valle del Cauca", to: "Pereira, Risaralda", driver: "Tomás R.", date: "Julio 8, 2025", time: "1:00 PM", seats: 1, price: 35000, avatar: "TR" },
];

const TripCard: React.FC<{ trip: Trip }> = ({ trip }) => (
    <div className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg flex flex-col p-6 transition-all duration-300 hover:border-purple-400/50 hover:shadow-purple-500/10 hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h4 className="text-lg font-bold text-white">{trip.from} → {trip.to}</h4>
                <p className="text-xs text-white/50">Conductor: {trip.driver}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xl border-2 border-slate-700">{trip.avatar}</div>
        </div>
        <div className="space-y-2 text-sm text-white/80 mb-4 flex-grow">
            <p><strong>Fecha:</strong> {trip.date}</p>
            <p><strong>Hora:</strong> {trip.time}</p>
            <p><strong>Asientos:</strong> {trip.seats} disponibles</p>
            <p className="text-lg font-bold text-purple-300 pt-2">{trip.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} / asiento</p>
        </div>
        <Link to={`/trip/${trip.id}`} className="w-full text-center mt-auto bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors">
            Ver Detalles
        </Link>
    </div>
);

export default function SearchPage() {
    const [searchResults] = useState<Trip[]>(availableTrips);
    return (
        <div className="relative z-10 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 mb-12">
                    <h2 className="text-3xl font-bold text-center text-white mb-6">Encuentra tu próximo viaje</h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                        <div>
                            <label className="text-sm font-medium text-white/70">Origen</label>
                            <input type="text" placeholder="Ciudad de partida" required className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/70">Destino</label>
                            <input type="text" placeholder="Ciudad de llegada" required className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/70">Fecha</label>
                            <input type="date" className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3" style={{colorScheme: 'dark'}}/>
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">
                            <SearchIcon className="w-5 h-5"/>Buscar
                        </button>
                    </form>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-6">{searchResults.length} Viajes Disponibles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {searchResults.map(trip => <TripCard key={trip.id} trip={trip} />)}
                    </div>
                 </div>
            </div>
        </div>
    );
};