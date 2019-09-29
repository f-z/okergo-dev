import React from "react"
import Editor from "misago/components/editor"
import Form from "misago/components/form"
import Container from "./utils/container"
import * as attachments from "./utils/attachments"
import cleanUsernames from "./utils/usernames"
import { getPostValidators, getTitleValidators } from "./utils/validators"
import ajax from "misago/services/ajax"
import posting from "misago/services/posting"
import snackbar from "misago/services/snackbar"

export default class extends Form {
  constructor(props) {
    super(props)

    const to = (props.to || []).map(user => user.username).join(", ")

    this.state = {
      isLoading: false,

      to: to,
      title: "",
      post: "",
      attachments: [],

      validators: {
        title: getTitleValidators(),
        post: getPostValidators()
      },
      errors: {}
    }
  }

  onCancel = () => {
    const cancel = confirm(
      "Είσαι σίγουρος ότι δε θέλεις να στείλεις μήνυμα για ανάθεση εργασίας;"
    )
    if (cancel) {
      posting.close()
    }
  }

  onToChange = event => {
    this.changeValue("to", event.target.value)
  }

  onTitleChange = event => {
    this.changeValue("title", event.target.value)
  }

  onPostChange = event => {
    this.changeValue("post", event.target.value)
  }

  onAttachmentsChange = attachments => {
    this.setState({
      attachments
    })
  }

  clean() {
    if (!cleanUsernames(this.state.to).length) {
      snackbar.error("Πρέπει να επιλέξεις τουλάχιστον ένα παραλήπτη!")
      return false
    }

    if (!this.state.title.trim().length) {
      snackbar.error("Πρέπει να βάλεις τίτλο στο μήνυμα!")
      return false
    }

    if (!this.state.post.trim().length) {
      snackbar.error("Πρέπει να βάλεις περιεχόμενο στο μήνυμα!")
      return false
    }

    const errors = this.validate()

    if (errors.title) {
      snackbar.error(errors.title[0])
      return false
    }

    if (errors.post) {
      snackbar.error(errors.post[0])
      return false
    }

    return true
  }

  send() {
    return ajax.post(this.props.submit, {
      to: cleanUsernames(this.state.to),
      title: this.state.title,
      post: this.state.post,
      attachments: attachments.clean(this.state.attachments)
    })
  }

  handleSuccess(success) {
    snackbar.success("Το μήνυμά σου εστάλη επιτυχώς!")
    window.location = success.url

    // keep form loading
    this.setState({
      isLoading: true
    })
  }

  handleError(rejection) {
    if (rejection.status === 400) {
      const errors = [].concat(
        rejection.non_field_errors || [],
        rejection.to || [],
        rejection.title || [],
        rejection.post || [],
        rejection.attachments || []
      )

      snackbar.error(errors[0])
    } else {
      snackbar.apiError(rejection)
    }
  }

  render() {
    return (
      <Container className="posting-form" withFirstRow={true}>
        <form onSubmit={this.handleSubmit}>
          <div className="row first-row">
            <div className="col-xs-12">
              <input
                className="form-control"
                disabled={this.state.isLoading}
                onChange={this.onToChange}
                placeholder={
                  "Ονόματα χρηστών με κόμμα μεταξύ τους, π.χ. nikos, eleni"
                }
                type="text"
                value={this.state.to}
              />
            </div>
          </div>
          <div className="row first-row">
            <div className="col-xs-12">
              <input
                className="form-control"
                disabled={this.state.isLoading}
                onChange={this.onTitleChange}
                placeholder={"Τίτλος μηνύματος"}
                type="text"
                value={this.state.title}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <Editor
                attachments={this.state.attachments}
                loading={this.state.isLoading}
                onAttachmentsChange={this.onAttachmentsChange}
                onCancel={this.onCancel}
                onChange={this.onPostChange}
                submitLabel={"Αποστολή μηνύματος"}
                value={this.state.post}
              />
            </div>
          </div>
        </form>
      </Container>
    )
  }
}
