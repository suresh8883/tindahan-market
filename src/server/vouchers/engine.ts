import { findProduct } from '../products';
import { findVoucher, SHIPPING_CENTAVOS, STORE_CLOCK, type Voucher } from './definitions';
import { applyCap, conflictsWithShipping, meetsMinimumSpend, violatesNoStacking } from './rules';

export type PaymentMethod = 'cod' | 'wallet' | 'qr';

export type RejectionReason =
  | 'UNKNOWN'
  | 'EXPIRED'
  | 'BELOW_MINIMUM'
  | 'NO_STACKING'
  | 'FREE_SHIPPING_CONFLICT'
  | 'COD_LIMIT';

export interface QuoteRequest {
  items: Record<string, number>;
  /** Evaluated in the order the customer entered them. */
  vouchers?: string[];
  payment?: PaymentMethod | null;
  now?: string;
}

export interface QuoteLine {
  productId: string;
  quantity: number;
  unitCentavos: number;
  lineCentavos: number;
}

export interface Quote {
  lines: QuoteLine[];
  subtotalCentavos: number;
  discountCentavos: number;
  shippingCentavos: number;
  totalCentavos: number;
  applied: string[];
  rejected: { code: string; reason: RejectionReason }[];
}

function buildLines(items: Record<string, number>): QuoteLine[] {
  const lines: QuoteLine[] = [];
  for (const [productId, rawQuantity] of Object.entries(items)) {
    const product = findProduct(productId);
    const quantity = Math.floor(Number(rawQuantity));
    if (!product || !Number.isFinite(quantity) || quantity <= 0) continue;
    lines.push({
      productId,
      quantity,
      unitCentavos: product.priceCentavos,
      lineCentavos: product.priceCentavos * quantity,
    });
  }
  return lines;
}

function rejectionFor(
  voucher: Voucher,
  applied: readonly Voucher[],
  subtotal: number,
  payment: QuoteRequest['payment'],
  now: number,
): RejectionReason | null {
  if (voucher.expiresAt && now > Date.parse(voucher.expiresAt)) return 'EXPIRED';
  if (conflictsWithShipping(applied, voucher)) return 'FREE_SHIPPING_CONFLICT';
  if (violatesNoStacking(applied, voucher)) return 'NO_STACKING';
  if (!meetsMinimumSpend(subtotal, voucher.minSpendCentavos)) return 'BELOW_MINIMUM';
  if (payment === 'cod' && voucher.codLimitCentavos !== undefined && subtotal > voucher.codLimitCentavos) {
    return 'COD_LIMIT';
  }
  return null;
}

function discountFor(voucher: Voucher, subtotal: number): number {
  if (voucher.kind === 'fixed') return voucher.value;
  if (voucher.kind !== 'percent') return 0;
  const raw = Math.round((subtotal * voucher.value) / 100);
  return voucher.capCentavos === undefined ? raw : applyCap(raw, voucher.capCentavos);
}

export function quote(request: QuoteRequest): Quote {
  const lines = buildLines(request.items ?? {});
  const subtotalCentavos = lines.reduce((sum, line) => sum + line.lineCentavos, 0);
  const now = Date.parse(request.now ?? STORE_CLOCK);

  const applied: Voucher[] = [];
  const rejected: Quote['rejected'] = [];
  for (const code of request.vouchers ?? []) {
    const voucher = findVoucher(code);
    if (!voucher) {
      rejected.push({ code, reason: 'UNKNOWN' });
      continue;
    }
    const reason = rejectionFor(voucher, applied, subtotalCentavos, request.payment, now);
    if (reason) rejected.push({ code: voucher.code, reason });
    else applied.push(voucher);
  }

  const rawDiscount = applied.reduce((sum, v) => sum + discountFor(v, subtotalCentavos), 0);
  const discountCentavos = Math.min(rawDiscount, subtotalCentavos);
  const freeShipping = applied.some((v) => v.kind === 'shipping');
  const shippingCentavos = lines.length === 0 || freeShipping ? 0 : SHIPPING_CENTAVOS;

  return {
    lines,
    subtotalCentavos,
    discountCentavos,
    shippingCentavos,
    totalCentavos: subtotalCentavos - discountCentavos + shippingCentavos,
    applied: applied.map((v) => v.code),
    rejected,
  };
}
