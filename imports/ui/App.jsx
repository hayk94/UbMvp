import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'

import { Ips } from '../api/ips.js'

import Client from './Client.jsx'

// App component - represents the whole app
class App extends Component {
  renderClients () {
    return this.props.ips.map((ip) => (
     <Client key={ip._id} ip={ip} />
   ))
  }
  render () {
    return (
      <div className="container">
        <div className="mainContentContainer container">
          <h1>All Users</h1>
          <hr className="myHR" />
          <ul className="clients">
            {this.renderClients()}
          </ul>
        </div>
        <pre>
        {
           JSON.stringify(Ips.find({}, {
                sort: {
                  createdAt: -1
                }
              }).fetch(), undefined, 2)
            }
        </pre>
      </div>
    )
  }
}

App.propTypes = {
  ips: PropTypes.array.isRequired
  // incompleteCount: PropTypes.number.isRequired,
  // currentUser: PropTypes.object
}

export default createContainer(() => {
  Meteor.subscribe('ips')
  // DONE:10 For now we're bringing the whole ip dbs with lots of Hubspot info, I am sure this will later cause some problems.. A good solution may be to create another db for what is needed to be delivered to the frontend like ipsFront.js and save front data there .... changed the db it is no longer that large anymore at least for now
  return {
    ips: Ips.find({}).fetch()
  }
}, App)
