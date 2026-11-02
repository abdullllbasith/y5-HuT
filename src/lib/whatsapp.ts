import { Currency } from '../types';

export interface WhatsAppEnquiryDetails {
  productName: string;
  brand: string;
  sku?: string;
  variantColor?: string;
  variantStorage?: string;
  priceLKR: number;
  priceUSD: number;
  currency: Currency;
  stock: number;
}

/**
 * Reads the optional demo recipient phone number from Vite environment variables.
 * Never hard-codes an invented real number.
 */
export const getDemoWhatsAppNumber = (): string => {
  const envNumber = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEMO_WHATSAPP_NUMBER as string | undefined) || '';
  return envNumber.replace(/\D/g, '');
};

/**
 * Builds a clear, professional enquiry message containing full product context,
 * selected variant options, live sample price, and demo disclaimers.
 */
export const buildWhatsAppEnquiryText = (details: WhatsAppEnquiryDetails): string => {
  const lines: string[] = [
    'Hello y5Hut (Demo Concept),',
    '',
    `I would like to enquire about: *${details.productName}*`,
    `• Brand: ${details.brand}`,
  ];

  if (details.variantStorage || details.variantColor) {
    const variantParts = [details.variantStorage, details.variantColor].filter(Boolean).join(' / ');
    lines.push(`• Variant: ${variantParts}`);
  }

  if (details.sku) {
    lines.push(`• SKU: ${details.sku}`);
  }

  const priceFormatted = details.currency === 'LKR'
    ? `Rs. ${details.priceLKR.toLocaleString()}`
    : `$${details.priceUSD.toLocaleString()}`;
  lines.push(`• Sample Price: ${priceFormatted}`);
  lines.push(`• Stock Status: ${details.stock > 0 ? `In Stock (${details.stock} available)` : 'Sold Out'}`);
  lines.push('');
  lines.push('---');
  lines.push('Demo Notice: Simulated customer enquiry from the y5Hut.lk storefront concept preview. No commercial transaction is initiated.');

  return lines.join('\n');
};

/**
 * Builds the URL encoded `https://wa.me/...` link.
 */
export const buildWhatsAppUrl = (number: string, message: string): string => {
  const cleaned = number.replace(/\D/g, '');
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
};
