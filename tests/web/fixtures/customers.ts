/** Synthetic people only. These names, numbers and addresses do not belong to anyone. */
export const CUSTOMERS = {
  quezonCity: {
    name: 'Juana Halimbawa',
    mobile: '0900 000 0001',
    address: 'Blk 1 Lot 1, Barangay Halimbawa, Quezon City',
  },
  cebu: {
    name: 'Pedro Sampol',
    mobile: '0900 000 0002',
    address: '1 Kalye Sampol, Barangay Pagsubok, Cebu City',
  },
} as const;

export type Customer = (typeof CUSTOMERS)[keyof typeof CUSTOMERS];
