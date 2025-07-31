// 📁 src/pages/Home.tsx (Actualizado)

import Hero from '../components/Hero';
import Features from '../components/Features';
import ActionCards from '../components/ActionCards';
import SustainableSection from '../components/SustainableSection';
import PopularRoutes from '../components/PopularRoutes';
import PopularRoutesCarousel from '../components/PopularRoutesCarousel'; // <-- 1. Importa el nuevo componente

export default function Home() {
  return (
    <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
            <Hero />
            <Features />
            <ActionCards />
            <SustainableSection />
            <PopularRoutesCarousel /> {/* <-- 2. Reemplaza el componente anterior por este */}
            <PopularRoutes />
        </div>
    </div>
  );
}
