
import React, { createContext, useContext, ReactNode } from 'react';
import { AppData } from './types';
import appsData from './apps.json';

interface AppContextType {
  apps: AppData[];
  getApp: (id: string) => AppData | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Cast the imported JSON to the correct type
  const apps: AppData[] = appsData as unknown as AppData[];

  const getApp = (id: string) => apps.find(a => a.id === id);

  return (
    <AppContext.Provider value={{ apps, getApp }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
