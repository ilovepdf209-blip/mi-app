export default function PopularRoutes() {
    const popularRoutesData = [
        { from: 'Bogotá', to: 'Medellín', img: 'https://images.unsplash.com/photo-1612294037193-a003c401562b?q=80&w=2070&auto=format&fit=crop', price: '90.000' },
        { from: 'Cali', to: 'Bogotá', img: 'https://images.unsplash.com/photo-1596222765322-553b313b8b6a?q=80&w=2070&auto=format&fit=crop', price: '110.000' },
        { from: 'Cartagena', to: 'Santa Marta', img: 'https://images.unsplash.com/photo-1586948834241-731b32a76b78?q=80&w=2070&auto=format&fit=crop', price: '45.000' },
        { from: 'Bucaramanga', to: 'Cúcuta', img: 'https://images.unsplash.com/photo-1616790473204-18798514d347?q=80&w=1974&auto=format&fit=crop', price: '55.000' },
    ];

    return (
        <div>
            <h2 className="text-4xl font-extrabold text-center text-white mb-12">Rutas Populares</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {popularRoutesData.map(route => (
                    <div key={`${route.from}-${route.to}`} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <img 
                            src={route.img} 
                            alt={`Viaje de ${route.from} a ${route.to}`} 
                            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x600/0f172a/e2e8f0?text=Ruta'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6">
                            <h3 className="text-2xl font-bold text-white">{route.from} → {route.to}</h3>
                            <p className="text-white/80 text-sm mt-1">Desde ${route.price} COP</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
