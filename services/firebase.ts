
import { Memory } from '../types';

const MEMORIES_KEY = 'jar_memories';
const DAILY_LOCK_KEY = 'jar_daily_lock';
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 Hours

// Safe parser to prevent crashes on corrupted data
const safeParse = (json: string | null): Memory[] => {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (e) {
    console.error("Error parsing JSON", e);
    return [];
  }
};

export const uploadMemory = async (text: string, imageUrl: string, dateStr?: string): Promise<void> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));

  let dateAdded = Date.now();
  if (dateStr) {
    // Parse YYYY-MM-DD to local noon
    const [y, m, d] = dateStr.split('-').map(Number);
    dateAdded = new Date(y, m - 1, d, 12, 0, 0).getTime();
  }

  const newMemory: Memory = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    text,
    imageUrl: imageUrl.trim(), // Store the link directly
    dateAdded,
    seen: false
  };

  const memories: Memory[] = safeParse(localStorage.getItem(MEMORIES_KEY));
  
  memories.push(newMemory);
  
  try {
    localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
  } catch (e: any) {
    console.error("LocalStorage Error:", e);
    if (e.name === 'QuotaExceededError' || e.code === 22) {
       throw new Error("Storage full! Please delete data.");
    }
    throw new Error("Could not save to local storage.");
  }
};

export interface DailyStatus {
  isLocked: boolean;
  lockedMemory: Memory | null;
  msUntilReset: number;
}

export const getDailyStatus = (): DailyStatus => {
  const dailyLockJson = localStorage.getItem(DAILY_LOCK_KEY);
  const now = Date.now();
  
  if (dailyLockJson) {
    try {
      const lockData = JSON.parse(dailyLockJson);
      
      // Check time elapsed since lock was set
      if (lockData.lockedAt) {
        const unlockTime = lockData.lockedAt + COOLDOWN_MS;
        
        if (now < unlockTime) {
            return {
                isLocked: true,
                lockedMemory: lockData.memory,
                msUntilReset: unlockTime - now
            };
        }
      } 
    } catch (e) {
      console.error("Error reading lock", e);
    }
  }

  return { isLocked: false, lockedMemory: null, msUntilReset: 0 };
};

const initializeStore = async (): Promise<Memory[]> => {
  try {
    // Try to fetch the storage.json file
    const response = await fetch('storage.json');
    if (!response.ok) throw new Error("No seed file found");
    
    const seedData = await response.json();
    if (Array.isArray(seedData) && seedData.length > 0) {
        const processedSeed = seedData.map((m: any) => {
            let timestamp = m.dateAdded;
            
            // If user provided a "date" string (e.g., "2024-05-20") in JSON
            if (m.date && typeof m.date === 'string') {
                const [y, month, d] = m.date.split('-').map(Number);
                // Create date object (months are 0-indexed in JS Date)
                timestamp = new Date(y, month - 1, d, 12, 0, 0).getTime();
            }

            return {
                ...m,
                id: m.id || 'seed-' + Math.random().toString(36).substr(2, 9),
                seen: m.seen || false,
                imageUrl: m.imageUrl || '',
                dateAdded: timestamp || Date.now()
            };
        });

        // Optimization: Don't just append, check if we need to replace to save space
        // For now, we overwrite if the user is reloading the app and storage.json exists
        try {
            localStorage.setItem(MEMORIES_KEY, JSON.stringify(processedSeed));
        } catch (e) {
             // If we can't save the seed data (storage full), we just return it
             // effectively running in "read-only" mode for the seed data
             console.warn("Storage full during init, running with in-memory seed data");
        }
        return processedSeed as Memory[];
    }
  } catch (e) {
    console.log("Could not load storage.json.", e);
  }

  // Fallback: Return empty array if storage.json fails, instead of fake memory
  return [];
}

export const fetchDailyMemory = async (): Promise<Memory | null> => {
  // 1. Check Lock
  const status = getDailyStatus();
  if (status.isLocked && status.lockedMemory) {
    return status.lockedMemory;
  }

  // 2. Fetch Memories
  let memories: Memory[] = safeParse(localStorage.getItem(MEMORIES_KEY));

  // 3. Initialize if empty OR if we suspect corruption/update needed
  if (memories.length === 0) {
    memories = await initializeStore();
  }

  // 4. Filter Unseen
  const unseenMemories = memories.filter(m => !m.seen);

  if (unseenMemories.length === 0) {
    return null;
  }

  // 5. Pick Random
  const randomIndex = Math.floor(Math.random() * unseenMemories.length);
  const selectedMemory = unseenMemories[randomIndex];

  // 6. Mark as Seen
  const updatedMemories = memories.map(m => 
    m.id === selectedMemory.id ? { ...m, seen: true } : m
  );
  
  try {
    localStorage.setItem(MEMORIES_KEY, JSON.stringify(updatedMemories));
  } catch (e) {
    console.error("Failed to update seen status - Storage Full", e);
    // If we can't save the "seen" status, the user might see this memory again. 
    // This is a fail-safe to prevent app crashing.
  }

  // 7. Lock for 24 Hours
  try {
    localStorage.setItem(DAILY_LOCK_KEY, JSON.stringify({
      lockedAt: Date.now(),
      memory: selectedMemory
    }));
  } catch (e) {
      console.error("Failed to set lock - Storage Full", e);
      // Attempt to clear some space?
      // For now, we just let the user see the memory, but the lock won't persist if they refresh.
      // This is better than a crash.
  }

  return selectedMemory;
};

export const bypassDailyLock = (): void => {
  localStorage.removeItem(DAILY_LOCK_KEY);
};

export const clearAllData = (): void => {
  localStorage.clear();
};
