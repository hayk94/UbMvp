import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'

import { Ips } from '../api/ips.js'

import Task from './Task.jsx'

// App component - represents the whole app
class App extends Component {



  render () {
    return (
      <div>
        Hello!
      </div>
    )
  }
}

// App.propTypes = {
//   tasks: PropTypes.array.isRequired,
//   incompleteCount: PropTypes.number.isRequired,
//   currentUser: PropTypes.object
// }

export default createContainer(() => {
  Meteor.subscribe('ips')

  return {
    ips: Ips.find({}, { sort: { createdAt: -1 } }).fetch()
  }
}, App)
