import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import ShopkeeperModal, { ShopkeeperResponse } from './ShopkeeperModal';
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

// Strip backslashes, quotes, backticks for security
const sanitize = (s: string) => s.replace(/[\\'"`]/g, '');

const ShopkeeperForm: React.FC = () => {
  const [name, setName]               = useState('');
  const [race, setRace]               = useState('');
  const [settlementSize, setSettlementSize] = useState('');
  const [shopType, setShopType]       = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading]         = useState(false);
  const [response, setResponse]       = useState<ShopkeeperResponse | null>(null);
  const [message, setMessage]         = useState('');  // validation errors
  const [error, setError]             = useState('');  // request errors
  const [lastWasRandom, setLastWasRandom] = useState(false);

  const hasBadChar = (s: string) => /[\\`'"]/.test(s);

  // Shared request function, random=true -> GET /api/shopkeeper/random
  const doRequest = async (random = false) => {
    setMessage('');
    setError('');
    setLoading(true);
    setLastWasRandom(random);
    try {
      let res;
      if (random) {
        res = await axios.get<ShopkeeperResponse>('/api/shopkeeper/random');
      } else {
        const payload: ShopkeeperRequest = {
          race,
          settlementSize,
          shopType,
        };
        if (name.trim())        payload.name        = sanitize(name.trim());
        if (description.trim()) payload.description = sanitize(description.trim());
        res = await axios.post<ShopkeeperResponse>(
          '/api/shopkeeper',
          payload
        );
      }
      setResponse(res.data);
    } catch {
      setError(random
        ? 'Error generating random shopkeeper.'
        : 'Error generating shopkeeper.'
      );
    } finally {
      setLoading(false);
    }
  };

  // handle normal submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (hasBadChar(name) || hasBadChar(description)) {
      setMessage('The characters \\ ` \' " are not allowed.');
      return;
    }
    doRequest(false);
  };

  // randomize
  const handleRandomize = () => {
    doRequest(true);
  };

  // reroll
  const handleReroll = () => {
    if (!response) return;
    doRequest(lastWasRandom);
  };

  return (
    <>
      {/* spinner overlay when loading but no modal yet */}
      {loading && !response && (
        <div className="loading-backdrop">
          <div className="loading-spinner" />
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <h2>Shopkeeper NPC Generator</h2>

        {/* Randomize button */}
        <button
          type="button"
          onClick={handleRandomize}
          disabled={loading}
        >
          {loading && lastWasRandom ? 'Loading…' : 'Randomize'}
        </button>

        <hr />

        <label>
          Shopkeeper Name:
          <input
            className="form-input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="(Optional)"
            disabled={loading}
          />
        </label>

        <label>
          Race:
          <select
            className="form-input"
            required
            value={race}
            onChange={e => setRace(e.target.value)}
            disabled={loading}
          >
            <option value="">Select Race</option>
            {races.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>

        <label>
          Settlement Size:
          <select
            className="form-input"
            required
            value={settlementSize}
            onChange={e => setSettlementSize(e.target.value)}
            disabled={loading}
          >
            <option value="">Select Settlement</option>
            {settlements.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <label>
          Shop Type:
          <select
            className="form-input"
            required
            value={shopType}
            onChange={e => setShopType(e.target.value)}
            disabled={loading}
          >
            <option value="">Select Type</option>
            {shopTypes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <label>
          Additional Details:
          <textarea
            className="form-input"
            placeholder="Optional extra flavor or requirements..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={loading}
          />
        </label>

        {/* Submit button shows loading only on normal submits */}
        <button
          type="submit"
          disabled={loading && !lastWasRandom}
        >
          {loading && !lastWasRandom ? 'Loading…' : 'Submit'}
        </button>

        {message && <p className="message">{message}</p>}
        {error   && <p className="message">{error}</p>}
      </form>

      {/* Modal */}
      {response && (
        <ShopkeeperModal
          data={response}
          loading={loading}
          onClose={() => setResponse(null)}
          onReroll={handleReroll}
        />
      )}
    </>
  );
};

export default ShopkeeperForm;