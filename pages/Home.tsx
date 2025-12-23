
import React from 'react';
import { useApp } from '../AppContext';
import AppCard from '../components/AppCard';
import { ArrowDown } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const { apps } = useApp();

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
              {t('discoverSubtitle')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                {t('discoverTitle')}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
              {t('heroDesc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#apps" className="bg-white text-darker px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors w-full sm:w-auto">
                {t('exploreApps')}
              </a>
              <a href="#contact" className="px-8 py-4 rounded-full font-bold text-white border border-white/20 hover:bg-white/5 transition-colors w-full sm:w-auto">
                {t('contactUs')}
              </a>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <ArrowDown className="text-gray-600 h-6 w-6" />
        </div>
      </section>

      {/* Apps Grid */}
      <section id="apps" className="py-24 bg-darker relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('ourApps')}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('ourAppsDesc')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 border-t border-white/5">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
               <div className="p-6">
                 <div className="text-4xl font-bold text-white mb-2">500K+</div>
                 <div className="text-gray-500 text-sm uppercase tracking-wider">{t('statsDownloads')}</div>
               </div>
               <div className="p-6">
                 <div className="text-4xl font-bold text-white mb-2">4.8</div>
                 <div className="text-gray-500 text-sm uppercase tracking-wider">{t('statsRating')}</div>
               </div>
               <div className="p-6">
                 <div className="text-4xl font-bold text-white mb-2">50+</div>
                 <div className="text-gray-500 text-sm uppercase tracking-wider">{t('statsCountries')}</div>
               </div>
               <div className="p-6">
                 <div className="text-4xl font-bold text-white mb-2">7/24</div>
                 <div className="text-gray-500 text-sm uppercase tracking-wider">{t('statsSupport')}</div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
