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
import android.os.Bundle;
import android.util.Log;
import android.view.WindowManager;

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

}
