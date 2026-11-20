package ph.tindahan.market;

import android.app.Activity;
import android.os.Bundle;
import android.widget.TextView;

public class QrPayActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qr);
        String amount = Store.money(Store.total());
        QrView qr = findViewById(R.id.qr_image);
        qr.setSeed(amount);
        qr.setContentDescription("QR Ph code for " + amount);
        ((TextView) findViewById(R.id.qr_amount)).setText("Amount to pay: " + amount);
        findViewById(R.id.qr_cancel).setOnClickListener(v -> finish());
        findViewById(R.id.qr_paid).setOnClickListener(v -> {
            if (Store.cart.isEmpty()) { finish(); return; }
            v.setEnabled(false);
            Store.placeOrder("QRPH",
                    getIntent().getStringExtra(CheckoutActivity.EXTRA_NAME),
                    getIntent().getStringExtra(CheckoutActivity.EXTRA_MOBILE),
                    getIntent().getStringExtra(CheckoutActivity.EXTRA_ADDRESS));
            ConfirmationActivity.open(this);
        });
    }
}
