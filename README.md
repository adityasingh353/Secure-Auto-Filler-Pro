<div align="center">
  <img src="dist\icons\icon300.png" alt="Secure Auto-Filler Pro Logo" width="128" height="128" />
  
  # Secure Auto-Filler Pro

  **The ultimate, secure, locally-encrypted form filler extension.**  
  Designed for maximum privacy and efficiency when filling out complex registration and examination forms.
</div>

---

## 🌟 Features

* **🛡️ 100% Private & Local:** No external servers, no cloud storage, no telemetry. Everything is stored strictly on your local machine.
* **🔐 Military-Grade Encryption:** Your profile data and sensitive documents are heavily encrypted using `TweetNaCl.js` (XSalsa20-Poly1305) before being saved to your hard drive. 
* **📄 Document Drag & Drop:** Easily securely store and retrieve PDFs or images of your certificates, signatures, and ID cards straight from the extension side panel.
* **⚡ Smart Auto-Fill:** Right-click context menus and smart text detection to fill out tedious forms in a fraction of a second.
* **🔑 Master Password Protection:** Only *you* can decrypt your data. The extension doesn't save your password—only a cryptographic salt.

## 📥 How to Install

Because this extension handles extremely sensitive data, you can download and inspect the code yourself and install it directly into your browser!

### Step 1: Download the Extension
1. Click the green **"Code"** button at the top right of this GitHub repository.
2. Select **"Download ZIP"**.
3. Extract the downloaded ZIP file to a permanent folder on your computer (e.g., your Documents folder).

### Step 2: Install in Google Chrome or Microsoft Edge
1. Open your browser.
2. If using **Chrome**, type `chrome://extensions/` in your address bar. If using **Edge**, type `edge://extensions/`.
3. In the top right (or bottom left in Edge), turn on **"Developer mode"**.
4. Click the **"Load unpacked"** button.
5. Select the **`dist`** folder located inside the folder you just extracted.

🎉 **That's it!** You will now see the Secure Auto-Filler Pro logo in your extensions bar! 

## 🚀 How to Use

**1. Set Your Master Password**
Click the extension icon in your browser toolbar. You will be asked to create a Master Password. **Do not forget this!** All your data is encrypted using this password, and there is no "Forgot Password" reset option.

**2. Build Your Profile**
Once unlocked, the Side Panel will open. Navigate to the **Profile/Settings** tab and enter all your common examination details (Name, Address, Aadhaar, PAN, Education details). Click "Save".

**3. Upload Your Documents**
Navigate to the **Documents** tab. Drag and drop your sensitive files (e.g., 10th Certificate, Signature, Passport Photo) into the secure vault. They are instantly encrypted and saved locally.

**4. Fill Out Forms at Lightning Speed**
When you are on a grueling 10-page examination form:
* **Text Fields:** Simply **Right-Click** any text input field (like "Father's Name") and select `Secure: Auto-Fill this field` from the context menu. The extension will intelligently find the right data and inject it.
* **Complex Fields:** If a form has a weird layout, just open the Side Panel and click the **1-Click Copy** buttons next to your data to instantly copy it to your clipboard.
* **Document Uploads:** Instead of digging through your hard drive, just **Drag and Drop** the document directly from the extension's Side Panel straight into the website's file upload box!

## 🛡️ Privacy Policy

By design, this extension has zero ability to connect to the internet to harvest data. You can read the full [Privacy Policy here](public/privacy.html). Because all data is encrypted and stored locally, any data loss due to a forgotten Master Password is the sole responsibility of the user.

## 🛠️ Built With

* [React](https://reactjs.org/)
* [Vite](https://vitejs.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [TweetNaCl.js](https://tweetnacl.js.org/)
* [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
