import React from 'react';

interface Props {
  firstName: string;
  lastName: string;
  name: string;
  position: string;
  avatar: string;
  loading: boolean;
  error: string | null;
  displayExample: string;
  onChangeFirst: (v: string) => void;
  onChangeLast: (v: string) => void;
  onChangeName: (v: string) => void;
  onChangePosition: (v: string) => void;
  onSave: () => void;
}

export default function ProfileForm(props: Props) {
  const {
    firstName, lastName, name, position, avatar, loading, error, displayExample,
    onChangeFirst, onChangeLast, onChangeName, onChangePosition, onSave
  } = props;

  return (
    <div className="w-full">
      <div className="mb-6 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Public Profile</h2>
        <p className="text-sm text-gray-500 mt-1">ข้อมูลนี้จะแสดงบนเรซูเม่ของคุณ</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">ชื่อจริง</label>
            <input value={firstName} onChange={(e) => onChangeFirst(e.target.value)} placeholder="เช่น นริน" className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">นามสกุล</label>
            <input value={lastName} onChange={(e) => onChangeLast(e.target.value)} placeholder="เช่น ชัยยาพร" className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">ชื่อที่แสดง (สาธารณะ)</label>
          <input value={name} onChange={(e) => onChangeName(e.target.value)} placeholder={displayExample} className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg" />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">ตำแหน่งปัจจุบัน</label>
          <input value={position} onChange={(e) => onChangePosition(e.target.value)} placeholder="เช่น Front-end Developer" className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg" />
        </div>

        <div className="pt-3 flex justify-end">
          <div>
            <button onClick={onSave} disabled={loading} className="inline-flex items-center justify-center px-6 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-full shadow transition-all active:scale-95 disabled:opacity-70">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            {error && <p className="mt-2 text-sm text-red-500 text-right">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
