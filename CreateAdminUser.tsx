import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import app from '../firebase';

export default function CreateAdminUser() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      const db = getFirestore(app);
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role: 'admin',
        createdAt: serverTimestamp(),
      });
      setSuccess('Usuario admin creado correctamente.');
    } catch (err: any) {
      setError(err.message || 'Error al crear usuario admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <form onSubmit={handleSubmit} className="bg-slate-800/80 p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Crear Usuario Admin</h2>
        <input
          type="text"
          placeholder="Nombre completo"
          className="bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          className="bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {success && <div className="text-green-400 text-center text-sm">{success}</div>}
        {error && <div className="text-red-400 text-center text-sm">{error}</div>}
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2.5 px-6 rounded-lg mt-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Admin'}
        </button>
      </form>
    </div>
  );
} 