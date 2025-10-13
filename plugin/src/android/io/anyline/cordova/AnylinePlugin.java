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
import android.util.Log;
import androidx.annotation.NonNull;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.List;

import io.anyline.plugin.config.UIFeedbackElementConfig;
import io.anyline.plugin.result.ExportedScanResult;
import io.anyline.wrapper.config.WrapperSessionExportCachedEventsResponse;
import io.anyline.wrapper.config.WrapperSessionExportCachedEventsResponseSucceed;
import io.anyline.wrapper.config.WrapperSessionExportCachedEventsResponseFail;
import io.anyline.wrapper.config.WrapperSessionScanResultExtraInfo;
import io.anyline.wrapper.config.WrapperSessionScanResultsResponse;
import io.anyline.wrapper.config.WrapperSessionScanStartRequest;
import io.anyline.wrapper.config.WrapperSessionScanResponse;
import io.anyline.wrapper.config.WrapperSessionScanResultConfig;
import io.anyline.wrapper.config.WrapperSessionSdkInitializationResponse;
import io.anyline.wrapper.config.WrapperSessionSdkInitializationResponseInitialized;
import io.anyline.wrapper.config.WrapperSessionUCRReportRequest;
import io.anyline.wrapper.config.WrapperSessionUCRReportResponse;
import io.anyline2.WrapperInfo;
import io.anyline2.sdk.extension.UIFeedbackElementConfigExtensionKt;
import io.anyline2.wrapper.WrapperSessionClientInterface;
import io.anyline2.wrapper.WrapperSessionProvider;
import io.anyline2.wrapper.extensions.WrapperSessionScanStartRequestExtensionKt;
import io.anyline2.wrapper.extensions.WrapperSessionSdkInitializationResponseExtensionKt;
import io.anyline2.wrapper.extensions.WrapperSessionUCRReportRequestExtensionKt;
import io.anyline2.wrapper.legacy.LegacyPluginHelper;


