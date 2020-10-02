import CryptoJS from 'crypto-js';
const keyHash = process.env.REACT_APP_KEY_HASH;

function encrypt(value) {
  const encrypted = CryptoJS.AES.encrypt(value, keyHash).toString();
  return encrypted;
}

function decrypt(value) {
  const bytes = CryptoJS.AES.decrypt(value, keyHash);
  const dencrypted = bytes.toString(CryptoJS.enc.Utf8);
  return dencrypted;
}

export default { encrypt, decrypt };
