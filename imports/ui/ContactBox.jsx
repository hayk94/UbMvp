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
      console.log(this.props.contact)
      return <div>{this.props.contact[0].firstname}</div>
  }
}

ContactBox.propTypes = {
  // This component gets the task to dipslay through a React prop.
  // We can use propTypes to indicate it is required
  contact: PropTypes.array.isRequired
}
