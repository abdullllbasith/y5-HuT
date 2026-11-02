import React from 'react';
import { Order } from '../../types';
import { Mail, CheckCircle, Package } from 'lucide-react';
import { Dot } from '../ui/Dot';
import { Button } from '../ui/Button';
import { useStore } from '../../context/StoreContext';

interface CheckoutConfirmationStepProps {
  order: Order;
  onClose: () => void;
}

export const CheckoutConfirmationStep: React.FC<CheckoutConfirmationStepProps> = ({
  order,
  onClose,
}) => {
  const { setPreviewingEmail, setIsCartOpen, setActiveView } = useStore();

  const handleInspectEmail = () => {
    const emailAlert = {
      id: `confirm-${order.id}`,
      type: 'milestone' as const,
      title: `y5Hut.lk Order Confirmation #${order.id}`,
      message: `DEMO order. Simulated ${order.paymentMethod} payment, no money taken.`,
      timestamp: 'Just now',
      read: true,
      orderId: order.id,
      emailSubject: `y5Hut.lk Order #${order.id} Confirmed`,
      emailBodyHtml: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #E2E8F0; border-radius: 8px;">
          <h2 style="color: #E11D48; margin: 0 0 10px 0;">y5<span style="color: #0F172A;">Hut</span>.lk Sri Lanka</h2>
          <p>Thank you for shopping with us, <strong>${order.customerName}</strong>!</p>
          <p>Total: <strong>${order.currency === 'LKR' ? `Rs. ${order.totalLKR.toLocaleString()}` : `$${order.totalUSD.toLocaleString()}`}</strong></p>
          <p>Your hardware items have passed serial verification and are being packed for courier handover from y5Hut.lk Colombo central hub.</p>
        </div>
      `,
    };
    setPreviewingEmail(emailAlert);
  };

  return (
    <div className="space-y-6 text-left font-ui">
      {/* Stamp Animation & Notification Box */}
      <div className="relative p-5 bg-card rounded-2xl border border-line shadow-hard-sm overflow-hidden">
        {/* Slanted Stamp */}
        <div className="absolute top-4 right-4 rotate-[-12deg] pointer-events-none border-2 border-go text-go px-2.5 py-1 rounded font-data text-xs font-black uppercase tracking-widest bg-card/90">
          CONFIRMED · SAMPLE
        </div>

        <div className="flex items-start gap-3.5 pr-28">
          <div className="w-10 h-10 rounded-full bg-go/15 border border-go/30 flex items-center justify-center shrink-0 text-go">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base text-ink">
              Order Recorded on Counter!
            </h3>
            <p className="font-data text-xs text-ink-soft">
              Reference: <strong className="text-ink font-bold">{order.id}</strong>
            </p>
            <p className="text-xs text-ink-soft">
              Simulated dispatch notification generated for{' '}
              <strong className="text-ink">{order.customerEmail}</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Milestone Tracking Stepper: Vertical Dot Timeline */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-red" />
          <h4 className="font-data text-xs uppercase font-bold tracking-wider text-ink-soft">
            Simulated Delivery Milestones
          </h4>
        </div>

        <div className="space-y-2.5 relative pl-4 border-l-2 border-line">
          {order.milestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 relative transition-all ${
                m.completed
                  ? 'bg-card border-line shadow-2xs'
                  : 'bg-paper border-line/40 opacity-50'
              }`}
            >
              {/* Dot on Timeline line */}
              <div
                className={`absolute -left-[23px] top-4 w-3 h-3 rounded-full border-2 border-paper ${
                  m.completed ? 'bg-red' : 'bg-line'
                }`}
              />

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-ui font-bold text-ink">{m.label}</span>
                  <span className="font-data text-[10px] text-ink-soft">{m.timestamp}</span>
                </div>
                <p className="font-ui text-ink-soft text-[11px] mt-0.5">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleInspectEmail}
          className="px-4 py-2.5 border border-line bg-card hover:bg-paper-sunk rounded-full text-xs font-bold text-ink flex items-center gap-2 cursor-pointer transition-colors min-h-[44px]"
        >
          <Mail className="w-4 h-4 text-red" />
          <span>Inspect Sample Dispatched Email</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
              setIsCartOpen(false);
              setActiveView('admin');
            }}
          >
            View in Owner Console
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              onClose();
              setIsCartOpen(false);
            }}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
