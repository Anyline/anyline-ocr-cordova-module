/*
 * Anyline Cordova Plugin
 * AnylineBaseActivity.java
 *
 * Copyright (c) 2015 Anyline GmbH
 *
 * Created by martin at 2015-12-09
 */
package io.anyline.cordova;

import android.app.Activity;
import android.content.Intent;
import android.hardware.Camera;
import android.graphics.PointF;
import android.os.Bundle;
import android.util.Log;
import android.view.WindowManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import at.nineyards.anyline.camera.CameraConfig;
import at.nineyards.anyline.camera.CameraController;
import at.nineyards.anyline.camera.CameraFeatures;
import at.nineyards.anyline.camera.CameraOpenListener;
import io.anyline.plugin.barcode.BarcodeScanViewPlugin;
import io.anyline.plugin.id.IdScanViewPlugin;
import io.anyline.plugin.licenseplate.LicensePlateScanViewPlugin;
import io.anyline.plugin.meter.MeterScanViewPlugin;
import io.anyline.plugin.ocr.OcrScanViewPlugin;
import io.anyline.view.AbstractBaseScanViewPlugin;
import io.anyline.view.ParallelScanViewComposite;
import io.anyline.view.SerialScanViewComposite;
//import io.anyline.view.ScanViewPlugin;

