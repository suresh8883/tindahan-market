# Tindahan Market: Cart, Vouchers and Checkout

**Product requirements document TM-PRD-11 · version 1.3 · status: approved for the 11.11 release**
Owner: Product, Tindahan Market · Stories: TM-301 cart · TM-305 vouchers · TM-311 checkout and payment · TM-320 order confirmation

## 1. Background and goal

Tindahan Market is a small Philippine online store priced in pesos. The 11.11 release adds the campaign vouchers and must let a shopper go from the catalogue to a confirmed order without help. QA treats this document as the single source of requirements for the release.

## 2. Scope

In scope: catalogue, cart, vouchers, checkout, payment and order confirmation, on desktop and mobile browsers.

Out of scope: customer accounts and login, order history, returns and refunds, inventory, admin tools.

## 3. Users

- **Shopper:** buys one to ten items and may hold one or two voucher codes from the 11.11 campaign.
- **Support agent:** reads an order confirmation to answer "what did I pay, and how?".

## 4. Catalogue and cart (TM-301)

| # | Requirement |
| --- | --- |
| 4.1 | The catalogue lists every product with its name and price in pesos. Prices are fixed for the release (price list below) and never change during a session. |
| 4.2 | A shopper adds a product from the catalogue, then changes the quantity or removes it in the cart. |
| 4.3 | The cart shows subtotal, discount, shipping and total, each with two decimals and the peso sign, for example ₱1,250.00. |
| 4.4 | Shipping is a flat ₱99.00 per order unless a free-shipping voucher applies. |
| 4.5 | Deep link for support and test use: `/cart?items=<id>:<qty>,...` fills the cart. Adding `&now=<ISO date-time>` sets the store clock for that browser session, so campaign expiry can be checked. |

**Price list for the 11.11 release**

| Product | Id | Price |
| --- | --- | --- |
| Barong Tagalog | `barong` | ₱2,500.00 |
| Banig Woven Mat | `banig` | ₱999.00 |
| Barako Coffee 250g | `kape` | ₱250.00 |
| Rubber Slippers | `tsinelas` | ₱199.00 |
| Dried Mango Pack | `mangga` | ₱149.00 |
| Walis Tingting | `walis` | ₱49.00 |
| Kendi (1 piece) | `kendi` | ₱1.00 |

## 5. Vouchers (TM-305)

| # | Requirement |
| --- | --- |
| 5.1 | The cart has one voucher field. Codes are not case-sensitive. An unknown or expired code shows a message and changes no amount. |
| 5.2 | Only one money-off voucher applies per order: the one entered first wins, and a later one is rejected with a message. |
| 5.3 | `SALE1111`: 20% off the subtotal. Minimum spend ₱1,000.00 (the subtotal must reach it). Discount capped at ₱500.00. Valid until the end of 11.11, store time (UTC+8). Cannot be combined with another money-off voucher, nor with `LIBRESHIP`, in either order. Not usable with cash on delivery when the subtotal is above ₱3,000.00. |
| 5.4 | `PESO100`: ₱100.00 off. Minimum spend ₱500.00. Money-off voucher. |
| 5.5 | `LIBRESHIP`: free shipping. May join one money-off voucher, except `SALE1111`. |
| 5.6 | `SALE1010`: expired. Entering it shows the expired message. |
| 5.7 | Removing a voucher restores every amount. |

## 6. Checkout and payment (TM-311)

| # | Requirement |
| --- | --- |
| 6.1 | Checkout collects the shopper's name, mobile number and delivery address, and a payment method. |
| 6.2 | The total shown before the shopper places the order is subtotal − discount + shipping. |
| 6.3 | Payment methods: **cash on delivery (COD)** and **QR Ph**. |
| 6.4 | COD: the order is confirmed at once and the payment status shows that payment is due on delivery. |
| 6.5 | QR Ph: the shopper sees a QR code and the amount to pay, confirms payment on the mock payment screen, and lands on the order confirmation with the payment status paid. |
| 6.6 | Every payment method charges exactly the total from 6.2, to the centavo. |
| 6.7 | A missing required field blocks the order and shows an inline message. |

## 7. Order confirmation (TM-320)

| # | Requirement |
| --- | --- |
| 7.1 | Shows the order reference (`TM-` followed by eight characters), the total and the payment status. |
| 7.2 | The same order always gets the same reference. Nothing is random. |
| 7.3 | The total on the confirmation matches the cart to the centavo. |

## 8. Non-functional

- Deterministic: no database, no randomness in prices or references, and a fixed store clock that a session may override with `&now`.
- Current Chrome, Safari and Firefox at desktop and mobile widths.
- Every interactive element has a stable `data-testid`.

## 9. Acceptance criteria used by QA

| AC | Check |
| --- | --- |
| AC-1 | A COD order of 1 × Barako Coffee totals ₱349.00 (₱250.00 + ₱99.00 shipping) and the confirmation shows payment due on delivery. |
| AC-2 | `SALE1111` on a ₱999.00 subtotal is rejected for minimum spend; the total stays ₱1,098.00. |
| AC-3 | `SALE1111` on a ₱2,500.00 subtotal discounts ₱500.00 (20%, exactly the cap); total ₱2,099.00. |
| AC-4 | `SALE1111` on a ₱2,501.00 subtotal discounts ₱500.00 (the cap), not ₱500.20. |
| AC-5 | `PESO100` entered before `SALE1111`: the second code is rejected and the discount stays ₱100.00. |
| AC-6 | `LIBRESHIP` with `PESO100` on a ₱999.00 subtotal: shipping ₱0.00, total ₱899.00. |
| AC-7 | `SALE1111` with `LIBRESHIP`, in either order: the second code is rejected. |
| AC-8 | With the store clock set after the end of 11.11, `SALE1111` is rejected as expired. |
| AC-9 | The QR Ph amount equals the order total, including shipping. |
| AC-10 | The order reference starts with `TM-` and the confirmation total equals the cart total. |
