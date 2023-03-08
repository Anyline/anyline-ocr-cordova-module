var fs = require("fs");
var path = require("path");
var xcode = require("xcode");
var utilities = require("../lib/utilities");

/**
 * This is used as the display text for the build phase block in XCode as well as the
 * inline comments inside of the .pbxproj file for the build script phase block.
 */
var comment = "\"Anyline: Remove unneeded assets\"";


module.exports = {

    getRetainAssetsPattern: function () {
        return utilities.getPreferenceValue('anyline-retain-assets-pattern');
    },

    getXcodeProjectPath: function () {
        return path.join("platforms", "ios", utilities.getAppName() + ".xcodeproj", "project.pbxproj");
    },

    getShellScriptBuildPhasePath: function () {
        return path.join("platforms", "ios", utilities.getAppName(), "Scripts", "remove-unneeded-assets.sh");
    },

    addShellScriptBuildPhase: function (context, xcodeProjectPath) {
        var retainAssetsPattern = this.getRetainAssetsPattern();
        if (!retainAssetsPattern) {
            return;
        }

        var scriptPathSrc = path.join(context.opts.plugin.dir, "scripts", "ios", "remove-unneeded-assets.sh");
        var scriptPathDest = this.getShellScriptBuildPhasePath();
        fs.copyFileSync(scriptPathSrc, scriptPathDest);

        // Read and parse the XCode project (.pxbproj) from disk.
        // File format information: http://www.monobjc.net/xcode-project-file-format.html
        var xcodeProject = xcode.project(xcodeProjectPath);
        xcodeProject.parseSync();

        // Build the body of the script to be executed during the build phase.
        var script = [
            '"',
            'export ANYLINE_RETAIN_ASSETS_PATTERN=\\"' + retainAssetsPattern.replace(/:/ig, ' ') + '\\"\\n',
            '\\"',
            '$SRCROOT',
            '/',
            '$PROJECT_NAME',
            '/',
            'Scripts',
            '/',
            'remove-unneeded-assets.sh',
            '\\"',
            '"'
        ].join('');

        // Generate a unique ID for our new build phase.
        var id = xcodeProject.generateUuid();
        // Create the build phase.
        xcodeProject.hash.project.objects.PBXShellScriptBuildPhase[id] = {
            isa: "PBXShellScriptBuildPhase",
            buildActionMask: 2147483647,
            files: [],
            inputPaths: ['"' + '$(BUILT_PRODUCTS_DIR)/$(INFOPLIST_PATH)' + '"'],
            name: comment,
            outputPaths: [],
            // "Run script only when installing"
            // runOnlyForDeploymentPostprocessing: 1,
            runOnlyForDeploymentPostprocessing: 0,
            shellPath: "/bin/sh",
            shellScript: script,
            showEnvVarsInLog: 0
        };

        // Add a comment to the block (viewable in the source of the pbxproj file).
        xcodeProject.hash.project.objects.PBXShellScriptBuildPhase[id + "_comment"] = comment;

        // Add this new shell script build phase block to the targets.
        for (var nativeTargetId in xcodeProject.hash.project.objects.PBXNativeTarget) {

            // Skip over the comment blocks.
            if (nativeTargetId.indexOf("_comment") !== -1) {
                continue;
            }

            var nativeTarget = xcodeProject.hash.project.objects.PBXNativeTarget[nativeTargetId];

            nativeTarget.buildPhases.push({
                value: id,
                comment: comment
            });
        }

        // Finally, write the .pbxproj back out to disk.
        fs.writeFileSync(path.resolve(xcodeProjectPath), xcodeProject.writeSync());
    },

    removeShellScriptBuildPhase: function (context, xcodeProjectPath) {
        var retainAssetsPattern = this.getRetainAssetsPattern();
        if (!retainAssetsPattern) {
            return;
        }

        // Read and parse the XCode project (.pxbproj) from disk.
        // File format information: http://www.monobjc.net/xcode-project-file-format.html
        var xcodeProject = xcode.project(xcodeProjectPath);
        xcodeProject.parseSync();

        // First, we want to delete the build phase block itself.

        var buildPhases = xcodeProject.hash.project.objects.PBXShellScriptBuildPhase;

        var commentTest = comment.replace(/"/g, '');
        for (var buildPhaseId in buildPhases) {

            var buildPhase = xcodeProject.hash.project.objects.PBXShellScriptBuildPhase[buildPhaseId];
            var shouldDelete = false;

            if (buildPhaseId.indexOf("_comment") === -1) {
                // Dealing with a build phase block.

                // If the name of this block matches ours, then we want to delete it.
                shouldDelete = buildPhase.name && buildPhase.name.indexOf(commentTest) !== -1;
            } else {
                // Dealing with a comment block.

                // If this is a comment block that matches ours, then we want to delete it.
                shouldDelete = buildPhase === commentTest;
            }

            if (shouldDelete) {
                delete buildPhases[buildPhaseId];
            }
        }

        // Second, we want to delete the native target reference to the block.

        var nativeTargets = xcodeProject.hash.project.objects.PBXNativeTarget;

        for (var nativeTargetId in nativeTargets) {

            // Skip over the comment blocks.
            if (nativeTargetId.indexOf("_comment") !== -1) {
                continue;
            }

            var nativeTarget = nativeTargets[nativeTargetId];

            // We remove the reference to the block by filtering out the the ones that match.
            nativeTarget.buildPhases = nativeTarget.buildPhases.filter(function (buildPhase) {
                return buildPhase.comment !== commentTest;
            });
        }

        // Finally, write the .pbxproj back out to disk.
        fs.writeFileSync(path.resolve(xcodeProjectPath), xcodeProject.writeSync());
    },

};
