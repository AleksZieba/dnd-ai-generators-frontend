import React from 'react'
import './ResponseModal.css'  // reuse your modal styles

export type ShopkeeperResponse = {
  Name: string
  Race: string
  SettlementSize: string
  ShopType: string
  Description: string
  ItemsList: string[]
}

interface Props {
  data: ShopkeeperResponse
  onClose: () => void
  onReroll: () => void
}

const ShopkeeperModal: React.FC<Props> = ({ data, onClose, onReroll }) => {
  // Build a plain‐text version of what the user sees
  const handleCopy = () => {
    let text = ''
    // Header
    text += `${data.Name || `${data.Race} Shopkeeper`}\n\n`
    // Fields
    text += `Race: ${data.Race}\n`
    text += `Settlement Size: ${data.SettlementSize}\n`
    text += `Shop Type: ${data.ShopType}\n`
    if (data.Description) {
      text += `Description: ${data.Description}\n`
    }
    // Items list
    text += `\nItems For Sale:\n`
    text += data.ItemsList.map(item => `• ${item}`).join('\n')
    // Copy to clipboard
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{data.Name || `${data.Race} Shopkeeper`}</h3>

        <dl className="modal-list">
          <dt>Race:</dt>
          <dd>{data.Race}</dd>

          <dt>Settlement Size:</dt>
          <dd>{data.SettlementSize}</dd>

          <dt>Shop Type:</dt>
          <dd>{data.ShopType}</dd>

          {data.Description && (
            <>
              <dt>Description:</dt>
              <dd>{data.Description}</dd>
            </>
          )}

          <dt>Items For Sale:</dt>
          <dd>
            <ul>
              {data.ItemsList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </dd>
        </dl>

        <div className="modal-buttons">
          {/* Copy button */}
          <button onClick={handleCopy}>Copy</button>
          {/* Reroll button */}
          <button onClick={onReroll}>Re-roll</button>
          {/* Close button */}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default ShopkeeperModal