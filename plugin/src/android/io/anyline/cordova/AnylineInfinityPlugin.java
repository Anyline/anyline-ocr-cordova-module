package io.anyline.cordova;

import android.content.Context;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import io.anyline.plugin.config.UIFeedbackElementConfig;
import io.anyline.wrapper.config.WrapperSessionExportCachedEventsResponse;
import io.anyline.wrapper.config.WrapperSessionScanResponse;
import io.anyline.wrapper.config.WrapperSessionScanResultConfig;
import io.anyline.wrapper.config.WrapperSessionScanResultsResponse;
import io.anyline.wrapper.config.WrapperSessionSdkInitializationResponse;
import io.anyline.wrapper.config.WrapperSessionUCRReportResponse;
import io.anyline2.WrapperInfo;
import io.anyline2.sdk.extension.UIFeedbackElementConfigExtensionKt;
import io.anyline2.wrapper.WrapperSessionClientInterface;
import io.anyline2.wrapper.WrapperSessionProvider;
import io.anyline2.wrapper.extensions.WrapperSessionExportCachedEventsResponseExtensionKt;
import io.anyline2.wrapper.extensions.WrapperSessionScanResponseExtensionKt;
import io.anyline2.wrapper.extensions.WrapperSessionScanResultsResponseExtensionKt;
import io.anyline2.wrapper.extensions.WrapperSessionSdkInitializationResponseExtensionKt;
import io.anyline2.wrapper.extensions.WrapperSessionUCRReportResponseExtensionKt;

/**
 * AnylineInfinityPlugin — typed, schema-driven Anyline Infinity scanning API for Cordova (Android).
 *
 * Passes JSON strings directly to/from WrapperSessionProvider without LegacyPluginHelper.
 * Intermediate scan results and UI element click events are multiplexed through the
 * requestScanStart callback channel using typed payloads: { type, data }.
 */
public class AnylineInfinityPlugin extends CordovaPlugin
        implements WrapperSessionClientInterface {

    // Retain the WrapperSessionProvider instance to prevent GC-related crashes.
    protected static final WrapperSessionProvider wrapperSessionProvider = WrapperSessionProvider.INSTANCE;

    private static String pluginVersion;

    private CallbackContext sdkInitializationCallbackContext;
    private CallbackContext scanStartCallbackContext;
    private CallbackContext ucrReportCallbackContext;
    private CallbackContext exportCachedEventsCallbackContext;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            try {
                switch (action) {
                    case "setupWrapperSession":
                        setupWrapperSession(args.getString(0));
                        callbackContext.success();
                        break;
                    case "requestSdkInitialization":
                        sdkInitializationCallbackContext = callbackContext;
                        WrapperSessionProvider.requestSdkInitialization(args.getString(0));
                        break;
                    case "getSDKVersion":
                        getSDKVersion(callbackContext);
                        break;
                    case "requestScanStart": {
                        scanStartCallbackContext = callbackContext;
                        final String requestJson = args.getString(0);
                        cordova.getActivity().runOnUiThread(() ->
                                WrapperSessionProvider.requestScanStart(requestJson));
                        break;
                    }
                    case "requestScanStop":
                        WrapperSessionProvider.requestScanStop(args.isNull(0) ? null : args.getString(0));
                        callbackContext.success();
                        break;
                    case "requestScanSwitchWithScanStartRequestParams":
                        WrapperSessionProvider.requestScanSwitchWithScanStartRequestParams(args.getString(0));
                        callbackContext.success();
                        break;
                    case "requestScanSwitchWithScanViewConfigContentString":
                        WrapperSessionProvider.requestScanSwitchWithScanViewConfigContentString(args.getString(0));
                        callbackContext.success();
                        break;
                    case "requestUCRReport":
                        ucrReportCallbackContext = callbackContext;
                        WrapperSessionProvider.requestUCRReport(args.getString(0));
                        break;
                    case "requestExportCachedEvents":
                        exportCachedEventsCallbackContext = callbackContext;
                        WrapperSessionProvider.requestExportCachedEvents();
                        break;
                    default:
                        callbackContext.error("Unknown action: " + action);
                }
            } catch (JSONException e) {
                callbackContext.error(e.getMessage());
            }
        });
        return true;
    }

    private void setupWrapperSession(String version) {
        pluginVersion = version;
        WrapperInfo wrapperInfo = new WrapperInfo(WrapperInfo.WrapperType.Cordova, pluginVersion, WrapperInfo.WrapperCodename.Infinity);
        WrapperSessionProvider.setupWrapperSession(wrapperInfo, this);
    }

    private void getSDKVersion(CallbackContext callbackContext) {
        callbackContext.success(at.nineyards.anyline.BuildConfig.VERSION_NAME);
    }

    private void sendScanStartEvent(String type, String data, boolean keepCallback) {
        if (scanStartCallbackContext == null) return;
        try {
            JSONObject payload = new JSONObject();
            payload.put("type", type);
            payload.put("data", data);
            PluginResult result = new PluginResult(PluginResult.Status.OK, payload);
            result.setKeepCallback(keepCallback);
            scanStartCallbackContext.sendPluginResult(result);
        } catch (JSONException e) {
            // ignore serialization errors
        }
    }

    @Override
    public @NotNull Context getContext() {
        return cordova.getContext();
    }

    @Override
    public @Nullable ViewGroup getContainerView() {
        return null;
    }

    @Override
    public void onSdkInitializationResponse(
            @NotNull WrapperSessionSdkInitializationResponse initializationResponse) {
        if (sdkInitializationCallbackContext == null) return;
        sdkInitializationCallbackContext.success(
                WrapperSessionSdkInitializationResponseExtensionKt
                        .toJsonObject(initializationResponse).toString());
        sdkInitializationCallbackContext = null;
    }

    @Override
    public void onScanResults(@NotNull WrapperSessionScanResultsResponse scanResultsResponse) {
        sendScanStartEvent("scanResults",
                WrapperSessionScanResultsResponseExtensionKt
                        .toJsonObject(scanResultsResponse).toString(),
                true);
    }

    @Override
    public void onScanResponse(@NotNull WrapperSessionScanResponse scanResponse) {
        sendScanStartEvent("scanResponse",
                WrapperSessionScanResponseExtensionKt
                        .toJsonObject(scanResponse).toString(),
                false);
        scanStartCallbackContext = null;
    }

    @Override
    public void onUIElementClicked(
            @NonNull WrapperSessionScanResultConfig scanResultConfig,
            @NonNull UIFeedbackElementConfig uiFeedbackElementConfig) {
        sendScanStartEvent("uiElementClicked",
                UIFeedbackElementConfigExtensionKt.toJsonObject(uiFeedbackElementConfig).toString(),
                true);
    }

    @Override
    public void onUCRReportResponse(@NotNull WrapperSessionUCRReportResponse ucrReportResponse) {
        if (ucrReportCallbackContext == null) return;
        ucrReportCallbackContext.success(
                WrapperSessionUCRReportResponseExtensionKt
                        .toJsonObject(ucrReportResponse).toString());
        ucrReportCallbackContext = null;
    }

    @Override
    public void onExportCachedEventsResponse(
            @NotNull WrapperSessionExportCachedEventsResponse exportCachedEventsResponse) {
        if (exportCachedEventsCallbackContext == null) return;
        exportCachedEventsCallbackContext.success(
                WrapperSessionExportCachedEventsResponseExtensionKt
                        .toJsonObject(exportCachedEventsResponse).toString());
        exportCachedEventsCallbackContext = null;
    }
}