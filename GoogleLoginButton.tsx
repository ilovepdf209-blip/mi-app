import React, { useCallback } from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useNavigate } from 'react-router-dom';

export const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  const handleError = useCallback((err: any) => {
    console.error('Error en Google Sign-In:', err);
    alert('Error al iniciar sesión con Google.');
  }, []);

  useGoogleAuth(handleSuccess, handleError);

  return (
    <div style={{ minHeight: 50, width: '100%' }}>
      <div id="google-signin-button" style={{ width: '100%' }}></div>
    </div>
  );
}; 