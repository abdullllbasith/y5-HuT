import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../../../types';
import { ProductImage } from '../../common/ProductImage';
import { Heart, Truck, ShieldCheck } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';

interface ProductStageProps {
  product: Product;
  activeColorHex?: string;
}

export const ProductStage: React.FC<ProductStageProps> = ({ product, activeColorHex }) => {
  const { toggleWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);

  const colorHex = activeColorHex || product.colorOptions[0]?.hex || '#141210';

  return (
    <div className="flex flex-col space-y-4">
      {/* Visual Canvas: Color-tinted stage with red disc */}
      <div
        className="rounded-3xl p-6 sm:p-10 border border-line flex items-center justify-center relative min-h-[260px] sm:min-h-[360px] overflow-hidden group shadow-hard-sm"
        style={{
          backgroundColor: `${colorHex}14`,
        }}
      >
        {/* Central Red Disc */}
        <div
          className="absolute w-44 h-44 sm:w-60 sm:h-60 rounded-full bg-red/10 blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500"
          aria-hidden="true"
        />

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="relative z-10 flex items-center justify-center"
        >
          <ProductImage
            product={product}
            colorHex={colorHex}
            className="max-h-60 sm:max-h-80 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
          />
        </motion.div>

        {/* Wishlist Button with Motion Bounce */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.75 }}
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-4 right-4 w-11 h-11 rounded-full border flex items-center justify-center transition-colors cursor-pointer min-w-[44px] min-h-[44px] z-20 ${
            wishlisted
              ? 'bg-red-wash border-red text-red'
              : 'bg-card border-line text-ink-soft hover:text-red hover:border-ink hover:bg-paper'
          }`}
          aria-label={wishlisted ? 'Remove from saved tags' : 'Save tag'}
        >
          <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      {/* Trust & Dispatch Mini Tickets */}
      <div className="grid grid-cols-2 gap-2 text-xs font-ui text-ink-soft">
        <div className="p-3 bg-card rounded-xl border border-line flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-go shrink-0" />
          <div className="min-w-0 text-left">
            <span className="font-bold text-ink block text-[11px] truncate">Islandwide Dispatch</span>
            <span className="font-data text-[9px] text-ink-soft block">2–4 business days</span>
          </div>
        </div>
        <div className="p-3 bg-card rounded-xl border border-line flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-ink shrink-0" />
          <div className="min-w-0 text-left">
            <span className="font-bold text-ink block text-[11px] truncate">Genuine Counter Tag</span>
            <span className="font-data text-[9px] text-ink-soft block">Sample warranty spec</span>
          </div>
        </div>
      </div>
    </div>
  );
};

