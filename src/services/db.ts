import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

export interface DocumentEntry {
  id: string;
  name: string;
  type: string; // 'Photo' | 'Certificate' | 'ID Proof' | etc.
  fileName: string;
  size: number;
  encryptedData: string; // Base64 encrypted file content
  lastModified: number;
}

interface SecureFormDB extends DBSchema {
  documents: {
    key: string;
    value: DocumentEntry;
    indexes: { 'by-type': string };
  };
}

const DB_NAME = 'SecureFormDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<SecureFormDB>> | null = null;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<SecureFormDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('documents')) {
          const store = db.createObjectStore('documents', { keyPath: 'id' });
          store.createIndex('by-type', 'type');
        }
      },
    });
  }
  return dbPromise;
};

export const saveDocument = async (doc: DocumentEntry) => {
  const db = await initDB();
  await db.put('documents', doc);
};

export const getDocument = async (id: string) => {
  const db = await initDB();
  return await db.get('documents', id);
};

export const getAllDocuments = async () => {
  const db = await initDB();
  return await db.getAll('documents');
};

export const deleteDocument = async (id: string) => {
  const db = await initDB();
  await db.delete('documents', id);
};

export const clearAllDocuments = async () => {
  const db = await initDB();
  await db.clear('documents');
};

// --- Chrome Storage Wrapper ---

export const getStorageData = async (key: string): Promise<any> => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result: any) => {
        resolve(result[key]);
      });
    });
  } else {
    // Fallback for development outside extension environment
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
};

export const setStorageData = async (key: string, value: any): Promise<void> => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const clearStorageData = async (): Promise<void> => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.clear(resolve);
    });
  } else {
    localStorage.clear();
  }
};
