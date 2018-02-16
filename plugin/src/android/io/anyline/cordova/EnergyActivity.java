/*
 * Anyline Cordova Plugin
 * EnergyActivity.java
 *
 * Copyright (c) 2015 Anyline GmbH
 *
 * Created by martin at 2015-07-21
 */
package io.anyline.cordova;

import android.content.res.ColorStateList;
import android.graphics.Rect;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;

import java.util.ArrayList;
import java.util.List;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.UUID;

import at.nineyards.anyline.camera.AnylineViewConfig;
import at.nineyards.anyline.camera.CameraController;
import at.nineyards.anyline.models.AnylineImage;
import at.nineyards.anyline.modules.energy.EnergyResultListener;
import at.nineyards.anyline.modules.energy.EnergyScanView;
import at.nineyards.anyline.modules.energy.EnergyResult;
import at.nineyards.anyline.util.TempFileUtil;
import at.nineyards.anyline.modules.barcode.NativeBarcodeResultListener;
import at.nineyards.anyline.modules.barcode.BarcodeScanView;

import android.util.SparseArray;

import com.google.android.gms.vision.barcode.Barcode;


public class EnergyActivity extends AnylineBaseActivity {
    private static final String TAG = EnergyActivity.class.getSimpleName();

    private EnergyScanView energyScanView;
    private RadioGroup radioGroup;
    private CordovaUIConfig cordovaUiConfig;
    private boolean nativeBarcodeEnabled;
    private List<String> barcodeList;
    private JSONArray jsonArray;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String scanModeString = getIntent().getStringExtra(AnylinePlugin.EXTRA_SCAN_MODE);
        nativeBarcodeEnabled = getIntent().getBooleanExtra(AnylinePlugin.EXTRA_SCAN_NATIVE_BARCODE, false);

        energyScanView = new EnergyScanView(this, null);

        JSONObject jsonObject;
        try {
            jsonObject = new JSONObject(configJson);
        } catch (Exception e) {
            //JSONException or IllegalArgumentException is possible, return it to javascript
            finishWithError(Resources.getString(this, "error_invalid_json_data") + "\n" + e.getLocalizedMessage());
            return;
        }

        // Set serial number specific configurations
        if (jsonObject.has("serialNumber")) {
            try {
                JSONObject serialNumberConfig = jsonObject.getJSONObject("serialNumber");

                // Set the character whitelist (all the characters that may occur in the data that should be recognized)
                // as a string for the Serialnumber scan mode.
                if (serialNumberConfig.has("numberCharWhitelist")) {
                    Log.d("WhiteList", serialNumberConfig.getString("numberCharWhitelist"));
                    energyScanView.setSerialNumberCharWhitelist(serialNumberConfig.getString("numberCharWhitelist"));
                }

                // Set a validation regex string for the Serialnumber scan mode.
                if (serialNumberConfig.has("validationRegex")) {
                    Log.d("Regex", serialNumberConfig.getString("validationRegex"));
                    energyScanView.setSerialNumberValidationRegex(serialNumberConfig.getString("validationRegex"));
                }
            } catch (JSONException e) {
                e.printStackTrace();
                finishWithError("error_invalid_json_serial_number_config");
                return;
            }
        }

        energyScanView.setConfig(new AnylineViewConfig(this, jsonObject));
        if (jsonObject.has("reportingEnabled")) {
            energyScanView.setReportingEnabled(jsonObject.optBoolean("reportingEnabled", true));
        }
        energyScanView.setScanMode(EnergyScanView.ScanMode.valueOf(scanModeString));

        cordovaUiConfig = new CordovaUIConfig(this, jsonObject);

        // Creating a new RelativeLayout
        final RelativeLayout relativeLayout = new RelativeLayout(this);

