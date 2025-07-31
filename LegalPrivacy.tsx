import React from 'react';
import { Link } from 'react-router-dom';

const LegalPrivacy: React.FC = () => (
  <div className="max-w-2xl mx-auto py-20 px-4">
    <h1 className="text-3xl font-bold mb-6 text-white">Legal y Privacidad</h1>
    <ul className="space-y-4 text-lg">
      <li><Link to="/legal/terminos" className="text-purple-400 hover:underline">Términos y condiciones</Link></li>
      <li><Link to="/legal/privacidad" className="text-purple-400 hover:underline">Política de privacidad</Link></li>
      <li><Link to="/legal/cookies" className="text-purple-400 hover:underline">Política de cookies</Link></li>
      <li><Link to="/legal/avisos" className="text-purple-400 hover:underline">Avisos legales</Link></li>
    </ul>
  </div>
);

export default LegalPrivacy; 