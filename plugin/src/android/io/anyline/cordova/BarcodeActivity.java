/*
 * Anyline Cordova Plugin
 * BarcodeActivity.java
 *
 * Copyright (c) 2015 Anyline GmbH
 *
 * Created by martin at 2015-07-21
 */
package io.anyline.cordova;

import android.os.Bundle;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import at.nineyards.anyline.camera.AnylineViewConfig;
import at.nineyards.anyline.camera.CameraController;
import at.nineyards.anyline.camera.CameraOpenListener;

import at.nineyards.anyline.models.AnylineImage;
import at.nineyards.anyline.modules.barcode.BarcodeResult;
import at.nineyards.anyline.modules.barcode.BarcodeResultListener;
import at.nineyards.anyline.modules.barcode.BarcodeScanView;
import at.nineyards.anyline.util.TempFileUtil;

public class BarcodeActivity extends AnylineBaseActivity implements CameraOpenListener{
    private static final String TAG = BarcodeActivity.class.getSimpleName();

    private BarcodeScanView barcodeScanView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        barcodeScanView = new BarcodeScanView(this, null);
        try {
            JSONObject json = new JSONObject(configJson);
            barcodeScanView.setConfig(new AnylineViewConfig(this, json));
        } catch (Exception e) {
            //JSONException or IllegalArgumentException is possible, return it to javascript
            finishWithError(Resources.getString(this, "error_invalid_json_data") + "\n" + e.getLocalizedMessage());
            return;
        }

        barcodeScanView.setCameraOpenListener(this);

        setContentView(barcodeScanView);

        initAnyline();
    }

    @Override
    protected void onResume() {
        super.onResume();
        barcodeScanView.startScanning();
    }

    @Override
    protected void onPause() {
        super.onPause();
        barcodeScanView.cancelScanning();
        barcodeScanView.releaseCameraInBackground();
    }

    @Override
    public void onCameraOpened(CameraController cameraController, int width, int height) {
        //the camera is opened async and this is called when the opening is finished
        Log.d(TAG, "Camera opened successfully. Frame resolution " + width + " x " + height);
    }

    @Override
    public void onCameraError(Exception e) {
        //This is called if the camera could not be opened.
        // (e.g. If there is no camera or the permission is denied)
        // This is useful to present an alternative way to enter the required data if no camera exists.
        throw new RuntimeException(e);
    }

    private void initAnyline() {
        barcodeScanView.setCameraOpenListener(this);

        barcodeScanView.initAnyline(licenseKey, new BarcodeResultListener() {
            @Override
            public void onResult(BarcodeResult result) {

                JSONObject jsonResult = new JSONObject();
                try {

                    jsonResult.put("value", result.getResult());
                    jsonResult.put("format", result.getBarcodeFormat());

                    jsonResult.put("outline", jsonForOutline(result.getOutline()));
                    jsonResult.put("confidence", result.getConfidence());

                    File imageFile = TempFileUtil.createTempFileCheckCache(BarcodeActivity.this,
                            UUID.randomUUID().toString(), ".jpg");

                    result.getCutoutImage().save(imageFile, 90);
                    jsonResult.put("imagePath", imageFile.getAbsolutePath());

                } catch (IOException e) {
                    Log.e(TAG, "Image file could not be saved.", e);

                } catch (JSONException jsonException) {
                    //should not be possible
                    Log.e(TAG, "Error while putting image path to json.", jsonException);
                }

                if (barcodeScanView.getConfig().isCancelOnResult()) {
                    ResultReporter.onResult(jsonResult, true);
                    setResult(AnylinePlugin.RESULT_OK);
                    finish();
                } else {
                    ResultReporter.onResult(jsonResult, false);
                }
            }
        });
        barcodeScanView.getAnylineController().setWorkerThreadUncaughtExceptionHandler(this);
    }

}
