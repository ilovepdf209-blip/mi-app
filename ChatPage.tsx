import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ChatWindow from '../components/Chat/ChatWindow';
import { useNotification } from '../hooks/useNotification';

interface Trip {
  id: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  driverId: string;
  driverName: string;
  driverAvatar?: string;
  passengerIds: string[];
  passengerNames: string[];
  passengerAvatars?: string[];
}

const ChatPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { showError } = useNotification();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

  useEffect(() => {
    const loadTripAndUser = async () => {
      if (!tripId) {
        showError('Error', 'ID de viaje no válido');
        navigate('/search');
        return;
      }

      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
          showError('Error', 'Debes iniciar sesión para acceder al chat');
          navigate('/login');
          return;
        }

        // Cargar datos del usuario actual
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        let userData = { name: user.displayName || 'Usuario', avatarUrl: user.photoURL };
        if (userSnap.exists()) {
          userData = userSnap.data();
        }

        setCurrentUser({
          id: user.uid,
          name: userData.name || user.displayName || 'Usuario',
          avatar: userData.avatarUrl || user.photoURL
        });

        // Cargar datos del viaje
        const tripRef = doc(db, 'trips', tripId);
        const tripSnap = await getDoc(tripRef);
        
        if (!tripSnap.exists()) {
          showError('Error', 'Viaje no encontrado');
          navigate('/search');
          return;
        }

        const tripData = tripSnap.data();
        const tripInfo: Trip = {
          id: tripId,
          origin: tripData.origin || '',
          destination: tripData.destination || '',
          date: tripData.date || '',
          time: tripData.time || '',
          driverId: tripData.driverId || '',
          driverName: tripData.driverName || 'Conductor',
          driverAvatar: tripData.driverAvatar,
          passengerIds: tripData.passengerIds || [],
          passengerNames: tripData.passengerNames || [],
          passengerAvatars: tripData.passengerAvatars || []
        };

        setTrip(tripInfo);

        // Determinar el participante con quien chatear
        const isDriver = user.uid === tripData.driverId;
        const isPassenger = tripData.passengerIds?.includes(user.uid);

        if (!isDriver && !isPassenger) {
          showError('Error', 'No tienes acceso a este chat');
          navigate('/search');
          return;
        }

        // Si es conductor, mostrar el primer pasajero (o crear un participante genérico)
        if (isDriver) {
          if (tripData.passengerIds?.length > 0) {
            const passengerIndex = 0; // Mostrar el primer pasajero
            const participantName = tripData.passengerNames?.[passengerIndex] || 'Pasajero';
            const participantAvatar = tripData.passengerAvatars?.[passengerIndex];
            
            setSelectedParticipant({
              id: tripData.passengerIds[passengerIndex],
              name: participantName,
              avatar: participantAvatar,
              isOnline: true // Simulado por ahora
            });
          } else {
            // Si no hay pasajeros, crear un participante genérico
            setSelectedParticipant({
              id: 'waiting_passenger',
              name: 'Esperando pasajeros',
              avatar: undefined,
              isOnline: false
            });
          }
        } else {
          // Si es pasajero, mostrar el conductor
          setSelectedParticipant({
            id: tripData.driverId,
            name: tripData.driverName || 'Conductor',
            avatar: tripData.driverAvatar,
            isOnline: true // Simulado por ahora
          });
        }

      } catch (error) {
        console.error('Error loading chat data:', error);
        showError('Error', 'No se pudo cargar la información del chat');
        navigate('/search');
      } finally {
        setLoading(false);
      }
    };

    loadTripAndUser();
  }, [tripId, navigate, showError]);

  const handleBack = () => {
    navigate(`/trip/${tripId}`);
  };

  if (loading) {
    return (
      <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white/60">Cargando chat...</p>
        </div>
      </div>
    );
  }

  if (!trip || !currentUser || !selectedParticipant) {
    return (
      <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error al cargar el chat</p>
          <button 
            onClick={() => navigate('/search')}
            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg transition-colors"
          >
            Volver a búsqueda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <ChatWindow
        tripId={tripId!}
        participant={selectedParticipant}
        currentUser={currentUser}
        onBack={handleBack}
      />
    </div>
  );
};

export default ChatPage; 