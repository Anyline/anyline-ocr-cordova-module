cordova.commandProxy.add("AnylineSDK",{
    tester: async () =>  {
        console.log('jojojojojo1');
        const jo = new AnylineProxy.AnylineProxy();

        const result = await jo.getHelloWorld();
        console.log(result);
        console.log('jojojojojoasdasdasds');
    }
});