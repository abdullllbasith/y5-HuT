import React from 'react';
import { CreditCard, Building, Banknote } from 'lucide-react';
import { Button } from '../ui/Button';

interface CheckoutPaymentStepProps {
  paymentMethod: 'card' | 'koko' | 'mintpay' | 'cod' | 'corporate-invoice';
  setPaymentMethod: (m: 'card' | 'koko' | 'mintpay' | 'cod' | 'corporate-invoice') => void;
  cardNumber: string;
  setCardNumber: (v: string) => void;
  cardExpiry: string;
  setCardExpiry: (v: string) => void;
  cardCvv: string;
  setCardCvv: (v: string) => void;
  poNumber: string;
  setPoNumber: (v: string) => void;
  customerCompany: string;
  customerName: string;
  totalLKR: number;
  totalUSD: number;
  cartSubtotalLKR: number;
  cartSubtotalUSD: number;
  shippingCostLKR: number;
  shippingCostUSD: number;
  currency: 'LKR' | 'USD';
  formatPrice: (lkr: number, usd: number) => string;
  isProcessing: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CheckoutPaymentStep: React.FC<CheckoutPaymentStepProps> = ({
  paymentMethod,
  setPaymentMethod,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  poNumber,
  setPoNumber,
  customerCompany,
  customerName,
  totalLKR,
  totalUSD,
  cartSubtotalLKR,
  cartSubtotalUSD,
  shippingCostLKR,
  shippingCostUSD,
  currency,
  formatPrice,
  isProcessing,
  onBack,
  onSubmit,
}) => {
  const installmentThirdLKR = Math.round(totalLKR / 3);
  const installmentThirdUSD = Math.round(totalUSD / 3);

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-left font-ui">
      <div>
        <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
          Select Payment Method
        </h3>
        <p className="font-ui text-xs text-ink-soft mt-0.5">
          Choose 0% interest installments, online debit/credit card, Cash on Delivery, or Net-30 invoice.
        </p>
      </div>

      {/* 5 Payment Methods as large selectable tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {/* Koko */}
        <button
          type="button"
          onClick={() => setPaymentMethod('koko')}
          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer min-h-[72px] ${
            paymentMethod === 'koko'
              ? 'border-ink bg-card shadow-hard-sm ring-2 ring-ink'
              : 'border-line bg-paper hover:bg-paper-sunk'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-display font-bold text-xs text-ink">Koko</span>
            <span className="font-data text-[9px] bg-red text-white font-bold px-1.5 py-0.2 rounded">
              0% INT
            </span>
          </div>
          <span className="font-ui text-[10px] text-ink-soft leading-tight">
            3 installments with Debit Card
          </span>
        </button>

        {/* Mintpay */}
        <button
          type="button"
          onClick={() => setPaymentMethod('mintpay')}
          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer min-h-[72px] ${
            paymentMethod === 'mintpay'
              ? 'border-ink bg-card shadow-hard-sm ring-2 ring-ink'
              : 'border-line bg-paper hover:bg-paper-sunk'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-display font-bold text-xs text-ink">Mintpay</span>
            <span className="font-data text-[9px] bg-go text-white font-bold px-1.5 py-0.2 rounded">
              0% INT
            </span>
          </div>
          <span className="font-ui text-[10px] text-ink-soft leading-tight">
            Pay in 3 with debit / credit
          </span>
        </button>

        {/* Online Card */}
        <button
          type="button"
          onClick={() => setPaymentMethod('card')}
          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer min-h-[72px] ${
            paymentMethod === 'card'
              ? 'border-ink bg-card shadow-hard-sm ring-2 ring-ink'
              : 'border-line bg-paper hover:bg-paper-sunk'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <CreditCard className="w-4 h-4 text-ink" />
            <span className="font-data text-[9px] text-ink-soft">VISA/MC</span>
          </div>
          <span className="font-display font-bold text-xs text-ink">Card Payment</span>
          <span className="font-ui text-[10px] text-ink-soft leading-tight">
            Debit / Credit Card
          </span>
        </button>

        {/* Cash on Delivery */}
        <button
          type="button"
          onClick={() => setPaymentMethod('cod')}
          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer min-h-[72px] ${
            paymentMethod === 'cod'
              ? 'border-ink bg-card shadow-hard-sm ring-2 ring-ink'
              : 'border-line bg-paper hover:bg-paper-sunk'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <Banknote className="w-4 h-4 text-go" />
            <span className="font-data text-[9px] bg-paper-sunk text-ink px-1 rounded border border-line">
              CASH
            </span>
          </div>
          <span className="font-display font-bold text-xs text-ink">Cash on Delivery</span>
          <span className="font-ui text-[10px] text-ink-soft leading-tight">
            Pay driver at doorstep
          </span>
        </button>

        {/* Corporate Invoice */}
        <button
          type="button"
          onClick={() => setPaymentMethod('corporate-invoice')}
          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer min-h-[72px] ${
            paymentMethod === 'corporate-invoice'
              ? 'border-ink bg-card shadow-hard-sm ring-2 ring-ink'
              : 'border-line bg-paper hover:bg-paper-sunk'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <Building className="w-4 h-4 text-ink" />
            <span className="font-data text-[9px] bg-paper-sunk text-ink font-bold px-1 rounded border border-line">
              B2B
            </span>
          </div>
          <span className="font-display font-bold text-xs text-ink">Net-30 Invoice</span>
          <span className="font-ui text-[10px] text-ink-soft leading-tight">
            Corporate PO purchase
          </span>
        </button>
      </div>

      {/* Dynamic Payment Details */}
      {paymentMethod === 'koko' && (
        <div className="p-4 bg-card rounded-2xl border border-line space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-ink">
            <span className="text-red">Koko 3-Month Plan Breakdown:</span>
            <span className="font-data text-go font-extrabold">0% Extra Fees</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <div className="bg-paper p-2.5 rounded-xl border border-line">
              <div className="font-data text-[10px] text-ink-soft">Today</div>
              <div className="font-data font-bold text-ink">
                {currency === 'LKR' ? `Rs. ${installmentThirdLKR.toLocaleString('en-LK')}` : `$${installmentThirdUSD}`}
              </div>
            </div>
            <div className="bg-paper p-2.5 rounded-xl border border-line">
              <div className="font-data text-[10px] text-ink-soft">Day 30</div>
              <div className="font-data font-bold text-ink">
                {currency === 'LKR' ? `Rs. ${installmentThirdLKR.toLocaleString('en-LK')}` : `$${installmentThirdUSD}`}
              </div>
            </div>
            <div className="bg-paper p-2.5 rounded-xl border border-line">
              <div className="font-data text-[10px] text-ink-soft">Day 60</div>
              <div className="font-data font-bold text-ink">
                {currency === 'LKR' ? `Rs. ${installmentThirdLKR.toLocaleString('en-LK')}` : `$${installmentThirdUSD}`}
              </div>
            </div>
          </div>
          <p className="font-ui text-[11px] text-ink-soft">
            Your debit card will only be charged the first installment today.
          </p>
        </div>
      )}

      {paymentMethod === 'card' && (
        <div className="p-4 bg-card rounded-2xl border border-line space-y-3">
          <div>
            <label className="block font-data text-[11px] font-bold uppercase text-ink-soft mb-1">
              Debit / Credit Card Number
            </label>
            <input
              type="text"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full text-xs font-data px-3.5 py-2.5 bg-paper border border-line rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-data text-[11px] font-bold uppercase text-ink-soft mb-1">
                Expiry Date (MM/YY)
              </label>
              <input
                type="text"
                required
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                className="w-full text-xs font-data px-3.5 py-2.5 bg-paper border border-line rounded-xl"
              />
            </div>
            <div>
              <label className="block font-data text-[11px] font-bold uppercase text-ink-soft mb-1">
                CVV Code
              </label>
              <input
                type="password"
                required
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                className="w-full text-xs font-data px-3.5 py-2.5 bg-paper border border-line rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'cod' && (
        <div className="p-4 bg-card rounded-2xl border border-line text-xs text-ink space-y-1">
          <h4 className="font-bold text-ink">Cash on Delivery (Islandwide)</h4>
          <p className="text-ink-soft leading-relaxed">
            Please prepare exact cash of{' '}
            <strong className="text-ink font-data font-bold">
              {formatPrice(totalLKR, totalUSD)}
            </strong>{' '}
            for the courier officer. You will receive an SMS prior to arrival.
          </p>
        </div>
      )}

      {paymentMethod === 'corporate-invoice' && (
        <div className="p-4 bg-card rounded-2xl border border-line space-y-2">
          <label className="block font-data text-[11px] font-bold uppercase text-ink-soft">
            Corporate PO Number
          </label>
          <input
            type="text"
            required
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
            className="w-full text-xs font-data px-3.5 py-2.5 bg-paper border border-line rounded-xl"
          />
          <p className="font-ui text-[11px] text-ink-soft">
            Net-30 invoice will be recorded for <strong>{customerCompany || customerName}</strong>.
          </p>
        </div>
      )}

      {/* Order Totals Summary */}
      <div className="bg-card p-4 rounded-2xl border border-line space-y-1.5 text-xs font-ui">
        <div className="flex justify-between text-ink-soft">
          <span>Counter Hardware Subtotal:</span>
          <span className="font-data font-bold text-ink">
            {formatPrice(cartSubtotalLKR, cartSubtotalUSD)}
          </span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>Islandwide Delivery:</span>
          <span className="font-data font-bold text-go">
            {shippingCostLKR === 0 ? 'FREE' : formatPrice(shippingCostLKR, shippingCostUSD)}
          </span>
        </div>
        <div className="border-t border-line pt-2 flex justify-between font-bold text-sm text-ink">
          <span>Total Payable:</span>
          <span className="font-data text-red text-base font-bold">
            {formatPrice(totalLKR, totalUSD)}
          </span>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between pt-3 border-t border-line">
        <button
          type="button"
          onClick={onBack}
          className="font-ui text-xs font-bold text-ink-soft hover:text-ink cursor-pointer px-3 min-h-[44px]"
        >
          &larr; Back to Address
        </button>
        <Button
          type="submit"
          variant="primary"
          disabled={isProcessing}
          isLoading={isProcessing}
        >
          {isProcessing ? 'Processing Order...' : `Confirm Order · ${formatPrice(totalLKR, totalUSD)}`}
        </Button>
      </div>
    </form>
  );
};
