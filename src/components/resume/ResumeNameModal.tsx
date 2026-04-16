import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ResumeNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (resumeName: string) => Promise<void>;
  isLoading?: boolean;
}

export default function ResumeNameModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ResumeNameModalProps) {
  const [resumeName, setResumeName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setError('');

    if (!resumeName.trim()) {
      setError('กรุณาใส่ชื่อเรซูเม่');
      return;
    }

    try {
      await onConfirm(resumeName.trim());
      setResumeName('');
      onClose();
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้างเรซูเม่';
      const message = /not authenticated|please login again|invalid token/i.test(rawMessage)
        ? 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่'
        : rawMessage;
      setError(message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleConfirm();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        background: 'rgba(17, 24, 39, 0.18)',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        className="bg-white rounded-xl shadow-lg"
        style={{
          width: 'min(560px, calc(100vw - 32px))',
          padding: '24px',
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Resume</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Resume Name Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Resume Name
          </label>
          <input
            type="text"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. My Professional Resume, Developer CV"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            autoFocus
          />
          <p className="text-sm text-gray-500 mt-1">
            This name helps you organize your resumes and choose a template on the next page.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !resumeName.trim()}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
