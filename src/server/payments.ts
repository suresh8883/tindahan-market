import { createHash } from 'node:crypto';
import { STORE_CLOCK } from './vouchers/definitions';
import type { PaymentMethod, Quote, QuoteRequest } from './vouchers/engine';
import { quote } from './vouchers/engine';

export interface OrderRequest extends QuoteRequest {
  payment: PaymentMethod;
  customer: { name: string; mobile: string; address: string };
}

export interface Order {
  ref: string;
  payment: PaymentMethod;
  quote: Quote;
  /** Where the browser goes next. */
  next: string;
}

/** Same order, same reference: there is no database and nothing is random. */
export function orderReference(request: OrderRequest): string {
  const digest = createHash('sha256').update(JSON.stringify(request)).digest('hex');
  return `TM-${digest.slice(0, 8).toUpperCase()}`;
}

/** Amount the buyer scans on the QR Ph screen. */
export function qrAmount(q: Quote): number {
  return q.subtotalCentavos - q.discountCentavos;
}

export function walletCallbackSignature(ref: string): string {
  return createHash('sha256').update(`mock-wallet|${ref}`).digest('hex').slice(0, 16);
}

export function createOrder(request: OrderRequest): Order {
  const q = quote(request);
  const ref = orderReference(request);
  if (request.payment === 'wallet') {
    const params = new URLSearchParams({ ref, amount: String(q.totalCentavos) });
    return { ref, payment: request.payment, quote: q, next: `/mock-wallet/authorize?${params}` };
  }
  if (request.payment === 'qr') {
    const params = new URLSearchParams({ ref, amount: String(qrAmount(q)) });
    return { ref, payment: request.payment, quote: q, next: `/pay/qr?${params}` };
  }
  return { ref, payment: request.payment, quote: q, next: `/order/confirmation?ref=${ref}` };
}

const SANDBOX_TOKEN = /^mock-wallet-sandbox-(\d{4})(\d{2})(\d{2})$/;

export type SandboxCheck = { ok: true } | { ok: false; reason: 'missing' | 'malformed' | 'expired' };

/** The mock wallet's sandbox tokens carry their own expiry date and are not secrets. */
export function checkSandboxToken(authorization: string | undefined): SandboxCheck {
  const token = authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return { ok: false, reason: 'missing' };
  const match = SANDBOX_TOKEN.exec(token);
  if (!match) return { ok: false, reason: 'malformed' };
  const expiry = Date.parse(`${match[1]}-${match[2]}-${match[3]}T23:59:59+08:00`);
  return expiry < Date.parse(STORE_CLOCK) ? { ok: false, reason: 'expired' } : { ok: true };
}
