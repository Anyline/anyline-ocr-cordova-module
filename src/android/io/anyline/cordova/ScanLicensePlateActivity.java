package io.anyline.cordova;

import android.os.Bundle;
import android.util.Log;
import android.view.WindowManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import at.nineyards.anyline.AnylineDebugListener;
import at.nineyards.anyline.camera.AnylineViewConfig;
import at.nineyards.anyline.core.RunFailure;
import at.nineyards.anyline.core.Vector_Contour;
import at.nineyards.anyline.modules.ocr.AnylineOcrConfig;
import at.nineyards.anyline.modules.ocr.AnylineOcrResult;
import at.nineyards.anyline.modules.ocr.AnylineOcrResultListener;
import at.nineyards.anyline.modules.ocr.AnylineOcrScanView;
import at.nineyards.anyline.util.AssetUtil;
import at.nineyards.anyline.util.TempFileUtil;

public class ScanLicensePlateActivity extends AnylineBaseActivity {

    private static final String TAG = ScanLicensePlateActivity.class.getSimpleName();
    protected AnylineOcrScanView scanView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //Set the flag to keep the screen on (otherwise the screen may go dark during scanning)
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        String ocrConfigString = getIntent().getExtras().getString(AnylinePlugin.EXTRA_OCR_CONFIG_JSON, "");

        scanView = new AnylineOcrScanView(this, null);




        try {
            JSONObject json = new JSONObject(configJson);
            scanView.setConfig(new AnylineViewConfig(this, json));

            json = new JSONObject(ocrConfigString);
            
            AnylineOcrConfig ocrConfig = new AnylineOcrConfig(json);

            String customCmdFile = json.getString("aleFile");
            ocrConfig.setCustomCmdFile(customCmdFile);
            if (ocrConfig.getCustomCmdFile() != null) {
                //custom cmd file in cordova is relative to www, so add www
                ocrConfig.setCustomCmdFile("www/assets/" + ocrConfig.getCustomCmdFile());
            }

            JSONArray tesseractArray = json.optJSONArray("traineddataFiles");
            if (tesseractArray != null) {
                String[] languages = new String[tesseractArray.length()];
                for (int i = 0; i < languages.length; i++) {
                    long start = System.currentTimeMillis();
                    File dirToCopyTo = new File(this.getFilesDir(), "anyline/module_anyline_ocr/tessdata/");
                    String traineddataFilePath = tesseractArray.getString(i);

                    int lastFileSeparatorIndex = traineddataFilePath.lastIndexOf(File.separator);
                    int lastDotIndex = traineddataFilePath.lastIndexOf(".");
                    if (lastDotIndex > lastFileSeparatorIndex) {
                        //start after the "/" or with 0 if no fileseperator was found
                        languages[i] = traineddataFilePath.substring(lastFileSeparatorIndex + 1, lastDotIndex);
                    } else {
                        //maybe it should just fail here, case propably not useful
                        languages[i] = traineddataFilePath.substring(lastFileSeparatorIndex + 1);
                    }
                    AssetUtil.copyAssetFileWithoutPath(this, "www/" + traineddataFilePath, dirToCopyTo, false);
                    Log.v(TAG, "Copy traineddata duration: " + (System.currentTimeMillis() - start));
                }
                ocrConfig.setTesseractLanguages(languages);
            }

            // set the ocr config
            scanView.setAnylineOcrConfig(ocrConfig);

        } catch (Exception e) {
            // JSONException or IllegalArgumentException is possible for errors in json
            // IOException is possible for errors during asset copying
            finishWithError(Resources.getString(this, "error_invalid_json_data") + "\n" + e.getLocalizedMessage());
        }

        setContentView(scanView);

        initAnyline();
    }

    private void initAnyline() {

        scanView.initAnyline(licenseKey, new AnylineOcrResultListener() {
            @Override
            public void onResult(AnylineOcrResult anylineOcrResult) {
                // Called when a valid result is found
                String results[] = anylineOcrResult.getResult().split("-");
                String country = results[0];
                String licensePlate = results[1];

                JSONObject jsonResult = new JSONObject();

                try {
                    jsonResult.put("country", country);
                    jsonResult.put("licensePlate", licensePlate);

                    jsonResult.put("outline", jsonForOutline(anylineOcrResult.getOutline()));
                    jsonResult.put("confidence", anylineOcrResult.getConfidence());


                    File imageFile = TempFileUtil.createTempFileCheckCache(ScanLicensePlateActivity.this,
                            UUID.randomUUID().toString(), ".jpg");
                    anylineOcrResult.getCutoutImage().save(imageFile, 90);
                    jsonResult.put("imagePath", imageFile.getAbsolutePath());

                } catch (IOException e) {
                    Log.e(TAG, "Image file could not be saved.", e);

                } catch (JSONException jsonException) {
                    //should not be possible
                    Log.e(TAG, "Error while puting result data to json.", jsonException);
                }

                if (scanView.getConfig().isCancelOnResult()) {
                    ResultReporter.onResult(jsonResult, true);
                    setResult(AnylinePlugin.RESULT_OK);
                    finish();
                } else {
                    ResultReporter.onResult(jsonResult, false);
                }


                Log.d("LICENSEPLATE", licensePlate);
            }
        });
    }


    private void setDebugListener() {
        scanView.setDebugListener(new AnylineDebugListener() {
            @Override
            public void onDebug(String name, Object value) {

                if(name.equals(AnylineDebugListener.BRIGHTNESS_VARIABLE_NAME) && value.getClass().equals
                        (AnylineDebugListener.BRIGHTNESS_VARIABLE_CLASS)){
                    Double val = AnylineDebugListener.BRIGHTNESS_VARIABLE_CLASS.cast(value);

                    Log.d(TAG, name +": " +val.doubleValue());
                }
                if(name.equals(CONTOURS_VARIABLE_NAME) && value.getClass().equals(CONTOURS_VARIABLE_CLASS)){
                    Vector_Contour contour = CONTOURS_VARIABLE_CLASS.cast(value);
                    Log.d(TAG, name +": " +contour.toString());
                }

            }

            @Override
            public void onRunSkipped(RunFailure runFailure) {
                Log.w(TAG, "run skipped: " +runFailure);
            }
        });
    }


    private void startScanning() {
        // this must be called in onResume, or after a result to start the scanning again
        if (!scanView.isRunning()) {
            scanView.startScanning();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        startScanning();
    }

    @Override
    protected void onPause() {
        super.onPause();

        scanView.cancelScanning();
        scanView.releaseCameraInBackground();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
}
