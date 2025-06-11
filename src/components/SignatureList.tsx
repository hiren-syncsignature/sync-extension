import { useEffect } from "react";
import type { Signature, SelectedSignature } from "../types";

interface SignatureListProps {
  signatures: Signature[];
  selectedSignature: SelectedSignature | null;
  onSelectSignature: (signature: Signature, index: number) => void;
  setStatusMessage?: (message: { text: string; type: "success" | "info" | "error" } | null) => void;
}

const SignatureList = ({
  signatures,
  selectedSignature,
  onSelectSignature,
  setStatusMessage,
}: SignatureListProps) => {
  const isSelected = (index: number) => {
    return selectedSignature?.index === index;
  };
  const isSameSignatureContent = (sig1: string, sig2: string | undefined) => {
    return sig1 === sig2;
  };

  const handleCopySignature = async (signature: Signature) => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([signature.html], { type: 'text/html' })
        })
      ]);
      
      // Show toast notification
      setStatusMessage?.({
        text: "Signature copied to clipboard!",
        type: "success"
      });
      
    } catch (error) {
      setStatusMessage?.({
        text: "Failed to copy signature",
        type: "error"
      });
    }
  };

  const handleDownloadSignature = (signature: Signature, index: number) => {
    try {
      const blob = new Blob([signature.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `signature-${index + 1}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setStatusMessage?.({
        text: "Signature downloaded successfully!",
        type: "success"
      });
      
    } catch (error) {
      setStatusMessage?.({
        text: "Failed to download signature",
        type: "error"
      });
    }
  };

  useEffect(() => {
    const same = isSameSignatureContent(
      signatures[0]?.html,
      selectedSignature?.content
    );

    if (same) {
      return;
    }

    onSelectSignature(signatures[0], 0);
  }, [onSelectSignature, selectedSignature?.content, signatures]);

  return (
    <div className="signatures-container">
      <div className="signatures-list">
        {signatures.map((signature, index) => (
          <div
            key={index}
            className={`signature-card ${
              isSelected(index) ? "selected-card" : ""
            }`}
          >
            <div className="signature-header">
              <div className="signature-info">
                <h3 className="signature-name">Signature {index + 1}</h3>
                {isSelected(index) && (
                  <span className="active-badge">Active</span>
                )}
              </div>
              <div className="signature-actions flex gap-3">
                <button
                  className="download-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadSignature(signature, index);
                  }}
                  aria-label="Download signature"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7,10 12,15 17,10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                </button>
                <button
                  className="copy-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopySignature(signature);
                  }}
                  aria-label="Copy signature"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </button>
                <button
                  className="select-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSignature(signature, index);
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

            {/* Signature preview is always visible */}
            <div className="signature-preview w-full overflow-hidden rounded border border-gray-200 bg-white p-4 shadow-sm">
              <div
                className="signature-content-wrapper max-w-full font-sans text-sm leading-6 text-gray-700"
                style={{
                  fontSize: '11px',
                  lineHeight: '1.3'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: signature.html.replace(
                    /width="?\d+(?:px)?"?/gi, 'width="100%"'
                  ).replace(
                    /style="([^"]*?)width:\s*\d+(?:px)?([^"]*?)"/gi, 
                    'style="$1max-width: 100%$2"'
                  ).replace(
                    /<table/gi, 
                    '<table style="width: 100% !important; max-width: 100% !important; table-layout: fixed !important;"'
                  ).replace(
                    /<img([^>]*?)>/gi,
                    '<img$1 style="max-width: 60px !important; height: auto !important;">'
                  )
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignatureList;