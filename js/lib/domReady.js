/**
 * @license RequireJS domReady 2.0.1 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/domReady for details
 */
define(function(){function a(){if(!c){c=!0;f&&clearInterval(f);var b=g;if(c&&b.length){g=[];var d;for(d=0;d<b.length;d+=1)b[d](l)}}}function e(b){c?b(l):g.push(b);return e}var m,h,f,k="undefined"!==typeof window&&window.document,c=!k,l=k?document:null,g=[];if(k){if(document.addEventListener)document.addEventListener("DOMContentLoaded",a,!1),window.addEventListener("load",a,!1);else if(window.attachEvent){window.attachEvent("onload",a);h=document.createElement("div");try{m=null===window.frameElement}catch(n){}h.doScroll&&m&&window.external&&(f=setInterval(function(){try{h.doScroll(),a()}catch(b){}},30))}"complete"===document.readyState&&a()}e.version="2.0.1";e.load=function(b,d,a,c){c.isBuild?a(null):e(a)};return e});