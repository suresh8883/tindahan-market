import type { Voucher } from './definitions';

/** The voucher applies when the subtotal reaches the minimum spend. */
export function meetsMinimumSpend(subtotal: number, minSpend: number): boolean {
  return subtotal >= minSpend;
}

/** A percentage discount never exceeds the voucher's cap. */
export function applyCap(rawDiscount: number, cap: number): number {
  return rawDiscount > cap ? cap : rawDiscount;
}

/**
 * Only one money-off voucher per order, whichever is entered first.
 * A shipping voucher is not money off, so it does not count, but it cannot be entered twice.
 */
export function violatesNoStacking(applied: readonly Voucher[], next: Voucher): boolean {
  if (next.kind === 'shipping') return applied.some((v) => v.code === next.code);
  return applied.some((v) => v.kind !== 'shipping');
}

/** Vouchers marked as conflicting cannot be combined with a shipping voucher, in either order. */
export function conflictsWithShipping(applied: readonly Voucher[], next: Voucher): boolean {
  if (next.kind === 'shipping') return applied.some((v) => v.conflictsWithFreeShipping === true);
  return next.conflictsWithFreeShipping === true && applied.some((v) => v.kind === 'shipping');
}
