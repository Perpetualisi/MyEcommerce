import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../../Firebase'; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Upload, X, CheckCircle2, Loader2, AlertCircle, Info, FileText } from 'lucide-react';

const UploadImage = ({ onUploadComplete }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [meta, setMeta] = useState({ name: '', size: '', type: '' });
  
  const fileInputRef = useRef(null);

  // Memory Cleanup
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const processFile = (file) => {
    setError(null);
    if (!file) return;

    // Registry Validation: 10MB Limit for High-Res Archives
    if (file.size > 10 * 1024 * 1024) {
      setError("Inquiry Rejected: Payload exceeds 10MB limit.");
      return;
    }

    setMeta({
      name: file.name.toUpperCase(),
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      type: file.type.split('/')[1].toUpperCase()
    });

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (!image) return;
    setIsUploading(true);

    // Sanitize filename for the registry
    const timestamp = Date.now();
    const sanitizedName = image.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    const storageRef = ref(storage, `archive/v2026/NY_${timestamp}_${sanitizedName}`);
    
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(p));
      },
      (err) => {
        setError("Transmission Fault: Network Handshake Failed.");
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setIsUploading(false);
        if (onUploadComplete) onUploadComplete(downloadURL);
        
        // Auto-purge state after success
        setTimeout(() => {
          setImage(null);
          setPreview(null);
          setProgress(0);
        }, 3000);
      }
    );
  };

  return (
    <div className="max-w-xl mx-auto p-10 bg-white border border-stone-200 selection:bg-stone-900 selection:text-white">
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-stone-50">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.6em] text-stone-900 font-black">
            Media Ingestion Portal
          </h2>
          <p className="text-[8px] uppercase tracking-widest text-stone-400 mt-1">Registry / US-EAST-01</p>
        </div>
        <FileText size={16} className="text-stone-200" strokeWidth={1} />
      </header>

      {error && (
        <div className="mb-8 p-5 bg-stone-950 text-white flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
          <AlertCircle size={14} className="text-red-500" />
          <span className="text-[9px] uppercase tracking-[0.3em] font-bold">{error}</span>
        </div>
      )}

      {!preview ? (
        <label 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`group relative flex flex-col items-center justify-center w-full h-[450px] border-2 border-dashed transition-all duration-1000 cursor-pointer 
            ${isDragging ? 'border-stone-900 bg-stone-50 scale-[0.98]' : 'border-stone-100 bg-[#fafaf9]'}
          `}
        >
          <div className={`p-6 rounded-full bg-white border border-stone-100 shadow-sm transition-all duration-700 ${isDragging ? 'rotate-180 scale-125' : ''}`}>
            <Upload className="text-stone-300 group-hover:text-stone-900" strokeWidth={1} size={32} />
          </div>
          
          <div className="mt-8 text-center space-y-3">
            <span className="block text-[10px] uppercase tracking-[0.5em] text-stone-900 font-black">
              Deploy Archive Object
            </span>
            <p className="text-[9px] text-stone-400 uppercase tracking-widest leading-relaxed">
              Drag file to terminal or <span className="text-stone-900 underline underline-offset-4">browse local drive</span>
            </p>
          </div>

          <div className="absolute bottom-8 left-0 w-full px-8 flex justify-between opacity-40">
            <span className="text-[7px] font-mono">SPEC: HEIC/JPG/WEBP</span>
            <span className="text-[7px] font-mono">ENCRYPTED_UPLOAD_V2</span>
          </div>
          
          <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => processFile(e.target.files[0])} accept="image/*" />
        </label>
      ) : (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Visual Frame */}
            <div className="relative aspect-square w-full bg-[#fafaf9] border border-stone-100 p-4">
              <img 
                src={preview} 
                className={`w-full h-full object-contain mix-blend-multiply transition-all duration-1000 ${isUploading ? 'grayscale blur-lg opacity-20' : ''}`} 
                alt="Registry Preview"
              />
              {!isUploading && (
                <button 
                  onClick={() => { setPreview(null); setImage(null); }}
                  className="absolute top-4 right-4 p-2 bg-white border border-stone-100 hover:bg-stone-900 hover:text-white transition-all shadow-xl"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Technical Metadata Table */}
            <div className="space-y-6 pt-4">
              <div className="space-y-4">
                <h4 className="text-[8px] uppercase tracking-[0.4em] text-stone-400 font-bold">Metadata Specs</h4>
                <div className="space-y-3 border-t border-stone-50 pt-4">
                  {[
                    { label: "Designation", value: meta.name.slice(0, 15) + (meta.name.length > 15 ? "..." : "") },
                    { label: "Payload Size", value: meta.size },
                    { label: "Encoding", value: meta.type },
                    { label: "Archive Dir", value: "NY/2026/PROD" }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-stone-400 uppercase">{item.label}</span>
                      <span className="text-stone-900 font-black tracking-tighter">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Safety Note */}
              <div className="p-4 bg-stone-50 border border-stone-100 flex gap-3">
                <Info size={12} className="text-stone-300 mt-0.5" />
                <p className="text-[8px] text-stone-500 uppercase tracking-widest leading-relaxed">
                  Objects are permanent once archived. Verify metadata before final ingestion.
                </p>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-4 pt-6 border-t border-stone-50">
             <div className="flex justify-between text-[9px] uppercase tracking-widest font-black">
                <span className={progress === 100 ? "text-green-600" : "text-stone-900"}>
                  {progress === 100 ? "Transmission Finalized" : "Bit-Stream Progress"}
                </span>
                <span className="font-mono">{progress}%</span>
             </div>
             <div className="w-full h-[2px] bg-stone-50 overflow-hidden">
                <div 
                  className="h-full bg-stone-950 transition-all duration-700 ease-in-out" 
                  style={{ width: `${progress}%` }}
                />
             </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading || progress === 100}
            className="group w-full py-8 bg-stone-950 text-white text-[10px] uppercase tracking-[0.5em] font-black flex items-center justify-center gap-4 hover:bg-stone-800 disabled:bg-stone-50 disabled:text-stone-200 transition-all duration-1000 shadow-2xl shadow-stone-200"
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Syncing to Archive
              </>
            ) : progress === 100 ? (
              <>
                <CheckCircle2 size={16} className="text-green-500" />
                Ingestion Successful
              </>
            ) : (
              "Authorize Ingestion"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadImage;