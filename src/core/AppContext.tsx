import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { TethrynExperience } from '../types/tethryn';
import { tethrynService } from '../services/tethrynService';

interface AppState {
  user: User | null;
  loading: boolean;
  experiences: TethrynExperience[];
  refreshExperiences: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<TethrynExperience[]>([]);

  const loadExperiences = async (userId: string) => {
    try {
      const data = await tethrynService.getUserExperiences(userId);
      setExperiences(data);
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const refreshExperiences = async () => {
    if (user) await loadExperiences(user.uid);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        loadExperiences(u.uid);
      } else {
        setExperiences([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ user, loading, experiences, refreshExperiences }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
