/*
 * Anyline Cordova Plugin
 * AnylinePlugin.java
 *
 * Copyright (c) 2015 Anyline GmbH
 *
 * Created by martin at 2015-07-21
 */

package io.anyline.cordova;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;

import io.anyline2.AnylineSdk;
import io.anyline2.CacheConfig;
import io.anyline2.core.LicenseException;
import io.anyline2.WrapperConfig;
import io.anyline2.WrapperInfo;


public class AnylinePlugin extends CordovaPlugin implements ResultReporter.OnResultListener {

    public static final String EXTRA_LICENSE_KEY = "EXTRA_LICENSE_KEY";
    public static final String EXTRA_CONFIG_JSON = "EXTRA_CONFIG_JSON";
    public static final String EXTRA_OCR_CONFIG_JSON = "EXTRA_OCR_CONFIG_JSON";
    public static final String EXTRA_ERROR_MESSAGE = "EXTRA_ERROR_MESSAGE";
    public static final String EXTRA_SCAN_NATIVE_BARCODE = "EXTRA_SCAN_NATIVE_BARCOE";
    public static final int RESULT_CANCELED = 0;
    public static final int RESULT_OK = 1;
    public static final int RESULT_ERROR = 2;
    public static final int REQUEST_BARCODE = 0;
    public static final int REQUEST_METER = 1;
    public static final int REQUEST_MRZ = 2;
    public static final int REQUEST_DEBIT_CARD = 3;
    public static final int REQUEST_ANYLINE_OCR = 4;
    public static final int REQUEST_DOCUMENT = 5;
    public static final int DIGITAL_METER = 6;
    public static final int ANALOG_METER = 7;
    public static final int REQUEST_LICENSE_PLATE = 8;
    public static final int REQUEST_ANYLINE_4 = 9;
    private static final String TAG = AnylinePlugin.class.getSimpleName();
    private CallbackContext callbackContext;
    private String mAction;
    private JSONArray mArgs;

    private static String pluginVersion;
    private static WrapperConfig wrapperConfig;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        this.callbackContext = callbackContext;
        mAction = action;
        mArgs = args;

        cordova.getThreadPool().execute((Runnable) () -> {
            try {
                if ("checkLicense".equals(mAction)) {
                    getLicenseExpirationDate(mArgs.getString(0));
                } else if ("setPluginVersion".equals(mAction)) {
                    setPluginVersion(args.getString(0));
                } else if ("getPluginVersion".equals(mAction)) {
                    getPluginVersion();
                } else if ("initAnylineSDK".equals(mAction)) {
                    boolean enableOfflineCache = args.optBoolean(1, false);
                    initAnylineSDK(args.getString(0), enableOfflineCache);
                } else if ("getSDKVersion".equals(mAction)) {
                    getSDKVersion();
                } else if ("scan".equals(mAction)) {
                    startScanning(mAction, mArgs);
                } else if ("exportCachedEvents".equals(mAction)) {
                    exportCachedEvents();
                }

            } catch (JSONException e) {
                onError(e.getMessage());
            } catch (LicenseException e) {
                onError(e.getMessage());
            } catch (IOException e) {
                onError(e.getMessage());
            }
        });
        return true;
    }

    private static void setPluginVersion(final String version) {
        pluginVersion = version;
        wrapperConfig = new WrapperConfig.Wrapper(
                new WrapperInfo(WrapperInfo.WrapperType.Cordova, pluginVersion)
        );
    }

    private void initAnylineSDK(String licenseKey) throws LicenseException {
        initAnylineSDK(licenseKey, false);
    }
    private void initAnylineSDK(String licenseKey, boolean enableOfflineCache) throws LicenseException {
        Activity activity = cordova.getActivity();

        CacheConfig.Preset cacheConfig = CacheConfig.Preset.Default.INSTANCE;
        if (enableOfflineCache) {
            cacheConfig = CacheConfig.Preset.OfflineLicenseEventCachingEnabled.INSTANCE;
        }
        AnylineSdk.init(licenseKey, activity, "www/assets", cacheConfig, wrapperConfig);
        onResult(new PluginResult(PluginResult.Status.OK, "Anyline SDK init was successful."), true);
    }

    private void getLicenseExpirationDate(String license) throws LicenseException {
        String validDate = AnylineSdk.getExpiryDate().toString();
        onResult(validDate, true);
    }

    private void exportCachedEvents() throws IOException {
        String exportedFile = AnylineSdk.exportCachedEvents();
        if (exportedFile != null) {
            onResult(exportedFile, true);
        } else {
            onError(getString("error_event_cache_empty"));
        }
    }

    private void onError(String errorMessage) {
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, errorMessage));
    }

    private void startScanning(String action, JSONArray args) {
        switch (action) {
            case "scan":
                scan(ScanActivity.class, REQUEST_ANYLINE_4, args);
                break;
            default:
                this.callbackContext.error(getString("error_unkown_scan_mode") + " " + action);
        }
    }

    private void scan(Class<?> activityToStart, int requestCode, JSONArray data) {
        Intent intent = new Intent(cordova.getActivity(), activityToStart);
        ResultReporter.setListener(this);

        try {
            intent.putExtra(EXTRA_CONFIG_JSON, data.getJSONObject(0).toString());
            cordova.startActivityForResult(this, intent, requestCode);
        } catch (JSONException e) {
            onError(getString("error_invalid_json_data"));
            return;
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        ResultReporter.setListener(null);

        if (resultCode == RESULT_OK) {
            //nothing todo, handeled with ResultReporter
        } else if (resultCode == RESULT_CANCELED) {
            this.callbackContext.error("Canceled");
        } else if (resultCode == RESULT_ERROR) {
            this.callbackContext.error(data.getStringExtra(EXTRA_ERROR_MESSAGE));
        }
    }

    private String getString(String stringName) {
        Activity activity = cordova.getActivity();
        return activity.getString(activity.getResources().getIdentifier(stringName, "string", activity.getPackageName()));
    }

    @Override
    public void onResult(Object result, boolean isFinalResult) {

        PluginResult pluginResult;
        if (result instanceof JSONObject) {
            pluginResult = new PluginResult(Status.OK, (JSONObject) result);
        } else if (result instanceof JSONArray) {
            pluginResult = new PluginResult(Status.OK, (JSONArray) result);
        } else {
            pluginResult = new PluginResult(Status.OK, result.toString());
        }
        if (!isFinalResult) {
            pluginResult.setKeepCallback(true);
        }

        this.callbackContext.sendPluginResult(pluginResult);
    }

    private void getPluginVersion() {
        onResult(pluginVersion, true);
    }
    private void getSDKVersion() {
        onResult(at.nineyards.anyline.BuildConfig.VERSION_NAME, true);
    }
}
