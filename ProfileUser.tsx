import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../firebase';

const ProfileUser: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const db = getFirestore(app);
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser({ ...userSnap.data(), email: firebaseUser.email });
        } else {
          setUser({
            role: 'passenger',
            name: firebaseUser.displayName || 'Usuario Pasajero',
            email: firebaseUser.email || '',
            descripcion: '¡Hola! Soy un pasajero entusiasta de los viajes compartidos.',
            avatarUrl: firebaseUser.photoURL || 'https://i.pravatar.cc/150?u=pasajero',
            miembroDesde: '2023',
            stats: { created: 0, completed: 0 },
            isVerified: false,
            verification: { email: true, phone: false, id: false },
            wallet: { balance: 0 },
          });
        }
      } catch (e: any) {
        setError('Error al cargar el perfil.');
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center p-10 text-white/50">Cargando perfil...</div>;
  if (error) return <div className="text-center p-10 text-red-400">{error}</div>;
  if (!user) return null;

  return (
    <div className="bg-slate-900 min-h-screen font-sans text-white py-10 relative overflow-hidden">
      {/* Efectos de fondo elegantes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Partículas de fondo */}
        <div className="absolute inset-0">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
        
        {/* Efectos de humo/ondas más sutiles */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 left-1/2 w-[300px] h-[300px] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>
      </div>

      <main className="relative z-10 flex flex-col items-center">
        <div className="w-full max-w-7xl mx-auto px-6">
          {/* Grid Magic Bento elegante con información útil */}
          <div className="bento-grid">
            {/* Primera fila */}
            <div className="bento-card card-profile">
              <div className="card-content">
                <div className="card-label">Perfil</div>
                <h3 className="card-title">Mi Perfil</h3>
                <div className="profile-info">
                  <div className="profile-avatar">
                    <img src={user.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-purple-400" />
                  </div>
                  <div className="profile-details">
                    <p className="user-name">{user.name}</p>
                    <p className="user-email">{user.email}</p>
                    <p className="user-since">Miembro desde {user.miembroDesde}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bento-card card-dashboard">
              <div className="card-content">
                <div className="card-label">Dashboard</div>
                <h3 className="card-title">Panel Principal</h3>
                <div className="dashboard-stats">
                  <div className="stat-item">
                    <span className="stat-value">${user.wallet?.balance?.toLocaleString('es-CO') ?? '0'}</span>
                    <span className="stat-label">Saldo</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{user.stats?.created ?? 0}</span>
                    <span className="stat-label">Viajes Creados</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{user.stats?.completed ?? 0}</span>
                    <span className="stat-label">Completados</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">⭐⭐⭐⭐⭐</span>
                    <span className="stat-label">Calificación</span>
                  </div>
                </div>
                <div className="payment-info">
                  <span className="payment-label">Medio de pago:</span>
                  <span className="payment-value">{user.paymentMethod ? user.paymentMethod : 'No registrado'}</span>
                </div>
              </div>
            </div>

            <div className="bento-card card-payment">
              <div className="card-content">
                <div className="card-label">Medio de Pago</div>
                <h3 className="card-title">Pago Principal</h3>
                <div className="payment-info-box">
                  <span className="payment-icon">💳</span>
                  <span className="payment-value">{user.paymentMethod ? user.paymentMethod : 'No registrado'}</span>
                </div>
                {/* Aquí puedes agregar botón para agregar/cambiar método de pago si lo deseas */}
              </div>
            </div>

            {/* Segunda fila */}
            <div className="bento-card card-preferences">
              <div className="card-content">
                <div className="card-label">Preferencias</div>
                <h3 className="card-title">Configuración</h3>
                <div className="preferences-grid">
                  <div className="preference-item">
                    <span className="preference-icon">🎵</span>
                    <span className="preference-text">Música</span>
                    <span className="preference-status">Sí</span>
                  </div>
                  <div className="preference-item">
                    <span className="preference-icon">💬</span>
                    <span className="preference-text">Conversación</span>
                    <span className="preference-status">Sí</span>
                  </div>
                  <div className="preference-item">
                    <span className="preference-icon">🐕</span>
                    <span className="preference-text">Mascotas</span>
                    <span className="preference-status">Sí</span>
                  </div>
                  <div className="preference-item">
                    <span className="preference-icon">❄️</span>
                    <span className="preference-text">Aire A/C</span>
                    <span className="preference-status">Sí</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bento-card card-history">
              <div className="card-content">
                <div className="card-label">Historial</div>
                <h3 className="card-title">Viajes</h3>
                <div className="history-info">
                  <div className="history-item">
                    <span className="history-label">Último viaje:</span>
                    <span className="history-value">Ninguno</span>
                  </div>
                  <div className="history-item">
                    <span className="history-label">Destino favorito:</span>
                    <span className="history-value">Por definir</span>
                  </div>
                  <div className="history-item">
                    <span className="history-label">Conductor favorito:</span>
                    <span className="history-value">Por definir</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tercera fila */}
            <div className="bento-card card-bio">
              <div className="card-content">
                <div className="card-label">Biografía</div>
                <h3 className="card-title">Sobre Mí</h3>
                <p className="bio-text">
                  {user.descripcion || '¡Hola! Soy un pasajero entusiasta de los viajes compartidos.'}
                </p>
              </div>
            </div>

            <div className="bento-card card-security">
              <div className="card-content">
                <div className="card-label">Seguridad</div>
                <h3 className="card-title">Protección</h3>
                <div className="security-list">
                  <div className="security-item">
                    <span className="security-icon">🔐</span>
                    <span className="security-text">2FA: Desactivada</span>
                  </div>
                  <div className="security-item">
                    <span className="security-icon">🔔</span>
                    <span className="security-text">Notificaciones: Activadas</span>
                  </div>
                  <div className="security-item">
                    <span className="security-icon">🛡️</span>
                    <span className="security-text">Privacidad: Estándar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Estilos CSS elegantes y organizados */}
      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 2rem;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 90vh;
        }

        .bento-card {
          position: relative;
          background: linear-gradient(135deg, #0a0018 0%, #1a0033 100%);
          border: 2px solid rgba(132, 0, 255, 0.2);
          border-radius: 2rem;
          padding: 2.5rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          cursor: pointer;
          backdrop-filter: blur(10px);
        }

        .bento-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
            rgba(132, 0, 255, 0.08) 0%, 
            transparent 60%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .bento-card:hover::before {
          opacity: 1;
        }

        .bento-card:hover {
          border-color: rgba(132, 0, 255, 0.5);
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(132, 0, 255, 0.3), 0 0 40px rgba(132, 0, 255, 0.1);
        }

        .card-wide {
          grid-column: span 2;
          grid-row: span 1;
        }

        /* Layout específico elegante */
        /* Primera fila: perfil, dashboard (más ancho), medio de pago */
        .card-profile {
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }
        .card-dashboard {
          grid-column: 2 / 4;
          grid-row: 1 / 2;
        }
        .card-payment {
          grid-column: 1 / 2;
          grid-row: 2 / 3;
        }
        /* Segunda fila: preferencias e historial */
        .card-preferences {
          grid-column: 2 / 3;
          grid-row: 2 / 3;
        }
        .card-history {
          grid-column: 3 / 4;
          grid-row: 2 / 3;
        }
        /* Tercera fila: bio y seguridad */
        .card-bio {
          grid-column: 1 / 3;
          grid-row: 3 / 4;
        }
        .card-security {
          grid-column: 3 / 4;
          grid-row: 3 / 4;
        }

        .card-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .card-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #a78bfa;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.8;
        }

        .card-title {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        /* Estilos específicos para cada tipo de tarjeta */
        .profile-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .user-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #ffffff;
        }

        .user-email {
          font-size: 0.875rem;
          color: #a78bfa;
        }

        .user-since {
          font-size: 0.75rem;
          color: #64748b;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 1rem;
          background: rgba(132, 0, 255, 0.1);
          border-radius: 1rem;
          border: 1px solid rgba(132, 0, 255, 0.2);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #a78bfa;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .verification-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .verification-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(132, 0, 255, 0.05);
          border-radius: 0.75rem;
          border: 1px solid rgba(132, 0, 255, 0.1);
        }

        .verification-icon {
          font-size: 1.25rem;
        }

        .verification-icon.verified {
          color: #10b981;
        }

        .verification-icon.pending {
          color: #f59e0b;
        }

        .verification-text {
          font-size: 0.875rem;
          color: #e2e8f0;
        }

        .preferences-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .preference-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(132, 0, 255, 0.05);
          border-radius: 1rem;
          border: 1px solid rgba(132, 0, 255, 0.1);
        }

        .preference-icon {
          font-size: 1.25rem;
        }

        .preference-text {
          flex: 1;
          font-size: 0.875rem;
          color: #e2e8f0;
        }

        .preference-status {
          font-size: 0.75rem;
          color: #10b981;
          font-weight: 600;
        }

        .history-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: rgba(132, 0, 255, 0.05);
          border-radius: 0.75rem;
          border: 1px solid rgba(132, 0, 255, 0.1);
        }

        .history-label {
          font-size: 0.875rem;
          color: #a78bfa;
        }

        .history-value {
          font-size: 0.875rem;
          color: #e2e8f0;
          font-weight: 500;
        }

        .bio-text {
          font-size: 1rem;
          color: #e2e8f0;
          line-height: 1.6;
          flex-grow: 1;
        }

        .security-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .security-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(132, 0, 255, 0.05);
          border-radius: 0.75rem;
          border: 1px solid rgba(132, 0, 255, 0.1);
        }

        .security-icon {
          font-size: 1.25rem;
        }

        .security-text {
          font-size: 0.875rem;
          color: #e2e8f0;
        }

        .payment-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(132, 0, 255, 0.08);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          margin-top: 0.5rem;
        }
        .payment-label {
          font-size: 0.95rem;
          color: #a78bfa;
          font-weight: 600;
        }
        .payment-value {
          font-size: 1rem;
          color: #e2e8f0;
          font-weight: 500;
        }
        .payment-info-box {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(132, 0, 255, 0.08);
          border-radius: 0.75rem;
          padding: 1.2rem 1.5rem;
          margin-top: 1.2rem;
        }
        .payment-icon {
          font-size: 2rem;
          color: #a78bfa;
        }
        .payment-value {
          font-size: 1.1rem;
          color: #e2e8f0;
          font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .bento-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: repeat(5, auto);
            gap: 1.5rem;
            padding: 1.5rem;
          }
          .card-profile {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
          }
          .card-dashboard {
            grid-column: 2 / 3;
            grid-row: 1 / 2;
          }
          .card-payment {
            grid-column: 1 / 3;
            grid-row: 2 / 3;
          }
          .card-preferences {
            grid-column: 1 / 2;
            grid-row: 3 / 4;
          }
          .card-history {
            grid-column: 2 / 3;
            grid-row: 3 / 4;
          }
          .card-bio {
            grid-column: 1 / 2;
            grid-row: 4 / 5;
          }
          .card-security {
            grid-column: 2 / 3;
            grid-row: 4 / 5;
          }
        }
        @media (max-width: 768px) {
          .bento-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(7, auto);
            gap: 1.5rem;
            padding: 1rem;
          }
          .bento-card {
            grid-column: 1 / 2 !important;
            grid-row: auto !important;
            padding: 2rem;
          }
        }
        @media (max-width: 900px) {
          .dashboard-stats {
            grid-template-columns: 1fr;
          }
        }
        /* Efectos de spotlight */
        .bento-card {
          --mouse-x: 50%;
          --mouse-y: 50%;
        }
      `}</style>

      {/* Script para efectos de spotlight */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.bento-card');
            
            cards.forEach(card => {
              card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                card.style.setProperty('--mouse-x', x + '%');
                card.style.setProperty('--mouse-y', y + '%');
              });
            });
          });
        `
      }} />
    </div>
  );
};

export default ProfileUser; 