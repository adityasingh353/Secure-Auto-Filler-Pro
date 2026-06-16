import { analyzeField } from '../features/autofill/FormMatcher';

console.log('Secure Auto-Filler Pro: Content Script Injected');

chrome.runtime.onMessage.addListener((request: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  if (request.action === 'fillAllFields') {
    const profileData = request.data;
    
    if (!profileData) {
      console.error('No profile data received for auto-fill');
      return true;
    }

    const elements = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
    let fillCount = 0;

    elements.forEach((el) => {
      const element = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      
      // Skip disabled or readonly fields
      if (element.disabled || (element.tagName !== 'SELECT' && (element as HTMLInputElement).readOnly)) return;

      const matchedKey = analyzeField(element);
      
      if (matchedKey && profileData[matchedKey]) {
        const valueToFill = profileData[matchedKey];
        
        // Handle different input types
        if (element.tagName === 'SELECT') {
          // Attempt to find matching option
          const selectEl = element as HTMLSelectElement;
          let optionFound = false;
          for (let i = 0; i < selectEl.options.length; i++) {
            if (selectEl.options[i].text.toLowerCase().includes(valueToFill.toLowerCase()) || 
                selectEl.options[i].value.toLowerCase() === valueToFill.toLowerCase()) {
              selectEl.selectedIndex = i;
              optionFound = true;
              break;
            }
          }
          if (!optionFound) return;
        } else if ((element as HTMLInputElement).type === 'radio' || (element as HTMLInputElement).type === 'checkbox') {
          // Complex logic for radio/checkboxes based on value mapping
          // Simplified for now
          if ((element as HTMLInputElement).value.toLowerCase() === valueToFill.toLowerCase()) {
             (element as HTMLInputElement).checked = true;
          } else {
             return; // Don't highlight if not clicked
          }
        } else if ((element as HTMLInputElement).type === 'file') {
          // File inputs cannot be programmatically set with string paths due to browser security.
          // They must be set using DataTransfer with File objects retrieved from IndexedDB.
          // This requires background script coordination which is complex.
          // For now, we highlight them to alert the user.
          element.style.border = '2px solid #00c853';
          return;
        } else {
          element.value = valueToFill;
        }

        // Dispatch events so React/Angular/Vue forms recognize the change
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Visual feedback
        const originalBg = element.style.backgroundColor;
        const originalTransition = element.style.transition;
        
        element.style.transition = 'background-color 0.3s ease';
        element.style.backgroundColor = '#e8f0fe';
        
        setTimeout(() => {
          element.style.backgroundColor = originalBg;
          setTimeout(() => { element.style.transition = originalTransition; }, 300);
        }, 1500);

        fillCount++;
      }
    });

    sendResponse({ success: true, count: fillCount });
  }
  return true;
});

// Custom Drag & Drop handler for virtual files from Side Panel
document.addEventListener('dragover', (e) => {
  // Check if it contains our custom type
  if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('application/x-secure-payload')) {
    e.preventDefault(); // This changes the cursor from "Not Allowed" to "Copy"
    e.dataTransfer.dropEffect = 'copy';
  }
});

document.addEventListener('drop', (e) => {
  if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('application/x-secure-payload')) {
    e.preventDefault();
    
    // Attempt to find the closest file input
    const target = e.target as HTMLElement;
    let fileInput = target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'file' 
      ? target as HTMLInputElement 
      : target.closest('input[type="file"]') as HTMLInputElement;
      
    if (!fileInput) return; // If dropped elsewhere, ignore

    try {
      const payloadStr = e.dataTransfer.getData('application/x-secure-payload');
      if (payloadStr) {
        const payload = JSON.parse(payloadStr);
        
        // Convert base64 to Blob
        const [, data] = payload.base64.split(',');
        const binary = atob(data);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([array], { type: payload.type || 'application/octet-stream' });
        
        // Create File object and assign to input via DataTransfer
        const dt = new DataTransfer();
        const file = new File([blob], payload.fileName, { type: payload.type || 'application/octet-stream' });
        dt.items.add(file);
        
        fileInput.files = dt.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Visual feedback
        fileInput.style.border = '2px solid #00c853';
        fileInput.style.backgroundColor = '#e8f0fe';
      }
    } catch (err) {
      console.error('Secure Drop Error:', err);
    }
  }
});

