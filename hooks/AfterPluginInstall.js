#!/usr/bin/env node
'use strict';

module.exports = function(context) {

  let cwd = process.cwd();
  let fs = require('fs');
  let path = require('path');

  // Using the ConfigParser from Cordova to get the project name.
  let cordova_util = context.requireCordovaModule("cordova-lib/src/cordova/util");
  let ConfigParser = context.requireCordovaModule('cordova-common').ConfigParser;
  let projectRoot = cordova_util.isCordova();
  let cordovaConfig = new ConfigParser(cordova_util.projectConfig(projectRoot));
  let projectName =  cordovaConfig.doc.findtext('./name');

  const modifyBuildConfig = function() {
    let xcConfigBuildFilePath = path.join(cwd, 'platforms', 'ios', 'cordova', 'build.xcconfig');

    try {
      let xcConfigBuildFileExists = fs.accessSync(xcConfigBuildFilePath);
    }
    catch(e) {
      console.log('Could not locate build.xcconfig, you will need to set -force_load manually');
      return;
    }

    console.log(`xcConfigBuildFilePath: ${xcConfigBuildFilePath}`);

    addOtherLinkerFlag(xcConfigBuildFilePath);
  };

  const addOtherLinkerFlag = function(xcConfigBuildFilePath) {
    let lines = fs.readFileSync(xcConfigBuildFilePath, 'utf8').split('\n');

    let otherLDFlagsLineNumber;

    lines.forEach((l, i) => {
      if (l.indexOf('OTHER_LDFLAGS') > -1) {
        otherLDFlagsLineNumber = i;
      }
    });

    if (otherLDFlagsLineNumber) {
      if (lines[otherLDFlagsLineNumber].indexOf('-all_load') == -1) {
      	//lines[otherLDFlagsLineNumber] = 'OTHER_LDFLAGS = -force_load "$(PROJECT_DIR)/$(PROJECT_NAME)/Plugins/io.anyline.cordova/Anyline.framework/Anyline"';
        lines[otherLDFlagsLineNumber] += ' -all_load ';
        console.log(`-all_load was added to other linker flags`);
      }
      else {
        console.log(`-all_load was already setup in build.xcconfig`);
      }
    }
    else {
      lines[lines.length - 1] = 'OTHER_LDFLAGS = -all_load';
    }

    let newConfig = lines.join('\n');

    fs.writeFile(xcConfigBuildFilePath, newConfig, function (err) {
      if (err) {
        console.log(`Error updating build.xcconfig: ${err}`);
        return;
      }
      console.log('Successfully updated OTHER_LDFLAGS in build.xcconfig');
    });
  };

  modifyBuildConfig();
};