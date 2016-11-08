/* =============================================>>>>>
= imports =
===============================================>>>>> */
import React, { Component, PropTypes } from 'react'
// import { Meteor } from 'meteor/meteor'
// import classnames from 'classnames'

/* = End of imports = */
/* =============================================<<<<< */

export default class ContactBox extends Component {
  render () {
      console.log('this.props.contact in ContactBox.jsx',this.props.contact)
      // TODO: Make connections to render
      // get from the contact[] the objects{} that do not have disconnectedAt and get the one that has the latest connectedAt

      // get online connections
       var onlineConns = _.filter(this.props.contact, (conn) => {
         return conn.disconnectedAt === null
       })
       console.log('onlineConns',onlineConns)
     // sort to get the most recent
       onlineConns = _.sortBy(onlineConns, (conn) => {
         return conn.connectedAt
       })
       // REVIEW: it seems that the filter already returns a sorted array in asc order, the last one is the last conn
       console.log('onlineConns sorted', onlineConns)
      return (
        <div className="contactBox">
          <div className="contactHead">
            <div className="contactImg">
              <img src="https://d30y9cdsu7xlg0.cloudfront.net/png/524202-200.png" />
            </div> {/* contactImg */}
            <div className="contactInfo">
              <p className="contactName">
                <strong>
                  <span className="contactFirstName">
                    {this.props.contact[0].firstName ? this.props.contact[0].firstName : 'unknown first name '}
                  </span>
                  <span className="contactLastName">
                    {this.props.contact[0].lastName ? ' ' + this.props.contact[0].lastName : 'unknown last name'}
                  </span>
                </strong>
              </p> {/* contactName */}
              <p className="contactEmail">
                {this.props.contact[0].email ? <a href={'mailto:' + this.props.contact[0].email}>{this.props.contact[0].email}</a> : <span>unknown mail</span>}
              </p> {/* contactEmail */}
              <p className="contactIp">
                <strong>{this.props.contact[0].ipAdr ? this.props.contact[0].ipAdr : 'unknown ip'}</strong>
              </p> {/* contactEmail */}
            </div> {/* contactInfo */}
          </div> {/* contactHead */}
        </div>
    )

  } // render ()
} // Component

ContactBox.propTypes = {
  // This component gets the task to dipslay through a React prop.
  // We can use propTypes to indicate it is required
  contact: PropTypes.array.isRequired
}
