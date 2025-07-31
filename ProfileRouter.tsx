import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../firebase';
import ProfileUser from './ProfileUser'; // Perfil de conductor
import ProfileDriver from './ProfileDriver'; // Perfil de conductor

const ProfileRouter: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }
      const db = getFirestore(app);
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setRole(userSnap.data().role);
      }
      setLoading(false);
    };
    fetchRole();
  }, []);

  if (loading) return <div className="text-center p-10 text-white/50">Cargando perfil...</div>;
  if (role === 'driver') return <ProfileDriver />;
  if (role === 'passenger') return <ProfileUser />;
  return <div className="text-center p-10 text-red-400">No se encontró el perfil.</div>;
};

export default ProfileRouter; 