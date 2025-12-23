
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AppDetail from './pages/AppDetail';
import Privacy from './pages/Privacy';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AppEditor from './pages/admin/AppEditor';
import { LanguageProvider } from './LanguageContext';
import { AppProvider } from './AppContext';
import { AuthProvider, useAuth } from './AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin" />;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppProvider>
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/app/:id" element={<AppDetail />} />
                  <Route path="/app/:id/privacy" element={<Privacy />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={
                    <PrivateRoute>
                      <AdminDashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/app/new" element={
                    <PrivateRoute>
                      <AppEditor />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/app/edit/:id" element={
                    <PrivateRoute>
                      <AppEditor />
                    </PrivateRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </AppProvider>
    </LanguageProvider>
  );
};

export default App;
