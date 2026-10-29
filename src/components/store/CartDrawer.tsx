import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, ArrowRight, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { CheckoutModal } from '../checkout/CheckoutModal';

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
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs">
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">
                  Shopping Bag ({cartTotalCount})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  y5Hut.lk Sri Lanka Express Checkout
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs text-slate-600">
              {isFreeShipping ? (
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>You've unlocked FREE Islandwide Delivery!</span>
                </div>
              ) : (
                <div>
                  Add{' '}
                  <strong className="text-slate-900 font-mono">
                    Rs. {(FREE_SHIPPING_THRESHOLD_LKR - cartSubtotalLKR).toLocaleString()}
                  </strong>{' '}
                  more for FREE Islandwide Delivery
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#E11D48] h-full transition-all duration-300"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <p className="text-sm font-bold text-slate-700">Your shopping bag is empty</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Explore our genuine smartphones, Apple products, and fast charging gadgets.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-5 py-2 text-xs font-bold text-white bg-[#E11D48] rounded-md hover:bg-[#BE123C] transition-colors cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={`${item.productId}-${item.selectedColor}-${idx}`}
                    className="p-3.5 border border-slate-200 rounded-lg flex items-start gap-3 hover:border-slate-300 transition-colors bg-white shadow-xs"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center shrink-0 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-600 font-mono">
                        {item.deviceType.substring(0, 3)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <div className="text-[11px] text-slate-500 mt-0.5 space-x-1.5">
                        {item.selectedColor && <span>{item.selectedColor}</span>}
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
                        <div className="flex items-center border border-slate-200 rounded text-xs">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.selectedColor,
                                item.selectedStorage
                              )
                            }
                            className="px-2 py-0.5 hover:bg-slate-100 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 font-mono tabular-nums font-semibold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.productId,
                                item.quantity + 1,
                                item.selectedColor,
                                item.selectedStorage
                              )
                            }
                            disabled={item.quantity >= item.maxStock}
                            className="px-2 py-0.5 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(
                              item.productId,
                              item.selectedColor,
                              item.selectedStorage
                            )
                          }
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-auto cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Action */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-200 bg-slate-50/70 space-y-3">
                
                {/* BNPL Installment Teaser */}
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-bold text-[#E11D48]">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay in 3 Installments:</span>
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
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  🔒 Bank-Grade 256-bit SSL Security · Islandwide COD &amp; 0% Installments
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
