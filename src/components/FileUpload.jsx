import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export const FileUpload = ({
  value = '',
  onChange,
  label = 'Upload Image',
  maxSizeKB = 500,
  className = '',
  aspectRatio = null, // e.g., '16:9' or '1:1'
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const compressImage = (base64Str, maxWidth = 800, maxHeight = 600) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress image to JPEG quality 0.7
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };
      img.onerror = () => {
        resolve(base64Str); // Fallback to original if load fails
      };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64Result = event.target.result;
        // Compress the image before passing it up
        const compressed = await compressImage(base64Result);
        
        // Double check size of compressed base64 (roughly 1.37 times original binary size)
        const sizeInKB = Math.round((compressed.length * 3) / 4 / 1024);
        if (sizeInKB > maxSizeKB) {
          setError(`Image is too large (${sizeInKB}KB). Max allowed size is ${maxSizeKB}KB.`);
          setLoading(false);
          return;
        }

        onChange(compressed);
      } catch (err) {
        setError('Error processing image file.');
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Error reading file.');
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
      
      {value ? (
        <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-slate-50 group flex items-center justify-center p-2 h-44">
          <img
            src={value}
            alt="Preview"
            className="max-h-full max-w-full object-contain rounded"
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded shadow transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-1.5 rounded shadow transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-slate-100/50 h-44"
        >
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
              <span className="text-xs text-slate-500 font-medium">Processing file...</span>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm font-medium text-slate-600">Click to upload or drag & drop</span>
              <span className="text-[11px] text-slate-400 mt-1">PNG, JPG, JPEG up to {maxSizeKB}KB</span>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-rose-600 font-semibold mt-1">{error}</p>}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
