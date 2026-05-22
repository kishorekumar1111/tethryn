import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, browserPopupRedirectResolver, signInAnonymously } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  initializeFirestore
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let signInPromise: Promise<any> | null = null;

export const signInWithGoogle = async () => {
  if (signInPromise) return signInPromise;

  signInPromise = (async () => {
    try {
      return await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/popup-blocked') {
        return null;
      }
      console.error('Authentication Error:', error);
      throw error;
    } finally {
      signInPromise = null;
    }
  })();

  return signInPromise;
};

export const signInAsGuest = async () => {
  try {
    return await signInAnonymously(auth);
  } catch (error) {
    console.error('Anonymous Auth Error:', error);
    throw error;
  }
};
