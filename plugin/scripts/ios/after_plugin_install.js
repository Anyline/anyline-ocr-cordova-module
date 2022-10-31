var helper = require("./helper");

module.exports = function(context) {
    var xcodeProjectPath = helper.getXcodeProjectPath();
    helper.removeShellScriptBuildPhase(context, xcodeProjectPath);
    helper.addShellScriptBuildPhase(context, xcodeProjectPath);
};
