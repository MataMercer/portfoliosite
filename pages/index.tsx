import dynamic from 'next/dynamic';
import Layout from '../components/Layout';

const DynamicProjectEntryList = dynamic(
  () => import('../components/ProjectEntryList')
);

export default function Home() {
  return (
    <div>
      <Layout title="Home">
        <section>
          <h1>Project Gallery</h1>
          <p>Works done in my free time.</p>
          <DynamicProjectEntryList />
        </section>
      </Layout>
    </div>
  );
}
