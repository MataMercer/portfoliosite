import '../styles/main.scss';
// eslint-disable-next-line no-unused-vars
import type { AppProps } from 'next/app';
import { AuthProvider } from '../auth/auth';
import { FirebaseProvider } from '../firebase/FirebaseContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </FirebaseProvider>
  );
}
