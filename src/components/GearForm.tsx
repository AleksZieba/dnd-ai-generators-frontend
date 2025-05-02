import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import ResponseModal, { GearResponse } from './ResponseModal';
import './GearForm.css';

interface GearRequest {
  name?: string;
  type: 'Weapon' | 'Armor' | 'Jewelry';
  handedness?: 'Single-Handed' | 'Two-Handed' | 'Versatile';
  subtype: string;
  rarity: string;
  description?: string;
  clothingPiece?: string;
}

const weaponHandOptions = ['Single-Handed', 'Two-Handed', 'Versatile'] as const;
const weaponTypeOptions: Record<typeof weaponHandOptions[number], string[]> = {
  'Single-Handed': [
    'Club', 'Dagger', 'Flail', 'Hand Crossbows', 'Handaxe',
    'Javelin', 'Light Hammer', 'Mace', 'Rapier', 'Scimitar',
    'Shortsword', 'Sickle', 'War pick'
  ].sort(),
  'Versatile': [
    'Battleaxe', 'Longsword', 'Quarterstaff', 'Spear',
    'Staff', 'Trident', 'Warhammer'
  ].sort(),
  'Two-Handed': [
    'Glaive', 'Greatclub', 'Greatsword', 'Greataxe', 'Halberd',
    'Heavy Crossbow', 'Light Crossbow', 'Longbow', 'Maul',
    'Pike', 'Shortbow'
  ].sort(),
};
const armorOptions = ['Clothes', 'Light', 'Medium', 'Heavy', 'Shield'] as const;

const GearForm: React.FC = () => {
  const [name, setName]               = useState('');
  const [type, setType]               = useState<'Weapon'|'Armor'|'Jewelry'|''>('');
  const [handedness, setHandedness]   = useState<typeof weaponHandOptions[number] | ''>('');
  const [subtype, setSubtype]         = useState('');
  const [rarity, setRarity]           = useState('');
  const [description, setDescription] = useState('');
  const [clothingPiece, setClothingPiece] = useState('');
  const [loading, setLoading]         = useState(false);
  const [message, setMessage]         = useState('');
  const [lastRequest, setLastRequest] = useState<GearRequest | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<GearResponse | null>(null);
  const [lastWasRandom, setLastWasRandom] = useState(false);

  // disallow \ ` ' "
  const hasBadChar = (s: string) => /[\\`'"]/.test(s);

  // unified send function
  async function sendRequest(
    reqPayload: GearRequest | null,
    random = false
  ) {
    setLoading(true);
    setMessage('');
    try {
      let res;
      if (random) {
        res = await axios.get<GearResponse>('/api/gear/random');
      } else {
        if (!reqPayload) throw new Error('No payload to send');
        res = await axios.post<GearResponse>('/api/gear', reqPayload);
      }
      setCurrentResponse(res.data);
      setModalVisible(true);
    } catch (err) {
      console.error(err);
      setMessage(random
        ? 'Error fetching random gear.'
        : 'Error sending gear request.');
    } finally {
      setLoading(false);
    }
  }

  // form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (hasBadChar(name) || hasBadChar(description)) {
      setMessage('The characters \\ ` \' " are not allowed.');
      return;
    }

    // build payload
    const payload: GearRequest = { type: type as any, subtype, rarity };
    if (name.trim())          payload.name           = name.trim();
    if (type === 'Weapon')    payload.handedness     = handedness as any;
    if (type === 'Armor' && subtype !== 'Shield')
                               payload.clothingPiece  = clothingPiece;
    if (description.trim())   payload.description    = description.trim();

    // save for reroll
    setLastRequest(payload);
    setLastWasRandom(false);

    // send right away
    await sendRequest(payload, false);

    // clear form
    setName('');
    setType('');
    setHandedness('');
    setSubtype('');
    setRarity('');
    setDescription('');
    setClothingPiece('');
  };

  // randomize
  const handleRandomize = async () => {
    setLastWasRandom(true);
    setLastRequest(null);
    await sendRequest(null, true);
  };

  // reroll uses same logic
  const handleReroll = async () => {
    await sendRequest(lastRequest, lastWasRandom);
  };

  return (
    <>
      {/* loading spinner */}
      {loading && (
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
          {loading && lastWasRandom ? 'Loading…' : 'Randomize'}
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
            <option value="Jewelry">Jewelry</option>
          </select>
        </label>

      {type === 'Jewelry' && (
        <label>
          Jewelry Category:
          <select
            value={subtype}
            onChange={e => setSubtype(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Ring">Ring</option>
            <option value="Necklace">Necklace</option>
          </select>
        </label>
      )}

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
              disabled={loading}
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
              disabled={loading}
            >
              <option value="">Select Armor Class</option>
              {armorOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
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
              {(subtype === 'Clothes'
                ? ['Boots','Clothes','Cloak','Gloves','Headgear','Robes','Shoes']
                : ['Boots','Chest Armor','Greaves','Headgear']
              ).map(opt => (
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

        <button type="submit" disabled={loading && !lastWasRandom}>
          {loading && !lastWasRandom ? 'Loading…' : 'Submit'}
        </button>

        {message && <p className="message">{message}</p>}
      </form>

      {modalVisible && currentResponse && (
        <ResponseModal
          data={currentResponse}
          onClose={() => setModalVisible(false)}
          onReroll={handleReroll}
          loading={loading}
        />
      )}

      {loading && (
        <div className="loading-backdrop">
          <div className="loading-spinner" />
        </div>
      )}
    </>
  );
};

export default GearForm;