import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language } from './types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  en: {
    home: "Home",
    privacy: "Privacy Policy",
    contact: "Contact",
    apps: "Apps",
    details: "Details",
    download: "Download",
    discoverTitle: "Mobile Experiences",
    discoverSubtitle: "Shaping the Future",
    heroDesc: "Discover our award-winning apps designed to simplify your daily life, boost productivity, and improve your health.",
    exploreApps: "Explore Apps",
    contactUs: "Contact Us",
    ourApps: "Our Apps",
    ourAppsDesc: "User-centric solutions, each carefully designed in its own category.",
    statsDownloads: "Downloads",
    statsRating: "Avg. Rating",
    statsCountries: "Countries",
    statsSupport: "Support",
    appNotFound: "App Not Found",
    returnHome: "Return to Home",
    allApps: "All Apps",
    reviews: "Reviews",
    downloadAppStore: "Download on App Store",
    features: "Key Features",
    screenshots: "Screenshots",
    readPrivacyPolicy: "Read Privacy Policy",
    readTerms: "Read Terms of Use",
    lastUpdated: "Last Updated",
    rightsReserved: "All rights reserved.",
    madeIn: "Made with love in Istanbul, Turkiye.",
    corporate: "Corporate",
    terms: "Terms of Use",
    about: "About Us",
    privacyTitle: "Privacy Policy",
  },
  tr: {
    home: "Ana Sayfa",
    privacy: "Gizlilik Politikası",
    contact: "İletişim",
    apps: "Uygulamalar",
    details: "Detaylar",
    download: "İndir",
    discoverTitle: "Mobil Deneyimler",
    discoverSubtitle: "Geleceği Şekillendiren",
    heroDesc: "Günlük yaşamınızı kolaylaştıran, verimliliğinizi artıran ve sağlığınızı koruyan ödüllü uygulamalarımızı keşfedin.",
    exploreApps: "Uygulamaları Keşfet",
    contactUs: "Bize Ulaşın",
    ourApps: "Uygulamalarımız",
    ourAppsDesc: "Her biri kendi kategorisinde özenle tasarlanmış, kullanıcı odaklı çözümler.",
    statsDownloads: "İndirme",
    statsRating: "Ortalama Puan",
    statsCountries: "Ülke",
    statsSupport: "Destek",
    appNotFound: "Uygulama Bulunamadı",
    returnHome: "Ana sayfaya dön",
    allApps: "Tüm Uygulamalar",
    reviews: "Oy",
    downloadAppStore: "App Store'dan İndir",
    features: "Öne Çıkan Özellikler",
    screenshots: "Ekran Görüntüleri",
    readPrivacyPolicy: "Gizlilik Politikasını Oku",
    readTerms: "Kullanım Koşullarını Oku",
    lastUpdated: "Son Güncelleme",
    rightsReserved: "Tüm hakları saklıdır.",
    madeIn: "Istanbul, Türkiye'de sevgiyle geliştirildi.",
    corporate: "Kurumsal",
    terms: "Kullanım Koşulları",
    about: "Hakkımızda",
    privacyTitle: "Gizlilik Politikası",
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Simple translation helper
  const t = (key: string) => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
