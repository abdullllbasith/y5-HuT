import React, { useEffect, useState } from 'react';
import { DeviceGraphic } from './DeviceGraphic';
import { Product } from '../../types';

interface ProductImageProps {
  product: Pick<Product, 'imageUrl' | 'deviceType' | 'brand' | 'name'>;
  colorHex?: string;
  className?: string;
}

/** Demo image link when the owner provided one; otherwise (or if it fails to load) the built-in graphic. */
export const ProductImage: React.FC<ProductImageProps> = ({ product, colorHex, className }) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [product.imageUrl]);

  if (product.imageUrl && !failed) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-rose-500 animate-spin opacity-50" />
          </div>
        )}
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`object-contain w-full transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className ?? ''}`}
        />
      </div>
    );
  }
  return <DeviceGraphic deviceType={product.deviceType} colorHex={colorHex} brand={product.brand} className={className} />;
};

