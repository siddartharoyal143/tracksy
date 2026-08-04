import React, { useState } from 'react';
import { X, Shield, Lock, Fingerprint, CheckCircle2 } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [pinEnabled, setPinEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Security & Privacy
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                App lock & biometric authentication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {/* PIN Lock */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="font-bold text-xs text-slate-800">Passcode PIN</p>
                <p className="text-[11px] text-slate-500">
                  Require 4-digit PIN on app open
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={pinEnabled}
              onChange={(e) => setPinEnabled(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </div>

          {/* Biometrics */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-bold text-xs text-slate-800">
                  Fingerprint / FaceID
                </p>
                <p className="text-[11px] text-slate-500">
                  Unlock using biometric sensor
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={biometricsEnabled}
              onChange={(e) => setBiometricsEnabled(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded"
            />
          </div>

          {/* Privacy Mode */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-bold text-xs text-slate-800">
                  Hide Balances Mode
                </p>
                <p className="text-[11px] text-slate-500">
                  Mask exact figures in public view
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={privacyMode}
              onChange={(e) => setPrivacyMode(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded"
            />
          </div>
        </div>

        <div className="pt-2 text-center text-xs text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto mb-1 inline" />{' '}
          Tracksy uses 256-bit encryption for local data security.
        </div>
      </div>
    </div>
  );
};
