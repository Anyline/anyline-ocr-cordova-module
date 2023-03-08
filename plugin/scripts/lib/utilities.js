/**
 * Utilities and shared functionality for the build hooks.
 */
var fs = require('fs');
var path = require("path");
var parser = require('xml-js');

var _configXml;

var Utilities = {};

Utilities.parseConfigXml = function () {
    if (_configXml) return _configXml;
    _configXml = Utilities.parseXmlFileToJson("config.xml");
    return _configXml;
};

Utilities.parseXmlFileToJson = function (filepath, parseOpts) {
    parseOpts = parseOpts || { compact: true };
    return JSON.parse(parser.xml2json(fs.readFileSync(path.resolve(filepath), 'utf-8'), parseOpts));
};

Utilities.getAppName = function () {
    return Utilities.parseConfigXml().widget.name._text.toString().trim();
};

Utilities.getPreferenceValue = function (name) {
    var config = Utilities.parseConfigXml()
    var retainAssetsPattern = config.widget.preference.find(preference => preference._attributes.name === name);
    if (retainAssetsPattern) {
        return retainAssetsPattern._attributes.value
    }
    return null;
}

module.exports = Utilities;
