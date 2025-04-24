import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import './GearForm.css';

interface GearRequest {
  name: string;
  type: string;
  rarity: string;
}

const GearForm: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [rarity, setRarity] = useState<string>('');
    const [message, setMessage] = useState<string>('');
  
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      const payload: GearRequest = { name, type, rarity };
      try {
        await axios.post<unknown>('/api/gear', payload);
        setMessage('Gear request sent successfully!');
        setName('');
        setType('');
        setRarity('');
      } catch (error) {
        console.error(error);
        setMessage('Error sending gear request.');
      }
    };
  
    return (
      <form className="form" onSubmit={handleSubmit}>
        <h2>Request Gear</h2>
        <label>
          Item Name:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </label>
  
        <label>
          Type:
          <select value={type} onChange={e => setType(e.target.value)} required>
            <option value="">Select Type</option>
            <option value="Weapon">Weapon</option>
            <option value="Armor">Armor</option>
            <option value="Potion">Potion</option>
            <option value="Misc">Miscellaneous</option>
          </select>
        </label>
  
        <label>
          Rarity:
          <select value={rarity} onChange={e => setRarity(e.target.value)} required>
            <option value="">Select Rarity</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Very Rare">Very Rare</option>
            <option value="Legendary">Legendary</option>
          </select>
        </label>
  
        <button type="submit">Submit</button>
        {message && <p className="message">{message}</p>}
      </form>
    );
  };
  
  export default GearForm;