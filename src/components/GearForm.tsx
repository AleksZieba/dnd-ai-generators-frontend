import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import ResponseModal, { GearResponse } from './ResponseModal';
import './GearForm.css';

interface GearRequest {
  name?: string;
  type: 'Weapon' | 'Armor';
  handedness?: 'Single-Handed' | 'Two-Handed' | 'Versatile';
  subtype: string;
  rarity: string;
  description?: string;
  clothingPiece?: string;
}

const weaponHandOptions = ['Single-Handed', 'Two-Handed', 'Versatile'] as const;
const weaponTypeOptions: Record<typeof weaponHandOptions[number], string[]> = {
  'Single-Handed': [
    'Club',
    'Dagger',
    'Flail',
    'Hand Crossbows',
    'Handaxe',
    'Javelin',
    'Light Hammer',
    'Mace',
    'Rapier',
    'Scimitar',
    'Shortsword',
    'Sickle',
    'War pick'
  ].sort(),
  'Versatile': [
    'Battleaxe',
    'Longsword',
    'Quarterstaff',
    'Spear',
    'Staff',
    'Trident',
    'Warhammer'
  ].sort(),
  'Two-Handed': [
    'Glaive',
    'Greatclub',
    'Greatsword',
    'Greataxe',
    'Halberd',
    'Heavy Crossbow',
    'Light Crossbow',
    'Longbow',
    'Maul',
    'Pike',
    'Shortbow'
  ].sort(),
};

const armorOptions = ['Clothes', 'Heavy', 'Light', 'Medium', 'Shield'] as const;
const clothingPieceOptions = ['Boots', 'Chestplate', 'Cloak', 'Gauntlets', 'Hat', 'Helmet'];

const GearForm: React.FC = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'Weapon' | 'Armor' | ''>('');
  const [handedness, setHandedness] = useState<typeof weaponHandOptions[number] | ''>('');
  const [subtype, setSubtype] = useState('');
  const [rarity, setRarity] = useState('');
  const [description, setDescription] = useState('');
  const [clothingPiece, setClothingPiece] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [modalData, setModalData] = useState<GearResponse | null>(null);
  const hasBadChar = (s: string) => /[\\`'"]/.test(s);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (hasBadChar(name) || hasBadChar(description)) {
      setMessage('The backslash, tilde, single and double parantheses characters (\\,\`,\',\") are not allowed in any field.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const payload: GearRequest = { type: type as 'Weapon' | 'Armor', subtype, rarity };
      if (name.trim()) {
        payload.name=name.trim();
      }
      if (type === 'Weapon') payload.handedness = handedness as any;
      if (type === 'Armor' && subtype !== 'Shield') payload.clothingPiece = clothingPiece;
      if (description.trim()) payload.description = description.trim();

      const res = await axios.post<GearResponse>('/api/gear', payload);
      setModalData(res.data);
      // clear form
      setName('');
      setType('');
      setHandedness('');
      setSubtype('');
      setRarity('');
      setDescription('');
      setClothingPiece('');
    } catch (err) {
      console.error(err);
      setMessage('Error sending gear request.');
    } finally {
      setLoading(false);
    }
  };

  const handleRandomize = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.get<GearResponse>('/api/gear/random');
      setModalData(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Error fetching random gear.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalData(null);
  };

  return (
    <>
      {/* ← spinner overlay while waiting */}
      {loading && !modalData && (
        <div className="loading-backdrop">
          <div className="loading-spinner" />
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <h2>Request Gear</h2>

        <button
          type="button"
          className="randomize-button"
          onClick={handleRandomize}
          disabled={loading}
        >
          {loading ? 'Loading…' : 'Randomize'}
        </button>

        <hr />

        <label>
          Item Name:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="(Optional)"
            disabled={loading}
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
            disabled={loading}
          >
            <option value="">Select Type</option>
            <option value="Weapon">Weapon</option>
            <option value="Armor">Armor</option>
          </select>
        </label>

        {type === 'Weapon' && (
          <label>
            Weapon Category:
            <select
              value={handedness}
              onChange={e => {
                setHandedness(e.target.value as any);
                setSubtype('');
              }}
              required
              disabled={loading}
            >
              <option value="">Select Category</option>
              {weaponHandOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        )}

        {type === 'Weapon' && handedness && (
          <label>
            Weapon Type:
            <select
              value={subtype}
              onChange={e => setSubtype(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Select Weapon</option>
              {weaponTypeOptions[handedness].map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        )}

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
              disabled={loading}
            >
              <option value="">Select Armor Class</option>
              {armorOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        )}

        {type === 'Armor' && subtype && subtype !== 'Shield' && (
          <label>
            {subtype === 'Clothes' ? 'Clothing Piece:' : 'Armor Piece:'}
            <select
              value={clothingPiece}
              onChange={e => setClothingPiece(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Select Piece</option>
              {(
                subtype === 'Clothes'
                  ? ['Boots','Clothes','Cloak','Gloves','Headgear','Robes','Shoes']
                  : ['Boots','Chest Armor','Greaves','Headgear']
              ).map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
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
            disabled={loading}
          >
            <option value="">Select Rarity</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Very Rare">Very Rare</option>
            <option value="Legendary">Legendary</option>
            <option value="Artifact">Artifact</option>
          </select>
        </label>

        <label>
          Additional Details:
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Optional extra flavor or requirements..."
            rows={3}
            disabled={loading}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Loading…' : 'Submit'}
        </button>

        {message && <p className="message">{message}</p>}

        {modalData && <ResponseModal data={modalData} onClose={closeModal} />}
      </form>
    </>
  );
};

export default GearForm;