import React from 'react';
import '../styles/main.scss';
// eslint-disable-next-line no-unused-vars
import type { AppProps } from 'next/app';
import { AuthProvider } from '../auth/auth';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
