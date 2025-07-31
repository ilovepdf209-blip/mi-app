import React from 'react';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-900">
      <AdminSidebar />
      <main className="flex-1 bg-slate-900 pt-4">
        <div className="px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 