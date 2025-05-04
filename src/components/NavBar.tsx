import React, { useState, useEffect } from 'react';
import './NavBar.css';

const NavBar: React.FC = () => {
  const [active, setActive] = useState<string>('#equipment');

  // Update active link on scroll
  useEffect(() => {
    const handleScroll = () => {
      const equipmentSection = document.getElementById('equipment');
      const npcSection = document.getElementById('npc');
      const scrollMid = window.scrollY + window.innerHeight / 2;

      if (npcSection && scrollMid >= npcSection.offsetTop) {
        setActive('#npc');
      } else {
        setActive('#equipment');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth-scroll to target section
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
      setActive(`#${id}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="tagesschrift-regular brand-title">
          Magic DND Generator
        </span>
        <img
          src="/dragon-logo.svg"
          alt="Dragon Logo"
          className="brand-logo"
        />
      </div>

      <div className="navbar-links">
        <a
          href="#equipment"
          className={active === '#equipment' ? 'active' : ''}
          onClick={scrollTo('equipment')}
        >
          Equipment Generator
        </a>
        <a
          href="#npc"
          className={active === '#npc' ? 'active' : ''}
          onClick={scrollTo('npc')}
        >
          NPC Generator
        </a>
        <a className="comingsoon">
          Character Sheet Gen. (Coming Soon)
        </a>
      </div>

      <a
        href="https://ko-fi.com/alekszieba"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary donate-button"
      >
        Donate ❤️
      </a>
    </nav>
  );
};

export default NavBar;