import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, orderBy, serverTimestamp, increment } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { TethrynExperience } from '../types/tethryn';
import { handleFirestoreError, OperationType } from '../lib/firebase';

const COLLECTION_NAME = 'experiences'; // Optimized for production naming convention

export const tethrynService = {
  async create(data: Partial<TethrynExperience>) {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required");

    const experience: Omit<TethrynExperience, 'id'> = {
      authorId: user.uid,
      templateId: data.templateId || 'memory-bloom',
      slug: data.slug || Math.random().toString(36).substring(7),
      title: data.title || 'A Tethryn Experience',
      recipientName: data.recipientName || '',
      senderName: data.senderName || '',
      content: data.content || {},
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), experience);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
      throw error;
    }
  },

  async update(id: string, data: Partial<TethrynExperience>) {
    const docRef = doc(db, COLLECTION_NAME, id);
    try {
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
    }
  },

  async getBySlug(slug: string) {
    const user = auth.currentUser;
    
    try {
      // 1. Try public query first (satisfies most common case and list rules for everyone)
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
       handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
       return null;
    }
  },

  async getById(id: string) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as TethrynExperience;
      }
      return null;
    } catch (error) {
       handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${id}`);
       return null;
    }
  },

  async getUserExperiences(userId?: string) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) return [];
    
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('authorId', '==', uid),
      orderBy('createdAt', 'desc')
    );

    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as TethrynExperience[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      return [];
    }
  },

  async incrementViews(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    try {
      await updateDoc(docRef, { views: increment(1) });
    } catch (error) {
      console.error("Failed to increment views:", error);
      // We don't throw here to avoid breaking the view experience for the user
      // but we log it and could use handleFirestoreError if we wanted strict reporting
    }
  },

  async delete(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
    }
  }
};
