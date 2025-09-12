/*
 * Anyline Cordova Plugin
 * config-loader.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */

const configLoader = {};

configLoader.loadJsonConfig = function(filename) {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/config/' + filename, false); // Synchronous request
    xhr.send();
    
    if (xhr.status === 200) {
      return JSON.parse(xhr.responseText);
    } else {
      console.error('Error loading config file:', filename, 'Status:', xhr.status);
      return null;
    }
  } catch (error) {
    console.error('Error loading config file:', filename, error);
    return null;
  }
}; 