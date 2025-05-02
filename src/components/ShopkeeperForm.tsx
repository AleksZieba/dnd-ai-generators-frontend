import React, { useState, FormEvent } from 'react'
import axios from 'axios'
import ResponseModal, { ShopkeeperResponse } from './ShopkeeperModal'
import './ShopkeeperForm.css'

interface ShopkeeperRequest {
  name?: string
  race: string
  settlementSize: string
  shopType: string
  description?: string
}

const races = [
  'Aarakocra','Aasimar','Air Genasi','Bugbear','Centaur','Changeling',
  'Deep Gnome','Duergar','Dragonborn','Dwarf','Earth Genasi','Eladrin',
  'Elf','Fairy','Firbolg','Fire Genasi','Githyanki','Githzerai','Gnome',
  'Goliath','Half-Elf','Halfling','Half-Orc','Harengon','Hobgoblin',
  'Human','Kenku','Kobold','Lizardfolk','Minotaur','Orc','Satyr',
  'Sea Elf','Shadar-kai','Shifter','Tabaxi','Tiefling','Tortle',
  'Triton','Water Genasi','Yuan-ti'
]
const settlements = ['Outpost','Village','Town','City']
const shopTypes  = [
  'Alchemist','Apothecary','Artificer','Blacksmith','Bookstore',
  'Cobbler','Fletcher','General Store','Haberdashery','Innkeeper',
  'Leatherworker','Pawnshop','Tailor'
]

const ShopkeeperForm: React.FC = () => {
  const [name, setName]               = useState<string>('')
  const [race, setRace]               = useState<string>('')
  const [settlementSize, setSettlementSize] = useState<string>('')
  const [shopType, setShopType]       = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [loading, setLoading]         = useState<boolean>(false)
  const [response, setResponse]       = useState<ShopkeeperResponse|null>(null)
  const [error, setError]             = useState<string>('')

  // POST /api/shopkeeper with the form payload
  const doRequest = async () => {
    setError('')
    setLoading(true)
    try {
      const payload: ShopkeeperRequest = {
        race,
        settlementSize,
        shopType,
      }
      if (name.trim())        payload.name        = name
      if (description.trim()) payload.description = description

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

  // POST /api/shopkeeper/random to get a totally random shopkeeper
  const doRandomize = async () => {
    setError('')
    setLoading(true)
    try {
      const { data } = await axios.post<ShopkeeperResponse>(
        '/api/shopkeeper/random'
      )
      setResponse(data)
    } catch {
      setError('Error randomizing shopkeeper.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    doRequest()
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Shopkeeper NPC Generator</h2>

      <button
        type="button"
        className="btn-primary"
        onClick={doRandomize}
        disabled={loading}
      >
        {loading ? 'Loading…' : 'Randomize'}
      </button>

      <hr />

      <label>
        Shopkeeper Name:
        <input
          className="form-input"
          type="text"
          placeholder="(Optional)"
          value={name}
          onChange={e => setName(e.target.value.replace(/["'\\]/g, ''))}
        />
      </label>

      <label>
        Race:
        <select
          required
          value={race}
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
          onChange={e => setDescription(e.target.value.replace(/["'\\]/g, ''))}
        />
      </label>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Loading…' : 'Submit'}
      </button>

      {error && <p className="message">{error}</p>}

      {response && (
        <ResponseModal
          data={response}
          onClose={() => setResponse(null)}
        />
      )}
    </form>
  )
}

export default ShopkeeperForm