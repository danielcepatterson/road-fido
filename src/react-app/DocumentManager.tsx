import { useState, useRef } from "react";

export type Document = {
  id: string;
  date: string;
  type: 'pdf' | 'photo' | 'camera';
  name: string;
  data: string; // base64 or blob URL
  thumbnail?: string;
};

interface DocumentManagerProps {
  date: string;
  documents: Document[];
  onAddDocument: (doc: Document) => void;
  onRemoveDocument: (docId: string) => void;
}

export function DocumentManager({ date, documents, onAddDocument, onRemoveDocument }: DocumentManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const dayDocuments = documents.filter(doc => doc.date === date);

  // Handle file upload (PDF, Photos)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'photo') => {
    const files = e.currentTarget.files;
    if (!files) return;

    for (const file of files) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = event.target?.result as string;
        const doc: Document = {
          id: `${Date.now()}-${Math.random()}`,
          date,
          type,
          name: file.name,
          data,
          thumbnail: type === 'photo' ? data : undefined, // Use original for photo thumbnails
        };
        onAddDocument(doc);
      };
      reader.readAsDataURL(file);
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div style={{ marginTop: 8 }}>
      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: '4px 8px',
          fontSize: 11,
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          width: '100%',
        }}
      >
        📎 {dayDocuments.length} Docs
      </button>

      {/* Document List */}
      {dayDocuments.length > 0 && (
        <div style={{ marginTop: 6, fontSize: 10 }}>
          {dayDocuments.map(doc => (
            <div key={doc.id} style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 2 }}>
              <span title={doc.name} style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {doc.type === 'pdf' ? '📄' : '📷'} {doc.name.substring(0, 12)}...
              </span>
              <button
                onClick={() => onRemoveDocument(doc.id)}
                style={{
                  padding: '2px 4px',
                  fontSize: 10,
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: 2,
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: '#222',
              padding: 20,
              borderRadius: 8,
              maxWidth: 500,
              width: '90%',
              color: '#fff',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Add Documents for {date}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Upload Photo */}
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
              >
                📷 Upload Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={e => handleFileSelect(e, 'photo')}
                style={{ display: 'none' }}
              />

              {/* Take Photo */}
              <button
                onClick={() => cameraInputRef.current?.click()}
                style={{
                  padding: '12px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
              >
                📸 Take Photo
              </button>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={e => handleFileSelect(e, 'photo')}
                style={{ display: 'none' }}
              />

              {/* Upload PDF */}
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.pdf,application/pdf';
                  input.multiple = true;
                  input.onchange = (e: any) => {
                    const files = e.target.files;
                    if (!files) return;
                    for (const file of files) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const data = event.target?.result as string;
                        const doc: Document = {
                          id: `${Date.now()}-${Math.random()}`,
                          date,
                          type: 'pdf',
                          name: file.name,
                          data,
                        };
                        onAddDocument(doc);
                      };
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
                style={{
                  padding: '12px',
                  backgroundColor: '#fd7e14',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
              >
                📄 Upload PDF
              </button>

              {/* Display current documents */}
              {dayDocuments.length > 0 && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #444' }}>
                  <h4 style={{ marginTop: 0 }}>Documents for {date}:</h4>
                  <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                    {dayDocuments.map(doc => (
                      <div
                        key={doc.id}
                        style={{
                          display: 'flex',
                          gap: 10,
                          alignItems: 'center',
                          padding: 8,
                          backgroundColor: '#333',
                          marginBottom: 6,
                          borderRadius: 4,
                        }}
                      >
                        {doc.thumbnail && (
                          <img
                            src={doc.thumbnail}
                            alt={doc.name}
                            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 3 }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12 }}>{doc.name}</div>
                          <div style={{ fontSize: 10, color: '#aaa' }}>
                            {doc.type === 'pdf' ? 'PDF' : 'Photo'} ({Math.round(doc.data.length / 1024)} KB)
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveDocument(doc.id)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: 2,
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '12px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
