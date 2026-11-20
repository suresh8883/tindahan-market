package ph.tindahan.market;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class CatalogueActivity extends Activity {
    private Button cartButton;
    private Toast toast;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_catalogue);
        cartButton = findViewById(R.id.cart_button);
        cartButton.setOnClickListener(v -> startActivity(new Intent(this, CartActivity.class)));
        ((TextView) findViewById(R.id.store_time)).setText(Store.STORE_TIME_LABEL);
        LinearLayout list = findViewById(R.id.product_list);
        LayoutInflater inf = LayoutInflater.from(this);
        for (Store.Product p : Store.PRODUCTS) {
            View row = inf.inflate(R.layout.row_product, list, false);
            ((TextView) row.findViewById(R.id.product_name)).setText(p.name);
            ((TextView) row.findViewById(R.id.product_price)).setText(Store.money(p.price));
            Button add = row.findViewById(R.id.add_button);
            add.setContentDescription("Add " + p.name);
            add.setOnClickListener(v -> {
                String text = Store.add(p.id) ? p.name + " added to cart" : "Maximum " + Store.MAX_QTY + " per item";
                if (toast != null) toast.cancel();
                toast = Toast.makeText(this, text, Toast.LENGTH_SHORT);
                toast.show();
                refresh();
            });
            list.addView(row);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        refresh();
    }

    private void refresh() {
        cartButton.setText("Cart (" + Store.count() + ")");
    }
}
