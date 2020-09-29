import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Skeleton from 'react-loading-skeleton';
import { FirebaseError } from 'firebase';
import Layout from '../components/Layout';
import { getAboutPage } from '../firebase/repositories/AboutPageRepository';
import ErrorAlert from '../components/ErrorAlert';

export default function About() {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('loading');
  const [errors, setErrors] = useState<FirebaseError[]>([]);

  useEffect(() => {
    if (status === 'loading') {
      getAboutPage()
        .then((res) => {
          setContent(res);
          setStatus('idle');
        })
        .catch((err) => {
          setErrors([...errors, err]);
          setStatus('error');
        });
    }
  }, [errors, status]);

  return (
    <div>
      <Layout title="About">
        <h1>About</h1>
        <ErrorAlert errors={errors} />
        {status === 'loading' ? (
          <>
            <Skeleton count={6} />
          </>
        ) : (
          <ReactMarkdown source={content} />
        )}
      </Layout>
    </div>
  );
}
