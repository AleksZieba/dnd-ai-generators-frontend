import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-left">
        Contact Me:&nbsp;
        <a href="mailto:aleks@alekszieba.com">aleks@alekszieba.com</a>
      </div>
      <div className="footer-center">
        © {year} Aleks Zieba
      </div>
      <div className="footer-right">
        <a
          href="https://ko-fi.com/alekszieba"
          target="_blank"
          rel="noopener noreferrer"
        >
          Donate ❤️
        </a>
      </div>
    </footer>
  );
};

export default Footer;