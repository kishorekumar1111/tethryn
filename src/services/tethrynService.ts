import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, orderBy, serverTimestamp, increment } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { TethrynExperience } from '../types/tethryn';
import { handleFirestoreError, OperationType } from '../lib/firebase';

const COLLECTION_NAME = 'experiences';

export const tethrynService = {
  async create(data: Partial<TethrynExperience>) {
    const user = auth.currentUser || (localStorage.getItem('local_dev_user_uid') ? { uid: localStorage.getItem('local_dev_user_uid') } : null);
    if (!user) throw new Error("Authentication required");

    const experience: any = {
      authorId: user.uid,
      templateId: data.templateId || 'memory-bloom',
      slug: data.slug || Math.random().toString(36).substring(7),
      title: data.title || 'A Tethryn Experience',
      recipientName: data.recipientName || '',
      senderName: data.senderName || '',
      content: data.content || {},
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      views: 0,
      createdAt: auth.currentUser ? serverTimestamp() : new Date().toISOString(),
      updatedAt: auth.currentUser ? serverTimestamp() : new Date().toISOString(),
    };

    // Guest Mode / Localhost fallback
    if (!auth.currentUser) {
      const id = 'local_' + Math.random().toString(36).substring(7);
      const newExp = { ...experience, id };
      const localList = JSON.parse(localStorage.getItem('local_experiences') || '[]');
      localList.push(newExp);
      localStorage.setItem('local_experiences', JSON.stringify(localList));
      return id;
    }

    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), experience);
      return docRef.id;
    } catch (error) {
      console.warn("Firestore save failed, falling back to local storage:", error);
      const id = 'local_' + Math.random().toString(36).substring(7);
      const newExp = { ...experience, id };
      const localList = JSON.parse(localStorage.getItem('local_experiences') || '[]');
      localList.push(newExp);
      localStorage.setItem('local_experiences', JSON.stringify(localList));
      return id;
    }
  },

  async update(id: string, data: Partial<TethrynExperience>) {
    if (id && id.toString().startsWith('local_')) {
      const localList = JSON.parse(localStorage.getItem('local_experiences') || '[]');
      const index = localList.findIndex((x: any) => x.id === id);
      if (index !== -1) {
        localList[index] = { ...localList[index], ...data, updatedAt: new Date().toISOString() };
        localStorage.setItem('local_experiences', JSON.stringify(localList));
      }
      return;
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn("Firestore update failed, falling back to local storage:", error);
      const localList = JSON.parse(localStorage.getItem('local_experiences') || '[]');
      const index = localList.findIndex((x: any) => x.id === id);
      if (index !== -1) {
        localList[index] = { ...localList[index], ...data, updatedAt: new Date().toISOString() };
        localStorage.setItem('local_experiences', JSON.stringify(localList));
      } else {
        handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
      }
    }
  },

  async getBySlug(slug: string) {
    // Check local storage first
    const localList = JSON.parse(localStorage.getItem('local_experiences') || '[]');
    const localExp = localList.find((x: any) => x.slug === slug);
    if (localExp) return localExp as TethrynExperience;

    const user = auth.currentUser;
    
    try {
      // 1. Try public query first
      const qPublic = query(
        collection(db, COLLECTION_NAME), 
        where('slug', '==', slug), 
        where('isPublished', '==', true)
      );
      const snapPublic = await getDocs(qPublic);
      if (!snapPublic.empty) {
        const d = snapPublic.docs[0];
        return { id: d.id, ...d.data() } as TethrynExperience;
      }
      
      // 2. If not found and logged in, try fetching as owner
      if (user) {
        const qOwner = query(
          collection(db, COLLECTION_NAME), 
          where('slug', '==', slug), 
          where('authorId', '==', user.uid)
        );
        const snapOwner = await getDocs(qOwner);
        if (!snapOwner.empty) {
          const d = snapOwner.docs[0];
          return { id: d.id, ...d.data() } as TethrynExperience;
        }
      }
      
      return null;
    } catch (error) {
       console.warn("Firestore getBySlug failed, using local fallback if available:", error);
       return localExp || null;
    }
  },

  async getById(id: string) {
    if (id && id.toString().startsWith('local_')) {
      const localList = JSON.parse(localStorage.getItem('local_experiences') || '[]');
      const localExp = localList.find((x: any) => x.id === id);
      return localExp || null;
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as TethrynExperience;
      }
      return null;
    } catch (error) {
       console.warn("Firestore getById failed, fallback to local storage check:", error);
       const localList = JSON.parse(localStorage.getItem('local_experiences') || '[]');
       const localExp = localList.find((x: any) => x.id === id);
       return localExp || null;
    }
  },

  async getUserExperiences(userId?: string) {
    const uid = userId || auth.currentUser?.uid || localStorage.getItem('local_dev_user_uid');
    if (!uid) return [];
    
    const localList = JSON.parse(localStorage.getItem('local_experiences') || '[]')
      .filter((x: any) => x.authorId === uid);

    if (!auth.currentUser) {
      return localList as TethrynExperience[];
    }

    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('authorId', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fsList = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as TethrynExperience[];
      
      const combined = [...localList, ...fsList];
      const seen = new Set();
      return combined.filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    } catch (error) {
      console.warn("Firestore getUserExperiences failed, showing local storage only:", error);
      return localList as TethrynExperience[];
    }
  },

  async incrementViews(id: string) {
    if (id && id.toString().startsWith('local_')) {
      const localList = JSON.parse(localStorage.getItem('local_experiences') || '[]');
      const index = localList.findIndex((x: any) => x.id === id);
      if (index !== -1) {
        localList[index] = { ...localList[index], views: (localList[index].views || 0) + 1 };
        localStorage.setItem('local_experiences', JSON.stringify(localList));
      }
      return;
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { views: increment(1) });
    } catch (error) {
      console.warn("Failed to increment views in database:", error);
    }
  },

  async delete(id: string) {
    if (id && id.toString().startsWith('local_')) {
      const localList = JSON.parse(localStorage.getItem('local_experiences') || '[]');
      const filtered = localList.filter((x: any) => x.id !== id);
      localStorage.setItem('local_experiences', JSON.stringify(filtered));
      return;
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
       console.warn("Firestore delete failed:", error);
       handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
    }
  }
};
