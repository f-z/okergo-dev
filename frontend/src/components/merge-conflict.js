import React from "react"
import Button from "./button"
import Form from "./form"
import FormGroup from "./form-group"
import ajax from "misago/services/ajax"
import modal from "misago/services/modal"

export default class extends Form {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,

      bestAnswer: "0",
      poll: "0"
    }
  }

  clean() {
    if (this.props.polls && this.state.poll === "0") {
      const confirmation = confirm(
        "Είσαι σίγουρος ότι θες να διαγράψεις όλες τις προσφορές;"
      )
      return confirmation
    }

    return true
  }

  send() {
    const data = Object.assign({}, this.props.data, {
      best_answer: this.state.bestAnswer,
      poll: this.state.poll
    })

    return ajax.post(this.props.api, data)
  }

  handleSuccess = success => {
    this.props.onSuccess(success)
    modal.hide()
  }

  handleError = rejection => {
    this.props.onError(rejection)
  }

  onBestAnswerChange = event => {
    this.changeValue("bestAnswer", event.target.value)
  }

  onPollChange = event => {
    this.changeValue("poll", event.target.value)
  }

  render() {
    return (
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button
              aria-label={"Κλείσιμο"}
              className="close"
              data-dismiss="modal"
              type="button"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 className="modal-title">{"Συγχώνευση εργασιών"}</h4>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="modal-body">
              <BestAnswerSelect
                choices={this.props.bestAnswers}
                onChange={this.onBestAnswerChange}
                value={this.state.bestAnswer}
              />
              <PollSelect
                choices={this.props.polls}
                onChange={this.onPollChange}
                value={this.state.poll}
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-default"
                data-dismiss="modal"
                disabled={this.state.isLoading}
                type="button"
              >
                {"Ακύρωση"}
              </button>
              <Button className="btn-primary" loading={this.state.isLoading}>
                {"Συγχώνευση εργασιών"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export function BestAnswerSelect({ choices, onChange, value }) {
  if (!choices) return null

  return (
    <FormGroup
      label={"Καλύτερη προσφορά"}
      helpText={"Επέλεξε την καλύτερη προσφορά για την καινούρια συγχωνευμένη εργασία. Δε θα χάσεις καμία προσφορά."}
      for="id_best_answer"
    >
      <select
        className="form-control"
        id="id_best_answer"
        onChange={onChange}
        value={value}
      >
        {choices.map(choice => {
          return (
            <option value={choice[0]} key={choice[0]}>
              {choice[1]}
            </option>
          )
        })}
      </select>
    </FormGroup>
  )
}

export function PollSelect({ choices, onChange, value }) {
  if (!choices) return null

  return (
    <FormGroup
      label={"Προσφορά"}
      helpText = {"Επέλεξε την καλύτερη προσφορά για την καινούρια συγχωνευμένη εργασία. Οι υπόλοιπες προσφορές θα διαγραφούν."}
      for="id_poll"
    >
      <select
        className="form-control"
        id="id_poll"
        onChange={onChange}
        value={value}
      >
        {choices.map(choice => {
          return (
            <option value={choice[0]} key={choice[0]}>
              {choice[1]}
            </option>
          )
        })}
      </select>
    </FormGroup>
  )
}
