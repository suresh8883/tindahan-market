package ph.tindahan.market;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

public class ConfirmationActivity extends Activity {
    /** Opens the confirmation on top of the catalogue, closing cart, checkout and payment. */
    static void open(Activity from) {
        Intent home = new Intent(from, CatalogueActivity.class).addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        from.startActivities(new Intent[]{home, new Intent(from, ConfirmationActivity.class)});
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_confirmation);
        ((TextView) findViewById(R.id.order_reference)).setText(Store.orderReference);
        ((TextView) findViewById(R.id.order_total)).setText("Total: " + Store.money(Store.orderTotal));
        ((TextView) findViewById(R.id.payment_status)).setText(Store.orderPaymentStatus);
        findViewById(R.id.new_order).setOnClickListener(v -> {
            Store.reset();
            finish();
        });
    }
}
