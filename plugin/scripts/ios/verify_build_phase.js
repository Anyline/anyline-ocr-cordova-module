const helper = require("./helper");

module.exports = function verifyBuildPhase() {
    if (!helper.getRetainAssetsPattern()) {
        return;
    }

    if (!helper.hasShellScriptBuildPhase(helper.getXcodeProjectPath())) {
        throw new Error("anyline-retain-assets-pattern is set, but the \"Anyline: Remove unneeded assets\" " +
            "build phase is missing from project.pbxproj, so every Anyline module was shipped. " +
            "Run `cordova prepare ios` and build again.");
    }
};
