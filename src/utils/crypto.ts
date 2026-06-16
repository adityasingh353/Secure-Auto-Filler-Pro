import nacl from 'tweetnacl';
import { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } from 'tweetnacl-util';

/**
 * Derives a 256-bit encryption key from a master password and salt using PBKDF2.
 */
export const deriveKey = async (password: string, saltString: string): Promise<Uint8Array> => {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const salt = enc.encode(saltString);

  const key = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256 // AES-256 equivalent
  );

  return new Uint8Array(key);
};

/**
 * Generates a random salt.
 */
export const generateSalt = (): string => {
  return encodeBase64(nacl.randomBytes(16));
};

/**
 * Encrypts a string (e.g. stringified JSON) using the provided secret key.
 */
export const encryptData = (data: string, secretKey: Uint8Array): string => {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const messageUint8 = decodeUTF8(data);
  const box = nacl.secretbox(messageUint8, nonce, secretKey);

  const fullMessage = new Uint8Array(nonce.length + box.length);
  fullMessage.set(nonce);
  fullMessage.set(box, nonce.length);

  return encodeBase64(fullMessage);
};

/**
 * Decrypts a Base64 encoded string using the provided secret key.
 */
export const decryptData = (messageWithNonceBase64: string, secretKey: Uint8Array): string => {
  const messageWithNonce = decodeBase64(messageWithNonceBase64);
  const nonce = messageWithNonce.slice(0, nacl.secretbox.nonceLength);
  const message = messageWithNonce.slice(nacl.secretbox.nonceLength);

  const decrypted = nacl.secretbox.open(message, nonce, secretKey);

  if (!decrypted) {
    throw new Error('Decryption failed. Invalid password or corrupted data.');
  }

  return encodeUTF8(decrypted);
};
