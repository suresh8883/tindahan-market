package ph.tindahan.market;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.TextView;

public class CheckoutActivity extends Activity {
    static final String EXTRA_NAME = "name", EXTRA_MOBILE = "mobile", EXTRA_ADDRESS = "address";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_checkout);
        findViewById(R.id.place_order).setOnClickListener(v -> placeOrder());
    }

    @Override
    protected void onResume() {
        super.onResume();
        ((TextView) findViewById(R.id.checkout_total)).setText("Total to pay: " + Store.money(Store.total()));
    }

    private void placeOrder() {
        String name = ((EditText) findViewById(R.id.input_name)).getText().toString().trim();
        String mobile = ((EditText) findViewById(R.id.input_mobile)).getText().toString().trim();
        String address = ((EditText) findViewById(R.id.input_address)).getText().toString().trim();
        boolean ok = true;
        ok &= show(R.id.error_name, name.isEmpty());
        ok &= show(R.id.error_mobile, !mobile.matches("09\\d{9}"));
        ok &= show(R.id.error_address, address.isEmpty());
        TextView msg = findViewById(R.id.checkout_message);
        msg.setText("");
        msg.setVisibility(View.GONE);
        if (!ok) return;
        if (Store.cart.isEmpty()) {
            msg.setText("Your cart is empty");
            msg.setVisibility(View.VISIBLE);
            return;
        }
        boolean cod = ((RadioButton) findViewById(R.id.pay_cod)).isChecked();
        if (cod && Store.vouchers.contains(Store.SALE1111) && Store.subtotal() > 300000) {
            msg.setText("SALE1111 cannot be used with cash on delivery above ₱3,000.00");
            msg.setVisibility(View.VISIBLE);
            return;
        }
        if (cod) {
            Store.placeOrder("COD", name, mobile, address);
            ConfirmationActivity.open(this);
        } else {
            Intent i = new Intent(this, QrPayActivity.class);
            i.putExtra(EXTRA_NAME, name).putExtra(EXTRA_MOBILE, mobile).putExtra(EXTRA_ADDRESS, address);
            startActivity(i);
        }
    }

    /** Shows or hides an inline error; returns true when there is no error. */
    private boolean show(int id, boolean error) {
        findViewById(id).setVisibility(error ? View.VISIBLE : View.GONE);
        return !error;
    }
}
