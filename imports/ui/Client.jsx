import React, { Component, PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import classnames from 'classnames'

export default class Client extends Component {
  render () {
    // DONE:0 make an array from the ips but with the needed info and more user-oriented ... No need for this

    /*=============================================>>>>>
    = Getting array with same vids =
    ===============================================>>>>>*/
    // var contactArr = this.props.ip.connections.map((vid) => ({vid}))
    // console.log(contactArr)
    /*----------- stackoverflow answers -----------*/

    specialArrays = {};
    for (var i = this.props.ip.connections.map.length - 1; i >= 0; i--) {
      if (!Array.isArray(specialArrays[myArray[i].specialValue])) {
        specialArrays[this.props.ip.connections.map[i].specialValue] = []
      }
      specialArrays[this.props.ip.connections.map[i].specialValue].push(this.props.ip.connections.map[i])
    }
    console.log(specialArrays)

    /*= End of Getting array with same vids =*/
    /*=============================================<<<<<*/
    return <div className="contactBox">{this.props.ip.ipAdr}</div>
  } // render
} // Client

Client.propTypes = {
  // This component gets the task to dipslay through a React prop.
  // We can use propTypes to indicate it is required
  ip: PropTypes.object.isRequired
}
