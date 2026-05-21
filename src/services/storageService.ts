import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../lib/firebase';

export const storageService = {
  async uploadFile(
    file: File, 
    path: string, 
    onProgress?: (progress: number) => void,
    retries = 2
  ): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required for upload. Please sign in again.");

    // Check if storage is initialized
    if (!storage) {
        throw new Error("Storage service is not initialized. Ensure getStorage(app) is called in firebase.ts");
    }

    // Create a safe filename with timestamp to avoid collisions
    const fileExtension = file.name.split('.').pop() || 'tmp';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const fullPath = `users/${user.uid}/${path}/${fileName}`;
    
    const storageRef = ref(storage, fullPath);
    console.log("Initializing Resumable Upload:", fullPath);
    
    // Check if browser is online
    if (!navigator.onLine) {
      throw new Error("Local Signal Interruption: No internet connection detected.");
    }

    try {
      return await this._performUpload(storageRef, file, onProgress);
    } catch (error: any) {
      console.error("Storage Error Detail:", error.code, error.message);
      
      // Specfic check for project setup issues
      if (error.code === 'storage/project-not-found' || error.code === 'storage/bucket-not-found') {
        throw new Error("Firebase Storage is NOT enabled for this project. Please go to the Firebase Console and click 'Get Started' in the Storage section.");
      }

      if (retries > 0 && error.code !== 'storage/unauthorized') {
        console.warn(`Upload attempt failed. Retrying... (${retries} left)`);
        // Wait a bit before retrying
        await new Promise(r => setTimeout(r, 2000));
        return this.uploadFile(file, path, onProgress, retries - 1);
      }
      throw error;
    }
  },

  async testConnection(): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    try {
      // Use listAll on a likely empty path to trigger a bucket check
      // This will throw if the bucket doesn't exist or if there's a CORS/Network issue
      const listRef = ref(storage, `users/${user.uid}/test-connection`);
      
      // We wrap it in a timeout so it doesn't hang if there's a massive network issue
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 3000)
      );

      await Promise.race([
        this._safeList(listRef),
        timeoutPromise
      ]);
      
      return true;
    } catch (error: any) {
      console.error("Storage Connectivity Test Failed:", error.code, error.message);
      if (error.code === 'storage/project-not-found' || error.code === 'storage/bucket-not-found' || error.message === 'Timeout') {
        return false;
      }
      // If it's a permission error, it means the bucket exists but we can't read it (which is fine for a connection test)
      if (error.code === 'storage/unauthorized') return true;
      return false;
    }
  },

  async _safeList(ref: any) {
    try {
      // We don't import listAll at the top to avoid bloating if not used, but it's fine here
      const { listAll } = await import('firebase/storage');
      await listAll(ref);
    } catch (e: any) {
      // If it's just "not found" it might still be active
      if (e.code === 'storage/object-not-found') return;
      throw e;
    }
  },

  _performUpload(storageRef: any, file: File, onProgress?: (progress: number) => void): Promise<string> {
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      // Add a safety timeout (5 mins) to prevent hanging
      const timeout = setTimeout(() => {
        uploadTask.cancel();
        reject(new Error("Upload Timeout: The upload took too long (5 mins)."));
      }, 300000);

      // Add a 15-second fast-fail timeout if NO progress happens
      let progressTimeout = setTimeout(() => {
        uploadTask.cancel();
        reject(new Error("Storage service is unreachable. You may need to enable Firebase Storage in the Firebase Console."));
      }, 15000);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          clearTimeout(progressTimeout); // If we get progress, clear the fast-fail timeout
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error: any) => {
          clearTimeout(timeout);
          console.error("Critical Storage Fault:", error);

          let displayMessage = `Upload Process Failure: ${error.message}`;
          
          if (error.code === 'storage/unauthorized') {
            displayMessage = "Access Denied: You don't have permission to upload this file.";
          } else if (error.code === 'storage/canceled') {
            displayMessage = "Upload canceled.";
          } else if (error.code === 'storage/retry-limit-exceeded') {
            displayMessage = "Upload failed. Please check your internet connection and try again.";
          }

          reject(new Error(displayMessage));
        },
        async () => {
          clearTimeout(timeout);
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (err: any) {
            console.error("Downlink Error:", err);
            reject(new Error("Upload complete, but failed to retrieve the public link."));
          }
        }
      );
    });
  }
};
