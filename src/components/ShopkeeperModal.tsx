import React from 'react'
import './ResponseModal.css'  // reuse your existing modal styles

export type ShopkeeperResponse = {
  Name: string
  Race: string
  SettlementSize: string
  ShopType: string
  Description?: string
  ItemsList: string[]
}

interface Props {
  data: ShopkeeperResponse
  loading: boolean            // ← receive loading flag
  onClose: () => void
  onReroll: () => void
}

const ShopkeeperModal: React.FC<Props> = ({
  data,
  loading,
  onClose,
  onReroll
}) => {
  // 1) While loading, render only the full-screen spinner overlay:
  if (loading) {
    return (
      <div className="loading-backdrop">
        <div className="loading-spinner" />
      </div>
    )
  }

  // 2) Once loaded, show your normal modal UI:
  const handleCopy = () => {
    let text = ''
    text += `${data.Name || `${data.Race} Shopkeeper`}\n\n`
    text += `Race: ${data.Race}\n`
    text += `Settlement Size: ${data.SettlementSize}\n`
    text += `Shop Type: ${data.ShopType}\n`
    if (data.Description) {
      text += `Description: ${data.Description}\n\n`
    }
    text += `Items For Sale:\n`
    text += data.ItemsList.map(item => `• ${item}`).join('\n')
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
              <dd style={{ whiteSpace: 'pre-wrap' }}>{data.Description}</dd>
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
          <button type="button" onClick={onReroll}>
            Re-roll
          </button>
          <button type="button" onClick={handleCopy}>
            Copy
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShopkeeperModal