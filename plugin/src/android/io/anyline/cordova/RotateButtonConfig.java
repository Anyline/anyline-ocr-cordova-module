package io.anyline.cordova;

import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

public class RotateButtonConfig {
    private String alignment = "";
    private Offset offset = null;
    private static final String TAG = RotateButtonConfig.class.getSimpleName();

    public RotateButtonConfig(JSONObject jsonObject) {
        alignment = jsonObject.optString("alignment", "");
        if (jsonObject.has("offset")) {
            try {
                offset = new Offset(jsonObject.getJSONObject("offset"));
            } catch (JSONException e) {
                Log.d(TAG, "RotateButtonConfig: "+ e.getMessage());
            }
        }
    }

    public String getAlignment() {
        return alignment;
    }

    public Offset getOffset() {
        return offset;
    }

    public boolean hasOffset() {
        return offset != null;
    }
}