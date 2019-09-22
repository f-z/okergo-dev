import React from "react"
import ajax from "misago/services/ajax"

export default class AcceptAgreement extends React.Component {
  constructor(props) {
    super(props)

    this.state = { submiting: false }
  }

  handleDecline = () => {
    if (this.state.submiting) return

    const confirmation = confirm(
        "Αν αρνηθείς θα διαγραφεί για πάντα ο λογαριασμός σου!"
    )
    if (!confirmation) return

    this.setState({ submiting: true })

    ajax.post(this.props.api, { accept: false }).then(() => {
      location.reload(true)
    })
  }

  handleAccept = () => {
    if (this.state.submiting) return

    this.setState({ submiting: true })

    ajax.post(this.props.api, { accept: true }).then(() => {
      location.reload(true)
    })
  }

  render() {
    return (
      <div>
        <button
          className="btn btn-default"
          disabled={this.state.submiting}
          type="buton"
          onClick={this.handleDecline}
        >
          {"Αρνούμαι"}
        </button>
        <button
          className="btn btn-primary"
          disabled={this.state.submiting}
          type="buton"
          onClick={this.handleAccept}
        >
          {"Δέχομαι"}
        </button>
      </div>
    )
  }
}
