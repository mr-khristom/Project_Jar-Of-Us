import React from 'react';

interface JarVisualProps {
  isShaking: boolean;
}

const JarVisual: React.FC<JarVisualProps> = ({ isShaking }) => {
  return (
    <div className={`relative w-64 h-96 mx-auto transition-transform duration-100 ${isShaking ? 'animate-shake-hard' : 'animate-float'}`}>
      
      {/* Lid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-12 z-20">
        <div className="w-full h-full bg-slate-300 rounded-t-lg border-b-4 border-slate-400 shadow-sm relative overflow-hidden">
            {/* Shine on lid */}
            <div className="absolute top-0 left-4 w-2 h-full bg-white/40 skew-x-12"></div>
        </div>
      </div>

      {/* Neck */}
      <div className="absolute top-11 left-1/2 -translate-x-1/2 w-36 h-8 bg-slate-100/50 backdrop-blur-sm border-x-2 border-slate-300 z-10"></div>

      {/* Body */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-52 h-80 bg-white/20 backdrop-blur-md border-4 border-white/40 rounded-b-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex items-end justify-center pb-6 z-10">
        
        {/* Glass reflections */}
        <div className="absolute top-4 left-4 w-4 h-64 bg-white/20 rounded-full filter blur-[2px]"></div>
        <div className="absolute top-10 right-6 w-2 h-16 bg-white/30 rounded-full"></div>

        {/* Contents (Folded Papers) - Decorative */}
        <div className="relative w-full h-full">
             {/* Generative paper scraps */}
             <div className="absolute bottom-4 left-8 w-12 h-12 bg-love-200 rotate-12 shadow-md rounded-sm opacity-80"></div>
             <div className="absolute bottom-6 right-10 w-14 h-10 bg-love-300 -rotate-6 shadow-md rounded-sm opacity-80"></div>
             <div className="absolute bottom-16 left-16 w-10 h-10 bg-white rotate-45 shadow-md rounded-sm opacity-70"></div>
             <div className="absolute bottom-10 right-20 w-12 h-14 bg-love-100 rotate-12 shadow-md rounded-sm opacity-80"></div>
             <div className="absolute bottom-24 left-10 w-8 h-8 bg-love-400 -rotate-12 shadow-md rounded-sm opacity-60"></div>
             
             {/* Floating particles */}
             <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
             <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Label */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-32 h-20 bg-love-50/90 shadow-lg rotate-[-2deg] z-20 flex items-center justify-center border border-love-200 rounded-sm">
        <div className="text-center">
          <div className="border-t border-b border-love-800 py-1">
             <h2 className="font-serif text-love-900 text-lg leading-none tracking-widest">OUR</h2>
             <h2 className="font-serif text-love-900 text-xl font-bold leading-none tracking-widest">MEMORIES</h2>
          </div>
        </div>
      </div>

    </div>
  );
};

export default JarVisual;
