import { PRODUCTS } from '../../../src/server/products';
import type { Locale } from '../support/i18n';

export type ProductId = 'barong' | 'banig' | 'kape' | 'tsinelas' | 'mangga' | 'walis' | 'kendi';

/** A cart is product id to quantity. See src/server/products.ts for prices. */
export type Cart = Partial<Record<ProductId, number>>;

export function productName(id: ProductId, locale: Locale = 'en'): string {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) throw new Error(`Unknown product: ${id}`);
  return product.name[locale];
}
