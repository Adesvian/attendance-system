import CryptoJs from "crypto-js";

// Decrypt function using CryptoJS
export const decrypt = (key, data) => {
  const bytes = CryptoJs.AES.decrypt(data, key);
  return bytes.toString(CryptoJs.enc.Utf8);
};

export const decodeJWT = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.error("Invalid JWT token:", e);
    return null;
  }
};
