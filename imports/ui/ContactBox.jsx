/* =============================================>>>>>
= imports =
===============================================>>>>> */
import React, { Component, PropTypes } from 'react'
// import { Meteor } from 'meteor/meteor'
// import classnames from 'classnames'

/* = End of imports = */
/* =============================================<<<<< */

export default class ContactBox extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false
    }

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.setState(prevState => ({
      show: !prevState.show
    }))
  }
  render () {
      console.log('this.props.contact in ContactBox.jsx',this.props.contact)
      // TODO: Show or hide all connections

      // get online connections
       var onlineConns = _.filter(this.props.contact, (conn) => {
         return conn.disconnectedAt === null
       })
       console.log('onlineConns',onlineConns)
      return (
        <div className="contactBox">
          <div className="contactHead">
            <div className={onlineConns[0] ? 'contactImg online' : 'contactImg offline'}>
              <img src="https://d30y9cdsu7xlg0.cloudfront.net/png/524202-200.png" />
            </div> {/* contactImg */}
            <div className="contactInfoContainer">
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
              <div className={"arrow" + (this.state.show ? ' active' : '')} onClick={this.handleClick}>
                arrow
              </div> {/* arrow */}
              <div className="contactLastStatus">
                {
                  onlineConns[0] ? (
                    <div className="startedContainer">
                      <span className="started">Started:</span><span>{onlineConns[onlineConns.length - 1].connectedAt.toString()}</span>
                   </div>
                )
                : (
                  <div>
                     <div className="startedContainer">
                        <span className="started">Started:</span><span>{this.props.contact[this.props.contact.length - 1].connectedAt.toString()}</span>
                     </div>
                     <div className="stopedContainer">
                        <span className="stoped">Stoped:</span><span>{this.props.contact[this.props.contact.length - 1].disconnectedAt.toString()}</span>
                     </div>
                  </div>
                )
                }
              </div> {/* contactLastStatus */}
            </div> {/* contactInfoContainer */}
          </div> {/* contactHead */}
          {this.state.show ? (<div className={"contactConns" + (this.state.show ? ' active' : '')}>
            <h3 className="contactConnsHead">User Visited Pages & Clicked On These</h3>
            <div className="theConns">
              <div className="theConnsHead">
                <div className="visitedClicked">
                  <span className="vistedHead">Visited Links</span>
                  <span> | </span>
                  <span className="clickedHead">Clicked This</span>
                </div> {/* visitedClicked */}
                <div className="timeDate">
                  <span>Time | Date</span>
                </div> {/* visitedClicked */}
              </div> {/* theConnsHead */}
              <div className="realConns">
                {this.props.contact.map((conn) => {
                  console.log('conn',conn)
                  console.log('conn.visits[0]',conn.visits[0])
                  // console.log('conn.visits[0].visitedThis',conn.visits[0].visitedThis)
                  return (
                      <div className="aConn">
                        <div className="visitedLinkContainer">
                          {
                            conn.visits[0] ? (
                              <div className="visitedLink">
                                <a href={conn.visits[0].visitedThis} className="theVisitedLink">{conn.visits[0].visitedThis}</a>
                                <span className="visitedLinkTime">{conn.visits[0].visitedAt.toString()}</span>
                              </div>
                            )
                            : <span>unknown</span>
                           }

                        </div>
                        <div className="clicksContainer">
                          {conn.clicks.map((click) => {
                              return (
                                <div className="clickedThisContainer">
                                  <span className="clickedThis">{click.clickedThis ? click.clickedThis : 'unknown item'}</span>
                                </div>
                              )
                          })}
                        </div>
                      </div>
                  )
                })}
              </div> {/* realConns */}
            </div> {/* theConns */}
          </div>
        ) : null}
        </div>
    )
  } // render ()
} // Component

ContactBox.propTypes = {
  // This component gets the task to dipslay through a React prop.
  // We can use propTypes to indicate it is required
  contact: PropTypes.array.isRequired
}
