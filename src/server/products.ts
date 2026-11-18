import type { Locale } from '../i18n/catalogue';

export interface Product {
  id: string;
  name: Record<Locale, string>;
  priceCentavos: number;
}

export const PRODUCTS: readonly Product[] = [
  { id: 'barong', name: { en: 'Barong Tagalog', fil: 'Barong Tagalog' }, priceCentavos: 250000 },
  { id: 'banig', name: { en: 'Banig Woven Mat', fil: 'Hinabing Banig' }, priceCentavos: 99900 },
  { id: 'kape', name: { en: 'Barako Coffee 250g', fil: 'Kapeng Barako 250g' }, priceCentavos: 25000 },
  { id: 'tsinelas', name: { en: 'Rubber Slippers', fil: 'Tsinelas' }, priceCentavos: 19900 },
  { id: 'mangga', name: { en: 'Dried Mango Pack', fil: 'Pinatuyong Mangga' }, priceCentavos: 14900 },
  { id: 'walis', name: { en: 'Walis Tingting', fil: 'Walis Tingting' }, priceCentavos: 4900 },
  { id: 'kendi', name: { en: 'Kendi (1 piece)', fil: 'Kendi (isang piraso)' }, priceCentavos: 100 },
];

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
