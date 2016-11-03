import React, { Component, PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import classnames from 'classnames'

export default class Client extends Component {
  render () {
    // DONE:0 make an array from the ips but with the needed info and more user-oriented ... No need for this

    return <div className="contactBox">{this.props.ip.ipAdr}</div>
  } // render
} // Client

Client.propTypes = {
  // This component gets the task to dipslay through a React prop.
  // We can use propTypes to indicate it is required
  ip: PropTypes.object.isRequired
}