        // Defining the RelativeLayout layout parameters.
        // In this case I want to fill its parent
        RelativeLayout.LayoutParams matchParentParams = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.MATCH_PARENT);

        relativeLayout.addView(energyScanView, matchParentParams);

        ArrayList<String> titles = cordovaUiConfig.getTitles();
        final ArrayList<String> modes = cordovaUiConfig.getModes();

        if (titles != null && titles.size() > 0) {

            if (titles.size() != modes.size()) {
                finishWithError(Resources.getString(this, "error_invalid_segment_config"));
            }

            RadioButton[] radioButtons = new RadioButton[titles.size()];
            radioGroup = new RadioGroup(this);
            radioGroup.setOrientation(RadioGroup.VERTICAL);

            int currentApiVersion = android.os.Build.VERSION.SDK_INT;
            for (int i = 0; i < titles.size(); i++) {
                radioButtons[i] = new RadioButton(this);
                radioButtons[i].setText(titles.get(i));

                if (currentApiVersion >= Build.VERSION_CODES.LOLLIPOP) {
                    radioButtons[i].setButtonTintList(ColorStateList.valueOf(cordovaUiConfig.getTintColor()));
                }

                radioGroup.addView(radioButtons[i]);
            }

            Integer modeIndex = modes.indexOf(scanModeString);
            RadioButton button = radioButtons[modeIndex];
            button.setChecked(true);

            radioGroup.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(RadioGroup group, int checkedId) {
                    View button = group.findViewById(checkedId);
                    String mode = modes.get(group.indexOfChild(button));
                    energyScanView.setScanMode(EnergyScanView.ScanMode.valueOf(mode));
                    energyScanView.startScanning();
                }
            });

            RelativeLayout.LayoutParams lp = new RelativeLayout.LayoutParams(
                    RelativeLayout.LayoutParams.WRAP_CONTENT,
                    RelativeLayout.LayoutParams.WRAP_CONTENT);
            lp.addRule(RelativeLayout.ALIGN_PARENT_TOP);

            radioGroup.setVisibility(View.INVISIBLE);

            relativeLayout.addView(radioGroup, lp);
        }

        setContentView(relativeLayout, matchParentParams);

        initAnyline();
    }

    @Override
    protected void onResume() {
        super.onResume();

        energyScanView.startScanning();
    }

    @Override
    protected void onPause() {
        super.onPause();
        energyScanView.cancelScanning();
        energyScanView.releaseCameraInBackground();
    }

    @Override
    public void onCameraOpened(CameraController cameraController, int width, int height) {
        super.onCameraOpened(cameraController, width, height);
        energyScanView.post(new Runnable() {
            @Override
            public void run() {
                if (radioGroup != null) {
                    Rect rect = energyScanView.getCutoutRect();

                    RelativeLayout.LayoutParams lp = (RelativeLayout.LayoutParams) radioGroup.getLayoutParams();
                    lp.setMargins(rect.left + cordovaUiConfig.getOffsetX(), rect.top + cordovaUiConfig.getOffsetY(), 0, 0);
                    radioGroup.setLayoutParams(lp);

                    radioGroup.setVisibility(View.VISIBLE);
                }
            }
        });
    }

    @Override
    public void onCameraError(Exception e) {
        //This is called if the camera could not be opened.
        // (e.g. If there is no camera or the permission is denied)
        // This is useful to present an alternative way to enter the required data if no camera exists.
        throw new RuntimeException(e);
    }

    private void initAnyline() {

        if (nativeBarcodeEnabled) {
            barcodeList = new ArrayList<String>();
            jsonArray = new JSONArray();

            energyScanView.enableBarcodeDetection(true, new NativeBarcodeResultListener() {
                @Override
                public void onBarcodesReceived(SparseArray<Barcode> barcodes) {
                    if (barcodes.size() > 0) {
                        for (int i = 0; i < barcodes.size(); i++) {
                            if (!barcodeList.contains(barcodes.valueAt(i).rawValue)) {
                                barcodeList.add(barcodes.valueAt(i).rawValue);
                                jsonArray.put(wrapBarcodeInJson(barcodes.valueAt(i)));
                            }
                        }

                    }
                }
            });
        }


        energyScanView.setCameraOpenListener(this);

        energyScanView.initAnyline(licenseKey, new EnergyResultListener() {

            @Override
            public void onResult(EnergyResult energyResult) {
                JSONObject jsonResult = new JSONObject();
                EnergyScanView.ScanMode scanMode = energyResult.getScanMode();

                try {
                    switch (scanMode) {
                        case DIGITAL_METER:
                            jsonResult.put("meterType", "Digital Meter");
                            break;
                        case DIAL_METER:
                            jsonResult.put("meterType", "Dial Meter");
                            break;
                        case ANALOG_METER:
                            jsonResult.put("meterType", "Analog Meter");
                            break;
                        case AUTO_ANALOG_DIGITAL_METER:
                            jsonResult.put("meterType", "Auto Analog Digital Meter");
                            break;
                        case HEAT_METER_4:
                        case HEAT_METER_5:
                        case HEAT_METER_6:
                            jsonResult.put("meterType", "Heat Meter");
                            break;
                        case SERIAL_NUMBER:
                            jsonResult.put("meterType", "Serial Number");
                            break;
                        default:
                            jsonResult.put("meterType", "Electric Meter");
                            break;
                    }

                    jsonResult.put("scanMode", scanMode.toString());
                    jsonResult.put("reading", energyResult.getResult());

                    //Quickfix for Dial Meter Alpha ScanMode Bug
                    String scanModeConfig = getIntent().getStringExtra(AnylinePlugin.EXTRA_SCAN_MODE);
                    if(!scanModeConfig.equals("DIAL_METER")) {
                        jsonResult.put("outline", jsonForOutline(energyResult.getOutline()));
                    }
                    jsonResult.put("confidence", energyResult.getConfidence());


                    File imageFile = TempFileUtil.createTempFileCheckCache(EnergyActivity.this,
                            UUID.randomUUID().toString(), ".jpg");

                    energyResult.getCutoutImage().save(imageFile, 90);
                    jsonResult.put("imagePath", imageFile.getAbsolutePath());

                    if (energyResult.getFullImage() != null) {
                        imageFile = TempFileUtil.createTempFileCheckCache(EnergyActivity.this,
                                UUID.randomUUID().toString(), ".jpg");
                        energyResult.getFullImage().save(imageFile, 90);
                        jsonResult.put("fullImagePath", imageFile.getAbsolutePath());
                    }
                    if (jsonArray != null) {
                        jsonResult.put("detectedBarcodes", jsonArray);
                    }

                } catch (IOException e) {
                    Log.e(TAG, "Image file could not be saved.", e);

                } catch (JSONException jsonException) {
                    //should not be possible
                    Log.e(TAG, "Error while putting image path to json.", jsonException);
                }


                if (energyScanView.getConfig().isCancelOnResult()) {
                    ResultReporter.onResult(jsonResult, true);
                    setResult(AnylinePlugin.RESULT_OK);
                    finish();
                } else {
                    ResultReporter.onResult(jsonResult, false);
                }
            }
        });
        energyScanView.getAnylineController().setWorkerThreadUncaughtExceptionHandler(this);
    }

    private JSONObject wrapBarcodeInJson(Barcode b) {
        JSONObject json = new JSONObject();

        try {
            json.put("value", b.rawValue);
            json.put("format", findValidFormatForReference(b.format));
        } catch (JSONException jsonException) {
            //should not be possible
            Log.e(TAG, "Error while putting image path to json.", jsonException);
        }
        return json;
    }

    private String findValidFormatForReference(int format) {
        if (format == Barcode.AZTEC) {
            return BarcodeScanView.BarcodeFormat.AZTEC.toString();
        }
        if (format == Barcode.CODABAR) {
            return BarcodeScanView.BarcodeFormat.CODABAR.toString();
        }
        if (format == Barcode.CODE_39) {
            return BarcodeScanView.BarcodeFormat.CODE_39.toString();
        }
        if (format == Barcode.CODE_93) {
            return BarcodeScanView.BarcodeFormat.CODE_93.toString();
        }
        if (format == Barcode.CODE_128) {
            return BarcodeScanView.BarcodeFormat.CODE_128.toString();
        }
        if (format == Barcode.DATA_MATRIX) {
            return BarcodeScanView.BarcodeFormat.DATA_MATRIX.toString();
        }
        if (format == Barcode.EAN_8) {
            return BarcodeScanView.BarcodeFormat.EAN_8.toString();
        }
        if (format == Barcode.EAN_13) {
            return BarcodeScanView.BarcodeFormat.EAN_13.toString();
        }
        if (format == Barcode.ITF) {
            return BarcodeScanView.BarcodeFormat.ITF.toString();
        }
        if (format == Barcode.PDF417) {
            return BarcodeScanView.BarcodeFormat.PDF_417.toString();
        }
        if (format == Barcode.QR_CODE) {
            return BarcodeScanView.BarcodeFormat.QR_CODE.toString();
        }
        if (format == Barcode.UPC_A) {
            return BarcodeScanView.BarcodeFormat.UPC_A.toString();
        }
        if (format == Barcode.UPC_E) {
            return BarcodeScanView.BarcodeFormat.UPC_E.toString();
        }

        //others are currently not supported by the native scanner (RSS_14, RSS_EXPANDED, UPC_EAN_EXTENSION)
        return BarcodeScanView.BarcodeFormat.UNKNOWN.toString();

    }

}
