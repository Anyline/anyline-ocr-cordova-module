package io.anyline.cordova;

import static io.anyline.cordova.AnylinePlugin.EXTRA_CONFIG_JSON;
import static io.anyline.cordova.AnylinePlugin.EXTRA_ERROR_MESSAGE;
import static io.anyline.cordova.AnylinePlugin.RESULT_ERROR;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.coordinatorlayout.widget.CoordinatorLayout;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import io.anyline2.ScanResult;
import io.anyline2.view.ScanView;
import io.anyline2.viewplugin.ViewPluginBase;

public class ScanActivity extends AppCompatActivity {

    private static final String KEY_DEFAULT_ORIENTATION_APPLIED = "default_orientation_applied";

    private ScanView scanView;
    private float dpFactor = 0;
    private boolean defaultOrientationApplied;
    private int orientation;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getResources().getIdentifier("activity_scan", "layout", getPackageName()));

        dpFactor = getResources().getDisplayMetrics().density;

        orientation = this.getResources().getConfiguration().orientation;

        scanView = findViewById(getResources().getIdentifier("scan_view", "id", getPackageName()));

        if (savedInstanceState != null) {
            defaultOrientationApplied = savedInstanceState.getBoolean(KEY_DEFAULT_ORIENTATION_APPLIED);
        }

        if (getIntent().hasExtra(EXTRA_CONFIG_JSON)) {

            try {
                JSONObject configJSON = new JSONObject(getIntent().getStringExtra(EXTRA_CONFIG_JSON));

                applyDefaultOrientation(configJSON);
                setupChangeOrientationButton(configJSON);

                scanView.init(configJSON);

                ViewPluginBase viewPluginBase = scanView.getScanViewPlugin();

                viewPluginBase.resultReceived = scanResult -> {
                    setResult(AnylinePlugin.RESULT_OK);
                    JSONObject resultObject = getResultWithImagePath(scanResult);
                    ResultReporter.onResult(resultObject, true);
                    finish();
                };

                viewPluginBase.resultsReceived = scanResults -> {
                    JSONArray resultJSONArray = new JSONArray();

                    for (ScanResult scanResult : scanResults) {
                        JSONObject resultObject = getResultWithImagePath(scanResult);
                        resultJSONArray.put(resultObject);
                    }
                    setResult(AnylinePlugin.RESULT_OK);
                    ResultReporter.onResult(resultJSONArray, true);
                    finish();
                };
            } catch (JSONException e) {
                finishWithError("Error parsing view config: " + e.getMessage());
            }
        } else {
            finishWithError("View config not found");
        }
    }

    private void applyDefaultOrientation(JSONObject configJSON) {
        if (defaultOrientationApplied) return;

        JSONObject optionsJsonObject = configJSON.optJSONObject("options");

        if (optionsJsonObject != null) {
            String defaultOrientationJsonString = optionsJsonObject.optString("defaultOrientation", "");

            if ("portrait".equals(defaultOrientationJsonString)) {
                setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
            } else if ("landscape".equals(defaultOrientationJsonString)) {
                setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
            }
        }
        defaultOrientationApplied = true;
    }

    private View getViewById(String id) {
        return findViewById(getResources()
                .getIdentifier(
                        id,
                        "id",
                        getPackageName()
                ));
    }

    private void setupChangeOrientationButton(JSONObject configJSON) {
        LinearLayout layoutChangeOrientation = (LinearLayout) getViewById("layout_change_orientation");
        layoutChangeOrientation.setVisibility(View.GONE);
        JSONObject optionsJsonObject = configJSON.optJSONObject("options");

        if (optionsJsonObject != null) {

            JSONObject rotateButtonJson = optionsJsonObject.optJSONObject("rotateButton");
            if (rotateButtonJson != null) {
                RotateButtonConfig rotateButtonConfig = new RotateButtonConfig(rotateButtonJson);

                CoordinatorLayout.LayoutParams buttonLayoutParams = new CoordinatorLayout.LayoutParams(
                        CoordinatorLayout.LayoutParams.WRAP_CONTENT,
                        CoordinatorLayout.LayoutParams.WRAP_CONTENT);

                buttonLayoutParams.gravity = Gravity.TOP | Gravity.RIGHT;
                String alignment = rotateButtonConfig.getAlignment();
                if (alignment.length() > 0) {
                    if (alignment.equals("top_left")) {
                        buttonLayoutParams.gravity = Gravity.TOP | Gravity.LEFT;
                    }
                    if (alignment.equals("top_right")) {
                        buttonLayoutParams.gravity = Gravity.TOP | Gravity.RIGHT;
                    }
                    if (alignment.equals("bottom_left")) {
                        buttonLayoutParams.gravity = Gravity.BOTTOM | Gravity.LEFT;
                    }
                    if (alignment.equals("bottom_right")) {
                        buttonLayoutParams.gravity = Gravity.BOTTOM | Gravity.RIGHT;
                    }
                }
                if (rotateButtonConfig.hasOffset()) {
                    buttonLayoutParams.setMargins(rotateButtonConfig.getOffset().getX(), rotateButtonConfig.getOffset().getY(), 0, 0);
                }
                layoutChangeOrientation.setLayoutParams(buttonLayoutParams);
                layoutChangeOrientation.requestLayout();

                layoutChangeOrientation.setVisibility(View.VISIBLE);
                getViewById("imageviewChangeOrientation").setOnClickListener(v -> {
                    if (orientation == ActivityInfo.SCREEN_ORIENTATION_PORTRAIT) {
                        orientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE;
                        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
                    } else {
                        orientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT;
                        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
                    }
                });
            }
        }
    }

    @NonNull
    private JSONObject getResultWithImagePath(ScanResult scanResult) {
        JSONObject resultObject = scanResult.getResult();

        try {
            String fullImagePath = scanResult.getImage().save();
            String cutoutImagePath = scanResult.getCutoutImage().save();
            resultObject.put("fullImagePath", fullImagePath);
            resultObject.put("imagePath", cutoutImagePath);
        } catch (Exception e) {
            finishWithError("Couldn't parse result: " + e.getMessage());
        }
        return resultObject;
    }

    private void finishWithError(String errorMessage) {
        Intent intent = new Intent();
        intent.putExtra(EXTRA_ERROR_MESSAGE, errorMessage);
        setResult(RESULT_ERROR, intent);
        finish();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putBoolean(KEY_DEFAULT_ORIENTATION_APPLIED, defaultOrientationApplied);
    }

    @Override
    protected void onResume() {
        super.onResume();
        scanView.start();
    }

    @Override
    protected void onPause() {
        scanView.stop();
        scanView.getCameraView().releaseCameraInBackground();
        super.onPause();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
    }
}
