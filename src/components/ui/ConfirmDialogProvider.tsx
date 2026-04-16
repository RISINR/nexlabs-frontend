import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

type ConfirmTone = 'default' | 'danger';

type ConfirmDialogOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: ConfirmTone;
};

type ConfirmDialogState = ConfirmDialogOptions & {
  resolve: (value: boolean) => void;
};

type ConfirmDialogContextValue = (options: ConfirmDialogOptions) => Promise<boolean>;

const ConfirmDialogContext = createContext<ConfirmDialogContextValue | null>(null);

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [dialogState, setDialogState] = useState<ConfirmDialogState | null>(null);

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        ...options,
        resolve,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        tone: options.tone || 'default',
      });
    });
  }, []);

  const handleClose = useCallback((confirmed: boolean) => {
    setDialogState((prev) => {
      if (prev) prev.resolve(confirmed);
      return null;
    });
  }, []);

  useEffect(() => {
    if (!dialogState) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose(false);
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [dialogState, handleClose]);

  const contextValue = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmDialogContext.Provider value={contextValue}>
      {children}

      {dialogState && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          onMouseDown={() => handleClose(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(15, 23, 42, 0.45)',
          }}
        >
          <div
            onMouseDown={(event) => event.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 460,
              borderRadius: 16,
              background: '#ffffff',
              padding: 20,
              boxShadow: '0 24px 60px rgba(2, 6, 23, 0.35)',
              border: '1px solid #e5e7eb',
            }}
          >
            <h3
              id="confirm-dialog-title"
              style={{
                margin: 0,
                fontSize: 20,
                lineHeight: 1.2,
                fontWeight: 700,
                color: '#111827',
              }}
            >
              {dialogState.title}
            </h3>

            {dialogState.description && (
              <p style={{ marginTop: 8, marginBottom: 0, fontSize: 14, lineHeight: 1.5, color: '#4b5563' }}>
                {dialogState.description}
              </p>
            )}

            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                type="button"
                onClick={() => handleClose(false)}
                style={{
                  borderRadius: 10,
                  border: '1px solid #d1d5db',
                  background: '#ffffff',
                  color: '#374151',
                  padding: '10px 14px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {dialogState.cancelText}
              </button>

              <button
                type="button"
                onClick={() => handleClose(true)}
                style={{
                  borderRadius: 10,
                  border: 'none',
                  background: dialogState.tone === 'danger' ? '#dc2626' : '#111827',
                  color: '#ffffff',
                  padding: '10px 14px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {dialogState.confirmText}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirmDialog must be used within ConfirmDialogProvider');
  }
  return context;
}
