import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      {/* only shown on small screens */}
      <a
        href="https://ko-fi.com/alekszieba"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary footer-donate-button"
      >
        Donate ❤️
      </a>

      <div className="footer-left">
        Contact Me:&nbsp;
        <a href="mailto:aleks@alekszieba.com">aleks@alekszieba.com</a>
      </div>

      <div className="footer-center">
        © {year} Aleks Zieba
      </div>

      <div className="footer-right">
        <a href="https://www.vecteezy.com/free-vector/symbol">
          Symbol Vectors by Vecteezy
        </a>
      </div>
    </footer>
  );
};

export default Footer;