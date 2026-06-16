import React, { useState, useEffect } from 'react';
import { Settings, User, Zap, File, Copy, Check, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getStorageData, getAllDocuments, type DocumentEntry } from '../services/db';
import { decryptData } from '../utils/crypto';
import styles from './Popup.module.css';

const Popup: React.FC = () => {
  const secretKey = useStore((state) => state.secretKey);
  const initSession = useStore((state) => state.initSession);
  const [fillStatus, setFillStatus] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentEntry[]>([]);
  const [decryptedDocs, setDecryptedDocs] = useState<Record<string, string>>({});
  const [profileData, setProfileData] = useState<Record<string, string>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAllData = async () => {
    setIsRefreshing(true);
    await initSession();
    const key = useStore.getState().secretKey;
    if (key) {
      try {
        const docs = await getAllDocuments();
        setDocuments(docs);
        const decrypted: Record<string, string> = {};
        docs.forEach(doc => {
          try { decrypted[doc.id] = decryptData(doc.encryptedData, key); } catch(e) {}
        });
        setDecryptedDocs(decrypted);

        const encrypted = await getStorageData('encryptedProfile');
        if (encrypted) {
          const decryptedStr = decryptData(encrypted, key);
          setProfileData(JSON.parse(decryptedStr));
        }
      } catch (err) {
        console.error('Failed to load data', err);
      }
    } else {
      setDocuments([]);
      setDecryptedDocs({});
      setProfileData({});
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    fetchAllData();
    
    // Auto-refresh if the user unlocks the extension in another tab
    const storageListener = (changes: any, area: string) => {
      if (area === 'session' && changes.secretKeyBase64) {
        fetchAllData();
      }
    };
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.onChanged.addListener(storageListener);
      return () => chrome.storage.onChanged.removeListener(storageListener);
    }
  }, [initSession]);

  const openOptions = (e: React.MouseEvent) => {
    e.preventDefault();
    if (chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('options.html', '_blank');
    }
  };

  const handleAutoFill = async () => {
    if (!secretKey) {
      setFillStatus('Locked. Please unlock via Profile tab.');
      return;
    }
    
    if (Object.keys(profileData).length === 0) {
      setFillStatus('No profile data found.');
      return;
    }
      
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'fillAllFields', data: profileData }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            setFillStatus('Error: Ensure page is fully loaded and not a restricted URL.');
            return;
          }
          if (response && response.success) {
            setFillStatus(`Filled ${response.count} fields successfully!`);
          } else {
            setFillStatus('No matching fields found on this page.');
          }
        });
      }
    });
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, doc: DocumentEntry) => {
    const base64Data = decryptedDocs[doc.id];
    if (base64Data) {
      const downloadUrl = `${doc.type}:${doc.fileName}:${base64Data}`;
      e.dataTransfer.setData('DownloadURL', downloadUrl);
      
      const payload = {
        fileName: doc.fileName,
        type: doc.type,
        base64: base64Data
      };
      e.dataTransfer.setData('application/x-secure-payload', JSON.stringify(payload));
      
      e.dataTransfer.effectAllowed = 'copy';
      const dt = e.dataTransfer;
      dt.setData('text/plain', doc.fileName);
    }
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const textData = Object.entries(profileData).filter(([k, v]) => 
    !k.toLowerCase().includes('doc') && 
    !k.toLowerCase().includes('upload') && 
    !k.toLowerCase().includes('photo') && 
    !k.toLowerCase().includes('signature') && 
    v && typeof v === 'string' && v.trim() !== ''
  );

  return (
    <div className={styles.container}>
      <header className={styles.header} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div className={styles.logoContainer}>
          <img src="/icons/icon48.png" alt="Logo" style={{width: '24px', height: '24px'}} />
          <h1 className={styles.title}>Secure Auto-Filler</h1>
        </div>
        <button 
          onClick={fetchAllData} 
          className={styles.copyBtn} 
          style={{transform: isRefreshing ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease'}}
          title="Refresh Data"
        >
          <RefreshCw size={20} />
        </button>
      </header>

      <main className={styles.main}>
        <div className={`${styles.statusCard} glass`}>
          <div className={styles.userInfo}>
            <span style={{fontSize: '1.05rem', fontWeight: '500', color: 'var(--text-color)'}}>Welcome, User</span>
            <span className={secretKey ? styles.badgeSuccess : styles.badgeWarning}>
              <div className={styles.indicator} />
              {secretKey ? 'Ready to Auto-Fill' : 'Locked'}
            </span>
          </div>
        </div>

        <div className={styles.actionsGrid}>
          <button className={`${styles.actionBtn} glass`} onClick={handleAutoFill}>
            <Zap size={20} className={styles.actionIcon} />
            <div className={styles.actionText}>
              <span className={styles.actionTitle}>Auto-Fill This Form</span>
              {fillStatus && <span style={{fontSize: '0.75rem', color: 'var(--primary-color)', marginTop: '4px'}}>{fillStatus}</span>}
            </div>
          </button>
          
          <button className={`${styles.actionBtn} glass`} onClick={openOptions}>
            <User size={20} className={styles.actionIcon} />
            <div className={styles.actionText}>
              <span className={styles.actionTitle}>Manage Profile & Documents</span>
            </div>
          </button>
        </div>

        {secretKey && (
          <>
            <div className={styles.vaultSection}>
              <h3 style={{fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '8px', padding: '0 8px'}}>Drag & Drop Documents</h3>
              {documents.length > 0 ? (
                <div className={styles.docsList}>
                  {documents.map(doc => (
                    <div 
                      key={doc.id} 
                      className={styles.docItem}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, doc)}
                      title="Drag and drop this file onto the webpage!"
                    >
                      <File size={24} color="var(--primary-color)" />
                      <div className={styles.docInfo}>
                        <span className={styles.docName}>{doc.name}</span>
                        <span className={styles.docFilename}>{doc.fileName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', padding: '8px', margin: 0, textAlign: 'center'}}>
                  No documents found. Upload them in the Profile tab!
                </p>
              )}
            </div>

            <div className={styles.dataSection}>
              <h3 style={{fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '8px', padding: '0 8px'}}>Quick Copy Data</h3>
              <div className={styles.dataList}>
                {textData.length > 0 ? textData.map(([key, value]) => (
                  <div key={key} className={styles.dataItem}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <span className={styles.dataKey}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className={styles.dataValue} title={value}>{value}</span>
                    </div>
                    <button className={styles.copyBtn} onClick={() => handleCopy(key, value)} title="Copy to clipboard">
                      {copiedKey === key ? <Check size={16} color="var(--success-color)" /> : <Copy size={16} />}
                    </button>
                  </div>
                )) : (
                  <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', padding: '8px', margin: 0, textAlign: 'center'}}>
                    No text data found.
                  </p>
                )}
              </div>
            </div>
          </>
        )}

      </main>

      <footer className={styles.footer}>
        <button className={styles.iconBtn} onClick={openOptions} title="Settings">
          <Settings size={18} />
        </button>
      </footer>
    </div>
  );
};

export default Popup;
