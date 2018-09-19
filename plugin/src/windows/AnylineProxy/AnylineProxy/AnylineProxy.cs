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
using Windows.ApplicationModel.Core;
using Windows.UI.Core;
using Windows.UI.ViewManagement;

namespace AnylineProxy
{
    public sealed class AnylineProxy
    {
        readonly string LicenseKey = "eyJzY29wZSI6WyJBTEwiXSwicGxhdGZvcm0iOlsiaU9TIiwiQW5kcm9pZCIsIldpbmRvd3MiXSwidmFsaWQiOiIyMDE4LTEwLTEwIiwibWFqb3JWZXJzaW9uIjoiMyIsImlzQ29tbWVyY2lhbCI6ZmFsc2UsInRvbGVyYW5jZURheXMiOjMwLCJzaG93UG9wVXBBZnRlckV4cGlyeSI6dHJ1ZSwiaW9zSWRlbnRpZmllciI6WyJBbnlsaW5lUHJveHkiXSwiYW5kcm9pZElkZW50aWZpZXIiOlsiQW55bGluZVByb3h5Il0sIndpbmRvd3NJZGVudGlmaWVyIjpbIkFueWxpbmVQcm94eSJdfQoyZGFLcVRSUytwSEJGcVk4aUoyTDhiUFdjVVlBdTMwNjlzOUY0RFBwZngrRVpIMzQ5NjBPT1BHcDJSY0NKeXdPdW1PbmxsanlkbHlXZ0pNcURzOTd4RHM4VXVNNThEeVcxQTRMTDYvdEpmd1Mva1U2YkhwNktXdTZDa2RDNWZRZHNQeGQ0dU1JQWtJMUJjSXJGR2VwejZZVDAvcUFESlF1aFZTN1pUSU9mbVVCL0x4cGdaWTJJdCs5Tkovdm1ZOFJvUE1maGVGdlNHbHQ2TGRrZFlXWFRWUVZuZmNhbkEva1F3UnJBMDFic2M0K05EYm5uRXdLR21sU0Q5cXRJT0ZXaS93YlJTZ0tGVUo5ckVjNm1sNmFneURxMU9KMVZPQWRZTmJjU0xVci91ZEZnZmtBZkNYakkra2xCZkZudDFudVMwNFpGaVQ4dDRMa1dHakhCOVZqSEE9PQ==";

        public event EventHandler<string> Log;

        public AnylineProxy()
        {
        }

        public IAsyncOperation<bool> InitAsync()
        {
            return ExecutionTask().AsAsyncOperation();
        }

        public void GetCordovaWindow(object window)
        {
            L("Acquired Cordova window. Here's the ToString():" + window.ToString());
        }
        
        private void L(object o) { Log?.Invoke(this, o.ToString()); }

        [MTAThread]
        private async Task<bool> ExecutionTask()
        {
            try
            {
                L("hello");
                
                var window = Windows.ApplicationModel.Core.CoreApplication.MainView?.CoreWindow;

                try
                {
                    //var id = AnylineProxyApp.UI.GetViewID();
                    //var newView = AnylineProxyApp.UI.CreateView();
                }
                catch(Exception e)
                {
                    L($"Exception: {e.Message}");
                }

                await window.Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                {
                    try
                    {
                        var currentView = ApplicationView.GetForCurrentView();
                        if (currentView == null)
                        {
                            L("Current view is null. Trying to create a new CoreApplicationView.");
                            var newCoreView = CoreApplication.CreateNewView();
                        }
                        else
                        {
                            var viewID = currentView.Id;
                            L($"Got the Application view with ID {viewID}.");

                            /*var w = new FrameworkView();
                            w.SetWindow(window);*/
/*
                            PhoneApplicationFrame frame = Application.Current.RootVisual as PhoneApplicationFrame;

                            Application.Current.root*/
                            /*
                            var viewSource = new FrameworkViewSource();
                            L("Created viewsource.");

                            var newCoreView = CoreApplication.CreateNewView(viewSource);

                            L(newCoreView.IsMain);*/
                        }
                    }
                    catch(Exception e)
                    {
                        L(e.Message);
                    }
                });

                /*
                int newViewId = 0;
                await newView.Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                {
                    Frame frame = new Frame();
                    //frame.Navigate(typeof(SecondaryPage), null);
                    //Window.Current.Content = frame;
                    // You have to activate the window in order to show it later.
                    if (Window.Current == null)
                        L("CURRENT WINDOW IS NULL");
                    else
                        Window.Current.Activate();

                    newViewId = ApplicationView.GetForCurrentView().Id;
                });
                bool viewShown = await ApplicationViewSwitcher.TryShowAsStandaloneAsync(newViewId);*/
                
                L("I AM WAITING IN A NEW TASK.");
                /*
                if (Windows.UI.Xaml.Application.Current == null)
                    L("Current app is null!!");
                
                if (Window.Current == null)
                    L("THE CURRENT WINDOW IS NULL");
                    */
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
