//import React from 'react';
import NavBar from './components/NavBar';
import GearForm from './components/GearForm';
import ShopkeeperForm from './components/ShopkeeperForm';
import './App.css'; 

function App() {
  return (
    <>
      <NavBar />
      <main>
        <section id="equipment">
          <GearForm />
        </section>
        <section id="npc" className="shopkeeper-section">
          <ShopkeeperForm />
        </section>
      </main>
    </>
  );
}

export default App;