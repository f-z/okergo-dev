import React from "react"
import * as actions from "misago/reducers/thread"
import ajax from "misago/services/ajax"
import snackbar from "misago/services/snackbar"
import store from "misago/services/store"

export default function(props) {
  if (!props.user.id) return null

  return (
    <div className={props.className}>
      <button
        aria-expanded="true"
        aria-haspopup="true"
        className="btn btn-default dropdown-toggle btn-block btn-outline"
        data-toggle="dropdown"
        type="button"
      >
        <span className="material-icon">
          {getIcon(props.thread.subscription)}
        </span>
        {getLabel(props.thread.subscription)}
      </button>
      <Dropdown {...props} />
    </div>
  )
}

export function getIcon(subscription) {
  if (subscription === true) {
    return "star"
  } else if (subscription === false) {
    return "star_half"
  } else {
    return "star_border"
  }
}

export function getLabel(subscription) {
  if (subscription === true) {
    return "Ειδοποιήσεις μέσω email"
  } else if (subscription === false) {
    return "Ενεργές ειδοποιήσεις"
  } else {
    return "Απενεργοποιημένες ειδοποιήσεις"
  }
}

export function Dropdown(props) {
  return (
    <ul className={props.dropdownClassName || "dropdown-menu stick-to-bottom"}>
      <Disable {...props} />
      <Enable {...props} />
      <Email {...props} />
    </ul>
  )
}

export class Disable extends React.Component {
  onClick = () => {
    if (this.props.thread.subscription === null) {
      return
    }

    update(this.props.thread, null, "unsubscribe")
  }

  render() {
    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick}>
          <span className="material-icon">star_border</span>
          {"Απεγγραφή από ειδοποιήσεις"}
        </button>
      </li>
    )
  }
}

export class Enable extends React.Component {
  onClick = () => {
    if (this.props.thread.subscription === false) {
      return
    }

    update(this.props.thread, false, "notify")
  }

  render() {
    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick}>
          <span className="material-icon">star_half</span>
          {"Εγγραφή σε ειδοποιήσεις στη σελίδα"}
        </button>
      </li>
    )
  }
}

export class Email extends React.Component {
  onClick = () => {
    if (this.props.thread.subscription === true) {
      return
    }

    update(this.props.thread, true, "email")
  }

  render() {
    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick}>
          <span className="material-icon">star</span>
          {"Εγγραφή σε ειδοποιήσεις μέσω email"}
        </button>
      </li>
    )
  }
}

export function update(thread, newState, value) {
  const oldState = {
    subscription: thread.subscription
  }

  store.dispatch(
    actions.update({
      subscription: newState
    })
  )

  ajax
    .patch(thread.api.index, [
      { op: "replace", path: "subscription", value: value }
    ])
    .then(
      finalState => {
        store.dispatch(actions.update(finalState))
      },
      rejection => {
        if (rejection.status === 400) {
          snackbar.error(rejection.detail[0])
        } else {
          snackbar.apiError(rejection)
        }

        store.dispatch(actions.update(oldState))
      }
    )
}
