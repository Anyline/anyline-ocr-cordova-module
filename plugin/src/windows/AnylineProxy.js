

cordova.commandProxy.add("AnylineSDK",{
    tester:function() {
        console.log('jojojojojo');
        const jo = new AnylineProxy.AnylineProxy();
        console.log(jo.invokeSomething());
        //AnylineProxy.AnylineProxy.GetHelloWorld();
    }
});