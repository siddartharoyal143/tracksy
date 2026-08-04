import React, { useState } from 'react';
import { X, Bell, Check, Trash2 } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Subscription Renewal Alert',
      body: 'Your Netflix subscription (₹89) renews in 3 days.',
      time: '2h ago',
      read: false,
    },
    {
      id: '2',
      title: 'Budget On Track',
      body: 'You have used less than 5% of your August budget!',
      time: '1d ago',
      read: true,
    },
    {
      id: '3',
      title: 'AI Insight Ready',
      body: 'Tap to view new financial predictions for this week.',
      time: '2d ago',
      read: true,
    },
  ]);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
              <p className="text-xs text-slate-500 font-medium">
                Bill reminders & smart updates
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

        {/* Action bar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={markAllAsRead}
              className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Mark all read
            </button>
            <button
              onClick={clearAll}
              className="text-rose-600 font-bold hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear all
            </button>
          </div>
        )}

        {/* Notification list */}
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">
              No new notifications.
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition ${
                  n.read
                    ? 'bg-slate-50/50 border-slate-200/60 opacity-75'
                    : 'bg-orange-50/50 border-orange-200/70 font-medium'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-xs text-slate-900">{n.title}</h3>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600">{n.body}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
