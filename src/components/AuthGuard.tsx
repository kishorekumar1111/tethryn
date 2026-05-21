import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-editorial-bg">
        <Loader2 className="animate-spin text-neutral-200 mb-4" size={48} />
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-neutral-300">Synchronizing Vault Access...</p>
      </div>
    );
  }

  if (!authenticated) {
    // Save the location they were trying to reach
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
