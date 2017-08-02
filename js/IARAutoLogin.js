// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.iamresponding.com/v3/Pages/Default.aspx
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $('#subscriberLogin').click();
    
   function funcx()
   {
      if( $('#memberLoginDialog').length ) {
          return;
      }
       console.log('subscribers is not found!' + $('#memberLoginDialog').length);
       // your code here
       // break out here if needed
       setTimeout(funcx, 3000);
   }

funcx();
    
    console.log('Member login dialog: ' + $('#memberLoginDialog').length);
    console.log('ddlsubscribers: ' + $('#ddlsubsciribers').length + ' memberfname: ' + $('#memberfname').length);
    $('#ddlsubsciribers').val('GREENKNOLLRS');
    $('#memberfname').val('gowakowski');
    $('#memberpwd').val('gnowakowskiSta#43');
    $('#login').click();
})();
