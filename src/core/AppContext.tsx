import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { TethrynExperience } from '../types/tethryn';
import { tethrynService } from '../services/tethrynService';

interface AppState {
  user: any;
  loading: boolean;
  experiences: TethrynExperience[];
  refreshExperiences: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
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
      if (u) {
        setUser(u);
        loadExperiences(u.uid);
      } else {
        const localUid = localStorage.getItem('local_dev_user_uid');
        if (localUid) {
          const guestUser = {
            uid: localUid,
            email: 'guest@localhost.local',
            displayName: 'Guest Developer',
            isAnonymous: true,
          } as any;
          setUser(guestUser);
          loadExperiences(localUid);
        } else {
          setUser(null);
          setExperiences([]);
        }
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
