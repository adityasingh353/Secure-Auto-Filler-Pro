import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Shield, UploadCloud, AlertCircle, CheckCircle2 } from 'lucide-react';
import { profileSections } from './ProfileConfig';
import { useStore } from '../../store/useStore';
import { encryptData, decryptData } from '../../utils/crypto';
import { getStorageData, setStorageData, saveDocument } from '../../services/db';
import styles from './ProfileForm.module.css';

const ProfileForm: React.FC = () => {
  const [openSection, setOpenSection] = useState<string>('personal');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [statusMsg, setStatusMsg] = useState<{type: 'success'|'error', text: string} | null>(null);
  const secretKey = useStore((state) => state.secretKey);

  useEffect(() => {
    const loadData = async () => {
      try {
        const encryptedProfile = await getStorageData('encryptedProfile');
        if (encryptedProfile && secretKey) {
          const decrypted = decryptData(encryptedProfile, secretKey);
          setFormData(JSON.parse(decrypted));
        }
      } catch (err) {
        setStatusMsg({ type: 'error', text: 'Failed to decrypt profile data.' });
      }
    };
    loadData();
  }, [secretKey]);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? '' : id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (field: any, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({ ...formData, [field.name]: file.name });
      
      if (!secretKey) {
        setStatusMsg({ type: 'error', text: 'Extension is locked. Cannot encrypt file.' });
        return;
      }
      
      try {
        const base64Str = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
        
        const encryptedData = encryptData(base64Str, secretKey);
        
        await saveDocument({
          id: field.name,
          name: field.label,
          type: file.type || 'application/octet-stream',
          fileName: file.name,
          size: file.size,
          encryptedData,
          lastModified: Date.now()
        });
        
        setStatusMsg({ type: 'success', text: `Encrypted and saved ${file.name} to vault.` });
        setTimeout(() => setStatusMsg(null), 3000);
      } catch (err) {
        setStatusMsg({ type: 'error', text: `Failed to encrypt ${file.name}.` });
      }
    }
  };

  const handleSave = async () => {
    if (!secretKey) return;
    try {
      const dataStr = JSON.stringify(formData);
      const encrypted = encryptData(dataStr, secretKey);
      await setStorageData('encryptedProfile', encrypted);
      setStatusMsg({ type: 'success', text: 'Profile data securely encrypted and saved!' });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Error saving data.' });
    }
  };

  const renderField = (field: any) => {
    const widthClass = field.width === 'half' ? styles.halfWidth : styles.fullWidth;
    
    return (
      <div key={field.name} className={`${styles.formGroup} ${widthClass}`}>
        <label>{field.label}</label>
        {field.type === 'select' ? (
          <select 
            name={field.name} 
            className="modern-input" 
            value={formData[field.name] || ''}
            onChange={handleInputChange}
          >
            {field.options?.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : field.type === 'file' ? (
          <div className={styles.fileUploadWrapper}>
            <input 
              type="file" 
              name={field.name} 
              accept={field.accept}
              onChange={(e) => handleFileChange(field, e)}
              className={styles.fileInput} 
              id={`file-${field.name}`}
            />
            <label htmlFor={`file-${field.name}`} className={styles.fileBtn}>
              <UploadCloud size={18} /> 
              {formData[field.name] || 'Choose File...'}
            </label>
          </div>
        ) : (
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder || ''}
            className="modern-input"
            value={formData[field.name] || ''}
            onChange={handleInputChange}
          />
        )}
      </div>
    );
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <h2>My Profile Data</h2>
        <p className="textMuted" style={{marginBottom: 0}}>
          Fill out your details securely. Data is encrypted and stays locally on your device.
        </p>
      </div>

      {statusMsg && (
        <div className={statusMsg.type === 'error' ? styles.errorMsg : styles.successMsg}>
          {statusMsg.type === 'error' ? <AlertCircle size={18}/> : <CheckCircle2 size={18}/>}
          {statusMsg.text}
        </div>
      )}

      <div className={styles.accordionContainer}>
        {profileSections.map((section) => (
          <div key={section.id} className={`${styles.accordionItem} glass`}>
            <button 
              className={styles.accordionHeader} 
              onClick={() => toggleSection(section.id)}
            >
              <span className={styles.sectionTitle}>{section.title}</span>
              {openSection === section.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {openSection === section.id && (
              <div className={styles.accordionContent}>
                <div className={styles.fieldsGrid}>
                  {section.fields.map(renderField)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.stickyFooter}>
        <button className="modern-btn" style={{width: '100%', maxWidth: '400px'}} onClick={handleSave}>
          <Shield size={18} /> Encrypt & Save All Profile Data
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;
