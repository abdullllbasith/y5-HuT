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
  useEffect(() => setFailed(false), [product.imageUrl]);

  if (product.imageUrl && !failed) {
    return (
      <img
        src={product.imageUrl}
        alt={product.name}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`object-contain w-full ${className ?? ''}`}
      />
    );
  }
  return <DeviceGraphic deviceType={product.deviceType} colorHex={colorHex} brand={product.brand} className={className} />;
};
