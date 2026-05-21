import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const supabaseStorageService = {
  /**
   * Upload a file to Supabase Storage
   * @param file The file to upload
   * @param bucket The bucket name (defaults to 'uploads')
   * @param folder Optional subfolder path
   */
  async uploadFile(file: File, bucket: string = 'uploads', folder: string = ''): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Try to find the correct bucket name if 'uploads' doesn't work
      let targetBucket = bucket;
      
      // Step 1: Check if the bucket exists, try 'UPLOADS' if 'uploads' fails
      const { data: buckets } = await supabase.storage.listBuckets();
      if (buckets) {
        const hasUploadsLower = buckets.some(b => b.name === 'uploads');
        const hasUploadsUpper = buckets.some(b => b.name === 'UPLOADS');
        
        if (!hasUploadsLower && hasUploadsUpper) {
          targetBucket = 'UPLOADS';
        } else if (!hasUploadsLower && !hasUploadsUpper && buckets.length > 0) {
          // If neither 'uploads' nor 'UPLOADS' exists, use the first available public bucket
          targetBucket = buckets[0].name;
        }
      }

      console.log(`Supabase: Attempting upload to bucket "${targetBucket}" at path "${filePath}"`);

      const { data, error } = await supabase.storage
        .from(targetBucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase Upload Error Object:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(targetBucket)
        .getPublicUrl(filePath);

      console.log(`Supabase: Upload successful! URL: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      console.error('Supabase Upload Error:', error);
      throw error;
    }
  },

  /**
   * Specifically handle media uploads
   */
  async uploadMedia(file: File, type: 'image' | 'video' | 'audio'): Promise<string> {
    const folder = `${type}s`;
    // We try 'media' or fall back to 'uploads' if that's what the user has
    try {
      return await this.uploadFile(file, 'media', folder);
    } catch {
      return await this.uploadFile(file, 'uploads', folder);
    }
  },

  /**
   * Test connection to Supabase Storage specifically
   */
  async testConnection(): Promise<boolean> {
    try {
       // We try to list the 'uploads' or 'UPLOADS' bucket
       const { error } = await supabase.storage.getBucket('uploads');
       const { error: error2 } = await supabase.storage.getBucket('UPLOADS');
       
       // If either exists, we are connected
       return !error || !error2;
    } catch {
      return false;
    }
  }
};
