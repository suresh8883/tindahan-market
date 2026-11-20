# Tindahan Market for Android

The same 11.11 release as the web store, as a small Android app: the same 7 products and prices, the cart, the four voucher codes with the same rules, and checkout with cash on delivery or QR Ph. Use it to try the mobile workflow in Test Companion: **PRD → test cases → explore on a real phone → automate**.

| What | Where |
| --- | --- |
| The app (APK, Android 7.0 and later, 32 KB) | [`tindahan-market-1.0.apk`](tindahan-market-1.0.apk) · direct download: `https://github.com/suresh8883/tindahan-market/raw/main/mobile/tindahan-market-1.0.apk` |
| The app's requirements | [`docs/prd/TM-PRD-12-android-app.md`](docs/prd/TM-PRD-12-android-app.md) (12 acceptance criteria) |
| The ticket card | [`workshop/tickets/TK-9.md`](../workshop/tickets/TK-9.md) |
| Source code | [`android/`](android/) |

SHA-256 of `tindahan-market-1.0.apk`: `1b93fea3ad6019105c6560efa5990ba312622010e171cf96e4b4742ce24a9a93`

## What to know about the app

- **No network, no login, no server.** Everything runs on the phone, so it works on a cloud real device as it is. Closing the app empties the cart.
- **Fixed store clock:** 10 Nov 2026, 8:00 PM (UTC+8), the evening before 11.11. `SALE1111` is valid whatever the phone's date is.
- **Stable element ids for automation:** every button and field has an Android resource id (`ph.tindahan.market:id/cart_button`, `voucher_input`, `summary_total` and so on). The full list is in section 8 of the PRD. Buttons in lists also have a content description such as "Add Barong Tagalog".
- QR Ph is a mock payment screen: the code is drawn for the demo and cannot be scanned.

## Use it with Test Companion

1. In the Test Companion panel, switch **Web** to **App**.
2. **Select App → Browse file** → `mobile/tindahan-market-1.0.apk`. Upload it once; afterwards pick it from **Recently Uploaded Apps**.
3. Follow [TK-9](../workshop/tickets/TK-9.md).

Running apps on cloud real devices uses your session access; automated (Appium) runs on real devices need real-device automation in that access.

## Install it on your own phone (optional)

Download the APK on the phone and open it. Android asks you to allow installs from that source once. The app is signed with a debug key, so Play Protect may warn you; it is the same file as in this repository (check the SHA-256 above).

## Build it yourself (optional)

Needs JDK 17 and the Android SDK (platform 35):

```bash
cd mobile/android
echo "sdk.dir=$HOME/Library/Android/sdk" > local.properties   # your SDK path; this file is git-ignored
./gradlew assembleDebug
# → app/build/outputs/apk/debug/app-debug.apk
```

Checked on an Android 15 emulator (Pixel 9 Pro): all 12 acceptance criteria of the PRD pass.
