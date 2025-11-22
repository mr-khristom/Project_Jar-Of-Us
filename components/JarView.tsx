
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchDailyMemory, getDailyStatus } from '../services/firebase';
import JarVisual from './JarVisual';
import MemoryModal from './MemoryModal';
import { Memory } from '../types';
import { Sparkles, ArrowLeft, Clock, Eye } from 'lucide-react';

const SHAKE_THRESHOLD = 25; // m/s^2
const REQUIRED_SHAKES = 5;
const SHAKE_TIMEOUT = 1000;

interface JarViewProps {
  onBack: () => void;
}

const JarView: React.FC<JarViewProps> = ({ onBack }) => {
  const [shakeCount, setShakeCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [memory, setMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Shake to open");
  
  // Daily Lock State
  const [isLocked, setIsLocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const lastShakeTime = useRef(0);
  const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check status on mount
  const checkStatus = useCallback(() => {
    const status = getDailyStatus();
    if (status.isLocked) {
      setIsLocked(true);
      setStatusMessage("Memory revealed for today");
      setPermissionGranted(true); 
    } else {
      setIsLocked(false);
      setStatusMessage("Shake to open");
    }
  }, []);

  useEffect(() => {
    checkStatus();
    
    // Update timer every second
    timerIntervalRef.current = setInterval(() => {
      const status = getDailyStatus();
      if (status.isLocked) {
        const hours = Math.floor((status.msUntilReset / (1000 * 60 * 60)));
        const minutes = Math.floor((status.msUntilReset / (1000 * 60)) % 60);
        const seconds = Math.floor((status.msUntilReset / 1000) % 60);
        setTimeRemaining(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [checkStatus]);

  const handleOpen = useCallback(async () => {
    setIsLoading(true);
    setStatusMessage("Opening...");
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mem = await fetchDailyMemory();
      
      if (mem) {
        setMemory(mem);
        setIsLocked(true);
        setStatusMessage("Memory Revealed!");
      } else {
        setMemory(null);
        setIsLocked(false); // Should probably allow shaking again if null? Or lock as empty?
        setStatusMessage("All memories have been seen!");
      }
    } catch (error) {
      console.error(error);
      setStatusMessage("Something went wrong.");
    } finally {
      setIsLoading(false);
      setShakeCount(0);
    }
  }, []);

  const handleViewAgain = () => {
    const status = getDailyStatus();
    if (status.lockedMemory) {
      setMemory(status.lockedMemory);
    }
  };

  // Manual tap fallback
  const handleTap = () => {
    if (memory || isLoading || isLocked) return;
    
    setIsShaking(true);
    setShakeCount(prev => {
      const newCount = prev + 1;
      if (newCount >= REQUIRED_SHAKES) {
        handleOpen();
        return 0;
      }
      return newCount;
    });
    setTimeout(() => setIsShaking(false), 300);
  };

  const requestPermission = async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceMotionEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
        } else {
          alert("Motion permission is required to shake the jar!");
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setPermissionGranted(true);
    }
  };

  useEffect(() => {
    if (!permissionGranted || isLocked) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      if (isLoading || memory) return;

      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const { x, y, z } = acc;
      if (x === null || y === null || z === null) return;

      const magnitude = Math.sqrt(x * x + y * y + z * z);

      if (magnitude > SHAKE_THRESHOLD) {
        const now = Date.now();
        if (now - lastShakeTime.current > 300) {
          lastShakeTime.current = now;
          setIsShaking(true);
          
          setShakeCount(prev => {
            const newCount = prev + 1;
            if (newCount >= REQUIRED_SHAKES) {
               handleOpen();
               return 0;
            }
            return newCount;
          });

          setTimeout(() => setIsShaking(false), 500);

          if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
          shakeTimeoutRef.current = setTimeout(() => {
            setShakeCount(0);
          }, SHAKE_TIMEOUT);
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    };
  }, [permissionGranted, isLoading, memory, handleOpen, isLocked]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative bg-gradient-to-b from-love-50 to-white p-4">
      
      {/* Controls */}
      <div className="absolute top-4 left-4 z-30">
        <button 
          onClick={onBack}
          className="p-2 bg-white/50 backdrop-blur-sm rounded-full text-slate-600 hover:bg-white hover:shadow-md transition-all"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Decorations */}
      {!isLocked && (
        <>
          <div className="absolute top-10 left-10 text-love-200 opacity-50 animate-float">
            <Sparkles size={48} />
          </div>
          <div className="absolute bottom-20 right-10 text-love-200 opacity-50 animate-wiggle">
            <Sparkles size={32} />
          </div>
        </>
      )}

      <div className="relative z-10 mb-8 text-center">
        <h1 className="text-3xl font-serif text-slate-800 mb-2">Jar of Us</h1>
        <p className="text-love-600 font-medium min-h-[1.5em] animate-fade-in">{statusMessage}</p>
        
        {shakeCount > 0 && !isLoading && !isLocked && (
            <div className="mt-2 h-1 w-32 bg-slate-200 rounded-full mx-auto overflow-hidden">
                <div 
                    className="h-full bg-love-500 transition-all duration-300" 
                    style={{ width: `${(shakeCount / REQUIRED_SHAKES) * 100}%` }}
                />
            </div>
        )}
      </div>

      {/* Jar Visual */}
      <div 
        onClick={handleTap} 
        className={`transition-all duration-500 ${isLocked ? 'opacity-80 scale-95 grayscale-[0.3]' : 'cursor-pointer active:scale-95'}`}
      >
        <JarVisual isShaking={isShaking} />
      </div>

      {/* Bottom Area: Shake Prompt or Cooldown */}
      <div className="mt-12 text-center h-20 w-full max-w-xs">
        {isLocked ? (
          <div className="animate-fade-in flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-xl bg-slate-50 px-4 py-2 rounded-lg shadow-inner">
              <Clock size={20} />
              <span>{timeRemaining}</span>
            </div>
            <div className="flex flex-col gap-2 mt-2 w-full">
                <button 
                  onClick={handleViewAgain}
                  className="flex items-center justify-center gap-2 text-love-600 text-sm font-medium hover:underline"
                >
                  <Eye size={16} />
                  View Today's Memory Again
                </button>
            </div>
          </div>
        ) : (
          <>
            {!permissionGranted && typeof (DeviceMotionEvent as any).requestPermission === 'function' && (
              <button 
                onClick={requestPermission}
                className="px-6 py-2 bg-slate-800 text-white rounded-full text-sm shadow-lg hover:bg-slate-700"
              >
                Enable Shake Access
              </button>
            )}
            {(!permissionGranted || isLoading) ? null : (
               <p className="text-xs text-slate-400 mt-4 uppercase tracking-widest animate-pulse">
                 {shakeCount === 0 ? "Shake firmly or Tap x5" : "Keep shaking!"}
               </p>
            )}
          </>
        )}
      </div>

      {memory && <MemoryModal memory={memory} onClose={() => setMemory(null)} />}
    </div>
  );
};

export default JarView;
