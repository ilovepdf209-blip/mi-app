import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Interfaz para definir las propiedades de cada tipo de rol
interface Role {
  title: string;
  description: string;
  benefits: string[];
  buttonText: string;
  icon: React.ReactNode; // Permite pasar componentes de icono
  gradient: string; // Gradiente de fondo para cada rol
}

// Datos para cada rol
const roles: { [key: string]: Role } = {
  passenger: {
    title: 'Soy Pasajero',
    description: 'Encuentra viajes a tus destinos favoritos de forma segura y económica. Conoce gente nueva y disfruta el trayecto.',
    benefits: [
      'Ahorra dinero en tus viajes.',
      'Viaja de forma cómoda y segura.',
      'Conecta con personas increíbles.',
    ],
    buttonText: 'Registrarme como Pasajero',
    icon: (
      // Icono para Pasajero
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    gradient: 'from-cyan-500 to-blue-500',
  },
  driver: {
    title: 'Soy Conductor',
    description: 'Comparte los asientos libres de tu auto, cubre los gastos de tu viaje y contribuye a un planeta más limpio.',
    benefits: [
      'Cubre gastos de combustible y peajes.',
      'Elige a tus compañeros de viaje.',
      'Reduce tu huella de carbono.',
    ],
    buttonText: 'Registrarme como Conductor',
    icon: (
      // Icono para Conductor (volante)
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M5.05 18.95l1.414-1.414m12.728 0l-1.414-1.414M5.05 5.05l1.414 1.414" />
      </svg>
    ),
    gradient: 'from-violet-500 to-fuchsia-500',
  },
};

// Componente de la tarjeta de rol
const RoleCard: React.FC<{ role: Role; onRegister: () => void }> = ({ role, onRegister }) => (
  <div className="text-center text-white p-8">
    <div className="mb-6 h-12">{role.icon}</div>
    <h3 className="text-3xl font-bold mb-3">{role.title}</h3>
    <p className="text-gray-200 mb-6 max-w-sm mx-auto">{role.description}</p>
    <ul className="space-y-3 text-left mb-8 inline-block">
      {role.benefits.map((benefit, index) => (
        <li key={index} className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-300 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
    <div className="mt-4">
      <button className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105" onClick={onRegister}>
        {role.buttonText}
      </button>
    </div>
  </div>
);

// Componente principal
const Register: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'passenger' | 'driver'>('passenger');
  const navigate = useNavigate();

  const isPassenger = selectedRole === 'passenger';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 transition-all duration-700 ${isPassenger ? 'bg-gradient-to-br from-cyan-900 to-gray-900' : 'bg-gradient-to-br from-violet-900 to-gray-900'} pt-32`}>
      <div className="text-center mb-12 w-full flex flex-col items-center justify-center">
        <h1 className="text-5xl font-extrabold text-white mb-3 w-full text-center">Únete a la Aventura</h1>
        <p className="text-gray-300 text-lg w-full text-center">Elige tu rol para comenzar. Ya sea que busques un viaje o tengas asientos para compartir.</p>
      </div>

      {/* Interruptor de Roles */}
      <div className="mb-12">
        <div className="relative w-72 h-16 bg-gray-800 rounded-full p-2 flex items-center cursor-pointer shadow-inner">
          <div
            className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-14 rounded-full bg-gradient-to-r ${isPassenger ? roles.passenger.gradient : roles.driver.gradient} transition-all duration-500 ease-in-out transform ${isPassenger ? 'translate-x-0' : 'translate-x-full'}`}
          />
          <div className="w-1/2 h-full flex items-center justify-center z-10" onClick={() => setSelectedRole('passenger')}>
            <span className={`font-bold transition-colors duration-300 ${isPassenger ? 'text-white' : 'text-gray-400'}`}>Pasajero</span>
          </div>
          <div className="w-1/2 h-full flex items-center justify-center z-10" onClick={() => setSelectedRole('driver')}>
            <span className={`font-bold transition-colors duration-300 ${!isPassenger ? 'text-white' : 'text-gray-400'}`}>Conductor</span>
          </div>
        </div>
      </div>

      {/* Contenedor de la tarjeta de rol con animación */}
      <div className="grid w-full max-w-2xl">
        {/* Usamos grid para que ambos elementos ocupen el mismo espacio y el contenedor no colapse */}
        <div
          className={`[grid-area:1/1] transition-opacity duration-500 ease-in-out ${isPassenger ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          {/* El botón de pasajero debe navegar a /register/passenger */}
          <RoleCard role={roles.passenger} onRegister={() => navigate('/register/passenger')} />
        </div>
        <div
          className={`[grid-area:1/1] transition-opacity duration-500 ease-in-out ${!isPassenger ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          {/* El botón de conductor debe navegar a /register/driver */}
          <RoleCard role={roles.driver} onRegister={() => navigate('/register/driver')} />
        </div>
      </div>
    </div>
  );
};

export default Register;