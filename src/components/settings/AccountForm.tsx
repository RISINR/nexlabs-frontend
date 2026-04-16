import React from 'react';

interface Props {
  email: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
  error: string | null;
  githubConnected: boolean;
  githubSSOConnected: boolean;
  onChangeEmail: (v: string) => void;
  onChangePassword: (v: string) => void;
  onChangeConfirm: (v: string) => void;
  onSave: () => void;
  onConnectGitHub: () => void;
  onDisconnectGitHub: () => void;
  onConnectGitHubSSO: () => void;
  onDisconnectGitHubSSO: () => void;
}

export default function AccountForm(props: Props) {
  const {
    email, password, confirmPassword, loading, error,
    githubConnected, githubSSOConnected,
    onChangeEmail, onChangePassword, onChangeConfirm, onSave,
    onConnectGitHub, onDisconnectGitHub, onConnectGitHubSSO, onDisconnectGitHubSSO
  } = props;

  return (
    <div className="w-full">
      <div className="mb-6 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Account Security</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your login credentials.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">อีเมล</label>
          <input value={email} onChange={(e) => onChangeEmail(e.target.value)} placeholder="เช่น you@company.com" className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">รหัสผ่านใหม่</label>
            <input type="password" value={password} onChange={(e) => onChangePassword(e.target.value)} placeholder="••••••••" className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">ยืนยันรหัสผ่าน</label>
            <input type="password" value={confirmPassword} onChange={(e) => onChangeConfirm(e.target.value)} placeholder="••••••••" className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg" />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-2">Linked Accounts</p>
          <div className="flex gap-2">
            <button className="flex-1 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Google</button>

            {githubConnected ? (
              <button onClick={onDisconnectGitHub} className="flex-1 py-2 border border-red-200 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">Disconnect GitHub</button>
            ) : (
              <button onClick={onConnectGitHub} className="flex-1 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Connect GitHub</button>
            )}

            {githubSSOConnected ? (
              <button onClick={onDisconnectGitHubSSO} className="flex-1 py-2 border border-red-200 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">Disconnect (University SSO)</button>
            ) : (
              <button onClick={onConnectGitHubSSO} className="flex-1 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Connect (University SSO)</button>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <div>
            <button onClick={onSave} disabled={loading} className="inline-flex items-center justify-center px-6 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-full shadow transition-all active:scale-95 disabled:opacity-70">
              {loading ? 'Updating...' : 'Update Account'}
            </button>
            {error && <p className="mt-2 text-sm text-red-500 text-right">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
