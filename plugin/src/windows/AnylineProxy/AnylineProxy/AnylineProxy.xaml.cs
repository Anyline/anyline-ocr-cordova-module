using System;
using Windows.UI.Xaml.Controls;

using Anyline.SDK.Modules.Mrz;
using Anyline.SDK.Camera;
using Anyline.SDK.Models;
using System.Diagnostics;
using Windows.UI.Xaml.Navigation;


namespace AnylineProxy
{

    public sealed partial class AnylineProxy : Page, IMrzResultListener, ICameraListener
    {
        readonly string LicenseKey = "eyJzY29wZSI6WyJBTEwiXSwicGxhdGZvcm0iOlsiaU9TIiwiQW5kcm9pZCIsIldpbmRvd3MiXSwidmFsaWQiOiIyMDE4LTEwLTEwIiwibWFqb3JWZXJzaW9uIjoiMyIsImlzQ29tbWVyY2lhbCI6ZmFsc2UsInRvbGVyYW5jZURheXMiOjMwLCJzaG93UG9wVXBBZnRlckV4cGlyeSI6dHJ1ZSwiaW9zSWRlbnRpZmllciI6WyJBbnlsaW5lUHJveHkiXSwiYW5kcm9pZElkZW50aWZpZXIiOlsiQW55bGluZVByb3h5Il0sIndpbmRvd3NJZGVudGlmaWVyIjpbIkFueWxpbmVQcm94eSJdfQoyZGFLcVRSUytwSEJGcVk4aUoyTDhiUFdjVVlBdTMwNjlzOUY0RFBwZngrRVpIMzQ5NjBPT1BHcDJSY0NKeXdPdW1PbmxsanlkbHlXZ0pNcURzOTd4RHM4VXVNNThEeVcxQTRMTDYvdEpmd1Mva1U2YkhwNktXdTZDa2RDNWZRZHNQeGQ0dU1JQWtJMUJjSXJGR2VwejZZVDAvcUFESlF1aFZTN1pUSU9mbVVCL0x4cGdaWTJJdCs5Tkovdm1ZOFJvUE1maGVGdlNHbHQ2TGRrZFlXWFRWUVZuZmNhbkEva1F3UnJBMDFic2M0K05EYm5uRXdLR21sU0Q5cXRJT0ZXaS93YlJTZ0tGVUo5ckVjNm1sNmFneURxMU9KMVZPQWRZTmJjU0xVci91ZEZnZmtBZkNYakkra2xCZkZudDFudVMwNFpGaVQ4dDRMa1dHakhCOVZqSEE9PQ==";

        public AnylineProxy()
        { 
            this.InitializeComponent();

            AnylineScanView.CameraListener = this;

            AnylineScanView.SetConfigFromAsset("Assets/MrzConfig.json");
            AnylineScanView.InitAnyline(LicenseKey, this);
        }

        public void OnCameraClosed(bool success)
        {
            if (AnylineScanView != null)
                AnylineScanView.CancelScanning();
        }

        public void OnCameraError(Exception e)
        {
            Debug.WriteLine("Error: " + e.Message);
        }

        public void OnCameraOpened(uint width, uint height)
        {
            if (AnylineScanView != null)
                AnylineScanView.StartScanning();
        }

        public void OnResult(MrzResult scanResult)
        {
            Debug.WriteLine("Result: " + scanResult.Result);
        }

        protected override void OnNavigatedFrom(NavigationEventArgs args)
        {
            base.OnNavigatedFrom(args);

            if (AnylineScanView != null)
            {
                AnylineScanView.CancelScanning();
                AnylineScanView.ReleaseCameraInBackground();
            }
            AnylineScanView = null;
        }
    }
}
