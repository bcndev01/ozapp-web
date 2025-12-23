
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../AppContext';
import { useAuth } from '../../AuthContext';
import { Plus, Edit, Trash2, LogOut, ExternalLink } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { apps, deleteApp } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this app?')) {
      try {
        await deleteApp(id);
      } catch (error) {
        console.error('Error deleting app:', error);
        alert('App silinirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">App Management</h1>
          <div className="flex gap-4">
            <Link 
              to="/admin/app/new" 
              className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add New App
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-xl font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase">
                  <th className="px-6 py-4 font-semibold">Icon</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Category (EN)</th>
                  <th className="px-6 py-4 font-semibold">Version</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {apps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <img src={app.iconUrl} alt={app.name} className="w-10 h-10 rounded-lg object-cover" />
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{app.name}</td>
                    <td className="px-6 py-4 text-gray-400">{app.category.en}</td>
                    <td className="px-6 py-4 text-gray-400">{app.version}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                         <Link 
                          to={`/app/${app.id}`} 
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="View Live"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link 
                          to={`/admin/app/edit/${app.id}`} 
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(app.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {apps.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No apps found. Create your first app!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
