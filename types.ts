export enum AccessLevel {
  LOCKED = 'LOCKED',
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface Memory {
  id?: string;
  text: string;
  imageUrl?: string;
  dateAdded: number;
  seen: boolean;
}

export interface AppState {
  accessLevel: AccessLevel;
  currentMemory: Memory | null;
  isShakeSupported: boolean;
}

export const DATE_GATE_USER = '2024-05-25';
export const DATE_GATE_ADMIN = '2006-10-09';
