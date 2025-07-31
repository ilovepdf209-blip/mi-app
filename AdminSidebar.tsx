import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Car, 
  Route, 
  FileText, 
  HelpCircle,
  Settings,
  LogOut,
  Truck
} from 'lucide-react';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/empresas', label: 'Empresas', icon: Building2 },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/admin/conductores', label: 'Conductores', icon: Car },
  { to: '/admin/vehiculos', label: 'Vehículos', icon: Truck },
  { to: '/admin/viajes', label: 'Viajes', icon: Route },
  { to: '/admin/facturacion', label: 'Facturación', icon: FileText },
  { to: '/admin/soporte', label: 'Soporte', icon: HelpCircle },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  
  return (
    <aside className="bg-slate-900/95 border-r border-slate-700/50 min-h-screen w-72 p-6 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Panel Admin</h2>
            <p className="text-slate-400 text-sm">Viajemos Juntos CO</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <div className="space-y-2">
          {links.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-slate-700/50">
        <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Administrador</p>
              <p className="text-slate-400 text-xs">admin@viajemos.com</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5 text-slate-400" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar; 