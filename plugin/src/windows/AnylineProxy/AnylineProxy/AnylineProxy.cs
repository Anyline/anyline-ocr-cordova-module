using System;
using Windows.UI.Xaml.Controls;

using Anyline.SDK.Modules.Mrz;
using Anyline.SDK.Camera;
using Anyline.SDK.Models;
using System.Diagnostics;
using Windows.UI.Xaml.Navigation;
using Anyline.SDK.Util;
using Windows.UI.Xaml;

namespace AnylineProxy
{
    public sealed class AnylineProxy
    {
        readonly string LicenseKey = "eyJzY29wZSI6WyJBTEwiXSwicGxhdGZvcm0iOlsiaU9TIiwiQW5kcm9pZCIsIldpbmRvd3MiXSwidmFsaWQiOiIyMDE4LTEwLTEwIiwibWFqb3JWZXJzaW9uIjoiMyIsImlzQ29tbWVyY2lhbCI6ZmFsc2UsInRvbGVyYW5jZURheXMiOjMwLCJzaG93UG9wVXBBZnRlckV4cGlyeSI6dHJ1ZSwiaW9zSWRlbnRpZmllciI6WyJBbnlsaW5lUHJveHkiXSwiYW5kcm9pZElkZW50aWZpZXIiOlsiQW55bGluZVByb3h5Il0sIndpbmRvd3NJZGVudGlmaWVyIjpbIkFueWxpbmVQcm94eSJdfQoyZGFLcVRSUytwSEJGcVk4aUoyTDhiUFdjVVlBdTMwNjlzOUY0RFBwZngrRVpIMzQ5NjBPT1BHcDJSY0NKeXdPdW1PbmxsanlkbHlXZ0pNcURzOTd4RHM4VXVNNThEeVcxQTRMTDYvdEpmd1Mva1U2YkhwNktXdTZDa2RDNWZRZHNQeGQ0dU1JQWtJMUJjSXJGR2VwejZZVDAvcUFESlF1aFZTN1pUSU9mbVVCL0x4cGdaWTJJdCs5Tkovdm1ZOFJvUE1maGVGdlNHbHQ2TGRrZFlXWFRWUVZuZmNhbkEva1F3UnJBMDFic2M0K05EYm5uRXdLR21sU0Q5cXRJT0ZXaS93YlJTZ0tGVUo5ckVjNm1sNmFneURxMU9KMVZPQWRZTmJjU0xVci91ZEZnZmtBZkNYakkra2xCZkZudDFudVMwNFpGaVQ4dDRMa1dHakhCOVZqSEE9PQ==";

        public AnylineProxy()
        {
            Frame rootFrame = Window.Current.Content as Frame;
            if (rootFrame == null)
            {
                // Create a Frame to act as the navigation context and navigate to the first page
                rootFrame = new Frame();
                
                // Place the frame in the current Window
                Window.Current.Content = rootFrame;
            }

            if (rootFrame.Content == null)
            {
                // When the navigation stack isn't restored navigate to the first page,
                // configuring the new page by passing required information as a navigation
                // parameter
                rootFrame.Navigate(typeof(ScanPage), null);
            }
            // Ensure the current window is active
            Window.Current.Activate();
        }
        
        public string GetHelloWorld()
        {
            return "Hello World";
        }
        
    }
}
