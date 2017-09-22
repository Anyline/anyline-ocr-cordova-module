/*
 * Anyline Cordova Plugin
 * ResultReporter.java
 *
 * Copyright (c) 2015 Anyline GmbH
 *
 * Created by martin at 2015-07-21
 */
package io.anyline.cordova;

public class ResultReporter {

    private static OnResultListener listener;

    public static void setListener(OnResultListener listener) {
        ResultReporter.listener = listener;
    }

    public static void onResult(Object result, boolean isFinalResult) {
        if (listener != null) {
            listener.onResult(result, isFinalResult);
        }
    }

    public interface OnResultListener {
        void onResult(Object result, boolean isFinalResult);
    }
}
