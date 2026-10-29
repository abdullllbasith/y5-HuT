import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import {
  X,
  CreditCard,
  Building,
  CheckCircle,
  Truck,
  Mail,
  Smartphone,
  Eye,
  Banknote,
} from 'lucide-react';

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const {
    cart,
    cartSubtotalLKR,
    cartSubtotalUSD,
    createOrder,
    currentUser,
    currency,
    formatPrice,
    setPreviewingEmail,
    setIsCartOpen,
    setActiveView,
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');

  // Shipping details (Sri Lankan standard address fields)
  const [customerName, setCustomerName] = useState(currentUser.name);
  const [customerEmail, setCustomerEmail] = useState(currentUser.email);
  const [customerPhone, setCustomerPhone] = useState('+94 77 341 9022');
  const [customerCompany, setCustomerCompany] = useState(currentUser.company || '');
  const [street, setStreet] = useState('No. 45/2, Galle Road, Bambalapitiya');
  const [city, setCity] = useState('Colombo 04');
  const [district, setDistrict] = useState('Colombo');
  const [postalCode, setPostalCode] = useState('00400');
  const [country, setCountry] = useState('Sri Lanka');

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<
    'card' | 'koko' | 'mintpay' | 'cod' | 'corporate-invoice'
  >('koko');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 1048');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCvv, setCardCvv] = useState('781');
  const [poNumber, setPoNumber] = useState('PO-LK-2026-9041');

  // Notifications toggle
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(true);

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCostLKR = cartSubtotalLKR >= 15000 ? 0 : 450;
  const shippingCostUSD = cartSubtotalUSD >= 50 ? 0 : 2;
  const totalLKR = cartSubtotalLKR + shippingCostLKR;
  const totalUSD = cartSubtotalUSD + shippingCostUSD;

  const installmentThirdLKR = Math.round(totalLKR / 3);
  const installmentThirdUSD = Math.round(totalUSD / 3);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleFinalPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const order = createOrder({
        customerName,
        customerEmail,
        customerPhone,
        customerCompany: customerCompany || undefined,
        shippingAddress: {
          street,
          city,
          state: district,
          postalCode,
          country,
        },
        items: cart.map((c) => ({
          productId: c.productId,
          name: c.name,
          priceLKR: c.priceLKR,
          priceUSD: c.priceUSD,
          quantity: c.quantity,
          selectedColor: c.selectedColor,
          selectedStorage: c.selectedStorage,
          variantId: c.variantId,
          sku: c.sku,
          deviceType: c.deviceType,
        })),
        subtotalLKR: cartSubtotalLKR,
        subtotalUSD: cartSubtotalUSD,
        shippingLKR: shippingCostLKR,
        shippingUSD: shippingCostUSD,
        totalLKR,
        totalUSD,
        currency,
        paymentMethod,
      });

      setCompletedOrder(order);
      setIsProcessing(false);
      setStep('confirmation');
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-base font-black text-slate-900 font-sans">
              simply<span className="text-[#E11D48]">tek</span> Checkout
            </span>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className={step === 'details' ? 'text-[#E11D48]' : ''}>1. Shipping</span>
              <span>→</span>
              <span className={step === 'payment' ? 'text-[#E11D48]' : ''}>2. Payment</span>
              <span>→</span>
              <span className={step === 'confirmation' ? 'text-emerald-700' : ''}>3. Milestones</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6">
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Islandwide Delivery Address &amp; Contact Info
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Courier tracking manifests and SMS milestone notifications will be sent to this number.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name / Recipient
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#E11D48] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Order Confirmation)
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#E11D48] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone (For Courier Call)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+94 77 000 0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#E11D48] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company / Organization (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dialog Axiata, MAS Holdings"
                    value={customerCompany}
                    onChange={(e) => setCustomerCompany(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#E11D48] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Street Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="House number, Street name, Apartment / Floor"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#E11D48] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Town
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Colombo 04"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#E11D48] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs px-2 py-2 border border-slate-300 rounded-lg bg-white"
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#E11D48] focus:outline-none"
                  />
                </div>
              </div>

              {/* Notification preferences */}
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                    className="rounded text-[#E11D48] focus:ring-[#E11D48]"
                  />
                  <span>Send real-time milestone dispatch alerts via Email</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifySms}
                    onChange={(e) => setNotifySms(e.target.checked)}
                    className="rounded text-[#E11D48] focus:ring-[#E11D48]"
                  />
                  <span>Send Pronto Express courier waybill SMS updates</span>
                </label>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Proceed to Payment Options →
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handleFinalPayment} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Select Payment Method
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose 0% interest installments, online debit/credit card, Cash on Delivery, or Net-30.
                </p>
              </div>

              {/* 5 Payment Methods */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* Koko */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('koko')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'koko'
                      ? 'border-[#E11D48] bg-rose-50/50 ring-2 ring-[#E11D48]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-slate-900">Koko</span>
                    <span className="text-[9px] bg-[#E11D48] text-white font-bold px-1 rounded">
                      0% INT
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    3 installments with Debit Card
                  </span>
                </button>

                {/* Mintpay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mintpay')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'mintpay'
                      ? 'border-[#E11D48] bg-rose-50/50 ring-2 ring-[#E11D48]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-slate-900">Mintpay</span>
                    <span className="text-[9px] bg-emerald-600 text-white font-bold px-1 rounded">
                      0% INT
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    Pay in 3 with debit / credit
                  </span>
                </button>

                {/* Online Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#E11D48] bg-rose-50/50 ring-2 ring-[#E11D48]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <CreditCard className="w-4 h-4 text-slate-800" />
                    <span className="text-[9px] text-slate-400 font-mono">SSL</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">Card Payment</span>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    Visa / Mastercard / Amex
                  </span>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#E11D48] bg-rose-50/50 ring-2 ring-[#E11D48]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1 rounded">
                      CASH
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">Cash on Delivery</span>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    Pay driver at doorstep
                  </span>
                </button>

                {/* Net-30 Corporate */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('corporate-invoice')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'corporate-invoice'
                      ? 'border-[#E11D48] bg-rose-50/50 ring-2 ring-[#E11D48]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Building className="w-4 h-4 text-slate-800" />
                    <span className="text-[9px] bg-blue-100 text-blue-700 font-bold px-1 rounded">
                      B2B
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">Net-30 Invoice</span>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    Corporate PO purchase
                  </span>
                </button>
              </div>

              {/* Dynamic Payment Details */}
              {paymentMethod === 'koko' && (
                <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="text-[#E11D48]">Koko 3-Month Plan Breakdown:</span>
                    <span className="font-mono text-slate-900 font-extrabold">0% Extra Fees</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div className="bg-white p-2 rounded-lg border border-rose-100">
                      <div className="text-[10px] text-slate-500">Today</div>
                      <div className="font-mono font-bold text-slate-900">
                        {currency === 'LKR' ? `Rs. ${installmentThirdLKR.toLocaleString()}` : `$${installmentThirdUSD}`}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-rose-100">
                      <div className="text-[10px] text-slate-500">Day 30</div>
                      <div className="font-mono font-bold text-slate-900">
                        {currency === 'LKR' ? `Rs. ${installmentThirdLKR.toLocaleString()}` : `$${installmentThirdUSD}`}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-rose-100">
                      <div className="text-[10px] text-slate-500">Day 60</div>
                      <div className="font-mono font-bold text-slate-900">
                        {currency === 'LKR' ? `Rs. ${installmentThirdLKR.toLocaleString()}` : `$${installmentThirdUSD}`}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Your debit card will only be charged the first installment today.
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Debit / Credit Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        CVV Code
                      </label>
                      <input
                        type="password"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <h4 className="font-bold text-slate-900">Cash on Delivery (Islandwide)</h4>
                  <p className="leading-relaxed">
                    Please prepare exact cash of{' '}
                    <strong className="text-slate-950 font-mono">
                      {formatPrice(totalLKR, totalUSD)}
                    </strong>{' '}
                    for the Pronto Express delivery officer. You will receive an SMS prior to delivery.
                  </p>
                </div>
              )}

              {paymentMethod === 'corporate-invoice' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Corporate PO Number
                  </label>
                  <input
                    type="text"
                    required
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                  <p className="text-[11px] text-slate-500">
                    Net-30 tax invoice will be issued to <strong>{customerCompany || customerName}</strong>.
                  </p>
                </div>
              )}

              {/* Order Totals Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Hardware Subtotal:</span>
                  <span className="font-mono tabular-nums font-bold text-slate-900">
                    {formatPrice(cartSubtotalLKR, cartSubtotalUSD)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Islandwide Delivery:</span>
                  <span className="font-mono tabular-nums font-bold text-emerald-700">
                    {shippingCostLKR === 0 ? 'FREE' : formatPrice(shippingCostLKR, shippingCostUSD)}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-950">
                  <span>Total Payable:</span>
                  <span className="font-mono text-[#E11D48] text-base">
                    {formatPrice(totalLKR, totalUSD)}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  ← Back to Address
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isProcessing ? 'Processing Order...' : `Confirm Order · ${formatPrice(totalLKR, totalUSD)}`}
                </button>
              </div>
            </form>
          )}

          {step === 'confirmation' && completedOrder && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-emerald-950">
                    Order Confirmed &amp; Fulfillment Initiated!
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Order Reference: <strong className="font-mono">{completedOrder.id}</strong>. Confirmation email dispatched to <strong>{completedOrder.customerEmail}</strong>.
                  </p>
                </div>
              </div>

              {/* Milestone Tracking Stepper */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Islandwide Delivery Milestones
                </h4>
                <div className="space-y-3">
                  {completedOrder.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 transition-colors ${
                        m.completed ? 'bg-slate-50 border-slate-300' : 'bg-white border-slate-200 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                          m.completed ? 'bg-[#E11D48] text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{m.label}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{m.timestamp}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{m.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const emailAlert = {
                      id: `confirm-${completedOrder.id}`,
                      type: 'milestone' as const,
                      title: `y5Hut.lk Order Confirmation #${completedOrder.id}`,
                      message: `Order authorized via ${completedOrder.paymentMethod}.`,
                      timestamp: 'Just now',
                      read: true,
                      orderId: completedOrder.id,
                      emailSubject: `y5Hut.lk Order #${completedOrder.id} Confirmed`,
                      emailBodyHtml: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #E2E8F0; border-radius: 8px;">
                          <h2 style="color: #E11D48; margin: 0 0 10px 0;">y5<span style="color: #0F172A;">Hut</span>.lk Sri Lanka</h2>
                          <p>Thank you for shopping with us, <strong>${completedOrder.customerName}</strong>!</p>
                          <p>Total: <strong>${completedOrder.currency === 'LKR' ? `Rs. ${completedOrder.totalLKR.toLocaleString()}` : `$${completedOrder.totalUSD.toLocaleString()}`}</strong></p>
                          <p>Your hardware items have passed serial verification and are being packed for Pronto Express courier handover from y5Hut.lk Colombo central hub.</p>
                        </div>
                      `,
                    };
                    setPreviewingEmail(emailAlert);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-[#E11D48]" />
                  <span>Inspect Dispatched Milestone Email</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setIsCartOpen(false);
                      setActiveView('admin');
                    }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 cursor-pointer"
                  >
                    View in Admin Orders
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setIsCartOpen(false);
                    }}
                    className="px-5 py-2 bg-[#E11D48] text-white rounded-lg text-xs font-bold hover:bg-[#BE123C] cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
