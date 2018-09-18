using System;
using Windows.UI.Xaml.Controls;

using Anyline.SDK.Modules.Mrz;
using Anyline.SDK.Camera;
using Anyline.SDK.Models;
using System.Diagnostics;
using Windows.UI.Xaml.Navigation;
using Anyline.SDK.Util;
using Windows.UI.Xaml;
using System.Threading.Tasks;
using Windows.Foundation;
using AnylineExamplesApp;

namespace AnylineProxy
{
    public sealed class AnylineProxy
    {
        readonly string LicenseKey = "eyJzY29wZSI6WyJBTEwiXSwicGxhdGZvcm0iOlsiaU9TIiwiQW5kcm9pZCIsIldpbmRvd3MiXSwidmFsaWQiOiIyMDE4LTEwLTEwIiwibWFqb3JWZXJzaW9uIjoiMyIsImlzQ29tbWVyY2lhbCI6ZmFsc2UsInRvbGVyYW5jZURheXMiOjMwLCJzaG93UG9wVXBBZnRlckV4cGlyeSI6dHJ1ZSwiaW9zSWRlbnRpZmllciI6WyJBbnlsaW5lUHJveHkiXSwiYW5kcm9pZElkZW50aWZpZXIiOlsiQW55bGluZVByb3h5Il0sIndpbmRvd3NJZGVudGlmaWVyIjpbIkFueWxpbmVQcm94eSJdfQoyZGFLcVRSUytwSEJGcVk4aUoyTDhiUFdjVVlBdTMwNjlzOUY0RFBwZngrRVpIMzQ5NjBPT1BHcDJSY0NKeXdPdW1PbmxsanlkbHlXZ0pNcURzOTd4RHM4VXVNNThEeVcxQTRMTDYvdEpmd1Mva1U2YkhwNktXdTZDa2RDNWZRZHNQeGQ0dU1JQWtJMUJjSXJGR2VwejZZVDAvcUFESlF1aFZTN1pUSU9mbVVCL0x4cGdaWTJJdCs5Tkovdm1ZOFJvUE1maGVGdlNHbHQ2TGRrZFlXWFRWUVZuZmNhbkEva1F3UnJBMDFic2M0K05EYm5uRXdLR21sU0Q5cXRJT0ZXaS93YlJTZ0tGVUo5ckVjNm1sNmFneURxMU9KMVZPQWRZTmJjU0xVci91ZEZnZmtBZkNYakkra2xCZkZudDFudVMwNFpGaVQ4dDRMa1dHakhCOVZqSEE9PQ==";

        public event EventHandler<string> Log;

        public AnylineProxy()
        {
            
        }
        
        public IAsyncOperation<bool> GetHelloWorld()
        {
            return GetHelloWorldTask().AsAsyncOperation();
        }
        
        private void L(object o)
        {
            Log?.Invoke(this, o.ToString());
        }

        [MTAThread]
        private async Task<bool> GetHelloWorldTask()
        {
            try
            {
                L("hello");

                Windows.UI.Xaml.Application.Start((p) => new App());

                L("started app.");

                var disp = Windows.ApplicationModel.Core.CoreApplication.MainView?.CoreWindow?.Dispatcher;
                if (disp == null) L("Dispatcher is null");

                var window = Windows.ApplicationModel.Core.CoreApplication.MainView?.CoreWindow;
                if (window == null) L("Window is null");
                else L(window.PointerPosition);

                await disp.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
                {
                    try
                    {
                        L("I AM WAITING IN A NEW TASK.");

                        if (Window.Current == null)
                            L("THE CURRENT WINDOW IS NULL");
                        
                    }
                    catch (Exception e)
                    {
                        L("Exception occurred: " + e.Message);
                    }
                });
            }
            catch(Exception e)
            {
                L(e.Message);
            }
            return true;
        }


        private void Window_PointerMoved(Windows.UI.Core.CoreWindow sender, Windows.UI.Core.PointerEventArgs args)
        {
            Log?.Invoke(this, $"{args.CurrentPoint.Position.X}, {args.CurrentPoint.Position.Y}");
        }
    }
}
