package ph.tindahan.market;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.View;

/** Draws a QR-style code (a mock: deterministic for the amount, not scannable). */
public class QrView extends View {
    private static final int N = 25;
    private final Paint paint = new Paint();
    private long seed = 1;

    public QrView(Context c, AttributeSet a) { super(c, a); paint.setColor(Color.BLACK); }

    void setSeed(String s) { seed = s.hashCode() * 2654435761L + 7; invalidate(); }

    @Override
    protected void onDraw(Canvas canvas) {
        canvas.drawColor(Color.WHITE);
        float cell = Math.min(getWidth(), getHeight()) / (float) (N + 2);
        long x = seed;
        for (int r = 0; r < N; r++) {
            for (int c = 0; c < N; c++) {
                boolean on;
                if (finder(r, c)) on = finderOn(r, c);
                else { x ^= x << 13; x ^= x >>> 7; x ^= x << 17; on = (x & 1) == 1; }
                if (on) canvas.drawRect((c + 1) * cell, (r + 1) * cell, (c + 2) * cell, (r + 2) * cell, paint);
            }
        }
    }

    private static boolean finder(int r, int c) {
        return (r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8);
    }

    private static boolean finderOn(int r, int c) {
        int rr = r < 8 ? r : r - (N - 7), cc = c < 8 ? c : c - (N - 7);
        if (rr < 0 || cc < 0 || rr > 6 || cc > 6) return false;
        return rr == 0 || rr == 6 || cc == 0 || cc == 6 || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4);
    }
}
