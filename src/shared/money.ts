/** All money is held as integer centavos. ₱1.00 === 100. */
export function formatPeso(centavos: number): string {
  const pesos = Math.floor(centavos / 100).toLocaleString('en-US');
  const cents = String(centavos % 100).padStart(2, '0');
  return `₱${pesos}.${cents}`;
}
