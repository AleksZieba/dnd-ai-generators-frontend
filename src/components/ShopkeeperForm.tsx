import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import ResponseModal, { ShopkeeperResponse } from './ShopkeeperModal';
import './ShopkeeperForm.css';

interface ShopkeeperRequest {
  name?: string;
  race: string;
  settlementSize: string;
  shopType: string;
  description?: string;
}

const races = [
  'Aarakocra','Aasimar','Air Genasi','Bugbear','Centaur','Changeling',
  'Deep Gnome','Duergar','Dragonborn','Dwarf','Earth Genasi','Eladrin',
  'Elf','Fairy','Firbolg','Fire Genasi','Githyanki','Githzerai','Gnome',
  'Goliath','Half-Elf','Halfling','Half-Orc','Harengon','Hobgoblin',
  'Human','Kenku','Kobold','Lizardfolk','Minotaur','Orc','Satyr',
  'Sea Elf','Shadar-kai','Shifter','Tabaxi','Tiefling','Tortle',
  'Triton','Water Genasi','Yuan-ti'
] as const;

const settlements = ['Outpost','Village','Town','City'] as const;

const shopTypes = [
  'Alchemist','Apothecary','Artificer','Blacksmith','Bookstore',
  'Cobbler','Fletcher','General Store','Haberdashery','Innkeeper',
  'Leatherworker','Pawnshop','Tailor'
] as const;

const sanitize = (s: string) => s.replace(/[\\'"`]/g, '');

const ShopkeeperForm: React.FC = () => {
  const [name, setName]               = useState('');
  const [race, setRace]               = useState('');
  const [settlementSize, setSettlementSize] = useState('');
  const [shopType, setShopType]       = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading]         = useState(false);
  const [response, setResponse]       = useState<ShopkeeperResponse | null>(null);
  const [error, setError]             = useState('');

  // Randomize button → GET /api/shopkeeper/random
  const handleRandomize = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.get<ShopkeeperResponse>('/api/shopkeeper/random');
      setResponse(data);
    } catch {
      setError('Error generating shopkeeper.');
    } finally {
      setLoading(false);
    }
  };

  // Submit form → POST /api/shopkeeper
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload: ShopkeeperRequest = { race, settlementSize, shopType };
      if (name.trim())        payload.name        = sanitize(name.trim());
      if (description.trim()) payload.description = sanitize(description.trim());
      const { data } = await axios.post<ShopkeeperResponse>('/api/shopkeeper', payload);
      setResponse(data);
    } catch {
      setError('Error generating shopkeeper.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Shopkeeper NPC Generator</h2>

      <button
        type="button"
        onClick={handleRandomize}
        disabled={loading}
      >
        {loading ? 'Loading…' : 'Randomize'}
      </button>

      <hr />

      <label>
        Name (optional):
        <input
          className="form-input"
          type="text"
          placeholder="(Optional)"
          value={name}
          disabled={loading}
          onChange={e => setName(sanitize(e.target.value))}
        />
      </label>

      <label>
        Race:
        <select
          required
          value={race}
          disabled={loading}
          onChange={e => setRace(e.target.value)}
        >
          <option value="">Select Race</option>
          {races.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>

      <label>
        Settlement Size:
        <select
          required
          value={settlementSize}
          disabled={loading}
          onChange={e => setSettlementSize(e.target.value)}
        >
          <option value="">Select Settlement</option>
          {settlements.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>

      <label>
        Shop Type:
        <select
          required
          value={shopType}
          disabled={loading}
          onChange={e => setShopType(e.target.value)}
        >
          <option value="">Select Type</option>
          {shopTypes.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>

      <label>
        Additional Details:
        <textarea
          className="form-input"
          placeholder="Optional extra flavor or requirements..."
          value={description}
          disabled={loading}
          onChange={e => setDescription(sanitize(e.target.value))}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
      >
        Submit
      </button>

      {error && <p className="message error">{error}</p>}

      {response && (
        <ResponseModal
          data={response}
          onClose={() => setResponse(null)}
          onReroll={handleRandomize} 
        />
      )}
    </form>
  );
};

export default ShopkeeperForm;