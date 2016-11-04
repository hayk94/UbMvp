import React, { Component, PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import classnames from 'classnames'

export default class Client extends Component {
  render () {
    // DONE:20 make an array from the ips but with the needed info and more user-oriented ... No need for this

    /* =============================================>>>>>
    = Getting array with same vids =
    ===============================================>>>>>*/
    /*----------- WORKING stack overflow answer by Nina Scholz -----------*/
    // http://stackoverflow.com/questions/40416608/js-getting-a-new-array-with-just-the-elements-that-contain-certain-value/40417288#40416657
    // So far seems to be reactive as well
    var object = { "myArray" : this.props.ip.connections },
    grouped = object.myArray.reduce((map =>
        (r, a) =>
           (!map.has(a.vid) && map.set(a.vid, r[r.push([]) - 1]), map.get(a.vid).push(a), r))(new Map), [])

           console.log(grouped)
    /* = End of Getting array with same vids =*/
    /* =============================================<<<<<*/
    // TODO: Make the html of everything we can get now
    // TODO: Check if it is reactive
    return <div className="contactBox">{this.props.ip.ipAdr}</div>
  } // render
} // Client

Client.propTypes = {
  // This component gets the task to dipslay through a React prop.
  // We can use propTypes to indicate it is required
  ip: PropTypes.object.isRequired
}
