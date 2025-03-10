
import { useState } from "react"
import type { Signature, SelectedSignature } from "../types"

interface SignatureListProps {
  signatures: Signature[]
  selectedSignature: SelectedSignature | null
  onSelectSignature: (signature: Signature, index: number) => void
}

const SignatureList = ({ signatures, selectedSignature, onSelectSignature }: SignatureListProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const isSelected = (index: number) => {
    return selectedSignature?.index === index
  }

  return (
    <div className="signatures-container">
      <h2 className="signatures-title">Your Signatures</h2>
      <div className="signatures-list">
        {signatures.map((signature, index) => (
          <div
            key={index}
            className={`signature-card ${isSelected(index) ? "selected-card" : ""} ${expandedIndex === index ? "expanded" : ""}`}
            onClick={() => toggleExpand(index)}
          >
            <div className="signature-header">
              <div className="signature-info">
                <h3 className="signature-name">Signature {index + 1}</h3>
                {isSelected(index) && <span className="active-badge">Active</span>}
              </div>
              <div className="signature-actions">
                <button
                  className="preview-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleExpand(index)
                  }}
                  aria-label={expandedIndex === index ? "Hide signature" : "Show signature"}
                >
                  {expandedIndex === index ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </button>
                <button
                  className="select-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectSignature(signature, index)
                  }}
                  aria-label="Select signature"
                >
                  {isSelected(index) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <path d="M22 4 12 14.01l-3-3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {expandedIndex === index && (
              <div className="signature-preview animate-fade-in">
                <div className="signature-content-wrapper" dangerouslySetInnerHTML={{ __html: signature.html }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SignatureList

