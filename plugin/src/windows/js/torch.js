function enableTorch() {
    const Lights = Windows.Devices.Lights;
    Lights.Lamp.getDefaultAsync()
        .then(function (lamp) {
            if (lamp === null) {
                console.error("Error: No lamp device was found");
                return;
            }
            lamp.isEnabled = true;
        });
}