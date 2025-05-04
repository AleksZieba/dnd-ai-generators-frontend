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

function formatPlainText(data: GearResponse): string {
  const lines: string[] = [];

  lines.push(`Name: ${data.Name}`);
  lines.push(`Category: ${data.Category}`);
  if (data.Type)       lines.push(`Type: ${data.Type}`);
  if (data.ItemType)   lines.push(`Item Type: ${data.ItemType}`);
  lines.push(`Rarity: ${data.Rarity}`);
  lines.push(`Cost: ${data.Cost}`);
  if (data.DamageDice && data.DamageType) {
    lines.push(`Damage: ${data.DamageDice} ${data.DamageType}`);
  }
  if (data.ArmorClass) lines.push(`Armor Class: ${data.ArmorClass}`);
  if (data.Attunement) lines.push(`Attunement: ${data.Attunement}`);
  if (data.Charges)    lines.push(`Charges: ${data.Charges}`);
  lines.push(`Weight: ${data.Weight}`);

  // safe-guard against undefined
  const props = Array.isArray(data.Properties) ? data.Properties : [];
  if (props.length > 0) {
    lines.push(`Properties:`);
    for (const p of props) {
      lines.push(`  • ${p}`);
    }
  }

  lines.push(`Description: ${data.Description}`);
  return lines.join(`\n`);
}

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
          <button className="copy-button"
            onClick={() => {
              navigator.clipboard.writeText(formatPlainText(data));
            }}
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