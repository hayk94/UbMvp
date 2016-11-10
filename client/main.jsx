import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'

import App from '../imports/ui/App.jsx'

Meteor.startup(() => {
  WebFontConfig = {
   google: { families: [ 'Open Sans:300,400,700:latin' ] }
 };
 (function() {
   var wf = document.createElement('script');
   wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
     '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
   wf.type = 'text/javascript';
   wf.async = 'true';
   var s = document.getElementsByTagName('script')[0];
   s.parentNode.insertBefore(wf, s);
   console.log("async fonts loaded", WebFontConfig);
 })();
  _ = lodash // no need to import lodash it is defined globally
  render(<App />, document.getElementById('render-target'))
})
