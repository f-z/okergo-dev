import React from "react"

export default class extends React.Component {
  refresh() {
    window.location.reload()
  }

  getMessage() {
    if (this.props.signedIn) {
      return interpolate("Έχεις συνδεθεί ως %(username)s. Ξαναφόρτωσε τη σελίδα πριν συνεχίσεις.",
        { username: this.props.signedIn.username },
        true
      )
    } else if (this.props.signedOut) {
      return interpolate("%(username)s, έχεις αποσυνδεθεί. Ξαναφόρτωσε τη σελίδα πριν συνεχίσεις.",
        { username: this.props.user.username },
        true
      )
    }
  }

  render() {
    let className = "auth-message"
    if (this.props.signedIn || this.props.signedOut) {
      className += " show"
    }

    return (
      <div className={className}>
        <div className="container">
          <p className="lead">{this.getMessage()}</p>
          <p>
            <button
              className="btn btn-default"
              type="button"
              onClick={this.refresh}
            >
              {"Ξαναφόρτωσε τη σελίδα"}
            </button>
            <span className="hidden-xs hidden-sm">
              {" " + "ή πάτησε το F5."}
            </span>
          </p>
        </div>
      </div>
    )
  }
}

export function select(state) {
  return {
    user: state.auth.user,
    signedIn: state.auth.signedIn,
    signedOut: state.auth.signedOut
  }
}
