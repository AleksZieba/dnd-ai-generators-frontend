import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import './GearForm.css';

interface GearRequest {
  name: string;
  type: 'Weapon' | 'Armor';
  handedness?: 'Single-Handed' | 'Two-Handed';
  subtype: string;
  rarity: string;
  clothingPiece?: string;
}

const weaponHandOptions = ['Single-Handed', 'Two-Handed'] as const;
const weaponTypeOptions: Record<typeof weaponHandOptions[number], string[]> = {
  'Single-Handed': ['Dagger', 'Sword', 'Axe'],
  'Two-Handed': ['Bow', 'Staff'],
};
const armorOptions = ['Light', 'Medium', 'Heavy', 'Shield', 'Clothes'];
const clothingPieceOptions = ['Helmet', 'Chestplate', 'Gauntlets', 'Boots', 'Cloak', 'Hat'];

const GearForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<'Weapon' | 'Armor' | ''>('');
  const [handedness, setHandedness] = useState<typeof weaponHandOptions[number] | ''>('');
  const [subtype, setSubtype] = useState<string>('');
  const [rarity, setRarity] = useState<string>('');
  const [clothingPiece, setClothingPiece] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload: GearRequest = { name, type: type as 'Weapon' | 'Armor', subtype, rarity };
    if (type === 'Weapon') {
      payload.handedness = handedness as 'Single-Handed' | 'Two-Handed';
    }
    if (type === 'Armor' && subtype !== 'Shield') {
      payload.clothingPiece = clothingPiece;
    }
    try {
      await axios.post<unknown>('/api/gear', payload);
      setMessage('Gear request sent successfully!');
      setName('');
      setType('');
      setHandedness('');
      setSubtype('');
      setRarity('');
      setClothingPiece('');
    } catch (error) {
      console.error(error);
      setMessage('Error sending gear request.');
    }
  };

  const armorClassOptions = armorOptions;

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
        <select
          value={type}
          onChange={e => {
            setType(e.target.value as 'Weapon' | 'Armor');
            setHandedness('');
            setSubtype('');
            setClothingPiece('');
          }}
          required
        >
          <option value="">Select Type</option>
          <option value="Weapon">Weapon</option>
          <option value="Armor">Armor</option>
        </select>
      </label>

      {/* Weapon Category Dropdown */}
      {type === 'Weapon' && (
        <label>
          Weapon Category:
          <select
            value={handedness}
            onChange={e => {
              setHandedness(e.target.value as typeof weaponHandOptions[number]);
              setSubtype('');
            }}
            required
          >
            <option value="">Select Category</option>
            {weaponHandOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
      )}

      {/* Weapon Type Dropdown */}
      {type === 'Weapon' && handedness && (
        <label>
          Weapon Type:
          <select
            value={subtype}
            onChange={e => setSubtype(e.target.value)}
            required
          >
            <option value="">Select Weapon</option>
            {weaponTypeOptions[handedness].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
      )}

      {/* Armor Class Dropdown */}
      {type === 'Armor' && (
        <label>
          Armor Class:
          <select
            value={subtype}
            onChange={e => {
              setSubtype(e.target.value);
              setClothingPiece('');
            }}
            required
          >
            <option value="">Select Armor Class</option>
            {armorClassOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
      )}

      {/* Clothing Piece Dropdown */}
      {type === 'Armor' && subtype && subtype !== 'Shield' && (
        <label>
          Clothing Piece:
          <select
            value={clothingPiece}
            onChange={e => setClothingPiece(e.target.value)}
            required
          >
            <option value="">Select Piece</option>
            {clothingPieceOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
      )}

      <label>
        Rarity:
        <select
          value={rarity}
          onChange={e => setRarity(e.target.value)}
          required
        >
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