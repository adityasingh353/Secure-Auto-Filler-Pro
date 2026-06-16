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

## 🛡️ Privacy Policy

By design, this extension has zero ability to connect to the internet to harvest data. You can read the full [Privacy Policy here](public/privacy.html). Because all data is encrypted and stored locally, any data loss due to a forgotten Master Password is the sole responsibility of the user.

## 🛠️ Built With

* [React](https://reactjs.org/)
* [Vite](https://vitejs.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [TweetNaCl.js](https://tweetnacl.js.org/)
* [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
