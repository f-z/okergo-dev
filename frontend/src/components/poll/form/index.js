import React from "react"
import ChoicesControl from "./choices-control"
import Button from "misago/components/button"
import Form from "misago/components/form"
import FormGroup from "misago/components/form-group"
import YesNoSwitch from "misago/components/yes-no-switch"
import * as poll from "misago/reducers/poll"
import ajax from "misago/services/ajax"
import posting from "misago/services/posting"
import snackbar from "misago/services/snackbar"
import store from "misago/services/store"

export default class extends Form {
  constructor(props) {
    super(props)

    const poll = props.poll || {
      question: "",
      choices: [
        {
          hash: "choice-10000",
          label: ""
        },
        {
          hash: "choice-20000",
          label: ""
        }
      ],
      length: 0,
      allowed_choices: 1,
      allow_revotes: 0,
      is_public: 0
    }

    this.state = {
      isLoading: false,
      isEdit: !!poll.question,

      question: poll.question,
      choices: poll.choices,
      length: poll.length,
      allowed_choices: poll.allowed_choices,
      allow_revotes: poll.allow_revotes,
      is_public: poll.is_public,

      validators: {
        question: [],
        choices: [],
        length: [],
        allowed_choices: []
      },

      errors: {}
    }
  }

  setChoices = choices => {
    const errors = Object.assign({}, errors, { choices: null })

    this.setState({
      choices,
      errors
    })
  }

  onCancel = () => {
    const cancel = confirm("Είσαι σίγουρος ότι δε θες να δημοσιεύσεις αυτή την ψηφοφορία;")
    if (cancel) {
      posting.close()
    }
  }

  send() {
    const data = {
      question: this.state.question,
      choices: this.state.choices,
      length: this.state.length,
      allowed_choices: this.state.allowed_choices,
      allow_revotes: this.state.allow_revotes,
      is_public: this.state.is_public
    }

    if (this.state.isEdit) {
      return ajax.put(this.props.poll.api.index, data)
    } else {
      return ajax.post(this.props.thread.api.poll, data)
    }
  }

  handleSuccess(data) {
    store.dispatch(poll.replace(data))

    if (this.state.isEdit) {
      snackbar.success("Η ψηφοφορία τροποποιήθηκε επιτυχώς!")
    } else {
      snackbar.success("Η ψηφοφορία δημοσιεύθηκε επιτυχώς!")
    }

    posting.close()
  }

  handleError(rejection) {
    if (rejection.status === 400) {
      if (rejection.non_field_errors) {
        rejection.allowed_choices = rejection.non_field_errors
      }

      this.setState({
        errors: Object.assign({}, rejection)
      })

      snackbar.error("Η φόρμα περιέχει λάθη!")
    } else {
      snackbar.apiError(rejection)
    }
  }

  render() {
    return (
      <div className="poll-form">
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <div className="panel panel-default panel-form">
              <div className="panel-body">
                <fieldset>
                  <legend>{"Ερώτηση και επιλογές"}</legend>

                  <FormGroup
                    label={"Ερώτηση ψηφοφορίας"}
                    for="id_questions"
                    validation={this.state.errors.question}
                  >
                    <input
                      className="form-control"
                      disabled={this.state.isLoading}
                      id="id_questions"
                      onChange={this.bindInput("question")}
                      type="text"
                      maxLength="255"
                      value={this.state.question}
                    />
                  </FormGroup>

                  <FormGroup
                    label={"Διαθέσιμες επιλογές"}
                    validation={this.state.errors.choices}
                  >
                    <ChoicesControl
                      choices={this.state.choices}
                      disabled={this.state.isLoading}
                      setChoices={this.setChoices}
                    />
                  </FormGroup>
                </fieldset>

                <fieldset>
                  <legend>{"Διαδικασία"}</legend>

                  <div className="row">
                    <div className="col-xs-12 col-sm-6">
                      <FormGroup
                        label={"Διάρκεια"}
                        helpText={
                          "Βάλε τον αριθμό των ημερών που θες να τρέξει η ψηφοφορία. Αν βάλεις μηδέν, θα είναι ανοιχτή επ' αόριστον."
                        }
                        for="id_length"
                        validation={this.state.errors.length}
                      >
                        <input
                          className="form-control"
                          disabled={this.state.isLoading}
                          id="id_length"
                          onChange={this.bindInput("length")}
                          type="text"
                          value={this.state.length}
                        />
                      </FormGroup>
                    </div>
                    <div className="col-xs-12 col-sm-6">
                      <FormGroup
                        label={"Διαθέσιμες επιλογές"}
                        for="id_allowed_choices"
                        validation={this.state.errors.allowed_choices}
                      >
                        <input
                          className="form-control"
                          disabled={this.state.isLoading}
                          id="id_allowed_choices"
                          onChange={this.bindInput("allowed_choices")}
                          type="text"
                          maxLength="255"
                          value={this.state.allowed_choices}
                        />
                      </FormGroup>
                    </div>
                  </div>

                  <div className="row">
                    <PollPublicSwitch
                      bindInput={this.bindInput}
                      disabled={this.state.isLoading}
                      isEdit={this.state.isEdit}
                      value={this.state.is_public}
                    />
                    <div className="col-xs-12 col-sm-6">
                      <FormGroup
                        label={"Να επιτρέπονται αλλαγές"}
                        for="id_allow_revotes"
                      >
                        <YesNoSwitch
                          id="id_allow_revotes"
                          disabled={this.state.isLoading}
                          iconOn="check"
                          iconOff="close"
                          labelOn={
                            "Οι χρήστες να μπορούν να αλλάξουν την ψήφο τους"
                          }
                          labelOff={
                            "Οι χρήστες να μην μπορούν να αλλάξουν την ψήφο τους"
                          }
                          onChange={this.bindInput("allow_revotes")}
                          value={this.state.allow_revotes}
                        />
                      </FormGroup>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className="panel-footer text-right">
                <button
                  className="btn btn-default"
                  disabled={this.state.isLoading}
                  onClick={this.onCancel}
                  type="button"
                >
                  {"Ακύρωση"}
                </button>{" "}
                <Button className="btn-primary" loading={this.state.isLoading}>
                  {this.state.isEdit
                    ? "Αποθήκευση αλλαγών"
                    : "Δημοσίευση ψηφοφορίας"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export function PollPublicSwitch(props) {
  if (props.isEdit) return null

  return (
    <div className="col-xs-12 col-sm-6">
      <FormGroup
        label={"Ανοιχτή ψηφοφορία"}
        helpText={
          "Αν η ψηφοφορία είναι ανοιχτή, όλοι οι χρήστες θα μπορούν να δουν τις ψήφους αναλυτικά, για παράδειγμα ποιοι ψήφισαν για ποιες επιλογές και πότε ακριβώς. Αυτή η επιλογή δεν μπορεί να αλλάξει εκ των υστέρων. Οι διαχειριστές της σελίδας έχουν πρόσβαση σε όλες τις ψηφοφορίες."
        }
        for="id_is_public"
      >
        <YesNoSwitch
          id="id_is_public"
          disabled={props.disabled}
          iconOn="visibility"
          iconOff="visibility_off"
          labelOn={"Η ψηφοφορία είναι ανοιχτή"}
          labelOff={"Η ψηφοφορία είναι κλειστή"}
          onChange={props.bindInput("is_public")}
          value={props.value}
        />
      </FormGroup>
    </div>
  )
}
