package ph.tindahan.market;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

public class CartActivity extends Activity {
    private LinearLayout lines, applied;
    private TextView message;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cart);
        lines = findViewById(R.id.cart_lines);
        applied = findViewById(R.id.applied_vouchers);
        message = findViewById(R.id.voucher_message);
        EditText input = findViewById(R.id.voucher_input);
        findViewById(R.id.voucher_apply).setOnClickListener(v -> {
            String msg = Store.applyVoucher(input.getText().toString());
            if (msg.startsWith("Voucher ")) input.setText("");
            message.setText(msg);
            render();
        });
        findViewById(R.id.checkout_button).setOnClickListener(v -> startActivity(new Intent(this, CheckoutActivity.class)));
        findViewById(R.id.continue_shopping).setOnClickListener(v -> finish());
    }

    @Override
    protected void onResume() {
        super.onResume();
        render();
    }

    private void changed() {
        String msg = Store.revalidate();
        if (msg != null) message.setText(msg);
        render();
    }

    private void render() {
        boolean empty = Store.cart.isEmpty();
        findViewById(R.id.cart_empty).setVisibility(empty ? View.VISIBLE : View.GONE);
        findViewById(R.id.continue_shopping).setVisibility(empty ? View.VISIBLE : View.GONE);
        findViewById(R.id.cart_content).setVisibility(empty ? View.GONE : View.VISIBLE);

        LayoutInflater inf = LayoutInflater.from(this);
        lines.removeAllViews();
        for (String id : Store.cart.keySet()) {
            Store.Product p = Store.product(id);
            int q = Store.qty(id);
            View row = inf.inflate(R.layout.row_line, lines, false);
            ((TextView) row.findViewById(R.id.line_name)).setText(p.name);
            ((TextView) row.findViewById(R.id.line_qty)).setText(String.valueOf(q));
            ((TextView) row.findViewById(R.id.line_total)).setText(Store.money(p.price * q));
            Button minus = row.findViewById(R.id.qty_minus);
            Button plus = row.findViewById(R.id.qty_plus);
            Button remove = row.findViewById(R.id.line_remove);
            minus.setContentDescription("Decrease " + p.name);
            plus.setContentDescription("Increase " + p.name);
            remove.setContentDescription("Remove " + p.name);
            plus.setEnabled(q < Store.MAX_QTY);
            minus.setOnClickListener(v -> { Store.setQty(id, q - 1); changed(); });
            plus.setOnClickListener(v -> { Store.setQty(id, q + 1); changed(); });
            remove.setOnClickListener(v -> { Store.setQty(id, 0); changed(); });
            lines.addView(row);
        }

        applied.removeAllViews();
        for (String code : Store.vouchers) {
            View row = inf.inflate(R.layout.row_voucher, applied, false);
            ((TextView) row.findViewById(R.id.applied_voucher)).setText(code);
            Button rm = row.findViewById(R.id.voucher_remove);
            rm.setContentDescription("Remove voucher " + code);
            rm.setOnClickListener(v -> {
                Store.removeVoucher(code);
                message.setText("Voucher " + code + " removed");
                render();
            });
            applied.addView(row);
        }

        ((TextView) findViewById(R.id.summary_subtotal)).setText(Store.money(Store.subtotal()));
        ((TextView) findViewById(R.id.summary_discount)).setText(Store.negativeMoney(Store.discount()));
        ((TextView) findViewById(R.id.summary_shipping)).setText(Store.money(Store.shipping()));
        ((TextView) findViewById(R.id.summary_total)).setText(Store.money(Store.total()));
    }
}
