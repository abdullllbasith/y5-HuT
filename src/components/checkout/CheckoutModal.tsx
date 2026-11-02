import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { X } from 'lucide-react';
import { Dot } from '../ui/Dot';
import { CheckoutAddressStep } from './CheckoutAddressStep';
import { CheckoutPaymentStep } from './CheckoutPaymentStep';
import { CheckoutConfirmationStep } from './CheckoutConfirmationStep';

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
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');

  // Shipping details
  const [customerName, setCustomerName] = useState(currentUser.name);
  const [customerEmail, setCustomerEmail] = useState(currentUser.email);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCompany, setCustomerCompany] = useState(currentUser.company || '');
  const [street, setStreet] = useState('No. 45/2, Galle Road, Bambalapitiya');
  const [city, setCity] = useState('Colombo 04');
  const [district, setDistrict] = useState('Colombo');
  const [postalCode, setPostalCode] = useState('00400');

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<
    'card' | 'koko' | 'mintpay' | 'cod' | 'corporate-invoice'
  >('koko');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 1048');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCvv, setCardCvv] = useState('781');
  const [poNumber, setPoNumber] = useState('PO-LK-2026-9041');

  // Notifications
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(true);

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCostLKR = cartSubtotalLKR >= 15000 ? 0 : 450;
  const shippingCostUSD = cartSubtotalUSD >= 50 ? 0 : 2;
  const totalLKR = cartSubtotalLKR + shippingCostLKR;
  const totalUSD = cartSubtotalUSD + shippingCostUSD;

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
          country: 'Sri Lanka',
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
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-paper rounded-3xl shadow-hard max-w-2xl w-full border border-line overflow-hidden my-auto max-h-[94vh] flex flex-col text-left">
        
        {/* Top Header with 3-Dot Stepper */}
        <div className="px-5 sm:px-6 py-4 border-b border-line flex items-center justify-between bg-card shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-base sm:text-lg text-ink">
              y5<span className="text-red">HuT</span> Checkout
            </span>

            {/* Stepper Dots Joined by Line */}
            <div className="hidden sm:flex items-center gap-2 font-data text-xs pl-3 border-l border-line text-ink-soft">
              <span className={`flex items-center gap-1.5 ${step === 'details' ? 'font-bold text-red' : ''}`}>
                <Dot tone={step === 'details' ? 'red' : 'ink'} size="xs" />
                <span>1. Address</span>
              </span>
              <span className="text-line">&mdash;</span>
              <span className={`flex items-center gap-1.5 ${step === 'payment' ? 'font-bold text-red' : ''}`}>
                <Dot tone={step === 'payment' ? 'red' : 'ink'} size="xs" />
                <span>2. Payment</span>
              </span>
              <span className="text-line">&mdash;</span>
              <span className={`flex items-center gap-1.5 ${step === 'confirmation' ? 'font-bold text-go' : ''}`}>
                <Dot tone={step === 'confirmation' ? 'go' : 'ink'} size="xs" />
                <span>3. Receipt</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-ink hover:bg-paper-sunk transition-colors cursor-pointer min-w-[44px] min-h-[44px]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Honest Demo Disclosure */}
          <div
            role="note"
            className="rounded-xl border border-line bg-highlighter/30 px-3.5 py-2.5 font-data text-xs text-ink"
          >
            <strong>DEMO Checkout.</strong> No payment is taken, no real order is placed, and no SMS or email is dispatched. Do not input real debit/credit cards.
          </div>

          {step === 'details' && (
            <CheckoutAddressStep
              customerName={customerName}
              setCustomerName={setCustomerName}
              customerEmail={customerEmail}
              setCustomerEmail={setCustomerEmail}
              customerPhone={customerPhone}
              setCustomerPhone={setCustomerPhone}
              customerCompany={customerCompany}
              setCustomerCompany={setCustomerCompany}
              street={street}
              setStreet={setStreet}
              city={city}
              setCity={setCity}
              district={district}
              setDistrict={setDistrict}
              postalCode={postalCode}
              setPostalCode={setPostalCode}
              notifyEmail={notifyEmail}
              setNotifyEmail={setNotifyEmail}
              notifySms={notifySms}
              setNotifySms={setNotifySms}
              onSubmit={handleDetailsSubmit}
              onCancel={onClose}
            />
          )}

          {step === 'payment' && (
            <CheckoutPaymentStep
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              cardExpiry={cardExpiry}
              setCardExpiry={setCardExpiry}
              cardCvv={cardCvv}
              setCardCvv={setCardCvv}
              poNumber={poNumber}
              setPoNumber={setPoNumber}
              customerCompany={customerCompany}
              customerName={customerName}
              totalLKR={totalLKR}
              totalUSD={totalUSD}
              cartSubtotalLKR={cartSubtotalLKR}
              cartSubtotalUSD={cartSubtotalUSD}
              shippingCostLKR={shippingCostLKR}
              shippingCostUSD={shippingCostUSD}
              currency={currency}
              formatPrice={formatPrice}
              isProcessing={isProcessing}
              onBack={() => setStep('details')}
              onSubmit={handleFinalPayment}
            />
          )}

          {step === 'confirmation' && completedOrder && (
            <CheckoutConfirmationStep order={completedOrder} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};
