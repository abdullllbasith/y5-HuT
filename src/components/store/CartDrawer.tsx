import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, ArrowRight, Truck, CreditCard, ShoppingBag } from 'lucide-react';
import { CheckoutModal } from '../checkout/CheckoutModal';
import { Receipt } from '../ui/Receipt';
import { Price } from '../ui/Price';
import { Dot } from '../ui/Dot';

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

  const shippingLKR = isFreeShipping ? 0 : 450;
  const totalAmountLKR = cartSubtotalLKR + shippingLKR;

  const receiptItems = cart.map((item) => ({
    id: item.productId,
    name: item.name,
    variantLabel: [item.selectedColor, item.selectedStorage].filter(Boolean).join(' / '),
    sku: item.sku || item.productId,
    quantity: item.quantity,
    priceLKR: item.priceLKR * item.quantity,
    priceUSD: item.priceUSD * item.quantity,
  }));

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag Drawer"
        className="fixed inset-0 z-50 overflow-hidden bg-ink/70 backdrop-blur-xs flex justify-end"
        onClick={() => setIsCartOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-paper h-full shadow-hard flex flex-col border-l border-line text-left relative"
        >
          {/* Top Title Bar */}
          <div className="px-5 py-4 border-b border-line flex items-center justify-between bg-card shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <Dot tone="red" size="xs" />
                <h3 className="font-display font-bold text-lg text-ink">
                  Shopping Bag ({cartTotalCount})
                </h3>
              </div>
              <p className="font-data text-[10px] text-ink-soft uppercase tracking-wider mt-0.5">
                Counter Scanning Drawer
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-ink hover:bg-paper-sunk transition-colors cursor-pointer min-w-[44px] min-h-[44px]"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Islandwide Free Delivery Progress Meter */}
          <div className="px-5 py-3 bg-paper-sunk border-b border-line text-xs font-ui shrink-0">
            {isFreeShipping ? (
              <div className="flex items-center gap-2 text-go font-bold">
                <Truck className="w-4 h-4 text-go shrink-0" />
                <span>Unlocked FREE Islandwide Express Delivery!</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink">
                    Add <strong className="font-data text-red">Rs. {(FREE_SHIPPING_THRESHOLD_LKR - cartSubtotalLKR).toLocaleString('en-LK')}</strong> more for Free Delivery
                  </span>
                  <span className="font-data text-ink-soft font-bold text-[11px]">{Math.round(progressToFreeShipping)}%</span>
                </div>
                <div className="w-full bg-card h-2 rounded-full overflow-hidden border border-line">
                  <div
                    className="bg-red h-full transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-ink-soft space-y-3">
                <div className="w-16 h-16 rounded-full bg-paper-sunk border border-line flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-ink-soft" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-ink">Nothing scanned yet</h4>
                  <p className="font-ui text-xs text-ink-soft mt-1 max-w-xs">
                    Inspect phones, watches and accessories on the shop shelves to add them to your receipt.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-ink text-paper font-ui text-xs font-bold hover:bg-red hover:shadow-hard-sm transition-all cursor-pointer min-h-[44px]"
                >
                  Inspect Shelf Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.productId}-${item.selectedColor}-${item.selectedStorage}-${idx}`}
                    className="p-3.5 bg-card border border-line rounded-xl flex items-start gap-3.5 shadow-2xs hover:border-ink transition-colors"
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-data text-[10px] uppercase font-bold text-ink-soft bg-paper-sunk px-1.5 py-0.2 rounded border border-line">
                          {item.deviceType}
                        </span>
                        {item.selectedColor && (
                          <span className="font-data text-[10px] text-ink-soft">
                            {item.selectedColor}
                          </span>
                        )}
                        {item.selectedStorage && (
                          <span className="font-data text-[10px] text-ink-soft font-bold">
                            · {item.selectedStorage}
                          </span>
                        )}
                      </div>

                      <h4 className="font-ui font-bold text-xs sm:text-sm text-ink truncate">
                        {item.name}
                      </h4>

                      <div className="font-data text-xs font-bold text-ink pt-0.5">
                        Rs. {(item.priceLKR * item.quantity).toLocaleString('en-LK')}
                      </div>

                      {/* Quantity & Remove */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-line rounded-full bg-paper overflow-hidden">
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
                            className="w-8 h-8 flex items-center justify-center font-bold text-xs hover:bg-paper-sunk cursor-pointer"
                            aria-label="Decrease"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-data text-xs font-bold text-ink border-x border-line">
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
                            className="w-8 h-8 flex items-center justify-center font-bold text-xs hover:bg-paper-sunk disabled:opacity-40 cursor-pointer"
                            aria-label="Increase"
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
                          className="p-1.5 text-ink-soft hover:text-red transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Thermal Slip Receipt Summary Component */}
                <Receipt
                  items={receiptItems}
                  subtotalLKR={cartSubtotalLKR}
                  totalLKR={totalAmountLKR}
                  currency={currency}
                  className="mt-4"
                />
              </div>
            )}
          </div>

          {/* Sticky Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-line bg-card space-y-3 pb-safe shrink-0 shadow-hard">
              {/* Koko split note */}
              {currency === 'LKR' && (
                <div className="p-2.5 bg-paper-sunk border border-line rounded-xl text-xs font-ui flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-red font-bold">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Koko 3× Split:</span>
                  </span>
                  <span className="font-data font-bold text-ink">
                    Rs. {installmentThird.toLocaleString('en-LK')}/mo
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3.5 px-6 rounded-full bg-ink hover:bg-red text-paper hover:text-white font-ui text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-hard cursor-pointer min-h-[48px]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="font-data text-[10px] text-center text-ink-soft">
                Concept demonstration · Simulated order confirmation
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />}
    </>
  );
};
