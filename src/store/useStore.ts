import { create } from 'zustand';
import { encodeBase64, decodeBase64 } from 'tweetnacl-util';

interface AppState {
  isUnlocked: boolean;
  activeProfileId: string | null;
  secretKey: Uint8Array | null;
  theme: 'dark' | 'light';
  
  unlock: (key: Uint8Array) => void;
  lock: () => void;
  initSession: () => Promise<void>;
  setActiveProfile: (id: string) => void;
  toggleTheme: () => void;
}

export const useStore = create<AppState>((set) => ({
  isUnlocked: false,
  activeProfileId: null,
  secretKey: null,
  theme: 'dark',

  unlock: (key: Uint8Array) => {
    set({ isUnlocked: true, secretKey: key });
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session) {
      chrome.storage.session.set({ secretKeyBase64: encodeBase64(key) });
    }
  },
  
  lock: () => {
    set({ isUnlocked: false, secretKey: null });
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session) {
      chrome.storage.session.remove('secretKeyBase64');
    }
  },

  initSession: async () => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session) {
      return new Promise<void>((resolve) => {
        chrome.storage.session.get(['secretKeyBase64'], (result) => {
          if (result.secretKeyBase64) {
            set({ isUnlocked: true, secretKey: decodeBase64(result.secretKeyBase64 as string) });
          }
          resolve();
        });
      });
    }
  },
  
  setActiveProfile: (id: string) => set({ activeProfileId: id }),
  
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));