public abstract class AnylineBaseActivity extends Activity
        implements CameraOpenListener, Thread.UncaughtExceptionHandler {

    private static final String TAG = AnylineBaseActivity.class.getSimpleName();

    protected String licenseKey;
    protected String configJson;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        licenseKey = getIntent().getExtras().getString(AnylinePlugin.EXTRA_LICENSE_KEY, "");
        configJson = getIntent().getExtras().getString(AnylinePlugin.EXTRA_CONFIG_JSON, "");
    }

    /**
     * Always set this like this after the initAnyline: <br/>
     * scanView.getAnylineController().setWorkerThreadUncaughtExceptionHandler(this);<br/>
     * <br/>
     * This will forward background errors back to the plugin (and back to javascript from there)
     */
    @Override
    public void uncaughtException(Thread thread, Throwable e) {
        String msg = e.getMessage();
        Log.e(TAG, "Cached uncaught exception", e);

        String errorMessage;
        if (msg.contains("license") || msg.contains("License")) {
            errorMessage = Resources.getString(this, "error_licence_invalid") + "\n\n" + msg;
        } else {
            errorMessage = Resources.getString(this, "error_occured") + "\n\n" + e.getLocalizedMessage();
        }

        finishWithError(errorMessage);
    }

    protected void finishWithError(String errorMessage) {
        Intent data = new Intent();
        data.putExtra(AnylinePlugin.EXTRA_ERROR_MESSAGE, errorMessage);
        setResult(AnylinePlugin.RESULT_ERROR, data);
        finish();
    }

    @Override
    public void onCameraOpened(CameraController cameraController, int width, int height) {
        Log.d(TAG, "Camera opened. Frame size " + width + " x " + height + ".");
    }

    @Override
    public void onCameraError(Exception e) {
        finishWithError(Resources.getString(this, "error_accessing_camera") + "\n" + e.getLocalizedMessage());
    }

    protected ArrayList getArrayListFromJsonArray(JSONArray jsonObject) {
        ArrayList<Double> listdata = new ArrayList<Double>();
        JSONArray jArray = jsonObject;
        try {
            for (int i = 0; i < jArray.length(); i++) {
                listdata.add(jArray.getDouble(i));
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return listdata;
    }

    protected String jsonForOutline(List<PointF> pointList) {

        if (pointList == null || pointList.size() <= 0) {
            return "No Outline";
        }

        JSONObject upLeft = new JSONObject();
        JSONObject upRight = new JSONObject();
        JSONObject downRight = new JSONObject();
        JSONObject downLeft = new JSONObject();
        JSONObject outline = new JSONObject();

        try {
            upLeft.put("x", pointList.get(0).x);
            upLeft.put("y", pointList.get(0).y);

            upRight.put("x", pointList.get(1).x);
            upRight.put("y", pointList.get(1).y);

            downRight.put("x", pointList.get(2).x);
            downRight.put("y", pointList.get(2).y);

            downLeft.put("x", pointList.get(3).x);
            downLeft.put("y", pointList.get(3).y);

            outline.put("upLeft", upLeft);
            outline.put("upRight", upRight);
            outline.put("downRight", downRight);
            outline.put("downLeft", downLeft);


        } catch (JSONException e) {
            Log.d(TAG, e.toString());
            e.printStackTrace();
        }

        return outline.toString();
    }

    protected void setFocusConfig (JSONObject json, CameraConfig camConfig) throws JSONException {

        if (json.has("focus")) {
            JSONObject focusConfig = json.getJSONObject("focus");

            // change default focus mode to auto (works better if cutout is not in the center)
            switch (focusConfig.getString("mode")) {
                case ("AUTO"):
                default:
                    camConfig.setFocusMode(CameraFeatures.FocusMode.AUTO);
                    break;
                case ("MACRO"):
                    camConfig.setFocusMode(CameraFeatures.FocusMode.MACRO);
                    break;
                case ("CONTINUOUS_PICTURE"):
                    camConfig.setFocusMode(CameraFeatures.FocusMode.CONTINUOUS_PICTURE);
                    break;
                case ("CONTINUOUS_VIDEO"):
                    camConfig.setFocusMode(CameraFeatures.FocusMode.CONTINUOUS_VIDEO);
                    break;
                case ("EDOF"):
                    camConfig.setFocusMode(CameraFeatures.FocusMode.EDOF);
                    break;
                case ("FIXED"):
                    camConfig.setFocusMode(CameraFeatures.FocusMode.FIXED);
                    break;
                case ("INFINITY"):
                    camConfig.setFocusMode(CameraFeatures.FocusMode.INFINITY);
                    break;
                case ("OFF"):
                    camConfig.setFocusMode(CameraFeatures.FocusMode.OFF);
                    break;
            }
            // autofocus is called in this interval (8000 is default)
            if(focusConfig.has("interval")){
                camConfig.setAutoFocusInterval(focusConfig.getInt("interval"));
            }
            // call autofocus if view is touched (true is default)
            if(focusConfig.has("touchEnabled")){
                camConfig.setFocusOnTouchEnabled(focusConfig.getBoolean("touchEnabled"));
            }
            // focus where the cutout is (true is default)
            if(focusConfig.has("regionEnabled")){
                camConfig.setFocusRegionEnabled(focusConfig.getBoolean("regionEnabled"));
            }
            // automatic exposure calculation based on where the cutout is (true is default)
            if(focusConfig.has("autoExposureRegionEnabled")){
                camConfig.setAutoExposureRegionEnabled(focusConfig.getBoolean("autoExposureRegionEnabled"));
            }
        }
    }

    protected void setResult(AbstractBaseScanViewPlugin scanViewPlugin, JSONObject jsonResult){
        Boolean isCancelOnResult = true;
        if (scanViewPlugin instanceof MeterScanViewPlugin) {
            isCancelOnResult = ((MeterScanViewPlugin) scanViewPlugin).getScanViewPluginConfig().isCancelOnResult();
        } else if (scanViewPlugin instanceof BarcodeScanViewPlugin) {
            isCancelOnResult = ((BarcodeScanViewPlugin) scanViewPlugin).getScanViewPluginConfig().isCancelOnResult();
        } else if (scanViewPlugin instanceof IdScanViewPlugin) {
            isCancelOnResult = ((IdScanViewPlugin) scanViewPlugin).getScanViewPluginConfig().isCancelOnResult();
        } else if (scanViewPlugin instanceof LicensePlateScanViewPlugin) {
            isCancelOnResult = ((LicensePlateScanViewPlugin) scanViewPlugin).getScanViewPluginConfig().isCancelOnResult();
        } else if (scanViewPlugin instanceof OcrScanViewPlugin) {
            isCancelOnResult = ((OcrScanViewPlugin) scanViewPlugin).getScanViewPluginConfig().isCancelOnResult();
        } else if (scanViewPlugin instanceof SerialScanViewComposite) {
            isCancelOnResult = ((SerialScanViewComposite) scanViewPlugin).getScanViewPluginConfig().isCancelOnResult();
        } else if (scanViewPlugin instanceof ParallelScanViewComposite) {
            isCancelOnResult = ((ParallelScanViewComposite) scanViewPlugin).getScanViewPluginConfig().isCancelOnResult();
        }

        if(scanViewPlugin != null && isCancelOnResult){
            //if(scanViewPlugin != null && scanViewPlugin.getScanViewPluginConfig().isCancelOnResult()){
            ResultReporter.onResult(jsonResult, true);
            setResult(AnylinePlugin.RESULT_OK);
            finish();
        }else{
            ResultReporter.onResult(jsonResult, false);
        }

    }

}
