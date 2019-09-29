import React from "react"
import Button from "misago/components/button"
import Form from "misago/components/form"
import FormGroup from "misago/components/form-group"
import Select from "misago/components/select"
import YesNoSwitch from "misago/components/yes-no-switch"
import { patch } from "misago/reducers/auth"
import ajax from "misago/services/ajax"
import title from "misago/services/page-title"
import snackbar from "misago/services/snackbar"
import store from "misago/services/store"

export default class extends Form {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,

      is_hiding_presence: props.user.is_hiding_presence,
      limits_private_thread_invites_to:
        props.user.limits_private_thread_invites_to,
      subscribe_to_started_threads: props.user.subscribe_to_started_threads,
      subscribe_to_replied_threads: props.user.subscribe_to_replied_threads,

      errors: {}
    }

    this.privateThreadInvitesChoices = [
      {
        value: 0,
        icon: "help_outline",
        label: "Όλοι"
      },
      {
        value: 1,
        icon: "done_all",
        label: "Μόνο χρήστες που ακολουθώ"
      },
      {
        value: 2,
        icon: "highlight_off",
        label: "Κανένας"
      }
    ]

    this.subscribeToChoices = [
      {
        value: 0,
        icon: "star_border",
        label: "Όχι"
      },
      {
        value: 1,
        icon: "star_half",
        label: "Ειδοποιήσεις στη σελίδα"
      },
      {
        value: 2,
        icon: "star",
        label: "Ειδοποιήσεις μέσω email"
      }
    ]
  }

  send() {
    return ajax.post(this.props.user.api.options, {
      is_hiding_presence: this.state.is_hiding_presence,
      limits_private_thread_invites_to: this.state
        .limits_private_thread_invites_to,
      subscribe_to_started_threads: this.state.subscribe_to_started_threads,
      subscribe_to_replied_threads: this.state.subscribe_to_replied_threads
    })
  }

  handleSuccess() {
    store.dispatch(
      patch({
        is_hiding_presence: this.state.is_hiding_presence,
        limits_private_thread_invites_to: this.state
          .limits_private_thread_invites_to,
        subscribe_to_started_threads: this.state.subscribe_to_started_threads,
        subscribe_to_replied_threads: this.state.subscribe_to_replied_threads
      })
    )
    snackbar.success("Οι ρυθμίσεις σου άλλαξαν επιτυχώς!")
  }

  handleError(rejection) {
    if (rejection.status === 400) {
      snackbar.error("Ανανέωσε τη σελίδα και ξαναπροσπάθησε...")
    } else {
      snackbar.apiError(rejection)
    }
  }

  componentDidMount() {
    title.set({
      title: "Ρυθμίσεις",
      parent: "Αλλαγή ρυθμίσεων"
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="panel panel-default panel-form">
          <div className="panel-heading">
            <h3 className="panel-title">{"Αλλαγή επιλογών"}</h3>
          </div>
          <div className="panel-body">
            <fieldset>
              <legend>{"Ρυθμίσεις ασφαλείας"}</legend>

              <FormGroup
                label={"Κρύψιμο της παρουσίας μου"}
                helpText={"Αν κρύψεις την παρουσία σου, οι άλλοι χρήστες δε θα μπορούν να δουν πότε είσαι συνδεδεμένος."}
                for="id_is_hiding_presence"
              >
                <YesNoSwitch
                  id="id_is_hiding_presence"
                  disabled={this.state.isLoading}
                  iconOn="visibility_off"
                  iconOff="visibility"
                  labelOn={"Κρύψιμο της παρουσίας μου από άλλους χρήστες"}
                  labelOff={"Εμφάνιση της παρουσίας μου σε άλλους χρήστες"}
                  onChange={this.bindInput("is_hiding_presence")}
                  value={this.state.is_hiding_presence}
                />
              </FormGroup>

              <FormGroup
                label={"Συνομιλίες για ανάθεση εργασίας"}
                for="id_limits_private_thread_invites_to"
              >
                <Select
                  id="id_limits_private_thread_invites_to"
                  disabled={this.state.isLoading}
                  onChange={this.bindInput("limits_private_thread_invites_to")}
                  value={this.state.limits_private_thread_invites_to}
                  choices={this.privateThreadInvitesChoices}
                />
              </FormGroup>
            </fieldset>

            <fieldset>
              <legend>{"Αυτόματες ειδοποιήσεις"}</legend>

              <FormGroup
                label={"Αγγελίες που δημοσιεύω"}
                for="id_subscribe_to_started_threads"
              >
                <Select
                  id="id_subscribe_to_started_threads"
                  disabled={this.state.isLoading}
                  onChange={this.bindInput("subscribe_to_started_threads")}
                  value={this.state.subscribe_to_started_threads}
                  choices={this.subscribeToChoices}
                />
              </FormGroup>

              <FormGroup
                label={"Προσφορές που κάνω"}
                for="id_subscribe_to_replied_threads"
              >
                <Select
                  id="id_subscribe_to_replied_threads"
                  disabled={this.state.isLoading}
                  onChange={this.bindInput("subscribe_to_replied_threads")}
                  value={this.state.subscribe_to_replied_threads}
                  choices={this.subscribeToChoices}
                />
              </FormGroup>
            </fieldset>
          </div>
          <div className="panel-footer">
            <Button className="btn-primary" loading={this.state.isLoading}>
              {"Αποθήκευση αλλαγών"}
            </Button>
          </div>
        </div>
      </form>
    )
  }
}
