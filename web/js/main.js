/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
'use strict';

/**
 * Example of Require.js boostrap javascript
 */

// The UserAgent is used to detect IE11. Only IE11 requires ES5.
(function() {

    function _ojIsIE11() {
        var nAgt = navigator.userAgent;
        return nAgt.indexOf('MSIE') !== -1 || !!nAgt.match(/Trident.*rv:11./);
    };
    var _ojNeedsES5 = _ojIsIE11();

    requirejs.config({
        baseUrl: 'js',

        paths:
        /* DO NOT MODIFY
         ** All paths are dynamicaly generated from the path_mappings.json file.
         ** Add any new library dependencies in path_mappings json file
         */
// injector:mainReleasePaths

{
  "knockout":"libs/knockout/knockout-3.5.1.debug",
  "jquery":"libs/jquery/jquery-3.5.1",
  "querystring":"libs/qs/qs",
  "mongodb":"libs/mongodb/mongodb",
  "mock-rest-server":"libs/mock-rest-server/MockRestServer",
  "mockjax":"libs/mock-rest-server/MockRestServer",
  "jqueryui-amd":"libs/jquery/jqueryui-amd-1.12.1",
  "mongodb-libs":"libs/mongodb/lib",
  "res_adherent":"views/adherentData.json",
  "promise":"libs/es6-promise/es6-promise",
  "hammerjs":"libs/hammer/hammer-2.0.8",
  "ojdnd":"libs/dnd-polyfill/dnd-polyfill-1.0.2",
  "ojs":"libs/oj/v10.0.0/debug" + (_ojNeedsES5 ? "_es5" : ""),
  "ojL10n":"libs/oj/v10.0.0/ojL10n",
  "ojtranslations":"libs/oj/v10.0.0/resources",
  "persist":"libs/persist/debug",
  "text":"libs/require/text",
  "signals":"libs/js-signals/signals",
  "touchr":"libs/touchr/touchr",
  "regenerator-runtime":"libs/regenerator-runtime/runtime",
  "corejs":"libs/corejs/shim",
  "customElements":"libs/webcomponents/custom-elements.min",
  "proj4":"libs/proj4js/dist/proj4-src",
  "css":"libs/require-css/css",
  "ojcss":"libs/oj/v10.0.0/debug" + (_ojNeedsES5 ? "_es5/ojcss.js" : "/ojcss.js"),
  "css-builder":"libs/require-css/css-builder",
  "normalize":"libs/require-css/normalize"
}

// endinjector
    });
}());

require(['ojs/ojbootstrap', 'root'], function(Bootstrap, Root) {
    // this callback gets executed when all required modules are loaded
    Bootstrap.whenDocumentReady().then(function() {
        Root.init();
    });
});