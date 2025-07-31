import React from 'react';

const SimpleTestPage: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Página Simple de Prueba</h1>
        <p className="text-white/60 mb-8">Esta es una página muy simple para verificar que la aplicación funciona</p>
        <div className="p-4 bg-slate-800 rounded-lg">
          <p className="text-green-400">✅ La aplicación está funcionando correctamente</p>
          <p className="text-white/60 mt-2">Si puedes ver esta página, el problema no está en los componentes básicos</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleTestPage; 