public class AnylinePlugin extends CordovaPlugin
        implements WrapperSessionClientInterface, ResultReporter.OnResultListener {

    // We're creating a static variable to retain the WrapperSessionProvider instance in order to prevent crashes due to garbage collection cleaning up the SDK.
    protected static final WrapperSessionProvider wrapperSessionProvider = WrapperSessionProvider.INSTANCE;

    private static final String TAG = AnylinePlugin.class.getSimpleName();
    private CallbackContext callbackContext;

    private static String pluginVersion;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        JSONArray mArgs;
        String mAction;
        this.callbackContext = callbackContext;
        mAction = action;
        mArgs = args;

        cordova.getThreadPool().execute((Runnable) () -> {
            try {
                if ("setupWrapperSession".equals(mAction)) {
                    setupWrapperSession(args.getString(0));
                } else if ("getPluginVersion".equals(mAction)) {
                    getPluginVersion();
                } else if ("initAnylineSDK".equals(mAction)) {
                    boolean enableOfflineCache = args.optBoolean(1, false);
                    initAnylineSDK(args.getString(0), enableOfflineCache);
                } else if ("getSDKVersion".equals(mAction)) {
                    getSDKVersion();
                } else if ("scan".equals(mAction)) {
                    startScanning(mAction, mArgs);
                } else if ("tryStopScan".equals(mAction)) {
                    tryStopScan(mArgs);
                } else if ("exportCachedEvents".equals(mAction)) {
                    exportCachedEvents();
                }

            } catch (JSONException e) {
                onError(e.getMessage());
            } catch (IOException e) {
                onError(e.getMessage());
            }
        });
        return true;
    }

    @Override
    public @NotNull Context getContext() {
        return cordova.getContext();
    }

    private void setupWrapperSession(final String version) {
        pluginVersion = version;
        WrapperInfo wrapperInfo = new WrapperInfo(WrapperInfo.WrapperType.Cordova, pluginVersion);
        WrapperSessionProvider.setupWrapperSession(wrapperInfo,this);
    }

    private void initAnylineSDK(String licenseKey) {
        initAnylineSDK(licenseKey, false);
    }
    private void initAnylineSDK(String licenseKey, boolean enableOfflineCache) {
        JSONObject wrapperSessionSdkInitializationRequestJson = LegacyPluginHelper
                .getWrapperSessionSdkInitializationRequestJson(licenseKey, enableOfflineCache, "www/assets");
        WrapperSessionProvider.requestSdkInitialization(
                wrapperSessionSdkInitializationRequestJson.toString());
    }

    @Override
    public void onSdkInitializationResponse(@NotNull WrapperSessionSdkInitializationResponse initializationResponse) {
        JSONObject json =
                WrapperSessionSdkInitializationResponseExtensionKt.toJsonObject(initializationResponse);

        if (initializationResponse.getInitialized() == Boolean.TRUE) {
            onResult(new PluginResult(PluginResult.Status.OK, "Anyline SDK init was successful."), true);
        } else {
            onError(json.toString());
        }
    }


    private void getLicenseExpirationDate() {
        if (WrapperSessionProvider.getCurrentSdkInitializationResponse().getInitialized() == Boolean.TRUE) {
            WrapperSessionSdkInitializationResponseInitialized sdkInitializationResponseInitialized
                    = WrapperSessionProvider.getCurrentSdkInitializationResponse().getSucceedInfo();
            if (sdkInitializationResponseInitialized != null) {
                onResult(sdkInitializationResponseInitialized.getExpiryDate(), true);
                return;
            }
        }
        onError("Anyline SDK was not initialized");
    }

    private void exportCachedEvents() throws IOException {
        WrapperSessionProvider.requestExportCachedEvents();
    }

    @Override
    public void onExportCachedEventsResponse(@NotNull WrapperSessionExportCachedEventsResponse exportCachedEventsResponse) {
        if (exportCachedEventsResponse.getStatus() == WrapperSessionExportCachedEventsResponse.WrapperSessionExportCachedEventsResponseStatus.EXPORT_SUCCEEDED) {
            WrapperSessionExportCachedEventsResponseSucceed exportCachedEventsSucceed = exportCachedEventsResponse.getSucceedInfo();
            onResult(exportCachedEventsSucceed.getExportedFile(), true);
        } else {
            WrapperSessionExportCachedEventsResponseFail exportCachedEventsFail = exportCachedEventsResponse.getFailInfo();
            onError(getString(exportCachedEventsFail.getLastError()));
        }
    }


    private void onError(String errorMessage) {
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, errorMessage));
    }

    private void startScanning(String action, JSONArray args) {
        if (action.equals("scan")) {
            try {
                String scanViewConfigContent = args.getJSONObject(0).toString();
                String scanViewInitParams = null;
                if (args.length() > 1 && !args.isNull(1)) {
                    scanViewInitParams = args.getJSONObject(1).toString();
                }

                String scanViewConfigPathString = null;
                if (args.length() > 2 && !args.isNull(2)) {
                    scanViewConfigPathString = args.getJSONObject(2).optString("scanViewConfigPath");
                }

                String scanResultCallbackConfig = null;
                if (args.length() > 3 && !args.isNull(3)) {
                    //ideally this element is corresponding to WrapperSessionScanResultConfig
                    scanResultCallbackConfig = args.getJSONObject(3).getJSONObject("callbackConfig").toString();
                }
                routeScanMode(scanViewConfigContent, scanViewInitParams, scanViewConfigPathString, scanResultCallbackConfig);
            } catch (JSONException e) {
                onError(getString("error_invalid_json_data") + ": " + e.getMessage());
            }
        } else {
            this.callbackContext.error(getString("error_unkown_scan_mode") + " " + action);
        }
    }

    private void routeScanMode(
            String scanViewConfigContent,
            String scanViewInitializationParametersString,
            String scanViewConfigPath,
            String scanCallbackConfigString) {
        boolean shouldReturnImages = true;
        WrapperSessionScanStartRequest wrapperSessionScanRequest;
        try {
            wrapperSessionScanRequest = LegacyPluginHelper.getWrapperSessionScanStartRequest(
                    cordova.getContext(),
                    scanViewConfigContent,
                    scanViewInitializationParametersString,
                    scanViewConfigPath,
                    scanCallbackConfigString,
                    shouldReturnImages);
        } catch (Exception e) {
            this.callbackContext.error("Could not parse scanViewInitializationParameters.");
            return;
        }
        ResultReporter.setListener(this);
        JSONObject wrapperSessionScanStartRequestJson
                = WrapperSessionScanStartRequestExtensionKt.toJsonObject(wrapperSessionScanRequest);
        WrapperSessionProvider.requestScanStart(wrapperSessionScanStartRequestJson.toString());
    }

    private void tryStopScan(JSONArray args) throws JSONException {
        String scanStopRequestParams = null;
        if (args != null) {
            if (args.length() > 1 && !args.isNull(1)) {
                scanStopRequestParams = args.getJSONObject(0).toString();
            }
        }
        WrapperSessionProvider.requestScanStop(scanStopRequestParams);
    }

    @Override
    public void onScanResults(@NotNull WrapperSessionScanResultsResponse scanResultsResponse) {
        WrapperSessionScanResultConfig scanResultConfig = scanResultsResponse.getScanResultConfig();
        List<ExportedScanResult> scanResultList = scanResultsResponse.getExportedScanResults();
        WrapperSessionScanResultExtraInfo scanResultExtraInfo = scanResultsResponse.getScanResultExtraInfo();
        try {
            String resultsWithImagePathString = LegacyPluginHelper
                    .getScanResultsWithImagePath(scanResultList, scanResultExtraInfo.getViewPluginType());

            if (scanResultConfig.getCallbackConfig() != null
                    &&  scanResultConfig.getCallbackConfig().getOnResultEventName() != null) {
                sendEvent(scanResultConfig.getCallbackConfig().getOnResultEventName(), resultsWithImagePathString);
            }
            else {
                if (scanResultExtraInfo.getViewPluginType() == WrapperSessionScanResultExtraInfo.ViewPluginType.VIEW_PLUGIN_COMPOSITE) {
                    ResultReporter.onResult(new JSONArray(resultsWithImagePathString), true);
                } else {
                    ResultReporter.onResult(new JSONObject(resultsWithImagePathString), true);
                }
            }
        } catch (Exception e) {
            //exception will not be handled here
        }
    }

    @Override
    public void onUIElementClicked(@NonNull WrapperSessionScanResultConfig scanResultConfig,
                                   @NonNull UIFeedbackElementConfig uiFeedbackElementConfig) {
        if (scanResultConfig.getCallbackConfig() != null
                &&  scanResultConfig.getCallbackConfig().getOnUIElementClickedEventName() != null) {
            sendEvent(
                    scanResultConfig.getCallbackConfig().getOnUIElementClickedEventName(),
                    UIFeedbackElementConfigExtensionKt.toJsonObject(uiFeedbackElementConfig).toString());
        }
    }

    private void sendEvent(String eventName, String message) {
        final String js = String.format("window." + eventName + "('%s')", message.replace("'", "\\'"));
        cordova.getActivity().runOnUiThread(() -> {
            webView.loadUrl("javascript:" + js);
        });
    }

    @Override
    public void onScanResponse(@NotNull WrapperSessionScanResponse scanResponse) {
        if (scanResponse.getStatus() != null) {
            switch (scanResponse.getStatus()) {
                case SCAN_SUCCEEDED:
                    WrapperSessionScanResultConfig scanResultConfig = scanResponse.getScanResultConfig();
                    if (scanResultConfig.getCallbackConfig() != null
                            && scanResultConfig.getCallbackConfig().getOnResultEventName() != null) {
                        ResultReporter.onResult("", true);
                    }
                    break;
                case SCAN_FAILED:
                    this.callbackContext.error(scanResponse.getFailInfo().getLastError());
                    break;
                case SCAN_ABORTED:
                    this.callbackContext.error("Canceled");
                    break;
            }
        }
    }

    private void reportCorrectedResult(String blobKey, String correctedResult) {
        WrapperSessionUCRReportRequest wrapperSessionUCRReportRequest = LegacyPluginHelper
                .getWrapperSessionUCRReportRequest(blobKey, correctedResult);
        JSONObject wrapperSessionUCRReportRequestJson = WrapperSessionUCRReportRequestExtensionKt
                .toJsonObject(wrapperSessionUCRReportRequest);
        WrapperSessionProvider.requestUCRReport(wrapperSessionUCRReportRequestJson.toString());
    }

    @Override
    public void onUCRReportResponse(@NotNull WrapperSessionUCRReportResponse ucrReportResponse) {
        if (ucrReportResponse.getStatus() == WrapperSessionUCRReportResponse.WrapperSessionUCRReportResponseStatus.UCR_REPORT_SUCCEEDED) {
            onResult(ucrReportResponse.getSucceedInfo().getMessage(), true);
        } else {
            onError(LegacyPluginHelper
                    .getWrapperSessionUCRReportResponseFailMessage(ucrReportResponse.getFailInfo()));
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
