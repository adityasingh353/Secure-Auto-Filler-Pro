import React, { useState, useEffect } from 'react';
import { Lock, Unlock, AlertCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { deriveKey, generateSalt } from '../../utils/crypto';
import { getStorageData, setStorageData } from '../../services/db';
import styles from './AuthScreen.module.css';

const AuthScreen: React.FC = () => {
  const [isSetupMode, setIsSetupMode] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const unlock = useStore((state) => state.unlock);

  useEffect(() => {
    // Check if master password salt exists, if not, we are in setup mode
    getStorageData('masterSalt').then((salt) => {
      if (!salt) {
        setIsSetupMode(true);
      }
    });
  }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const salt = generateSalt();
      const key = await deriveKey(password, salt);
      
      // We don't store the password itself, just the salt
      // To verify the password later without storing a hash, we can store a known encrypted string
      // and try to decrypt it to verify the key.
      const { encryptData } = await import('../../utils/crypto');
      const verificationStr = encryptData('valid', key);
      
      await setStorageData('masterSalt', salt);
      await setStorageData('masterVerification', verificationStr);
      
      unlock(key);
    } catch (err) {
      setError('Failed to setup security. Try again.');
    }
    setLoading(false);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const salt = await getStorageData('masterSalt');
      const verificationStr = await getStorageData('masterVerification');
      
      if (!salt || !verificationStr) {
        setIsSetupMode(true);
        setLoading(false);
        return;
      }

      const key = await deriveKey(password, salt);
      
      const { decryptData } = await import('../../utils/crypto');
      
      // Try decrypting the verification string. If it fails, password is wrong
      try {
        const decrypted = decryptData(verificationStr, key);
        if (decrypted === 'valid') {
          unlock(key);
        } else {
          setError('Invalid master password.');
        }
      } catch {
        setError('Invalid master password.');
      }
    } catch (err) {
      setError('An error occurred during unlock.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.authWrapper}>
      <div className={`${styles.authCard} glass`}>
        <div className={styles.iconWrapper}>
          <img src="/icons/icon128.png" alt="Logo" style={{width: '48px', height: '48px'}} />
        </div>
        
        <h2>{isSetupMode ? 'Setup Master Password' : 'Unlock Extension'}</h2>
        <p className="textMuted" style={{textAlign: 'center', marginBottom: '24px'}}>
          {isSetupMode 
            ? 'Create a strong master password. All your local data will be encrypted with it.' 
            : 'Enter your master password to decrypt your profile and documents.'}
        </p>

        {error && (
          <div className={styles.errorAlert}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={isSetupMode ? handleSetup : handleUnlock} className={styles.form}>
          <div className="formGroup" style={{width: '100%'}}>
            <label>Master Password</label>
            <input 
              type="password" 
              className="modern-input" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isSetupMode && (
            <>
              <div className="formGroup" style={{width: '100%'}}>
                <label>Confirm Master Password</label>
                <input 
                  type="password" 
                  className="modern-input" 
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                <input 
                  type="checkbox" 
                  id="terms" 
                  required 
                  style={{marginTop: '4px', cursor: 'pointer'}} 
                />
                <label htmlFor="terms" style={{cursor: 'pointer', lineHeight: '1.4'}}>
                  I agree to the <a href="privacy.html" target="_blank" style={{color: 'var(--primary-color)', textDecoration: 'underline'}}>Privacy Policy & Terms</a> and acknowledge that because all data is stored entirely locally on my device, any data breach or loss is my sole responsibility.
                </label>
              </div>
            </>
          )}

          <button type="submit" className="modern-btn" style={{width: '100%', marginTop: '16px'}} disabled={loading}>
            {loading ? 'Processing...' : (isSetupMode ? <><Lock size={18} /> Encrypt & Setup</> : <><Unlock size={18} /> Unlock Data</>)}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;
