import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Mail, Bell, Check, Eye } from 'lucide-react';
import { NotificationAlert } from '../../types';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    previewingEmail,
    setPreviewingEmail,
    triggerNotification,
  } = useStore();

  if (!isNotificationOpen) return null;

  const handleSimulateRealtimeTask = () => {
    triggerNotification(
      'task',
      'Logistics Dispatch Milestone Reached',
      'FedEx Express courier scan recorded at JFK Gateway. Priority overnight package in transit.',
      'YH-89410',
      'Courier Scan Event: Package In Transit',
      `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #E2E8F0; border-radius: 8px;">
          <h3 style="color: #D31015; margin: 0 0 10px 0;">y5 HuT Live Tracking Update</h3>
          <p style="font-size: 14px; color: #334155;">Package #YH-89410 has cleared the regional staging facility and has been assigned to flight FX-1049.</p>
          <div style="background-color: #F8FAFC; padding: 12px; border-radius: 6px; margin: 15px 0; font-size: 13px;">
            <strong>Estimated Arrival:</strong> Today by 18:00 EST<br/>
            <strong>Destination:</strong> Vance Capital Partners, New York
          </div>
        </div>
      `
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs">
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-[#D31015]" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Notifications &amp; Alerts
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  title="Mark all as read"
                >
                  Mark all read
                </button>
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Test Trigger Strip */}
            <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Channel: Push + Email Gateway</span>
              <button
                onClick={handleSimulateRealtimeTask}
                className="text-[#D31015] hover:underline font-semibold cursor-pointer"
              >
                + Simulate Milestone Event
              </button>
            </div>

            {/* Notifications Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <p className="text-sm font-medium text-slate-600">No active alerts</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Order milestone updates, stock warnings, and team tasks will appear here in real-time.
                  </p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => markNotificationAsRead(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      item.read
                        ? 'bg-white border-slate-200'
                        : 'bg-red-50/20 border-red-200 ring-1 ring-red-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.message}
                    </p>

                    {item.emailBodyHtml && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#D31015]" />
                          <span>Automated email logged</span>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewingEmail(item);
                          }}
                          className="text-xs font-medium text-[#D31015] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect Email</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Push Status Info */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Web Push &amp; SMTP relay active</span>
              </span>
              <span className="font-mono">SSL 256-bit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Email Preview Modal */}
      {previewingEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Dispatched Email Notification Preview
                </span>
                <h4 className="text-sm font-semibold truncate max-w-md mt-0.5">
                  {previewingEmail.emailSubject || previewingEmail.title}
                </h4>
              </div>
              <button
                onClick={() => setPreviewingEmail(null)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-slate-50">
              <div
                className="bg-white p-6 rounded-lg shadow-xs border border-slate-200"
                dangerouslySetInnerHTML={{
                  __html:
                    previewingEmail.emailBodyHtml ||
                    `<p>${previewingEmail.message}</p>`,
                }}
              />
            </div>

            <div className="px-6 py-3 bg-white border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPreviewingEmail(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
