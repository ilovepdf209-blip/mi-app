import { Link } from 'react-router-dom';

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  buttonText: string;
  to: string;
  gradient: string;
}

export default function RoleCard({ icon, title, description, benefits, buttonText, to, gradient }: RoleCardProps) {
  return (
    <div className="bg-slate-800/60 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-white/10">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 text-white bg-gradient-to-br ${gradient}`}>
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-white/70 mb-4">{description}</p>
      <ul className="text-left text-white/80 mb-6 space-y-1">
        {benefits.map((b, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-green-400">✔</span> {b}
          </li>
        ))}
      </ul>
      <Link
        to={to}
        className="w-full text-center font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 bg-indigo-600 text-white"
        style={{ background: 'inherit' }}
      >
        {buttonText}
      </Link>
    </div>
  );
} 