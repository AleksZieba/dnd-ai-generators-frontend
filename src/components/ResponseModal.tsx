import React from 'react';
import './ResponseModal.css';

export type GearResponse = {
  Name: string;
  Category: string;
  Type?: string;
  Rarity: string;
  Cost: string;
  DamageDice?: string;
  DamageType?: string;
  Weight: string;
  Properties: string[];
  Description: string;
  // armor-only
  ItemType?: string;
  ArmorClass?: string;
  Attunement?: string;
  Charges?: string;
};

interface ResponseModalProps {
  data: GearResponse;
  onClose: () => void;
}

const ResponseModal: React.FC<ResponseModalProps> = ({ data, onClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const isWeapon = !!data.DamageDice;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{data.Name}</h3>

        <dl className="modal-list">
          <dt>Category:</dt><dd>{data.Category}</dd>
          {isWeapon && (
            <>
              <dt>Type:</dt><dd>{data.Type}</dd>
            </>
          )}
          {!isWeapon && data.ItemType && (
            <>
              <dt>Item Type:</dt><dd>{data.ItemType}</dd>
            </>
          )}
          <dt>Rarity:</dt><dd>{data.Rarity}</dd>
          <dt>Cost:</dt><dd>{data.Cost}</dd>
          {isWeapon ? (
            <>
              <dt>Damage:</dt><dd>{data.DamageDice} {data.DamageType}</dd>
            </>
          ) : (
            <>
              <dt>Armor Class:</dt><dd>{data.ArmorClass}</dd>
              <dt>Attunement:</dt><dd>{data.Attunement}</dd>
              {data.Charges && <>
                <dt>Charges:</dt><dd>{data.Charges}</dd>
              </>}
            </>
          )}
          <dt>Weight:</dt><dd>{data.Weight}</dd>
          <dt>Properties:</dt>
          <dd>
            <ul>
              {data.Properties.map((p,i) => <li key={i}>{p}</li>)}
            </ul>
          </dd>
          <dt>Description:</dt><dd>{data.Description}</dd>
        </dl>

        <div className="modal-buttons">
          <button onClick={handleCopy}>Copy</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;