
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData } from './types';
import { initialAppsData } from './data';
import { supabase, isSupabaseAvailable, TABLE_NAME } from './lib/supabase';

interface AppContextType {
  apps: AppData[];
  getApp: (id: string) => AppData | undefined;
  addApp: (app: AppData) => Promise<void>;
  updateApp: (app: AppData, oldId?: string) => Promise<void>;
  deleteApp: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'ozapplabs_portfolio_data';

// Convert AppData (camelCase) to database format (snake_case)
const toDbFormat = (app: AppData) => ({
  id: app.id,
  name: app.name,
  tagline: app.tagline,
  description: app.description,
  icon_url: app.iconUrl,
  screenshots: app.screenshots,
  features: app.features,
  download_link: app.downloadLink,
  category: app.category,
  rating: app.rating,
  reviews_count: app.reviewsCount,
  version: app.version,
  last_updated: app.lastUpdated,
  privacy_policy: app.privacyPolicy,
});

// Convert database format (snake_case) to AppData (camelCase)
const fromDbFormat = (dbApp: any): AppData => ({
  id: dbApp.id,
  name: dbApp.name,
  tagline: dbApp.tagline,
  description: dbApp.description,
  iconUrl: dbApp.icon_url,
  screenshots: dbApp.screenshots || [],
  features: dbApp.features || [],
  downloadLink: dbApp.download_link,
  category: dbApp.category,
  rating: dbApp.rating || 0,
  reviewsCount: dbApp.reviews_count || 0,
  version: dbApp.version || '1.0.0',
  lastUpdated: dbApp.last_updated,
  privacyPolicy: dbApp.privacy_policy || [],
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<AppData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch apps from Supabase or localStorage
  const fetchApps = async () => {
    if (isSupabaseAvailable() && supabase) {
      try {
        const { data, error } = await supabase
          .from(TABLE_NAME)
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching apps from Supabase:', error);
          // Fallback to localStorage
          loadFromLocalStorage();
        } else {
          if (data && data.length > 0) {
            const convertedApps = data.map(fromDbFormat);
            setApps(convertedApps);
          } else {
            // If no data in Supabase, initialize with default data
            setApps(initialAppsData);
            // Insert initial data to Supabase
            const dbApps = initialAppsData.map(toDbFormat);
            const { error: insertError } = await supabase
              .from(TABLE_NAME)
              .insert(dbApps);
            if (insertError) {
              console.error('Error inserting initial data:', insertError);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching apps:', error);
        loadFromLocalStorage();
      }
    } else {
      loadFromLocalStorage();
    }
    setIsLoaded(true);
  };

  const loadFromLocalStorage = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setApps(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored apps", e);
        setApps(initialAppsData);
      }
    } else {
      setApps(initialAppsData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAppsData));
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const getApp = (id: string) => apps.find(a => a.id === id);

  // Refresh apps from Supabase
  const refreshApps = async () => {
    if (isSupabaseAvailable() && supabase) {
      try {
        const { data, error } = await supabase
          .from(TABLE_NAME)
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const convertedApps = data.map(fromDbFormat);
          setApps(convertedApps);
          // Also update localStorage as backup
          localStorage.setItem(STORAGE_KEY, JSON.stringify(convertedApps));
        }
      } catch (error) {
        console.error('Error refreshing apps:', error);
      }
    }
  };

  const addApp = async (app: AppData) => {
    if (isSupabaseAvailable() && supabase) {
      try {
        const dbApp = toDbFormat(app);
        console.log('Adding app to Supabase:', { 
          id: dbApp.id, 
          privacyPolicyLength: dbApp.privacy_policy?.length,
          privacyPolicy: dbApp.privacy_policy 
        });
        const { error } = await supabase
          .from(TABLE_NAME)
          .insert([dbApp]);

        if (error) {
          console.error('Error adding app to Supabase:', error);
          // Fallback to localStorage
          const newApps = [...apps, app];
          setApps(newApps);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newApps));
        } else {
          // Successfully added to Supabase, refresh the list
          await refreshApps();
        }
      } catch (error) {
        console.error('Error adding app:', error);
        // Fallback to localStorage
        const newApps = [...apps, app];
        setApps(newApps);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newApps));
      }
    } else {
      // Use localStorage
      const newApps = [...apps, app];
      setApps(newApps);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newApps));
    }
  };

  const updateApp = async (app: AppData, oldId?: string) => {
    const targetId = oldId || app.id;
    
    if (isSupabaseAvailable() && supabase) {
      try {
        const dbApp = toDbFormat(app);
        
        // If ID changed, delete old and insert new
        if (oldId && oldId !== app.id) {
          // Delete old app
          const { error: deleteError } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', oldId);

          if (deleteError) {
            console.error('Error deleting old app:', deleteError);
            // Fallback to localStorage
            const newApps = apps.map(a => a.id === targetId ? app : a);
            setApps(newApps);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newApps));
            return;
          }

          // Insert new app with new ID
          const { error } = await supabase
            .from(TABLE_NAME)
            .insert([dbApp]);

          if (error) {
            console.error('Error updating app in Supabase:', error);
            // Fallback to localStorage
            const newApps = apps.map(a => a.id === targetId ? app : a);
            setApps(newApps);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newApps));
          } else {
            // Successfully updated, refresh the list
            await refreshApps();
          }
        } else {
          // Normal update
          console.log('Updating app in Supabase:', { 
            id: dbApp.id, 
            privacyPolicyLength: dbApp.privacy_policy?.length,
            privacyPolicy: dbApp.privacy_policy 
          });
          const { error } = await supabase
            .from(TABLE_NAME)
            .update(dbApp)
            .eq('id', app.id);

          if (error) {
            console.error('Error updating app in Supabase:', error);
            // Fallback to localStorage
            const newApps = apps.map(a => a.id === app.id ? app : a);
            setApps(newApps);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newApps));
          } else {
            // Successfully updated, refresh the list
            await refreshApps();
          }
        }
      } catch (error) {
        console.error('Error updating app:', error);
        // Fallback to localStorage
        const newApps = apps.map(a => a.id === targetId ? app : a);
        setApps(newApps);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newApps));
      }
    } else {
      // Use localStorage
      const newApps = apps.map(a => a.id === targetId ? app : a);
      setApps(newApps);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newApps));
    }
  };

  const deleteApp = async (id: string) => {
    if (isSupabaseAvailable() && supabase) {
      try {
        const { error } = await supabase
          .from(TABLE_NAME)
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting app from Supabase:', error);
          // Fallback to localStorage
          const newApps = apps.filter(a => a.id !== id);
          setApps(newApps);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newApps));
        } else {
          // Successfully deleted from Supabase, refresh the list
          await refreshApps();
        }
      } catch (error) {
        console.error('Error deleting app:', error);
        // Fallback to localStorage
        const newApps = apps.filter(a => a.id !== id);
        setApps(newApps);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newApps));
      }
    } else {
      // Use localStorage
      const newApps = apps.filter(a => a.id !== id);
      setApps(newApps);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newApps));
    }
  };

  if (!isLoaded) return null;

  return (
    <AppContext.Provider value={{ apps, getApp, addApp, updateApp, deleteApp }}>
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
