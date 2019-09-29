import React from "react"
import PanelMessage from "misago/components/panel-message"

export default class extends React.Component {
  getHelpText() {
    if (this.props.options.next_on) {
      return interpolate(
        "Θα μπορείς να αλλάξεις ξανά το όνομα χρήστη σου %(next_change)s",
        { next_change: this.props.options.next_on.fromNow() },
        true
      )
    } else {
      return "Έχεις χρησιμοποιήσει όλες τις δυνατότητες αλλαγής ονόματος χρήστη"
    }
  }

  render() {
    return (
      <div className="panel panel-default panel-form">
        <div className="panel-heading">
          <h3 className="panel-title">{"Αλλαγή ονόματος χρήστη"}</h3>
        </div>
        <PanelMessage
          helpText={this.getHelpText()}
          message={"Δεν μπορείς να αλλάξεις το όνομα χρήστη σου αυτή τη στιγμή..."}
        />
      </div>
    )
  }
}
