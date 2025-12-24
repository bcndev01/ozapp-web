import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, Download } from 'lucide-react';
import { AppData } from '../types';
import { useLanguage } from '../LanguageContext';

interface AppCardProps {
  app: AppData;
}

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-card border border-white/5 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 group flex flex-col h-full">
      <div className="p-8 flex-1">
        <div className="flex items-start justify-between mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img
              src={app.iconUrl}
              alt={`${app.name} icon`}
              className="w-20 h-20 rounded-2xl shadow-lg relative z-10 object-cover"
            />
          </div>

        </div>

        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{app.name}</h3>
        <p className="text-primary text-sm font-medium mb-4">{app.category[language]}</p>
        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {app.description[language]}
        </p>
      </div>

      <div className="px-8 pb-8 pt-0 mt-auto flex gap-3">
        <Link
          to={`/app/${app.id}`}
          className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 group/btn"
        >
          {t('details')}
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
        <a
          href={app.downloadLink}
          className="bg-primary hover:bg-blue-600 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center"
          aria-label={`${app.name} download`}
        >
          <Download className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default AppCard;
