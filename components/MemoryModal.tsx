
import React, { useState } from 'react';
import { Memory } from '../types';
import { X, ImageOff } from 'lucide-react';
import { getDirectImgurUrl } from '../services/utils';

interface MemoryModalProps {
  memory: Memory;
  onClose: () => void;
}

const MemoryModal: React.FC<MemoryModalProps> = ({ memory, onClose }) => {
  const [imgError, setImgError] = useState(false);
  
  // Auto-fix Imgur links that point to the page instead of the image
  const displayImageUrl = memory.imageUrl ? getDirectImgurUrl(memory.imageUrl) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#fff9f0] p-8 rounded-xl shadow-2xl transform rotate-1 max-h-[90vh] overflow-y-auto">
        
        {/* Paper Texture effect */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 rounded-xl pointer-events-none"></div>

        {/* Tape visual */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/30 backdrop-blur-[1px] rotate-1 shadow-sm border-l border-r border-white/20"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"
        >
          <X size={24} />
        </button>

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-xs font-serif text-slate-400 text-center uppercase tracking-widest mb-6">
            A Memory From {new Date(memory.dateAdded).toLocaleDateString()}
          </p>
          
          {displayImageUrl && !imgError && (
            <div className="mb-6 p-2 bg-white shadow-md rotate-[-1deg] w-full flex justify-center">
              <img 
                src={displayImageUrl} 
                alt="Memory" 
                className="max-w-full h-auto max-h-[50vh] object-contain rounded-sm"
                onError={() => setImgError(true)}
              />
            </div>
          )}

          {/* Fallback if image has text but failed to load */}
          {displayImageUrl && imgError && (
             <div className="mb-6 flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg text-slate-300 w-full">
                <ImageOff size={32} />
                <span className="text-xs mt-2">Image not found</span>
             </div>
          )}

          <div className="prose prose-slate text-center mx-auto">
            <p className="font-serif text-lg md:text-xl leading-relaxed text-slate-800">
              "{memory.text}"
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-love-600 text-white rounded-full text-sm font-medium hover:bg-love-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Keep in heart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryModal;
