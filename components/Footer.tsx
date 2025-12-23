
import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Mail, Github } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useApp } from '../AppContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { apps } = useApp();

  return (
    <footer className="bg-darker border-t border-white/10 pt-16 pb-8" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-bold text-white mb-4 block">OzAppLabs</span>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('heroDesc')}
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">{t('apps')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {apps.map(app => (
                <li key={app.id}>
                  <Link to={`/app/${app.id}`} className="hover:text-primary transition-colors">
                    {app.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('corporate')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">{t('terms')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('about')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('contact')}</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:contact@ozapplabs.com" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} OzAppLabs. {t('rightsReserved')}
          </p>
          <div className="mt-4 md:mt-0">
             <span className="text-gray-600 text-xs">{t('madeIn')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
