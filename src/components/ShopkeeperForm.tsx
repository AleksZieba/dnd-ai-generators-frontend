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

const sanitize = (s: string) => s.replace(/[\\'"`]/g, '');

const ShopkeeperForm: React.FC = () => {
  const [name, setName]               = useState('')
  const [race, setRace]               = useState('')
  const [settlementSize, setSettlementSize] = useState('')
  const [shopType, setShopType]       = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading]         = useState(false)
  const [response, setResponse]       = useState<ShopkeeperResponse | null>(null)
  const [error, setError]             = useState('')

  const doRequest = async () => {
    setError('')
    setLoading(true)
    try {
      const payload: ShopkeeperRequest = { race, settlementSize, shopType }
      if (name)        payload.name        = name
      if (description) payload.description = description

      const { data } = await axios.post<ShopkeeperResponse>(
        '/api/shopkeeper',
        payload
      )
      setResponse(data)
    } catch {
      setError('Error generating shopkeeper.')
    } finally {
      setLoading(false)
    }
  }

  // share this for both Submit & Randomize
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    doRequest()
  }

  const handleReroll = () => {
    if (!response) return
    doRequest()
  }

  return (
    <>
      {/* ← spinner overlay while waiting and no modal open */}
      {loading && !response && (
        <div className="loading-backdrop">
          <div className="loading-spinner" />
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <h2>Shopkeeper NPC Generator</h2>

        <button
          type="button"
          onClick={doRequest}
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
            value={name}
            onChange={e => setName(e.target.value.replace(/["'\\]/g,''))}
            disabled={loading}
          />
        </label>

        <label>
          Race:
          <select
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
            placeholder="Optional extra flavor or requirements."
            value={description}
            onChange={e => setDescription(e.target.value.replace(/["'\\]/g,''))}
            disabled={loading}
          />
        </label>

        <button type="submit" disabled={loading}>
          Submit
        </button>

        {error && <p className="message">{error}</p>}
      </form>

      {response && (
        <ShopkeeperModal
          data={response}
          loading={loading}
          onClose={() => setResponse(null)}
          onReroll={handleReroll}
        />
      )}
    </>
  )
}

export default ShopkeeperForm