# R8 keep rules for the Anyline Cordova DevExample release build.
#
# cordova-android ships no ProGuard rules of its own and sets no minifyEnabled
# anywhere, so a minified Cordova app has nothing protecting the framework's
# reflective wiring. Every rule below covers a lookup that R8 cannot see,
# with the source location it comes from in cordova-android 15.
#
# The Anyline SDK ships its own consumer rules inside the AAR, so nothing here
# repeats them. These rules cover Cordova and the Anyline Cordova plugin only.

# PluginManager instantiates every plugin named in res/xml/config.xml by class
# name (PluginManager.java:564-567: Class.forName, then
# getDeclaredConstructor().newInstance()). The no-arg constructor must survive.
-keep class * extends org.apache.cordova.CordovaPlugin {
    public <init>();
    public *;
}

# CordovaWebViewImpl resolves the WebView engine by class name and calls a
# (Context, CordovaPreferences) constructor (CordovaWebViewImpl.java:80-82).
-keep class * implements org.apache.cordova.CordovaWebViewEngine {
    public <init>(android.content.Context, org.apache.cordova.CordovaPreferences);
    public *;
}

# BuildHelper reads "<applicationId>.BuildConfig" reflectively
# (BuildHelper.java:55).
-keep class **.BuildConfig { *; }

# The JavaScript bridge is called from WebView JavaScript, never from Java
# (SystemExposedJsApi.java:39,45,51). WebView also requires the annotation to
# still be present at runtime.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes *Annotation*

# The framework itself: MainActivity is named in the manifest and reaches most
# of this package, and the plugin API surface is crossed by the bridge rather
# than called directly.
-keep class org.apache.cordova.** { *; }

# AnylinePlugin and AnylineInfinityPlugin are named in res/xml/config.xml and
# instantiated by PluginManager, the same as any other Cordova plugin.
-keep class io.anyline.cordova.** { *; }

# Generic signatures are needed by the reflective JSON parsing the SDK uses to
# read scan view configurations. Without them a parameterized type erases and
# the parser sees a raw type at runtime.
-keepattributes Signature, InnerClasses, EnclosingMethod