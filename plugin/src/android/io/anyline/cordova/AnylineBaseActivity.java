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

import at.nineyards.anyline.camera.CameraController;
import at.nineyards.anyline.camera.CameraOpenListener;

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

}
