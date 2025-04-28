import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import './GearForm.css';
import ResponseModal from './ResponseModal';

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
  const [name, setName] = useState('');
  const [type, setType] = useState<'Weapon' | 'Armor' | ''>('');
  const [handedness, setHandedness] = useState<typeof weaponHandOptions[number] | ''>('');
  const [subtype, setSubtype] = useState('');
  const [rarity, setRarity] = useState('');
  const [clothingPiece, setClothingPiece] = useState('');
  const [message, setMessage] = useState('');
  const [modalContent, setModalContent] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    const payload: GearRequest = { name, type: type as any, subtype, rarity };
    if (type === 'Weapon') {
      payload.handedness = handedness as any;
    }
    if (type === 'Armor' && subtype !== 'Shield') {
      payload.clothingPiece = clothingPiece;
    }

    try {
      const response = await axios.post<unknown>('/api/gear', payload);
      // stringify with indentation for readability
      const text = JSON.stringify(response.data, null, 2);
      setModalContent(text);
      // reset form
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
    <>
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
              setType(e.target.value as any);
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

        {type === 'Weapon' && (
          <>
            <label>
              Weapon Category:
              <select
                value={handedness}
                onChange={e => {
                  setHandedness(e.target.value as any);
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
            {handedness && (
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
          </>
        )}

        {type === 'Armor' && (
          <>
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
            {subtype && subtype !== 'Shield' && (
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
          </>
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

      {modalContent && (
        <ResponseModal
          content={modalContent}
          onClose={() => setModalContent(null)}
        />
      )}
    </>
  );
};

export default GearForm;