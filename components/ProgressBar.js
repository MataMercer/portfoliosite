import React, { useEffect } from 'react';
import useStorage from '../hooks/useStorage';
import { motion } from 'framer-motion';

const ProgressBar = ({ files, setFiles }) => {
  const { progress, url } = useStorage(files);

  useEffect(() => {
    if (url) {
      setFiles(null);
    }
  }, [url, setFiles]);

  return (
    <motion.div className="progress-bar"
      initial={{ width: 0 }}
      animate={{ width: progress + '%' }}
    ></motion.div>
  );
} 

export default ProgressBar;