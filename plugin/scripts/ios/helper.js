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
        var configNamePath = path.join("platforms", "ios", utilities.getAppName() + ".xcodeproj", "project.pbxproj");
        if (fs.existsSync(configNamePath)) {
            return configNamePath;
        }

        // Since cordova-ios 8.0.0 the generated Xcode project/target is always named "App",
        // regardless of the <name> set in config.xml. Fall back to that when the
        // config-name path doesn't exist.
        return path.join("platforms", "ios", "App.xcodeproj", "project.pbxproj");
    },

    getShellScriptBuildPhasePath: function () {
        var configNamePath = path.join("platforms", "ios", utilities.getAppName());
        if (fs.existsSync(configNamePath)) {
            return path.join(configNamePath, "remove-unneeded-assets.sh");
        }

        return path.join("platforms", "ios", "App", "remove-unneeded-assets.sh");
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
            '$PROJECT_DIR',
            '/',
            '$PROJECT_NAME',
            '/',
            'remove-unneeded-assets.sh',
            '\\"',
            '"'
        ].join('');

        // cordova-ios 8+ generates an "App" project with no shell-script build phases,
        // so this object map is absent after parsing. Initialise it before use.
        if (!xcodeProject.hash.project.objects.PBXShellScriptBuildPhase) {
            xcodeProject.hash.project.objects.PBXShellScriptBuildPhase = {};
        }

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

            nativeTarget.buildPhases.splice(this.getBuildPhaseIndex(xcodeProject, nativeTarget.buildPhases), 0, {
                value: id,
                comment: comment
            });
        }

        // Finally, write the .pbxproj back out to disk.
        fs.writeFileSync(path.resolve(xcodeProjectPath), xcodeProject.writeSync());
    },

    /**
     * Where the phase goes in a target's build phases: right after the last "Embed Frameworks"
     * phase (the copy files phase whose destination is Frameworks, dstSubfolderSpec 10), never
     * after a "Crashlytics" phase, and last only when the target has neither. Appending it
     * instead puts it after any phase another plugin has already appended, and Firebase requires
     * its "Crashlytics" phase to be the last one in the target, or the dSYMs are not uploaded.
     * The position does NOT order the script after Anyline.framework is signed: on cordova-ios 8
     * the Embed Frameworks phase is empty, because the framework comes from Swift Package Manager
     * and Xcode embeds and signs it with tasks of its own. Xcode signs it before this phase in a
     * clean build and after it in an incremental build that copies it again, which is why
     * remove-unneeded-assets.sh re-signs it.
     */
    getBuildPhaseIndex: function (xcodeProject, buildPhases) {
        var objects = xcodeProject.hash.project.objects;
        var copyFilesPhases = objects.PBXCopyFilesBuildPhase || {};
        var shellScriptPhases = objects.PBXShellScriptBuildPhase || {};
        var index = buildPhases.length;
        var crashlyticsIndex = -1;

        buildPhases.forEach(function (buildPhase, position) {
            var copyFilesPhase = copyFilesPhases[buildPhase.value];
            if (copyFilesPhase && String(copyFilesPhase.dstSubfolderSpec) === "10") {
                index = position + 1;
            }
            var shellScriptPhase = shellScriptPhases[buildPhase.value];
            var name = shellScriptPhase && shellScriptPhase.name ? String(shellScriptPhase.name).replace(/"/g, '') : '';
            if (crashlyticsIndex === -1 && name === "Crashlytics") {
                crashlyticsIndex = position;
            }
        });

        return crashlyticsIndex === -1 ? index : Math.min(index, crashlyticsIndex);
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

                // If this is a comment block that matches ours, then we want to delete it. It is
                // written with the quotes, so it reads back with them.
                shouldDelete = buildPhase === comment || buildPhase === commentTest;
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
            // addShellScriptBuildPhase writes the reference with the QUOTED comment, and it reads
            // back quoted, so comparing only against the unquoted name never matches: every run
            // after the first left a reference to a phase it had just deleted. Compare both forms.
            nativeTarget.buildPhases = nativeTarget.buildPhases.filter(function (buildPhase) {
                return buildPhase.comment !== comment && buildPhase.comment !== commentTest;
            });
        }

        // Finally, write the .pbxproj back out to disk.
        fs.writeFileSync(path.resolve(xcodeProjectPath), xcodeProject.writeSync());
    },

};
