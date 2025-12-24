
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AppDetail from './pages/AppDetail';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { LanguageProvider } from './LanguageContext';
import { AppProvider } from './AppContext';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/app/:id" element={<AppDetail />} />
                <Route path="/app/:id/privacy" element={<Privacy />} />
                <Route path="/app/:id/terms" element={<Terms />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AppProvider>
    </LanguageProvider>
  );
};

export default App;
