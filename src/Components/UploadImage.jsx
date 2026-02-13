import React, { useState, useEffect } from 'react';
import { storage } from '../../Firebase'; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Upload, X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const UploadImage = ({ onUploadComplete }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError(null);

    if (file) {
      // Validation: Limit to 5MB for the archive
      if (file.size > 5 * 1024 * 1024) {
        setError("Object size exceeds 5MB threshold.");
        return;
      }
      
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearSelection = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
    setProgress(0);
    setError(null);
  };

  const handleUpload = () => {
    if (!image) return;

    setIsUploading(true);
    // Organized into the NY-2026 directory structure
    const storageRef = ref(storage, `archive/v2026/${Date.now()}_${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(progressPercent));
      },
      (err) => {
        console.error("Transmission Interrupted:", err);
        setError("Upload failed. Check network connection.");
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setIsUploading(false);
        
        // Pass the URL up to the parent component (e.g., to save to Firestore)
        if (onUploadComplete) onUploadComplete(downloadURL);

        // Auto-reset after successful ingestion
        setTimeout(() => {
          clearSelection();
        }, 2000);
      }
    );
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white border border-stone-100 shadow-sm selection:bg-stone-900 selection:text-white">
      <h2 className="text-[10px] uppercase tracking-[0.5em] text-stone-400 mb-8 font-black">
        Media Ingestion / US-HQ
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 flex items-center gap-3 text-red-900 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={14} />
          <span className="text-[9px] uppercase tracking-widest font-bold">{error}</span>
        </div>
      )}

      {!preview ? (
        <label className="group flex flex-col items-center justify-center w-full h-80 border border-dashed border-stone-200 hover:border-stone-900 transition-all duration-700 cursor-pointer bg-stone-50/50">
          <div className="p-4 rounded-full bg-white border border-stone-100 group-hover:scale-110 transition-transform duration-500 shadow-sm">
            <Upload className="text-stone-300 group-hover:text-stone-900" strokeWidth={1} size={28} />
          </div>
          <span className="mt-6 text-[9px] uppercase tracking-[0.4em] text-stone-400 group-hover:text-stone-900 font-bold transition-colors">
            Select Archive Object
          </span>
          <p className="mt-2 text-[8px] text-stone-300 uppercase tracking-tighter">JPG, PNG, WEBP — MAX 5MB</p>
          <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
        </label>
      ) : (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
          <div className="relative aspect-[4/5] w-full bg-stone-50 overflow-hidden border border-stone-100">
            <img 
              src={preview} 
              alt="Preview" 
              className={`w-full h-full object-contain p-4 mix-blend-multiply transition-all duration-1000 ${isUploading ? 'scale-90 opacity-50 blur-sm' : 'scale-100'}`} 
            />
            {!isUploading && (
              <button 
                onClick={clearSelection}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md text-stone-900 border border-stone-100 hover:bg-stone-950 hover:text-white transition-all duration-500"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Technical Progress Bar */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] uppercase tracking-widest text-stone-400 font-bold">
                <span>Data Transmission</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-[1px] bg-stone-100">
                <div 
                  className="h-full bg-stone-950 transition-all duration-500 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={isUploading || progress === 100}
            className="group w-full py-6 bg-stone-950 text-white text-[10px] uppercase tracking-[0.5em] font-black flex items-center justify-center gap-4 hover:bg-stone-800 disabled:bg-stone-50 disabled:text-stone-300 transition-all duration-700"
          >
            {isUploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Processing...
              </>
            ) : progress === 100 ? (
              <>
                <CheckCircle2 size={14} className="text-green-500" />
                Object Archived
              </>
            ) : (
              "Finalize Ingestion"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadImage;