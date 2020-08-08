import Layout from "../components/Layout";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useFirebase } from "../firebase/FirebaseContext";
import ReactMarkdown from "react-markdown";
import Skeleton from 'react-loading-skeleton';
export default function About() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { database} = useFirebase();
  

  useEffect(() => {
    async function setAboutPageContent() {
      const aboutPageContent = await getAboutPage();
    setContent(aboutPageContent);
    setLoading(false);
    }

    setAboutPageContent();
  }, []);

  async function getAboutPage() {
    const aboutPageRef = database.collection("pages").doc("about");
    return aboutPageRef.get().then(function (doc) {
      if (doc.exists) {
        return doc.data().content;
      } else {
        return "This page is under construction";
      }
    });
  }


  return (
    <div>
      <Layout title="About">{loading ? <><Skeleton/> <Skeleton count={5}/></> : <ReactMarkdown source={content}/>}</Layout>
    </div>
  );
}

// <section><h1 className="title">About</h1>

// <div>
//   <p>
//     I'm a full-stack developer located in 🍊 Orange County, California. All
//     my projects are open source on <a href="https://github.com/MataMercer">Github</a>.
//   </p>

//   <p>
//     I'm also currently seeking work! You can find my resume on <a href="https://www.linkedin.com/in/mercer-denholm/">LinkedIn</a>.
//   </p>
// </div>
// </section>

// <section>
// <h2>Licensing</h2>

// <p>All source code on my Github, including this website, is licensed under GNU Public License v3.0 unless otherwise stated.</p>
// </section>
