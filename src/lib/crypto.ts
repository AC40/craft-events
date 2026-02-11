export interface EncryptedSecrets {
  apiUrl: string;
  apiKey?: string;
}

const ALGORITHM = "AES-GCM";
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;

function base64UrlEncode(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined" && Buffer.from) {
    return Buffer.from(bytes).toString("base64url");
  }
  if (typeof btoa !== "undefined") {
    const base64 = btoa(String.fromCharCode(...bytes));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
  throw new Error("base64UrlEncode: No encoding method available");
}

function base64UrlDecode(str: string): Uint8Array {
  if (typeof Buffer !== "undefined" && Buffer.from) {
    return new Uint8Array(Buffer.from(str, "base64url"));
  }
  if (typeof atob !== "undefined") {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
  throw new Error("base64UrlDecode: No decoding method available");
}

function getCrypto(): Crypto {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    return crypto;
  }
  if (typeof window !== "undefined" && window.crypto) {
    return window.crypto;
  }
  throw new Error("Crypto API not available");
}

function getKeyMaterial(password: string): Promise<CryptoKey> {
  const cryptoInstance = getCrypto();
  return cryptoInstance.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
}

function deriveKey(
  keyMaterial: CryptoKey,
  salt: Uint8Array
): Promise<CryptoKey> {
  const cryptoInstance = getCrypto();
  const saltBuffer =
    salt.buffer instanceof ArrayBuffer
      ? salt.buffer
      : new Uint8Array(salt).buffer;
  return cryptoInstance.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGORITHM, length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(
  data: EncryptedSecrets,
  masterKey: string
): Promise<string> {
  const cryptoInstance = getCrypto();
  const keyMaterial = await getKeyMaterial(masterKey);
  const salt = cryptoInstance.getRandomValues(new Uint8Array(SALT_LENGTH));
  const key = await deriveKey(keyMaterial, salt);
  const iv = cryptoInstance.getRandomValues(new Uint8Array(IV_LENGTH));

  const ivBuffer =
    iv.buffer instanceof ArrayBuffer ? iv.buffer : new Uint8Array(iv).buffer;
  const encrypted = await cryptoInstance.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: ivBuffer,
      tagLength: TAG_LENGTH * 8,
    },
    key,
    new TextEncoder().encode(JSON.stringify(data))
  );

  const combined = new Uint8Array(
    salt.length + iv.length + encrypted.byteLength
  );
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  return base64UrlEncode(combined);
}

export async function decrypt(
  encryptedBlob: string,
  masterKey: string
): Promise<EncryptedSecrets> {
  const cryptoInstance = getCrypto();
  const combined = base64UrlDecode(encryptedBlob);
  const salt = combined.slice(0, SALT_LENGTH);
  const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const encrypted = combined.slice(SALT_LENGTH + IV_LENGTH);

  const keyMaterial = await getKeyMaterial(masterKey);
  const key = await deriveKey(keyMaterial, salt);

  const ivBuffer =
    iv.buffer instanceof ArrayBuffer ? iv.buffer : new Uint8Array(iv).buffer;
  const encryptedBuffer =
    encrypted.buffer instanceof ArrayBuffer
      ? encrypted.buffer
      : new Uint8Array(encrypted).buffer;
  const decrypted = await cryptoInstance.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: ivBuffer,
      tagLength: TAG_LENGTH * 8,
    },
    key,
    encryptedBuffer
  );

  try {
    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch {
    throw new Error("Failed to decrypt credentials — data may be corrupt or the master key may have changed");
  }
}
