import React from 'react';
import Layout from '../components/Layout';
import ProjectEntryList from '../components/ProjectEntryList';

export default function Home() {
  return (
    <div>
      <Layout title="Home">
        <section>
          <h1>Project Gallery</h1>
          <p>Works done in my free time.</p>
          <ProjectEntryList />
        </section>
      </Layout>
    </div>
  );
}
