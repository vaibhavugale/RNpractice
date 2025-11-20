package com.rnpractice.UPIInstalledAppsModule;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.drawable.Drawable;
import android.util.Base64;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.io.ByteArrayOutputStream;
import java.util.List;

public class UPIInstalledAppsModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public UPIInstalledAppsModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "UPIInstalledApps";
    }

    @ReactMethod
    public void getInstalledUPIAppLists(Promise promise) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(android.net.Uri.parse("upi://pay"));

            PackageManager pm = reactContext.getPackageManager();
            List<ResolveInfo> resolveInfoList = pm.queryIntentActivities(intent, 0);

            WritableArray appArray = Arguments.createArray();

            for (ResolveInfo info : resolveInfoList) {
                WritableMap appInfoMap = Arguments.createMap();

                String packageName = info.activityInfo.packageName;
                String label = info.loadLabel(pm).toString();
                Drawable iconDrawable = info.activityInfo.loadIcon(pm);

                appInfoMap.putString("name", label);
                appInfoMap.putString("package", packageName);
                appInfoMap.putString("icon", drawableToBase64(iconDrawable));

                appArray.pushMap(appInfoMap);
            }

            promise.resolve(appArray);

        } catch (Exception e) {
            promise.reject("UPI_ERROR", e);
        }
    }

    private String drawableToBase64(Drawable drawable) {
        try {
            android.graphics.Bitmap bitmap = android.graphics.Bitmap.createBitmap(
                    drawable.getIntrinsicWidth(),
                    drawable.getIntrinsicHeight(),
                    android.graphics.Bitmap.Config.ARGB_8888
            );

            android.graphics.Canvas canvas = new android.graphics.Canvas(bitmap);
            drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
            drawable.draw(canvas);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, outputStream);

            return Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT);

        } catch (Exception e) {
            return null;
        }
    }
}
