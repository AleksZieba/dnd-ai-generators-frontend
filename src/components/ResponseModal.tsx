import React from 'react';
import './ResponseModal.css';

export interface GearResponse {
  Name:        string;
  Category?:   string;
  Type?:       string;
  Rarity:      'Common'|'Uncommon'|'Rare'|'Very Rare'|'Legendary'|'Artifact';
  Cost?:       string;
  DamageDice?: string;
  DamageType?: string;
  Weight?:     string;
  Properties?: string[];
  Description?:string;
  ItemType?:   string;
  ArmorClass?: string;
  Attunement?: string;
  Charges?:    string;
}

interface ResponseModalProps {
  data: GearResponse;
  onClose: () => void;
  onReroll: () => void;
  loading: boolean;         
}

const rarityColors: Record<string,string> = {
  Common:     '#ffffff',
  Uncommon:   '#1eff00',
  Rare:       '#0070dd',
  'Very Rare':'#a335ee',
  Legendary:  '#ff8000',
  Artifact:   '#e6cc80',
};

const ResponseModal: React.FC<ResponseModalProps> = ({
  data,
  onClose,
  onReroll,
  loading,                
}) => {
  const color = rarityColors[data.Rarity] || '#fff';
  const isWeapon = Boolean(data.DamageDice);
  const propsArray = Array.isArray(data.Properties) ? data.Properties : [];

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3 style={{ color }}>{data.Name}</h3>

        <dl className="modal-list">
          {data.Category && (
            <>
              <dt>Category:</dt>
              <dd>{data.Category}</dd>
            </>
          )}

          {data.Type && (
            <>
              <dt>Type:</dt>
              <dd>{data.Type}</dd>
            </>
          )}

          {!isWeapon && data.ItemType && (
            <>
              <dt>Item Type:</dt>
              <dd>{data.ItemType}</dd>
            </>
          )}

          <dt>Rarity:</dt>
          <dd style={{ color }}>{data.Rarity}</dd>

          {data.Cost && (
            <>
              <dt>Cost:</dt>
              <dd>{data.Cost}</dd>
            </>
          )}

          {isWeapon ? (
            <>
              {data.DamageDice && (
                <>
                  <dt>Damage Dice:</dt>
                  <dd>{data.DamageDice}</dd>
                </>
              )}
              {data.DamageType && (
                <>
                  <dt>Damage Type:</dt>
                  <dd>{data.DamageType}</dd>
                </>
              )}
            </>
          ) : (
            <>
              {data.ArmorClass && (
                <>
                  <dt>Armor Class:</dt>
                  <dd>{data.ArmorClass}</dd>
                </>
              )}
              {data.Attunement && (
                <>
                  <dt>Attunement:</dt>
                  <dd>{data.Attunement}</dd>
                </>
              )}
              {data.Charges && (
                <>
                  <dt>Charges:</dt>
                  <dd>{data.Charges}</dd>
                </>
              )}
            </>
          )}

          {data.Weight && (
            <>
              <dt>Weight:</dt>
              <dd>{data.Weight}</dd>
            </>
          )}

          {propsArray.length > 0 && (
            <>
              <dt>Properties:</dt>
              <dd>
                <ul>
                  {propsArray.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </dd>
            </>
          )}

          {data.Description && (
            <>
              <dt>Description:</dt>
              <dd style={{ whiteSpace: 'pre-wrap' }}>
                {data.Description}
              </dd>
            </>
          )}
        </dl>

        <div className="modal-buttons">
          <button
            type="button"
            onClick={onReroll}
            disabled={loading}
          >
            {loading ? 'Loading…' : 'Re-roll'}
          </button>
          <button
            type="button"
            onClick={() =>
              navigator.clipboard.writeText(
                JSON.stringify(data, null, 2)
              )
            }
          >
            Copy
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;