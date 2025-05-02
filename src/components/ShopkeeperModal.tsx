import React from 'react'
import './ResponseModal.css' // re-use your existing modal styles

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
}

const ShopkeeperModal: React.FC<Props> = ({ data, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{data.Name || `${data.Race} Shopkeeper`}</h3>
        <dl className="modal-list">
          <dt>Race:</dt>           <dd>{data.Race}</dd>
          <dt>Settlement Size:</dt><dd>{data.SettlementSize}</dd>
          <dt>Shop Type:</dt>      <dd>{data.ShopType}</dd>
          {data.Description && <>
            <dt>Description:</dt>  <dd>{data.Description}</dd>
          </>}
          <dt>Items For Sale:</dt>
          <dd>
            <ul>
              {data.ItemsList.map((item,i) =>
                <li key={i}>{item}</li>
              )}
            </ul>
          </dd>
        </dl>
        <div className="modal-buttons">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default ShopkeeperModal