package ph.tindahan.market;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/** In-memory store: price list, cart, vouchers and totals. All money is in centavos. */
public final class Store {
    private Store() {}

    public static final class Product {
        public final String id;
        public final String name;
        public final long price;
        Product(String id, String name, long price) { this.id = id; this.name = name; this.price = price; }
    }

    public static final List<Product> PRODUCTS = Arrays.asList(
            new Product("barong", "Barong Tagalog", 250000),
            new Product("banig", "Banig Woven Mat", 99900),
            new Product("kape", "Barako Coffee 250g", 25000),
            new Product("tsinelas", "Rubber Slippers", 19900),
            new Product("mangga", "Dried Mango Pack", 14900),
            new Product("walis", "Walis Tingting", 4900),
            new Product("kendi", "Kendi (1 piece)", 100));

    public static final long SHIPPING = 9900;
    public static final int MAX_QTY = 10;
    public static final String STORE_TIME_LABEL = "Store time: 10 Nov 2026, 8:00 PM";
    /** Fixed store clock: 10 Nov 2026 20:00 UTC+8. Device time is never used. */
    static final long STORE_NOW = 1794312000000L;
    /** SALE1111 valid until 11 Nov 2026 23:59:59 UTC+8. */
    static final long SALE1111_END = 1794412799000L;

    public static final String SALE1111 = "SALE1111";
    public static final String PESO100 = "PESO100";
    public static final String LIBRESHIP = "LIBRESHIP";
    public static final String SALE1010 = "SALE1010";

    static final LinkedHashMap<String, Integer> cart = new LinkedHashMap<>();
    static final List<String> vouchers = new ArrayList<>();

    // Last placed order, shown on the confirmation screen.
    static String orderReference = "";
    static long orderTotal = 0;
    static String orderPaymentStatus = "";

    public static Product product(String id) {
        for (Product p : PRODUCTS) if (p.id.equals(id)) return p;
        throw new IllegalArgumentException(id);
    }

    public static int qty(String id) {
        Integer q = cart.get(id);
        return q == null ? 0 : q;
    }

    public static int count() {
        int n = 0;
        for (int q : cart.values()) n += q;
        return n;
    }

    /** Adds one; returns false when the line is already at the maximum. */
    public static boolean add(String id) {
        int q = qty(id);
        if (q >= MAX_QTY) return false;
        cart.put(id, q + 1);
        return true;
    }

    public static void setQty(String id, int q) {
        if (q <= 0) cart.remove(id);
        else cart.put(id, Math.min(q, MAX_QTY));
    }

    public static long subtotal() {
        long s = 0;
        for (Map.Entry<String, Integer> e : cart.entrySet()) s += product(e.getKey()).price * e.getValue();
        return s;
    }

    static long minimum(String code) {
        if (SALE1111.equals(code)) return 100000;
        if (PESO100.equals(code)) return 50000;
        return 0;
    }

    static boolean moneyOff(String code) { return SALE1111.equals(code) || PESO100.equals(code); }

    public static long discount() {
        long sub = subtotal();
        long d = 0;
        for (String v : vouchers) {
            if (SALE1111.equals(v)) d += Math.min((sub * 20 + 50) / 100, 50000);
            else if (PESO100.equals(v)) d += 10000;
        }
        return Math.min(d, sub);
    }

    public static long shipping() {
        if (cart.isEmpty() || vouchers.contains(LIBRESHIP)) return 0;
        return SHIPPING;
    }

    public static long total() { return subtotal() - discount() + shipping(); }

    /** Applies a voucher code and returns the message to show. */
    public static String applyVoucher(String raw) {
        String code = raw == null ? "" : raw.trim().toUpperCase(Locale.US);
        if (code.isEmpty()) return "Enter a voucher code";
        if (SALE1010.equals(code)) return "This voucher has expired";
        if (!SALE1111.equals(code) && !PESO100.equals(code) && !LIBRESHIP.equals(code)) return "Unknown voucher code";
        if (vouchers.contains(code)) return code + " is already applied";
        if (SALE1111.equals(code) && STORE_NOW > SALE1111_END) return "This voucher has expired";
        if ((SALE1111.equals(code) && vouchers.contains(LIBRESHIP)) || (LIBRESHIP.equals(code) && vouchers.contains(SALE1111)))
            return "SALE1111 cannot be combined with LIBRESHIP";
        if (moneyOff(code)) {
            for (String v : vouchers) if (moneyOff(v)) return "Only one money-off voucher per order";
        }
        if (subtotal() < minimum(code)) {
            return code + " needs a subtotal of at least " + money(minimum(code));
        }
        vouchers.add(code);
        return "Voucher " + code + " applied";
    }

    public static void removeVoucher(String code) { vouchers.remove(code); }

    /** After a cart change: drops vouchers whose minimum spend is no longer met. Returns a message or null. */
    public static String revalidate() {
        String msg = null;
        long sub = subtotal();
        for (String v : new ArrayList<>(vouchers)) {
            if (sub < minimum(v)) {
                vouchers.remove(v);
                msg = v + " was removed: minimum spend not reached";
            }
        }
        return msg;
    }

    public static String money(long centavos) {
        return String.format(Locale.US, "₱%,d.%02d", centavos / 100, centavos % 100);
    }

    public static String negativeMoney(long centavos) {
        return centavos == 0 ? money(0) : "−" + money(centavos);
    }

    /** Places the order: same order details always give the same reference. Empties the cart. */
    public static void placeOrder(String payment, String name, String mobile, String address) {
        StringBuilder sb = new StringBuilder();
        for (String id : new java.util.TreeSet<>(cart.keySet())) sb.append(id).append(':').append(cart.get(id)).append(',');
        sb.append('|');
        for (String v : new java.util.TreeSet<>(vouchers)) sb.append(v).append(',');
        sb.append('|').append(payment).append('|').append(name.trim()).append('|').append(mobile.trim()).append('|').append(address.trim());
        long h = 0xcbf29ce484222325L;
        for (byte b : sb.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8)) {
            h ^= (b & 0xff);
            h *= 0x100000001b3L;
        }
        orderReference = "TM-" + String.format(Locale.US, "%08X", (h ^ (h >>> 32)) & 0xffffffffL);
        orderTotal = total();
        orderPaymentStatus = "COD".equals(payment) ? "Payment due on delivery" : "Paid";
        cart.clear();
        vouchers.clear();
    }

    public static void reset() {
        cart.clear();
        vouchers.clear();
    }
}
