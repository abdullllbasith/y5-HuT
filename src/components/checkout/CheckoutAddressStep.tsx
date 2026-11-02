import React from 'react';
import { Button } from '../ui/Button';

interface CheckoutAddressStepProps {
  customerName: string;
  setCustomerName: (v: string) => void;
  customerEmail: string;
  setCustomerEmail: (v: string) => void;
  customerPhone: string;
  setCustomerPhone: (v: string) => void;
  customerCompany: string;
  setCustomerCompany: (v: string) => void;
  street: string;
  setStreet: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  district: string;
  setDistrict: (v: string) => void;
  postalCode: string;
  setPostalCode: (v: string) => void;
  notifyEmail: boolean;
  setNotifyEmail: (v: boolean) => void;
  notifySms: boolean;
  setNotifySms: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const CheckoutAddressStep: React.FC<CheckoutAddressStepProps> = ({
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
  customerPhone,
  setCustomerPhone,
  customerCompany,
  setCustomerCompany,
  street,
  setStreet,
  city,
  setCity,
  district,
  setDistrict,
  postalCode,
  setPostalCode,
  notifyEmail,
  setNotifyEmail,
  notifySms,
  setNotifySms,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 text-left font-ui">
      <div>
        <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
          Islandwide Dispatch Address
        </h3>
        <p className="font-ui text-xs text-ink-soft mt-0.5">
          Demo checkout preview: no courier is booked and no external messages are transmitted.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block font-data text-[11px] font-bold uppercase text-ink-soft mb-1">
            Recipient Name
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 bg-paper border border-line rounded-xl focus:border-ink focus:outline-none"
          />
        </div>
        <div>
          <label className="block font-data text-[11px] font-bold uppercase text-ink-soft mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 bg-paper border border-line rounded-xl focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block font-data text-[11px] font-bold uppercase text-ink-soft mb-1">
            Mobile Phone (Courier Contact)
          </label>
          <input
            type="tel"
            required
            placeholder="+94 77 000 0000"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 bg-paper border border-line rounded-xl focus:border-ink focus:outline-none font-data"
          />
        </div>
        <div>
          <label className="block font-data text-[11px] font-bold uppercase text-ink-soft mb-1">
            Company / Business (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Sample Tech Ltd"
            value={customerCompany}
            onChange={(e) => setCustomerCompany(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 bg-paper border border-line rounded-xl focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block font-data text-[11px] font-bold uppercase text-ink-soft mb-1">
          Delivery Street Address
        </label>
        <input
          type="text"
          required
          placeholder="House/Building No., Street Name, Floor"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="w-full text-xs px-3.5 py-2.5 bg-paper border border-line rounded-xl focus:border-ink focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block font-data text-[10px] font-bold uppercase text-ink-soft mb-1">
            City / Town
          </label>
          <input
            type="text"
            required
            placeholder="Colombo 04"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full text-xs px-3 py-2.5 bg-paper border border-line rounded-xl focus:border-ink focus:outline-none"
          />
        </div>
        <div>
          <label className="block font-data text-[10px] font-bold uppercase text-ink-soft mb-1">
            District
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full text-xs px-2 py-2.5 bg-paper border border-line rounded-xl cursor-pointer"
          >
            <option value="Colombo">Colombo</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Kalutara">Kalutara</option>
            <option value="Kandy">Kandy</option>
            <option value="Galle">Galle</option>
            <option value="Kurunegala">Kurunegala</option>
            <option value="Matara">Matara</option>
            <option value="Jaffna">Jaffna</option>
          </select>
        </div>
        <div>
          <label className="block font-data text-[10px] font-bold uppercase text-ink-soft mb-1">
            Postal Code
          </label>
          <input
            type="text"
            required
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full text-xs px-3 py-2.5 bg-paper border border-line rounded-xl font-data focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="pt-2 border-t border-line space-y-2 text-xs text-ink-soft">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.checked)}
            className="rounded text-red accent-red"
          />
          <span>Send dispatch milestone receipts via Email</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={notifySms}
            onChange={(e) => setNotifySms(e.target.checked)}
            className="rounded text-red accent-red"
          />
          <span>Send courier waybill tracking alerts via SMS</span>
        </label>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between pt-4 border-t border-line">
        <button
          type="button"
          onClick={onCancel}
          className="font-ui text-xs font-bold text-ink-soft hover:text-ink cursor-pointer min-h-[44px] px-3"
        >
          Cancel
        </button>
        <Button type="submit" variant="primary">
          Proceed to Payment Options &rarr;
        </Button>
      </div>
    </form>
  );
};
