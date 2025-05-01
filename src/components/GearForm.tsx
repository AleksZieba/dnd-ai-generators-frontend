import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import ResponseModal, { GearResponse } from './ResponseModal';
import './GearForm.css';

interface GearRequest {
  name: string;
  type: 'Weapon' | 'Armor';
  handedness?: 'Single-Handed' | 'Versatile' | 'Two-Handed';
  subtype: string;
  rarity: string;
  clothingPiece?: string;
}

const weaponHandOptions = ['Single-Handed', 'Versatile', 'Two-Handed'] as const;

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
    'Morningstar',
    'Rapier',
    'Scimitar',
    'Sickle',
    'Shortsword',
    'War pick'
  ],
  'Versatile': [
    'Battleaxe',
    'Longsword',
    'Quarterstaff',
    'Spear',
    'Staff',
    'Trident',
    'Warhammer'
  ],
  'Two-Handed': [
    'Glaive',
    'Greataxe',
    'Greatclub',
    'Greatsword',
    'Halberd',
    'Heavy Crossbow',
    'Light Crossbow',
    'Longbow',
    'Maul',
    'Pike',
    'Shortbow'
  ]
};

const armorOptions = ['Light', 'Medium', 'Heavy', 'Shield', 'Clothes'] as const;
const clothingPieceOptions = ['Helmet', 'Chestplate', 'Gauntlets', 'Boots', 'Cloak', 'Hat'];

const GearForm: React.FC = () => {
  const [name, setName]                   = useState('');
  const [type, setType]                   = useState<'Weapon'|'Armor'|''>('');
  const [handedness, setHandedness]       = useState<typeof weaponHandOptions[number]|''>('');
  const [subtype, setSubtype]             = useState('');
  const [rarity, setRarity]               = useState('');
  const [clothingPiece, setClothingPiece] = useState('');
  const [loading, setLoading]             = useState(false);
  const [responseData, setResponseData]   = useState<GearResponse|null>(null);
  const [showModal, setShowModal]         = useState(false);
  const [errorMessage, setErrorMessage]   = useState<string|null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      const payload: GearRequest = {
        name,
        type: type as 'Weapon'|'Armor',
        subtype,
        rarity
      };
      if (type === 'Weapon') {
        payload.handedness = handedness as typeof weaponHandOptions[number];
      }
      if (type === 'Armor' && subtype !== 'Shield') {
        payload.clothingPiece = clothingPiece;
      }

      const { data } = await axios.post<GearResponse>('/api/gear', payload);
      setResponseData(data);
      setShowModal(true);
      // reset form
      setName(''); setType(''); setHandedness(''); setSubtype(''); setRarity(''); setClothingPiece('');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Error sending gear request.');
    } finally {
      setLoading(false);
    }
  };

  const handleRandomize = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { data } = await axios.get<GearResponse>('/api/gear/random');
      setResponseData(data);
      setShowModal(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Error randomizing gear.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="modal-backdrop">
          <div className="modal" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{
              width: '3rem',
              height:'3rem',
              border:'0.5rem solid var(--surface)',
              borderTop:'0.5rem solid var(--primary)',
              borderRadius:'50%',
              animation:'spin 1s linear infinite'
            }} />
          </div>
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <h2>Request Gear</h2>

        <button
          type="button"
          className="randomize-btn"
          onClick={handleRandomize}
          disabled={loading}
        >
          Randomize
        </button>

        <hr className="separator" />

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
              setType(e.target.value as 'Weapon'|'Armor');
              setHandedness(''); setSubtype(''); setClothingPiece('');
            }}
            required
          >
            <option value="">Select Type</option>
            <option value="Weapon">Weapon</option>
            <option value="Armor">Armor</option>
          </select>
        </label>

        {/* Weapon Category */}
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

        {/* Weapon Type */}
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

        {/* Armor Class */}
        {type === 'Armor' && (
          <label>
            Armor Class:
            <select
              value={subtype}
              onChange={e => { setSubtype(e.target.value); setClothingPiece(''); }}
              required
            >
              <option value="">Select Armor Class</option>
              {armorOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
        )}

        {/* Clothing Piece */}
        {type === 'Armor' && subtype !== 'Shield' && (
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
            <option value="Artifact">Artifact</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          Submit
        </button>

        {errorMessage && <p className="message error">{errorMessage}</p>}
      </form>

      {showModal && responseData && (
        <ResponseModal
          data={responseData}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default GearForm;
