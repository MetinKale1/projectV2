import { useState, useRef } from 'react';
import { IoCloudUpload, IoClose } from 'react-icons/io5';

export default function ImageUpload({ currentImage, onImageSelect, label = "Upload Afbeelding" }) {
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Selecteer een geldig afbeeldingsbestand');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Afbeelding moet kleiner zijn dan 5MB');
      return;
    }

    setError('');

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreview(base64String);
      onImageSelect(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-white/80 text-sm font-medium">{label}</label>
      
      {preview ? (
        // Preview - GEEN GRIJZE ACHTERGROND, alleen border
        <div className="relative w-full h-48 rounded-xl border-2 border-white/10 overflow-hidden flex items-center justify-center">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-full object-contain" 
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>
      ) : (
        // Upload area
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#FF6B35] hover:bg-white/5 transition-all"
        >
          <IoCloudUpload className="w-12 h-12 text-white/40 mb-2" />
          <p className="text-white/60 text-sm">Klik om afbeelding te uploaden</p>
          <p className="text-white/40 text-xs mt-1">PNG, JPG, GIF (max 5MB)</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
}
