import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics"; // Opcional

const firebaseConfig = {
  apiKey: "AIzaSyDYhLgwpa9EVrUIeXduf_fl_ne9ck2cRyg",
  authDomain: "viajando-2.firebaseapp.com",
  projectId: "viajando-2",
  storageBucket: "viajando-2.appspot.com",
  messagingSenderId: "220004202497",
  appId: "1:220004202497:web:f6e2fa7e5c76d18c626800",
  measurementId: "G-DG89TM0KDZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * Sube un archivo a Storage y retorna la URL de descarga
 * @param file Archivo a subir
 * @param path Ruta en Storage (ej: 'drivers/uid/documentos/licencia.pdf')
 */
export async function uploadFileAndGetURL(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : undefined;

export default app;