import React from "react"
import Button from "misago/components/button"
import ajax from "misago/services/ajax"
import title from "misago/services/page-title"
import snackbar from "misago/services/snackbar"
import misago from "misago"

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      password: ""
    }
  }

  componentDidMount() {
    title.set({
      title: "Διαγραφή λογαριασμού",
      parent: "Αλλαγή ρυθμίσεων"
    })
  }

  onPasswordChange = event => {
    this.setState({ password: event.target.value })
  }

  handleSubmit = event => {
    event.preventDefault()

    const { isLoading, password } = this.state
    const { user } = this.props

    if (password.length === 0) {
      snackbar.error("Βάλε τον κωδικό πρόσβασής σου για επιβεβαίωση!")
      return false
    }

    if (isLoading) return false
    this.setState({ isLoading: true })

    ajax.post(user.api.delete, { password }).then(
      success => {
        window.location.href = misago.get("MISAGO_PATH")
      },
      rejection => {
        this.setState({ isLoading: false })
        if (rejection.password) {
          snackbar.error(rejection.password[0])
        } else {
          snackbar.apiError(rejection)
        }
      }
    )
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="panel panel-danger panel-form">
          <div className="panel-heading">
            <h3 className="panel-title">{"Διαγραφή λογαριασμού"}</h3>
          </div>
          <div className="panel-body">
            <p className="lead">
              {"Πρόκειται να διαγράψεις το λογαριασμό σου. Αυτή η ενέργεια είναι μη αναστρέψιμη. Τα παρακάτω δεδομένα θα διαγραφούν:"}
            </p>

            <p>
              -{" "}
              {"Αποθηκευμένες διευθύνσεις IP που σχετίζονται με δημοσιευμένο περιεχόμενο"}
            </p>
            <p>
              -{" "}
              {"Το όνομα χρήστη σου θα γίνει διαθέσιμο σε άλλους χρήστες"}
            </p>
            <p>
              -{" "}
              {"Το email σου θα γίνει διαθέσιμο σε νέες εγγραφές λογαριασμών"}
            </p>

            <hr />

            <p>
              {"Όλη η δραστηριότητά σου ΔΕ θα διαγραφεί, αλλα θα είναι ανώνυμη."}
            </p>
          </div>
          <div className="panel-footer">
            <div className="input-group">
              <input
                className="form-control"
                disabled={this.state.isLoading}
                name="password-confirmation"
                type="password"
                placeholder={"Βάλε των κωδικό πρόσβασής σου για επιβεβαίωση"}
                value={this.state.password}
                onChange={this.onPasswordChange}
              />
              <span className="input-group-btn">
                <Button className="btn-danger" loading={this.state.isLoading}>
                  {"Διαγραφή του λογαριασμού μου"}
                </Button>
              </span>
            </div>
          </div>
        </div>
      </form>
    )
  }
}
