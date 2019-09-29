import React from "react"
import { changeOwner } from "./actions"

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.isUser = props.participant.id === props.user.id
  }

  onClick = () => {
    let confirmed = false
    if (this.isUser) {
      confirmed = confirm(
        "Είσαι σίγουρος ότι θέλεις να πάρεις τον έλεγχο αυτής της συνομιλίας;"
      )
    } else {
      const message = "Είσαι σίγουρος ότι θέλεις να δώσεις τον έλεγχο της συνομιλίας στο χρήστη %(user)s;"

      confirmed = confirm(
        interpolate(
          message,
          {
            user: this.props.participant.username
          },
          true
        )
      )
    }

    if (!confirmed) return

    changeOwner(this.props.thread, this.props.participant)
  }

  render() {
    if (this.props.participant.is_owner) return null
    if (!this.props.thread.acl.can_change_owner) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick} type="button">
          {"Δώσε τον έλεγχο"}
        </button>
      </li>
    )
  }
}
