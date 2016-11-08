import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'

import App from '../imports/ui/App.jsx'

Meteor.startup(() => {
  _ = lodash
  render(<App />, document.getElementById('render-target'))
})
