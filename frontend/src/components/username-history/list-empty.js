import React from "react"

export default class extends React.Component {
  getEmptyMessage() {
    if (this.props.emptyMessage) {
      return this.props.emptyMessage
    } else {
      return "Δεν έχεις αλλάξει το όνομα χρήστη σου"
    }
  }

  render() {
    return (
      <div className="username-history ui-ready">
        <ul className="list-group">
          <li className="list-group-item empty-message">
            {this.getEmptyMessage()}
          </li>
        </ul>
      </div>
    )
  }
}
