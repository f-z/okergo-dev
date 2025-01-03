import React from "react"
import Button from "misago/components/button"
import Form from "misago/components/form"
import FormGroup from "misago/components/form-group"
import ajax from "misago/services/ajax"
import snackbar from "misago/services/snackbar"
import * as validators from "misago/utils/validators"

export default class extends Form {
  constructor(props) {
    super(props)

    this.state = {
      new_email: "",
      password: "",

      validators: {
        new_email: [validators.email()],
        password: []
      },

      isLoading: false
    }
  }

  clean() {
    let errors = this.validate()
    let lengths = [
      this.state.new_email.trim().length,
      this.state.password.trim().length
    ]

    if (lengths.indexOf(0) !== -1) {
      snackbar.error("Συμπλήρωσε όλα τα πεδία!")
      return false
    }

    if (errors.new_email) {
      snackbar.error(errors.new_email[0])
      return false
    }

    return true
  }

  send() {
    return ajax.post(this.props.user.api.change_email, {
      new_email: this.state.new_email,
      password: this.state.password
    })
  }

  handleSuccess(response) {
    this.setState({
      new_email: "",
      password: ""
    })

    snackbar.success(response.detail)
  }

  handleError(rejection) {
    if (rejection.status === 400) {
      if (rejection.new_email) {
        snackbar.error(rejection.new_email)
      } else {
        snackbar.error(rejection.password)
      }
    } else {
      snackbar.apiError(rejection)
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="type" style={{ display: "none" }} />
        <input type="password" style={{ display: "none" }} />
        <div className="panel panel-default panel-form">
          <div className="panel-heading">
            <h3 className="panel-title">{"Αλλαγή διεύθυνσης email"}</h3>
          </div>
          <div className="panel-body">
            <FormGroup label={"Νέο email"} for="id_new_email">
              <input
                type="text"
                id="id_new_email"
                className="form-control"
                disabled={this.state.isLoading}
                onChange={this.bindInput("new_email")}
                value={this.state.new_email}
              />
            </FormGroup>

            <hr />

            <FormGroup
              label={"Ο κωδικός πρόσβασής σου"}
              for="id_confirm_email"
            >
              <input
                type="password"
                id="id_confirm_email"
                className="form-control"
                disabled={this.state.isLoading}
                onChange={this.bindInput("password")}
                value={this.state.password}
              />
            </FormGroup>
          </div>
          <div className="panel-footer">
            <Button className="btn-primary" loading={this.state.isLoading}>
              {"Αλλαγή email"}
            </Button>
          </div>
        </div>
      </form>
    )
  }
}
