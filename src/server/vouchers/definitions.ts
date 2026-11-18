export type VoucherKind = 'percent' | 'fixed' | 'shipping';

export interface Voucher {
  code: string;
  kind: VoucherKind;
  /** percent: whole percentage. fixed: centavos. shipping: unused. */
  value: number;
  minSpendCentavos: number;
  capCentavos?: number;
  expiresAt?: string;
  conflictsWithFreeShipping?: boolean;
  /** Not usable with cash on delivery when the subtotal is above this. */
  codLimitCentavos?: number;
}

/** The store clock is fixed so every run is deterministic. A quote may override it with `now`. */
export const STORE_CLOCK = '2026-11-11T12:00:00+08:00';

export const SHIPPING_CENTAVOS = 9900;

export const VOUCHERS: readonly Voucher[] = [
  {
    code: 'SALE1111',
    kind: 'percent',
    value: 20,
    minSpendCentavos: 100000,
    capCentavos: 50000,
    expiresAt: '2026-11-11T23:59:59+08:00',
    conflictsWithFreeShipping: true,
    codLimitCentavos: 300000,
  },
  { code: 'SALE1010', kind: 'percent', value: 10, minSpendCentavos: 0, expiresAt: '2026-10-10T23:59:59+08:00' },
  { code: 'PESO100', kind: 'fixed', value: 10000, minSpendCentavos: 50000 },
  { code: 'LIBRESHIP', kind: 'shipping', value: 0, minSpendCentavos: 0 },
];

export function findVoucher(code: string): Voucher | undefined {
  const wanted = code.trim().toUpperCase();
  return VOUCHERS.find((v) => v.code === wanted);
}
