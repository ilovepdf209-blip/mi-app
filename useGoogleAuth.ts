import { useEffect } from 'react';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

// Asegúrate de reemplazar este client_id por el tuyo real
const CLIENT_ID = '220004202497-rknk3s3af7vnb6da7qedu21ernklot9t.apps.googleusercontent.com';

declare global {
  interface Window {
    google: any;
  }
}

export function useGoogleAuth(onSuccess: () => void, onError: (err: any) => void) {
  useEffect(() => {
    function tryRenderButton() {
      if (window.google && document.body) {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: async (response: any) => {
            if (response.credential) {
              try {
                const auth = getAuth();
                const firebaseCredential = GoogleAuthProvider.credential(response.credential);
                await signInWithCredential(auth, firebaseCredential);
                onSuccess();
              } catch (err) {
                onError(err);
              }
            } else {
              onError(response);
            }
          },
        });
        window.google.accounts.id.renderButton(document.body, { theme: 'outline', size: 'large' });
      } else {
        setTimeout(tryRenderButton, 100);
      }
    }
    tryRenderButton();
  }, [onSuccess, onError]);
} 