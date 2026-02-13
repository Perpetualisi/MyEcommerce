import React, { useState } from 'react';
import { storage } from '../../Firebase'; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Upload, X, CheckCircle2, Loader2 } from 'lucide-react';

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Create a local preview URL
    }
  };

  const clearSelection = () => {
    setImage(null);
    setPreview(null);
    setProgress(0);
  };

  const handleUpload = () => {
    if (!image) return;

    setIsUploading(true);
    const storageRef = ref(storage, `archive/images/${Date.now()}_${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(progressPercent));
      },
      (error) => {
        console.error("Upload failed:", error);
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("File available at:", downloadURL);
        setIsUploading(false);
        // Reset or redirect here
      }
    );
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-stone-50 border border-stone-200">
      <h2 className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-8">Media Upload</h2>

      {!preview ? (
        <label className="group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-stone-200 hover:border-stone-400 transition-all cursor-pointer">
          <Upload className="text-stone-300 group-hover:text-stone-500 mb-4" strokeWidth={1} size={32} />
          <span className="text-[10px] uppercase tracking-widest text-stone-400">Select Image</span>
          <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
        </label>
      ) : (
        <div className="space-y-6">
          <div className="relative aspect-square w-full bg-stone-100 overflow-hidden border border-stone-200">
            <img src={preview} alt="Preview" className="w-full h-full object-cover grayscale-[20%]" />
            <button 
              onClick={clearSelection}
              className="absolute top-4 right-4 p-2 bg-stone-900 text-white rounded-full hover:bg-stone-700 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="w-full h-[2px] bg-stone-100">
              <div 
                className="h-full bg-stone-800 transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full py-4 bg-stone-900 text-stone-100 text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400 transition-all"
          >
            {isUploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Uploading {progress}%
              </>
            ) : progress === 100 ? (
              <>
                <CheckCircle2 size={14} />
                Complete
              </>
            ) : (
              "Confirm Upload"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadImage;