// Your code here!
async function tester() {
    const jo = new AnylineProxy.AnylineProxy();

    // register log messages
    jo.onlog = function (ev) { console.log(ev.toString()); }

    // try to init on UI thread
    await jo.initAsync();
}

tester();