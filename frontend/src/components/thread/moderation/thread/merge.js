import React from "react"
import Form from "misago/components/form"
import FormGroup from "misago/components/form-group"
import MergeConflict from "misago/components/merge-conflict"
import * as thread from "misago/reducers/thread"
import ajax from "misago/services/ajax"
import modal from "misago/services/modal"
import snackbar from "misago/services/snackbar"
import store from "misago/services/store"

export default class extends Form {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,

      url: "",

      validators: {
        url: []
      },
      errors: {}
    }
  }

  clean() {
    if (!this.state.url.trim().length) {
      snackbar.error("Πρέπει να βάλεις το σύνδεσμο για την άλλη αγγελία!")
      return false
    }

    return true
  }

  send() {
    // freeze thread
    store.dispatch(thread.busy())

    return ajax.post(this.props.thread.api.merge, {
      other_thread: this.state.url
    })
  }

  handleSuccess = success => {
    this.handleSuccessUnmounted(success)

    // keep form loading
    this.setState({
      isLoading: true
    })
  }

  handleSuccessUnmounted = success => {
    snackbar.success("Η αγγελίες έχουν συγχωνευθεί")
    window.location = success.url
  }

  handleError = rejection => {
    store.dispatch(thread.release())

    if (rejection.status === 400) {
      if (rejection.best_answers || rejection.polls) {
        modal.show(
          <MergeConflict
            api={this.props.thread.api.merge}
            bestAnswers={rejection.best_answers}
            data={{ other_thread: this.state.url }}
            polls={rejection.polls}
            onError={this.handleError}
            onSuccess={this.handleSuccessUnmounted}
          />
        )
      } else if (rejection.best_answer) {
        snackbar.error(rejection.best_answer[0])
      } else if (rejection.poll) {
        snackbar.error(rejection.poll[0])
      } else {
        snackbar.error(rejection.detail)
      }
    } else {
      snackbar.apiError(rejection)
    }
  }

  onUrlChange = event => {
    this.changeValue("url", event.target.value)
  }

  render() {
    return (
      <div className="modal-dialog" role="document">
        <form onSubmit={this.handleSubmit}>
          <div className="modal-content">
            <ModalHeader />
            <div className="modal-body">
              <FormGroup
                for="id_url"
                label={"Σύνδεσμος για την αγγελία που θες να συγχωνεύσεις"}
                help_text={"Θα διαγραφεί η τωρινή αγγελία και θα μεταφερθούν τα περιεχόμενά της σε αυτή στο σύνδεσμο"}
              >
                <input
                  className="form-control"
                  disabled={this.state.isLoading || this.props.thread.isBusy}
                  id="id_url"
                  onChange={this.onUrlChange}
                  value={this.state.url}
                />
              </FormGroup>
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
              <button
                className="btn btn-primary"
                loading={this.state.isLoading || this.props.thread.isBusy}
              >
                {"Συγχώνευση αγγελίας"}
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export function ModalHeader(props) {
  return (
    <div className="modal-header">
      <button
        aria-label={"Κλείσιμο"}
        className="close"
        data-dismiss="modal"
        type="button"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 className="modal-title">}{"Συγχώνευση αγγελίας"}</h4>
    </div>
  )
}
