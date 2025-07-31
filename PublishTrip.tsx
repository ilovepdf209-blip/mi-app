import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Iconos (Simulación de Lucide) ---
// const MapPin: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
// const DollarSign: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
// const Users: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;

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

const locations = [
  "Bogotá, D.C.", "Medellín, Antioquia", "Cali, Valle del Cauca", "Barranquilla, Atlántico", "Cartagena, Bolívar", "Aeropuerto El Dorado (BOG), Bogotá", "Aeropuerto José María Córdova (MDE), Rionegro"
];

type TripDetails = {
  origin: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  price: number;
  description: string;
};

const initialTripDetails: TripDetails = {
  origin: '',
  destination: '',
  date: '',
  time: '',
  seats: 2,
  price: 50000,
  description: '',
};

// Reemplaza 'TU_API_KEY' por tu clave real de Google Maps
const GOOGLE_MAPS_API_KEY = 'TU_API_KEY';

const defaultCenter = { lat: 6.2442, lng: -75.5812 }; // Medellín por defecto

// @ts-ignore
// eslint-disable-next-line
declare global {
  interface Window {
    google: any;
  }
}

const PublishTrip: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<number>(1);
    const [tripDetails, setTripDetails] = useState<TripDetails>(initialTripDetails);
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);
    const directionsRenderer = useRef<any>(null);
    const directionsService = useRef<any>(null);
    const mapInstance = useRef<any>(null);

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setTripDetails(prev => ({
          ...prev,
          [name]: type === 'number' || name === 'seats' || name === 'price' ? Number(value) : value
        }));
    };

    const progress = ((step - 1) / 3) * 100;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Viaje de ${tripDetails.origin} a ${tripDetails.destination} publicado!`);
        navigate('/search');
    }

    // Cargar el script de Google Maps solo una vez
    useEffect(() => {
        if (window.google && window.google.maps) {
            setMapLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = () => setMapLoaded(true);
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Inicializar el mapa y mostrar la ruta cuando ambos puntos estén definidos
    useEffect(() => {
        if (!mapLoaded || !mapRef.current) return;
        if (!window.google || !window.google.maps) return;
        if (!tripDetails.origin || !tripDetails.destination) return;

        if (!mapInstance.current) {
            mapInstance.current = new window.google.maps.Map(mapRef.current, {
                center: defaultCenter,
                zoom: 7,
                disableDefaultUI: true,
                styles: [
                    { elementType: 'geometry', stylers: [{ color: '#1a2233' }] },
                    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a2233' }] },
                    { elementType: 'labels.text.fill', stylers: [{ color: '#f3f3f3' }] },
                ],
            });
        }
        if (!directionsRenderer.current) {
            directionsRenderer.current = new window.google.maps.DirectionsRenderer({
                map: mapInstance.current,
                suppressMarkers: false,
                polylineOptions: { strokeColor: '#06b6d4', strokeWeight: 5 },
            });
        }
        if (!directionsService.current) {
            directionsService.current = new window.google.maps.DirectionsService();
        }
        directionsService.current.route(
            {
                origin: tripDetails.origin,
                destination: tripDetails.destination,
                travelMode: 'DRIVING',
            },
            (result: any, status: string) => {
                if (status === 'OK') {
                    directionsRenderer.current.setDirections(result);
                }
            }
        );
    }, [tripDetails.origin, tripDetails.destination, mapLoaded]);

    return (
        <div className="bg-slate-900 text-white min-h-screen">
            <div className="relative z-10 pt-24 pb-20">
              <div className="max-w-4xl mx-auto px-4">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                  <h1 className="text-3xl lg:text-4xl font-bold text-center text-white mb-4">Publica tu Viaje</h1>
                  <p className="text-center text-white/60 mb-8">Comparte tu ruta y gastos con otros viajeros.</p>
                  {/* Barra de Progreso */}
                   <div className="my-8">
                      <div className="relative h-2 bg-slate-700 rounded-full">
                        <div className="absolute top-0 left-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
                      </div>
                      <div className="flex justify-between text-xs text-white/50 mt-2">
                        <span className={step >= 1 ? 'text-purple-400 font-bold' : ''}>1. Ruta</span>
                        <span className={step >= 2 ? 'text-purple-400 font-bold' : ''}>2. Horario</span>
                        <span className={step >= 3 ? 'text-purple-400 font-bold' : ''}>3. Detalles</span>
                        <span className={step >= 4 ? 'text-purple-400 font-bold' : ''}>4. Revisar</span>
                      </div>
                   </div>
                  <form onSubmit={handleSubmit}>
                    {step === 1 && (
                      <div className="space-y-6 animate-fade-in">
                        <h3 className="text-xl font-semibold text-white/90">Define tu ruta</h3>
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-white/70">Origen</label>
                                  <input list="locations-list" name="origin" value={tripDetails.origin} onChange={handleChange} placeholder="Ej: Medellín, Antioquia" required className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-white/70">Destino</label>
                                  <input list="locations-list" name="destination" value={tripDetails.destination} onChange={handleChange} placeholder="Ej: Bogotá, D.C." required className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" />
                                </div>
                            </div>
                            <div className="bg-slate-700/30 rounded-lg h-64 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-600">
                                <p>Simulación de API de Google Maps</p>
                            </div>
                        </div>
                        <datalist id="locations-list">
                            {locations.map(loc => <option key={loc} value={loc} />)}
                        </datalist>
                        <div className="pt-4 flex justify-end">
                            <ActionButton onClick={nextStep} type="button" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">Siguiente</ActionButton>
                        </div>
                      </div>
                    )}
                    {step === 2 && (
                       <div className="space-y-6 animate-fade-in">
                        <h3 className="text-xl font-semibold text-white/90">Establece el horario</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-white/70">Fecha de salida</label>
                                <input type="date" name="date" value={tripDetails.date} onChange={handleChange} required className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" style={{colorScheme: 'dark'}}/>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-white/70">Hora de salida</label>
                                <input type="time" name="time" value={tripDetails.time} onChange={handleChange} required className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" style={{colorScheme: 'dark'}}/>
                            </div>
                        </div>
                        <div className="pt-4 flex justify-between">
                            <ActionButton onClick={prevStep} type="button" className="bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/20">Anterior</ActionButton>
                            <ActionButton onClick={nextStep} type="button" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">Siguiente</ActionButton>
                        </div>
                      </div>
                    )}
                     {step === 3 && (
                       <div className="space-y-6 animate-fade-in">
                        <h3 className="text-xl font-semibold text-white/90">Define los detalles del viaje</h3>
                        <div>
                           <label className="text-sm font-medium text-white/70">Asientos disponibles: {tripDetails.seats}</label>
                           <input type="range" name="seats" min="1" max="6" value={tripDetails.seats} onChange={handleChange} className="w-full mt-2 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                        </div>
                        <div>
                           <label className="text-sm font-medium text-white/70">Precio por asiento</label>
                            <div className="relative mt-1">
                                <input type="number" name="price" step="1000" value={tripDetails.price} onChange={handleChange} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">COP</div>
                            </div>
                        </div>
                        <div>
                           <label className="text-sm font-medium text-white/70">Descripción del viaje (Opcional)</label>
                           <textarea name="description" value={tripDetails.description} onChange={handleChange} rows={4} placeholder="Ej:  me gusta escuchar rock, espacio para equipaje de mano y maleta, aire acondicionado disponible." className="mt-1 w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"></textarea>
                        </div>
                        <div className="pt-4 flex justify-between">
                            <ActionButton onClick={prevStep} type="button" className="bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/20">Anterior</ActionButton>
                            <ActionButton onClick={nextStep} type="button" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">Siguiente</ActionButton>
                        </div>
                      </div>
                    )}
                     {step === 4 && (
                       <div className="space-y-6 animate-fade-in">
                        <h3 className="text-xl font-semibold text-white/90">Revisa y publica tu viaje</h3>
                        <div className="bg-slate-700/30 p-6 rounded-lg space-y-3 border border-slate-600">
                            <p className="text-white"><strong>Origen:</strong> {tripDetails.origin || 'No definido'}</p>
                            <p className="text-white"><strong>Destino:</strong> {tripDetails.destination || 'No definido'}</p>
                            <p className="text-white"><strong>Fecha:</strong> {tripDetails.date || 'No definida'}</p>
                            <p className="text-white"><strong>Hora:</strong> {tripDetails.time || 'No definida'}</p>
                            <p className="text-white"><strong>Asientos:</strong> {tripDetails.seats}</p>
                            <p className="text-2xl font-bold text-purple-400 mt-2"><strong>Precio:</strong> {Number(tripDetails.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} / asiento</p>
                            {tripDetails.description && <p className="text-white pt-2"><strong>Descripción:</strong> <span className="text-white/80">{tripDetails.description}</span></p>}
                        </div>
                        <div className="pt-4 flex justify-between">
                            <ActionButton onClick={prevStep} type="button" className="bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/20">Anterior</ActionButton>
                            <ActionButton type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">Publicar Viaje</ActionButton>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
            {/* Mapa grande */}
            <div className="flex-1 w-full h-[500px] min-h-[400px] max-h-[700px] rounded-2xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-slate-900/80 mx-auto lg:mx-0">
                <div ref={mapRef} className="w-full h-full" />
                {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-cyan-400 text-xl font-bold bg-slate-900/80">Cargando mapa...</div>
                )}
            </div>
        </div>
    );
};

export default PublishTrip; 