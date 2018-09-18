cordova.commandProxy.add("AnylineSDK",{
    tester: async () =>  {
        const jo = new AnylineProxy.AnylineProxy();
        jo.onlog = function(ev) { console.log(ev.toString()); }
        await jo.getHelloWorld();
    }
});