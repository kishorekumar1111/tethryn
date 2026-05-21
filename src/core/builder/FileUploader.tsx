import React, { useRef, useState } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { storageService } from '../../services/storageService';
import { supabaseStorageService } from '../../services/supabaseStorageService';
import { isSupabaseConfigured } from '../../lib/supabase';

// Set this to 'supabase' or 'firebase'
export const STORAGE_PROVIDER: 'firebase' | 'supabase' = isSupabaseConfigured ? 'supabase' : 'firebase';

interface FileUploaderProps {
  onUploadSuccess: (url: string) => void;
  path: string;
  accept?: string;
  label?: string;
  provider?: 'firebase' | 'supabase';
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onUploadSuccess, 
  path, 
  accept = "image/*", 
  label = "Upload File",
  provider = STORAGE_PROVIDER
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Add a file size limit (e.g., 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File exceeds 20MB limit");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setStatus('idle');
    
    try {
      let url = '';
      
      if (provider === 'supabase') {
        // For Supabase, 'path' is treated as folder name
        try {
          url = await supabaseStorageService.uploadFile(file, 'uploads', path);
        } catch (err: any) {
          const errorMsg = err.message || 'Supabase Upload Failed';
          toast.error(`Supabase Error: ${errorMsg}`);
          // Re-throw to trigger the catch block below
          throw err;
        }
      } else {
        url = await storageService.uploadFile(file, path, (p) => {
          setProgress(Math.round(p));
        });
      }

      onUploadSuccess(url);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: any) {
      console.error("Upload failed in component:", error);
      toast.error(error.message || "Failed to upload file");
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`w-full h-16 flex items-center justify-center space-x-4 px-6 rounded-xl border transition-all duration-500 relative overflow-hidden shadow-sm ${
          status === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-700' :
          status === 'error' ? 'bg-red-500/5 border-red-500/20 text-red-700' :
          'bg-white border-tethryn-border hover:border-tethryn-accent text-tethryn-muted hover:text-tethryn-ink hover:bg-tethryn-bg'
        }`}
      >
        {isUploading && (
          <div 
            className="absolute inset-0 bg-tethryn-accent/5 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        )}
        
        {isUploading ? (
          <>
            <Loader2 size={18} className="animate-spin text-tethryn-accent" />
            <span className="text-[12px] font-bold uppercase tracking-[0.4em]">SYNTHESIZING {progress}%</span>
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle2 size={18} className="text-green-500" />
            <span className="text-[12px] font-bold uppercase tracking-[0.4em]">DEPOSITED</span>
          </>
        ) : status === 'error' ? (
          <>
            <AlertCircle size={18} className="text-red-500" />
            <span className="text-[12px] font-bold uppercase tracking-[0.4em]">SYNC ERROR</span>
          </>
        ) : (
          <>
            <Upload size={18} className="text-tethryn-accent" />
            <span className="text-[12px] font-bold uppercase tracking-[0.4em]">{label}</span>
          </>
        )}
      </button>
    </div>
  );
};
