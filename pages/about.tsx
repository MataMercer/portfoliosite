import ReactMarkdown from 'react-markdown';
import Skeleton from 'react-loading-skeleton';
import Layout from '../components/Layout';
import useAboutPage from '../firebase/hooks/useAboutPage';
import ErrorAlert from '../components/ErrorAlert';

export default function About() {
  const { aboutPage, status, errors } = useAboutPage();
  return (
    <div>
      <Layout title="About">
        <h1>About</h1>
        <ErrorAlert errors={errors} />
        {status === 'loading' ? (
          <Skeleton count={6} />
        ) : (
          <ReactMarkdown>{aboutPage}</ReactMarkdown>
        )}
      </Layout>
    </div>
  );
}
