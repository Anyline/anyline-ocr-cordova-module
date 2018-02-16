/*
 * Anyline Cordova Plugin
 * AnylinePlugin.java
 *
 * Copyright (c) 2015 Anyline GmbH
 *
 * Created by martin at 2015-07-21
 */

package io.anyline.cordova;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import at.nineyards.anyline.modules.energy.EnergyScanView;


public class AnylinePlugin extends CordovaPlugin implements ResultReporter.OnResultListener {

    private static final String TAG = AnylinePlugin.class.getSimpleName();

    public static final String EXTRA_LICENSE_KEY = "EXTRA_LICENSE_KEY";
    public static final String EXTRA_CONFIG_JSON = "EXTRA_CONFIG_JSON";
    public static final String EXTRA_OCR_CONFIG_JSON = "EXTRA_OCR_CONFIG_JSON";
    public static final String EXTRA_SCAN_MODE = "EXTRA_SCAN_MODE";
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

    private CallbackContext mCallbackContext;
    private String mAction;
    private JSONArray mArgs;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        mCallbackContext = callbackContext;
        mAction = action;
        mArgs = args;
        Log.d(TAG, "Starting action: " + action);

        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                try {
                    checkPermission();
                } catch (Exception e) {
                    mCallbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, "Camera permission denied"));
                }
            }
        });

        return true;
    }

    private void checkPermission() {
        boolean result = cordova.hasPermission("android.permission.CAMERA");
        if (result) {
            startScanning(mAction, mArgs);
        } else {
            cordova.requestPermission(this, 55433, "android.permission.CAMERA");
        }
    }

    public void onRequestPermissionResult(int requestCode, String[] permissions,
                                          int[] grantResults) throws JSONException
    {
        for(int r:grantResults) {
            if (r == PackageManager.PERMISSION_DENIED) {
                this.mCallbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, "Camera permission denied"));
                return;
            }
        }
        startScanning(mAction, mArgs);
    }

    private void startScanning(String action, JSONArray args) {
        switch (action) {
            case "AUTO_ANALOG_DIGITAL_METER":
                scanEnergy(args, EnergyScanView.ScanMode.AUTO_ANALOG_DIGITAL_METER);
                break;
            case "DIAL_METER":
                scanEnergy(args, EnergyScanView.ScanMode.DIAL_METER);
                break;
            case "DIGITAL_METER":
                scanEnergy(args, EnergyScanView.ScanMode.DIGITAL_METER);
                break;
            case "ANALOG_METER":
                scanEnergy(args, EnergyScanView.ScanMode.ANALOG_METER);
                break;
            case "scanBarcode":
            case "BARCODE":
                scan(BarcodeActivity.class, REQUEST_BARCODE, args);
                break;
            case "scanMRZ":
            case "MRZ":
                scan(MrzActivity.class, REQUEST_MRZ, args);
                break;
            case "DOCUMENT":
                scan(DocumentActivity.class, REQUEST_DOCUMENT, args);
                break;
            case "scanElectricMeter":
            case "ELECTRIC_METER":
                scanEnergy(args, EnergyScanView.ScanMode.ANALOG_METER);
                break;
            case "ELECTRIC_METER_5_1":
                scanEnergy(args, EnergyScanView.ScanMode.ANALOG_METER);
                break;
            case "ANALOG_METER_4":
                scanEnergy(args, EnergyScanView.ScanMode.ANALOG_METER);
                break;
            case "ANALOG_METER_7":
                scanEnergy(args, EnergyScanView.ScanMode.ANALOG_METER);
                break;
            case "ANALOG_METER_WHITE":
                scanEnergy(args, EnergyScanView.ScanMode.ANALOG_METER);
                break;
            case "scanGasMeter":
            case "GAS_METER":
                scanEnergy(args, EnergyScanView.ScanMode.ANALOG_METER);
                break;
            case "GAS_METER_6":
                scanEnergy(args, EnergyScanView.ScanMode.ANALOG_METER);
                break;
            case "WATER_METER_WHITE":
                scanEnergy(args, EnergyScanView.ScanMode.ANALOG_METER);
                break;
            case "WATER_METER_BLACK":
                scanEnergy(args, EnergyScanView.ScanMode.ANALOG_METER);
                break;
            case "HEAT_METER_4":
                scanEnergy(args, EnergyScanView.ScanMode.HEAT_METER_4);
                break;
            case "HEAT_METER_5":
                scanEnergy(args, EnergyScanView.ScanMode.HEAT_METER_5);
                break;
            case "HEAT_METER_6":
                scanEnergy(args, EnergyScanView.ScanMode.HEAT_METER_6);
                break;
            case "SERIAL_NUMBER":
                scanEnergy(args, EnergyScanView.ScanMode.SERIAL_NUMBER);
                break;
             case "DOT_MATRIX_METER":
                scanEnergy(args, EnergyScanView.ScanMode.DOT_MATRIX_METER);
                break;
            case "ANYLINE_OCR":
                scan(AnylineOcrActivity.class, REQUEST_ANYLINE_OCR, args);
                break;
            case "LICENSE_PLATE":
                scan(LicensePlateActivity.class, REQUEST_LICENSE_PLATE, args);
                break;
            case "DRIVING_LICENSE":
                scan(AnylineOcrActivity.class, REQUEST_ANYLINE_OCR, args);
                break;
            default:
                this.mCallbackContext.error(Resources.getString(cordova.getActivity(),
                        "error_unkown_scan_mode") + " " + action);
        }
    }

    private void scan(Class<?> activityToStart, int requestCode, JSONArray data) {
        scan(activityToStart, requestCode, data, null);
    }

    private void scanEnergy(JSONArray data, EnergyScanView.ScanMode modeEnum) {
        scan(EnergyActivity.class, REQUEST_METER, data, modeEnum.name());
    }

    private void scan(Class<?> activityToStart, int requestCode, JSONArray data, String mode) {
        Intent intent = new Intent(cordova.getActivity(), activityToStart);

        try {
            intent.putExtra(EXTRA_LICENSE_KEY, data.getString(0));
            if (data.length() > 1) {
                intent.putExtra(EXTRA_CONFIG_JSON, data.getString(1));
            }
            if (data.length() > 2) {

                //currently we only support native barcode for energy, which will not have a OCR config, so this will be enough
                JSONObject json = data.getJSONObject(2);

                //check if a mode is set. when not it's OCR. When it's set, it's energy
                if (mode == null) {
                    intent.putExtra(EXTRA_OCR_CONFIG_JSON, data.getString(2));
                } else {
                    boolean nativeBarcodeEnabled = json.optBoolean("nativeBarcodeEnabled", false);
                    intent.putExtra(EXTRA_SCAN_NATIVE_BARCODE, nativeBarcodeEnabled);
                }

            }

            if (mode != null) {
                intent.putExtra(EXTRA_SCAN_MODE, mode);
            }


        } catch (JSONException e) {
            this.mCallbackContext.error(Resources.getString(cordova.getActivity(), "error_invalid_json_data"));
            return;
        }
        ResultReporter.setListener(this);
        cordova.startActivityForResult(this, intent, requestCode);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        ResultReporter.setListener(null);
        if (resultCode == RESULT_OK) {
            //nothing todo, handeled with ResultReporter
        } else if (resultCode == RESULT_CANCELED) {
            this.mCallbackContext.error("Canceled");

        } else if (resultCode == RESULT_ERROR) {
            this.mCallbackContext.error(data.getStringExtra(EXTRA_ERROR_MESSAGE));
        }
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

        this.mCallbackContext.sendPluginResult(pluginResult);
    }
}
