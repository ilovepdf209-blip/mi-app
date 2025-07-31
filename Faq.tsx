import React, { useState } from 'react';

const faqData = [
  {
    section: 'Generales',
    items: [
      {
        question: "¿Qué es 'viajemos juntos'?",
        answer: 'Es una plataforma comunitaria que conecta conductores con asientos libres y pasajeros que van en la misma dirección, para compartir los gastos del viaje y reducir el impacto ambiental.'
      },
      {
        question: '¿Cómo me registro?',
        answer: 'Puedes registrarte fácilmente a través de la aplicación o nuestro sitio web, completando tu perfil y siguiendo los pasos de verificación.'
      },
      {
        question: "¿Es gratis usar 'viajemos juntos'?",
        answer: 'El registro y la publicación de viajes son gratuitos. La plataforma puede aplicar una pequeña tarifa de servicio sobre las reservas para mantener y mejorar la plataforma, la cual siempre se mostrará de forma transparente antes de confirmar.'
      },
      {
        question: "¿En qué ciudades/regiones opera 'viajemos juntos'?",
        answer: 'Actualmente, nuestra operación está centrada en Antioquia, conectando sus municipios y ciudades principales.'
      }
    ]
  },
  {
    section: 'Para Pasajeros',
    items: [
      {
        question: '¿Cómo busco y reservo un viaje?',
        answer: 'Usa el buscador en la página principal, ingresa tu origen, destino y fecha. Revisa los viajes disponibles, elige el que más te convenga y solicita la reserva.'
      },
      {
        question: '¿Cómo se calcula la contribución para los gastos del viaje?',
        answer: 'La contribución es sugerida por el conductor, basándose en un cálculo que considera distancia, peajes y costos de combustible. El objetivo es compartir gastos, no generar ganancias.'
      },
      {
        question: '¿Qué pasa si necesito cancelar un viaje?',
        answer: 'Puedes cancelar desde la sección "Mis Viajes". Revisa nuestra política de cancelación para entender si aplica algún reembolso.'
      }
    ]
  },
  {
    section: 'Para Conductores',
    items: [
      {
        question: '¿Cómo publico un viaje?',
        answer: "Ve a 'Publicar Viaje', completa los detalles de tu ruta, horario, asientos disponibles y la contribución sugerida por asiento."
      },
      {
        question: '¿Cómo y cuándo recibo la contribución de los pasajeros?',
        answer: 'La contribución se procesa a través de la plataforma y se transfiere a tu billetera virtual después de que el viaje se ha completado exitosamente.'
      }
    ]
  },
  {
    section: 'Seguridad',
    items: [
      {
        question: '¿Qué medidas de seguridad tiene la plataforma?',
        answer: 'Contamos con verificación de perfiles, sistema de calificaciones, comunicación segura dentro de la app y un equipo de soporte dedicado. Visita nuestra sección de Seguridad para más detalles.'
      },
      {
        question: '¿Cómo funciona el sistema de calificaciones?',
        answer: 'Después de cada viaje, tanto pasajeros como conductores pueden dejar una calificación y un comentario sobre su experiencia. Esto ayuda a toda la comunidad a viajar con más confianza.'
      }
    ]
  },
  {
    section: 'Contacto y Soporte',
    items: [
      {
        question: '¿No encontraste respuesta a tu pregunta?',
        answer: 'Puedes contactarnos a través del formulario de contacto en la sección Ayuda y Soporte, o escribirnos a soporte@viajemosjuntos.co. ¡Estamos para ayudarte!'
      }
    ]
  }
];

function FaqAccordion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-700">
      <button
        className="w-full flex justify-between items-center py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-semibold text-white text-lg">{question}</span>
        <span className={`transition-transform duration-300 text-purple-400 ${open ? 'rotate-90' : ''}`}>▶</span>
      </button>
      {open && (
        <div className="pb-4 text-white/80 text-base animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Faq() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-2">
      <div className="w-full max-w-3xl bg-slate-800/80 rounded-2xl shadow-2xl p-8 md:p-12 border border-white/10">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-pink-400 mb-10">Preguntas Frecuentes (FAQ)</h1>
        {faqData.map((section) => (
          <div key={section.section} className="mb-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">{section.section}</h2>
            <div className="divide-y divide-slate-700">
              {section.items.map((item) => (
                <FaqAccordion key={item.question} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 