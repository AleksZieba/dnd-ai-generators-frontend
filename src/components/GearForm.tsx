import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import ResponseModal, { GearResponse } from './ResponseModal';
import './GearForm.css';
import './ResponseModal.css'; // ensures your modal styles are loaded

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
  // form fields
  const [name, setName]               = useState('');
  const [type, setType]               = useState<'Weapon'|'Armor'|''>('');
  const [handedness, setHandedness]   = useState<typeof weaponHandOptions[number]|''>('');
  const [subtype, setSubtype]         = useState('');
  const [rarity, setRarity]           = useState('');
  const [clothingPiece, setClothingPiece] = useState('');

  // UI state
  const [loading, setLoading]         = useState(false);
  const [responseData, setResponseData] = useState<GearResponse|null>(null);
  const [showModal, setShowModal]     = useState(false);
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      const payload: GearRequest = { name, type: type as 'Weapon'|'Armor', subtype, rarity };
      if (type === 'Weapon') {
        payload.handedness = handedness as 'Single-Handed'|'Two-Handed';
      }
      if (type === 'Armor' && subtype !== 'Shield') {
        payload.clothingPiece = clothingPiece;
      }

      // We expect the backend to return exactly a GearResponse object:
      const { data } = await axios.post<GearResponse>('/api/gear', payload);

      // Store it and open the modal:
      setResponseData(data);
      setShowModal(true);

      // Optionally reset form fields:
      setName('');
      setType('');
      setHandedness('');
      setSubtype('');
      setRarity('');
      setClothingPiece('');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message
          || 'An unexpected error occurred while requesting gear.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Loading spinner overlay */}
      {loading && (
        <div className="modal-backdrop">
          <div className="modal" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              border: '0.5rem solid var(--surface)',
              borderTop: '0.5rem solid var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        </div>
      )}

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
              setType(e.target.value as 'Weapon'|'Armor');
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
              {armorOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
        )}

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

        {errorMessage && (
          <p className="message error">{errorMessage}</p>
        )}
      </form>

      {/* Render the modal as soon as we have valid responseData */}
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