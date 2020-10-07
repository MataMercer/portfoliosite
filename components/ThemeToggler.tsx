import { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const ThemeToggler = () => {
  const [theme, setTheme] = useState(true);

  const handleChange = () => {
    setTheme(!theme);
  };

  useEffect(() => {
    const getTheme = localStorage.getItem('theme');
    if (getTheme === 'dark') {
      setTheme(true);
    } else if (getTheme === 'light') {
      setTheme(false);
    }
  }, []);

  useEffect(() => {
    if (theme) {
      localStorage.setItem('theme', 'dark');
      document.body.classList.add('dark-theme');
    } else {
      localStorage.setItem('theme', 'light');
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  return (
    <div>
      <Button size="sm" onClick={handleChange} className="theme-toggler">
        {theme ? (
          <FontAwesomeIcon icon={faMoon} />
        ) : (
          <FontAwesomeIcon icon={faSun} />
        )}
      </Button>
    </div>
  );
};

export default ThemeToggler;
