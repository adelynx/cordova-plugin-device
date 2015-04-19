/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

var argscheck = require('cordova/argscheck'),
        channel = require('cordova/channel'),
        utils = require('cordova/utils'),
        exec = require('cordova/exec'),
        cordova = require('cordova');

channel.createSticky('onCordovaInfoReady');
// Tell cordova channel to wait on the CordovaInfoReady event
channel.waitForInitialization('onCordovaInfoReady');

/**
 * This represents the mobile device, and provides properties for inspecting the model, version, UUID of the
 * phone, etc.
 * @constructor
 */
function Device() {
    this.available = false;
    this.platform = null;
    this.version = null;
    this.uuid = null;
    this.cordova = null;
    this.model = null;
    this.manufacturer = null;
    this.serial = null;
    this.subscriberid = null;
    this.imei = null;
    this.imsi = null;
    this.operatorname = null;
    this.networktype = null;

    var me = this;

    channel.onCordovaReady.subscribe(function () {
        me.getInfo(function (info) {
            //ignoring info.cordova returning from native, we should use value from cordova.version defined in cordova.js
            //TODO: CB-5105 native implementations should not return info.cordova
            var buildLabel = cordova.version;
            me.available = true;
            me.platform = info.platform;
            me.version = info.version;
            me.uuid = info.uuid;
            me.cordova = buildLabel;
            me.model = info.model;
            me.manufacturer = info.manufacturer || 'unknown';
            me.serial = info.serial;
            me.subscriberid = info.subscriberid;
            me.imei = info.imei;
            me.imsi = info.imsi;
            me.operatorname = info.operatorname;
            me.networktype = getNetworkType(info.networktype);
            channel.onCordovaInfoReady.fire();
        }, function (e) {
            me.available = false;
            utils.alert("[ERROR] Error initializing Cordova: " + e);
        });
    });
}

/**
 * Get Network Type
 *
 * @param {networktype}; 
 */
function getNetworkType(networktype) {
    
    switch (networktype) {
        case 0:
            return "Unknown";
        case 1:
            return "2G";
        case 2:
            return "2G";
        case 4:
            return "2G";
        case 7:
            return "2G";
        case 11:
            return "2G";
            
        case 3:
            return "3G";
        case 5:
            return "3G";
        case 6:
            return "3G";
        case 8:
            return "3G";
        case 9:
            return "3G";
        case 10:
            return "3G";
        case 12:
            return "3G";
        case 14:
            return "3G";
        case 15:
            return "3G";
            
        case 13:
            return "4G";
        
        default :
            return "Unknown";
    }    
}

/**
 * Get device info
 *
 * @param {Function} successCallback The function to call when the heading data is available
 * @param {Function} errorCallback The function to call when there is an error getting the heading data. (OPTIONAL)
 */
Device.prototype.getInfo = function (successCallback, errorCallback) {
    argscheck.checkArgs('fF', 'Device.getInfo', arguments);
    exec(successCallback, errorCallback, "Device", "getDeviceInfo", []);
};

module.exports = new Device();