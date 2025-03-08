import React from 'react';
import { Signature, SelectedSignature } from '../types/index';

interface SignatureListProps {
  signatures: Signature[];
  selectedSignature: SelectedSignature | null;
  onSelectSignature: (signature: Signature, index: number) => void;
}

const SignatureList: React.FC<SignatureListProps> = ({ 
  signatures, 
  selectedSignature, 
  onSelectSignature 
}) => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Signatures</h2>
      
      <div className="space-y-3">
        {signatures.map((signature, index) => (
          <div 
            key={index}
            className={`bg-white rounded-lg border-2 overflow-hidden ${
              selectedSignature?.index === index 
                ? 'border-primary-500' 
                : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-center border-b p-3">
              <h3 className="font-medium">Signature {index + 1}</h3>
              <button
                onClick={() => onSelectSignature(signature, index)}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  selectedSignature?.index === index
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
                }`}
              >
                {selectedSignature?.index === index ? 'Selected' : 'Use in Gmail'}
              </button>
            </div>
            <div 
              className="signature-preview p-3 max-h-36 overflow-auto text-sm"
              dangerouslySetInnerHTML={{ __html: signature.html }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignatureList;