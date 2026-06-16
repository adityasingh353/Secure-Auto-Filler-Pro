import React, { useState, useEffect } from 'react';
import { User, FileText, Settings, Bell, Moon, Sun, X } from 'lucide-react';
import styles from './Options.module.css';
import ProfileForm from './components/ProfileForm';
import AuthScreen from './components/AuthScreen';
import { useStore } from '../store/useStore';

const Options: React.FC = () => {
  const isUnlocked = useStore(state => state.isUnlocked);
  const initSession = useStore(state => state.initSession);
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    initSession().then(() => setIsInit(true));
  }, [initSession]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileForm />;
      case 'documents':
        return (
          <div className={`${styles.card} glass`}>
            <h2>Additional Documents</h2>
            <p className={styles.textMuted}>Upload any extra documents not covered in the personal profile sections.</p>
            
            <div className={styles.uploadArea}>
              <FileText size={48} className={styles.uploadIcon} />
              <p>Click to browse and securely encrypt files to your vault</p>
              <input 
                type="file" 
                id="extra-doc-upload"
                style={{display: 'none'}}
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0] && isUnlocked) {
                    const file = e.target.files[0];
                    try {
                      const base64Str = await new Promise<string>((res, rej) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => res(reader.result as string);
                        reader.onerror = rej;
                      });
                      const { encryptData } = await import('../utils/crypto');
                      const { saveDocument } = await import('../services/db');
                      const encryptedData = encryptData(base64Str, useStore.getState().secretKey!);
                      await saveDocument({
                        id: `extra-${Date.now()}`,
                        name: file.name,
                        type: file.type || 'application/octet-stream',
                        fileName: file.name,
                        size: file.size,
                        encryptedData,
                        lastModified: Date.now()
                      });
                      alert('Document securely encrypted and saved to vault!');
                    } catch (err) {
                      alert('Failed to encrypt document.');
                    }
                  }
                }}
              />
              <label htmlFor="extra-doc-upload" className="modern-btn" style={{cursor: 'pointer', display: 'inline-block'}}>
                Browse Files
              </label>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className={`${styles.card} glass`}>
            <h2>Extension Settings</h2>
            <p className={styles.textMuted}>Configure auto-fill behavior and privacy preferences.</p>
            
            <div className={styles.settingItem}>
              <div>
                <h4>Auto-Fill Mode</h4>
                <p className={styles.textMuted}>Choose when forms are automatically filled.</p>
              </div>
              <select className="modern-input" style={{width: 'auto'}}>
                <option>On Click Only</option>
                <option>On Page Load</option>
                <option>On Input Focus</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <div>
                <h4>Master Password Auto-Lock</h4>
                <p className={styles.textMuted}>Time before extension requires password again.</p>
              </div>
              <select className="modern-input" style={{width: 'auto'}}>
                <option>15 Minutes</option>
                <option>1 Hour</option>
                <option>On Browser Close</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isInit) return null; // Wait for session check

  if (!isUnlocked) {
    return <AuthScreen />;
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
            <img src="/icons/icon48.png" alt="Logo" style={{width: '28px', height: '28px'}} />
            <h2>Secure Auto-Filler Pro</h2>
        </div>
        
        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} /> Personal Profile
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'documents' ? styles.active : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <FileText size={20} /> Additional Documents
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} /> Settings
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.themeToggle} onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className={styles.iconBtn} title="Notifications">
              <Bell size={20} />
            </button>
            <button className={styles.iconBtn} title="Close Window" onClick={() => window.close()}>
              <X size={20} />
            </button>
          </div>
        </header>
        
        <div className={styles.contentArea}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Options;
