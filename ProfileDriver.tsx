import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import MagicBento from '../components/MagicBento';

const ProfileDriver: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error('No autenticado');
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser({ uid: currentUser.uid, ...userSnap.data() });
        } else {
          setUser({
            uid: currentUser.uid,
            role: 'driver',
            name: currentUser.displayName || 'Conductor',
            email: currentUser.email || '',
            phone: '+57 300 123 4567',
            city: 'Medellín, Antioquia',
            description: 'Conductor experimentado con más de 5 años en carretera. Me gusta la puntualidad, la buena música y un viaje tranquilo y seguro para todos.',
            avatarUrl: currentUser.photoURL || 'https://i.pravatar.cc/150?u=conductor',
            memberSince: '2022',
            stats: { created: 152, completed: 148 },
            vehicle: {
              make: 'Chevrolet',
              model: 'Onix',
              year: '2023',
              version: '1.0 Turbo',
              fuelType: 'Gasolina',
              consumption: 18.5,
              plate: 'JSN-458',
              color: 'Gris Plata',
              features: ['Aire Acondicionado', 'Mascotas Permitidas', 'Asientos de Cuero']
            },
            wallet: { balance: 750000, totalEarnings: 3200000 }
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen font-sans text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-[#0a0018] rounded-2xl border border-fuchsia-900/40 shadow-2xl p-10 text-center">
            <div className="text-white/50">Cargando perfil...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-slate-900 min-h-screen font-sans text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-[#0a0018] rounded-2xl border border-fuchsia-900/40 shadow-2xl p-10 text-center">
            <div className="text-red-400">{error || 'No se encontró perfil'}</div>
          </div>
        </div>
      </div>
    );
  }

  // Construir las tarjetas para MagicBento
  const cards = [
    {
      color: '#060010',
      title: user.name,
      description: `Email: ${user.email}\nTeléfono: ${user.phone}\nCiudad: ${user.city}`,
      label: 'Perfil',
    },
    {
      color: '#060010',
      title: 'Vehículo',
      description: user.vehicle ? `${user.vehicle.make} ${user.vehicle.model} (${user.vehicle.year})\nPlaca: ${user.vehicle.plate}\nColor: ${user.vehicle.color}` : 'Sin información de vehículo',
      label: 'Auto',
    },
    {
      color: '#060010',
      title: 'Documentos',
      description: 'Licencia, SOAT, matrícula, cédula, RTM',
      label: 'Docs',
    },
    {
      color: '#060010',
      title: 'Billetera',
      description: `Saldo: ${user.wallet?.balance?.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) ?? '$0'}\nGanancias: ${user.wallet?.totalEarnings?.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) ?? '$0'}`,
      label: 'Wallet',
    },
    {
      color: '#060010',
      title: 'Huella de Carbono',
      description: user.vehicle ? `Consumo: ${user.vehicle.consumption} km/L\nAhorro estimado: 125.3 kg CO₂` : 'Agrega tu vehículo para calcular tu huella',
      label: 'CO₂',
    },
    {
      color: '#060010',
      title: 'Biografía',
      description: user.description,
      label: 'Sobre mí',
    },
    {
      color: '#060010',
      title: 'Estadísticas',
      description: `Viajes creados: ${user.stats?.created ?? 0}\nCompletados: ${user.stats?.completed ?? 0}`,
      label: 'Stats',
    },
  ];

  return (
    <div className="bg-slate-900 min-h-screen font-sans text-white py-20">
      <main className="relative z-10 flex flex-col items-center">
        <MagicBento
          cards={cards}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          particleCount={12}
          glowColor="132, 0, 255"
        />
      </main>
    </div>
  );
};

export default ProfileDriver; 