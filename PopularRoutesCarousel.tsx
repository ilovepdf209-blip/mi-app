
import React from 'react';
// Importa los componentes y estilos de Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Importa los estilos base de Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Define el tipo para cada objeto de ruta
interface Ruta {
  image: string;
  name: string;
  price: string;
}

// Datos de ejemplo para las rutas
const rutasPopulares: Ruta[] = [
  {
    image: "https://images.unsplash.com/photo-1612294037193-a003c401562b?q=80&w=800&auto=format&fit=crop",
    name: "Bogotá → Medellín",
    price: "Desde $90.000 COP"
  },
  {
    image: "https://images.unsplash.com/photo-1596222765322-553b313b8b6a?q=80&w=800&auto=format&fit=crop",
    name: "Cali → Bogotá",
    price: "Desde $110.000 COP"
  },
  {
    image: "https://images.unsplash.com/photo-1586948834241-731b32a76b78?q=80&w=800&auto=format&fit=crop",
    name: "Cartagena → Santa Marta",
    price: "Desde $45.000 COP"
  },
  {
    image: "https://images.unsplash.com/photo-1616790473204-18798514d347?q=80&w=800&auto=format&fit=crop",
    name: "Bucaramanga → Cúcuta",
    price: "Desde $55.000 COP"
  },
  {
    image: "https://images.unsplash.com/photo-1597920188434-3b16b354a2a2?q=80&w=800&auto=format&fit=crop",
    name: "Medellín → Guatapé",
    price: "Desde $35.000 COP"
  }
];

const PopularRoutesCarousel: React.FC = () => {
  const handleClick = (ruta: Ruta) => {
    alert(`¡Has hecho click en la ruta: ${ruta.name}!`);
    // Aquí puedes agregar la lógica para navegar a otra página o abrir un modal
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-10">
      <h2 className="text-4xl font-extrabold text-center text-white mb-12">Rutas Populares</h2>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 30 },
          1024: { slidesPerView: 3, spaceBetween: 40 },
        }}
        className="pb-12" // Añade padding-bottom para que la paginación no se corte
      >
        {rutasPopulares.map((ruta, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="bg-slate-800/50 rounded-2xl shadow-lg p-6 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300 border border-transparent hover:border-purple-500"
              onClick={() => handleClick(ruta)}
            >
              <img 
                src={ruta.image} 
                alt={ruta.name} 
                className="w-full h-48 object-cover rounded-xl mb-4" 
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x600/0f172a/e2e8f0?text=Ruta'; }} 
              />
              <div className="text-2xl font-bold text-white mb-2">{ruta.name}</div>
              <div className="text-white/80">{ruta.price}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default PopularRoutesCarousel;