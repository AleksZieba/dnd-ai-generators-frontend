import React from 'react';
import './ResponseModal.css';

interface ResponseModalProps {
  content: string;
  onClose: () => void;
}

const ResponseModal: React.FC<ResponseModalProps> = ({ content, onClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Generated Gear</h3>
        <pre className="modal-content">{content}</pre>
        <div className="modal-buttons">
          <button onClick={handleCopy}>Copy</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;