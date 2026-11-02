import React, { useEffect, useState } from 'react';
import { DeviceGraphic } from './DeviceGraphic';
import { Product } from '../../types';

interface ProductImageProps {
  product: Pick<Product, 'imageUrl' | 'deviceType' | 'brand' | 'name'> & { id?: string };
  colorHex?: string;
  className?: string;
  showFallbackOnFail?: boolean;
}

/**
 * Curated high-resolution studio product photography for real hardware aesthetics.
 * Falls back gracefully to SVG DeviceGraphic if offline or loading fails.
 */
const CURATED_PRODUCT_IMAGES: Record<string, string> = {
  'prod-iphone16promax': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=85',
  'prod-s24ultra': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=85',
  'prod-applewatch10': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=85',
  'prod-airpodspro2': 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=85',
  'prod-ankerpowerbank': 'https://images.unsplash.com/photo-1609592424364-f6b7c258079b?auto=format&fit=crop&w=800&q=85',
  'prod-soundpeats': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=85',
  'prod-ugreen100w': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=85',
  'prod-ankermaggo': 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=85',
  'prod-spigencase': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=85',
  'prod-ugreencable': 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=85',
  'prod-iphone15': 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=85',
  'prod-galaxya55': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=85',
  'prod-redminote13pro': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=85',
  'prod-xiaomi14t': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=85',
};

const getCuratedImageUrl = (product: ProductImageProps['product']): string | null => {
  if (product.imageUrl) return product.imageUrl;
  if (product.id && CURATED_PRODUCT_IMAGES[product.id]) {
    return CURATED_PRODUCT_IMAGES[product.id];
  }

  const name = product.name?.toLowerCase() || '';
  if (name.includes('16 pro')) return CURATED_PRODUCT_IMAGES['prod-iphone16promax'];
  if (name.includes('s24')) return CURATED_PRODUCT_IMAGES['prod-s24ultra'];
  if (name.includes('watch')) return CURATED_PRODUCT_IMAGES['prod-applewatch10'];
  if (name.includes('airpods')) return CURATED_PRODUCT_IMAGES['prod-airpodspro2'];
  if (name.includes('power bank')) return CURATED_PRODUCT_IMAGES['prod-ankerpowerbank'];
  if (name.includes('earbuds') || name.includes('soundpeats')) return CURATED_PRODUCT_IMAGES['prod-soundpeats'];
  if (name.includes('charger') || name.includes('gan')) return CURATED_PRODUCT_IMAGES['prod-ugreen100w'];
  if (name.includes('stand') || name.includes('maggo') || name.includes('qi2')) return CURATED_PRODUCT_IMAGES['prod-ankermaggo'];
  if (name.includes('case')) return CURATED_PRODUCT_IMAGES['prod-spigencase'];
  if (name.includes('cable')) return CURATED_PRODUCT_IMAGES['prod-ugreencable'];
  if (name.includes('iphone 15')) return CURATED_PRODUCT_IMAGES['prod-iphone15'];
  if (name.includes('a55')) return CURATED_PRODUCT_IMAGES['prod-galaxya55'];
  if (name.includes('redmi')) return CURATED_PRODUCT_IMAGES['prod-redminote13pro'];
  if (name.includes('xiaomi') || name.includes('14t')) return CURATED_PRODUCT_IMAGES['prod-xiaomi14t'];

  return null;
};

export const ProductImage: React.FC<ProductImageProps> = ({
  product,
  colorHex,
  className,
  showFallbackOnFail = true,
}) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const targetImageUrl = getCuratedImageUrl(product);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [targetImageUrl]);

  if (targetImageUrl && !failed) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper-sunk/30 animate-pulse rounded-xl">
            <div className="w-6 h-6 rounded-full border-2 border-ink/20 border-t-red animate-spin opacity-60" />
          </div>
        )}
        <img
          src={targetImageUrl}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`object-cover w-full h-full rounded-xl transition-all duration-300 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${className ?? ''}`}
        />
      </div>
    );
  }

  if (showFallbackOnFail) {
    return (
      <DeviceGraphic
        deviceType={product.deviceType}
        colorHex={colorHex}
        brand={product.brand}
        className={className}
      />
    );
  }

  return null;
};

