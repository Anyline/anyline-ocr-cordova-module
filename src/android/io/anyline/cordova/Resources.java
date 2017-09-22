/*
 * Anyline Cordova Plugin
 * AnylinePlugin.java
 *
 * Copyright (c) 2015 Anyline GmbH
 *
 * Created by martin at 2015-12-09
 */

package io.anyline.cordova;

import android.content.Context;

public class Resources {

    public static CharSequence getText(Context context, String stringName) {
        int resId = context.getResources().getIdentifier(stringName, "string", context.getPackageName());
        return resId == 0 ? null : context.getText(resId);
    }

    public static String getString(Context context, String stringName) {
        int resId = context.getResources().getIdentifier(stringName, "string", context.getPackageName());
        return resId == 0 ? null : context.getString(resId);
    }
}
