import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Smartphone, Globe } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tr' : 'en');
  };

  const navLinks = [
    { name: t('home'), path: '/' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-darker/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
                 <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">OzAppLabs</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-primary/20 text-primary'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <a 
                href="#contact"
                className="text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
              >
                {t('contact')}
              </a>
              
              <div className="h-6 w-px bg-white/10 mx-2"></div>

              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-white/5"
              >
                <Globe className="w-4 h-4" />
                <span>{language.toUpperCase()}</span>
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden items-center gap-4">
            <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{language.toUpperCase()}</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                   isActive(link.path)
                      ? 'bg-primary/20 text-primary'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
             <a 
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
              >
                {t('contact')}
              </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
