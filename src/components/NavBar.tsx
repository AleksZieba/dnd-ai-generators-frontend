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
    handleScroll(); // initialize
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
      {/* donate button */}
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