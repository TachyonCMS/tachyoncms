const WebCrypto = require("easy-web-crypto");

export default function useEncryption() {

  const newMasterKey = async (passphrase) => {
    const encMasterKey = await WebCrypto.genEncryptedMasterKey(
      passphrase
    );
    return encMasterKey;
  }

  const decryptMasterKey = async (passphrase, encMasterKey) => {
   
    // decrypt the (stored) AES key to be able to encrypt/decrypt data
    const key = await WebCrypto.decryptMasterKey(
      passphrase,
      encMasterKey
    );
    return key;
  }

  const updateMasterKey = async (passphrase, newPassphrase, encMasterKey) => {
   
    const updatedEncMasterKey = await WebCrypto.updatePassphraseKey(passphrase,
      newPassphrase, encMasterKey)

    const key = await WebCrypto.decryptMasterKey(newPassphrase, updatedEncMasterKey)

    return { key: key, encryptedKey: updatedEncMasterKey};
    
  }

  const encryptData = async (masterKey, data) => {
    const encrypted = await WebCrypto.encrypt(dek, data);
    return encrypted;
  }

  const decryptData = async (masterKey, encData) => {
    const val = await WebCrypto.decrypt(dek, encData)
    return val;
  }

  const encryptBuffer = async (masterKey, buffer) => {
    const encrypted = await WebCrypto.encryptBuffer(dek, buffer);
    return encrypted;
  }

  const decryptBuffer = async (masterKey, encBuffer) => {
    const val = await WebCrypto.decryptBuffer(dek, encBuffer)
    return val;
  }

  return {
    newMasterKey,
    decryptMasterKey,
    updateMasterKey,
    encryptData,
    decryptData,
    encryptBuffer,
    decryptBuffer
  };
}

