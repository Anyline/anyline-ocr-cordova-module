

cordova.commandProxy.add("AnylineSDK",{
    tester:function() {
        console.log('jojojojojo');
        const jo = new AnylineProxy.AnylineProxy()
        jo.tester();
        AnylineProxy.AnylineProxy.tester();
    }
});