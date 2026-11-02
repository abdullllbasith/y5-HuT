import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, ArrowRight, Truck, CreditCard } from 'lucide-react';
import { CheckoutModal } from '../checkout/CheckoutModal';
import { DeviceGraphic } from '../common/DeviceGraphic';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotalLKR,
    cartSubtotalUSD,
    cartTotalCount,
    formatPrice,
    currency,
  } = useStore();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD_LKR = 15000;
  const isFreeShipping = cartSubtotalLKR >= FREE_SHIPPING_THRESHOLD_LKR;
  const progressToFreeShipping = Math.min(
    100,
    (cartSubtotalLKR / FREE_SHIPPING_THRESHOLD_LKR) * 100
  );

  const installmentThird =
    currency === 'LKR'
      ? Math.round(cartSubtotalLKR / 3)
      : Math.round(cartSubtotalUSD / 3);

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Drawer"
        className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
      >
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-2 sm:pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">
                  Shopping Bag ({cartTotalCount})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  y5Hut.lk Express Checkout (Demo)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-100 text-xs text-slate-600 shrink-0">
              {isFreeShipping ? (
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>You've unlocked FREE Islandwide Delivery!</span>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center text-[11px] sm:text-xs">
                    <span>
                      Add <strong className="text-slate-900 font-mono">Rs. {(FREE_SHIPPING_THRESHOLD_LKR - cartSubtotalLKR).toLocaleString()}</strong> more for FREE Delivery
                    </span>
                    <span className="font-mono text-slate-500 font-bold">{Math.round(progressToFreeShipping)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-[#E11D48] h-full transition-all duration-300"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <Truck className="w-7 h-7 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Your shopping bag is empty</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Explore our genuine smartphones, Apple devices, and fast charging gadgets.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-5 py-2 text-xs font-bold text-white bg-[#E11D48] rounded-lg hover:bg-[#BE123C] transition-colors cursor-pointer shadow-xs min-h-[38px]"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={`${item.productId}-${item.selectedColor}-${item.selectedStorage}-${idx}`}
                    className="p-3 border border-slate-200 rounded-xl flex items-center gap-3 hover:border-slate-300 transition-colors bg-white shadow-2xs"
                  >
                    <div className="w-12 h-12 bg-slate-50 rounded-lg p-1 flex items-center justify-center shrink-0 border border-slate-100">
                      <DeviceGraphic
                        deviceType={item.deviceType}
                        colorHex="#1E293B"
                        className="max-h-10"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                        {item.selectedColor && <span className="font-medium text-slate-700">{item.selectedColor}</span>}
                        {item.selectedStorage && (
                          <>
                            <span>·</span>
                            <span>{item.selectedStorage}</span>
                          </>
                        )}
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-900 mt-1 tabular-nums">
                        {formatPrice(
                          item.priceLKR * item.quantity,
                          item.priceUSD * item.quantity
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-slate-200 rounded-md text-xs">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.selectedColor,
                                item.selectedStorage
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 cursor-pointer font-bold"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-mono tabular-nums font-semibold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item.productId,
                                item.quantity + 1,
                                item.selectedColor,
                                item.selectedStorage
                              )
                            }
                            disabled={item.quantity >= item.maxStock}
                            className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 cursor-pointer font-bold"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.productId,
                              item.selectedColor,
                              item.selectedStorage
                            )
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors ml-auto cursor-pointer"
                          title="Remove item"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Action */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50/70 space-y-3 pb-safe shrink-0">
                
                {/* BNPL Installment Teaser */}
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-bold text-[#E11D48]">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay in 3 with Koko:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {currency === 'LKR' ? `Rs. ${installmentThird.toLocaleString()} / mo` : `$${installmentThird} / mo`}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono tabular-nums font-bold text-slate-900">
                      {formatPrice(cartSubtotalLKR, cartSubtotalUSD)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Islandwide Delivery:</span>
                    <span className="font-mono tabular-nums font-bold text-emerald-700">
                      {isFreeShipping ? 'FREE' : formatPrice(450, 2)}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-950">
                    <span>Total Amount:</span>
                    <span className="font-mono tabular-nums text-[#E11D48] text-base">
                      {formatPrice(
                        cartSubtotalLKR + (isFreeShipping ? 0 : 450),
                        cartSubtotalUSD + (isFreeShipping ? 0 : 2)
                      )}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer min-h-[44px]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  Concept checkout demo · Simulated order confirmation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />
      )}
    </>
  );
};
