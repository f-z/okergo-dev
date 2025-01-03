import React from "react"
import Button from "misago/components/button"
import Form from "misago/components/form"
import FormGroup from "misago/components/form-group"
import Loader from "misago/components/modal-loader"
import ModalMessage from "misago/components/modal-message"
import YesNoSwitch from "misago/components/yes-no-switch"
import misago from "misago/index"
import ajax from "misago/services/ajax"
import polls from "misago/services/polls"

export default class extends Form {
  constructor(props) {
    super(props)

    this.state = {
      isLoaded: false,
      isLoading: false,
      isDeleted: false,
      error: null,

      countdown: 5,
      confirm: false,

      with_content: false
    }
  }

  componentDidMount() {
    ajax.get(this.props.profile.api.delete).then(
      () => {
        this.setState({
          isLoaded: true
        })

        this.countdown()
      },
      rejection => {
        this.setState({
          isLoaded: true,
          error: rejection.detail
        })
      }
    )
  }

  countdown = () => {
    window.setTimeout(() => {
      if (this.state.countdown > 1) {
        this.setState({
          countdown: this.state.countdown - 1
        })
        this.countdown()
      } else if (!this.state.confirm) {
        this.setState({
          confirm: true
        })
      }
    }, 1000)
  }

  send() {
    return ajax.post(this.props.profile.api.delete, {
      with_content: this.state.with_content
    })
  }

  handleSuccess() {
    polls.stop("user-profile")

    if (this.state.with_content) {
      this.setState({
        isDeleted: interpolate(
            "Ο λογαριασμός του χρήστη %(username)s έχει διαγραφεί τελείως",
          {
            username: this.props.profile.username
          },
          true
        )
      })
    } else {
      this.setState({
        isDeleted: interpolate(
            "Ο λογαριασμός του χρήστη %(username)s έχει διαγραφεί και η δραστηριότητά του θα είναι κρυμμένη",
          {
            username: this.props.profile.username
          },
          true
        )
      })
    }
  }

  getButtonLabel() {
    if (this.state.confirm) {
      return interpolate("Διαγραφή του χρήστη %(username)s",
        {
          username: this.props.profile.username
        },
        true
      )
    } else {
      return interpolate("Παρακαλώ περίμενε... (%(countdown)s)",
        {
          countdown: this.state.countdown
        },
        true
      )
    }
  }

  getForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="modal-body">
          <FormGroup label={"Δραστηριότητα χρήστη"} for="id_with_content">
            <YesNoSwitch
              id="id_with_content"
              disabled={this.state.isLoading}
              labelOn={"Διαγραφή μαζί με το λογαριασμό"}
              labelOff={"Κρύψιμο μετά τη διαγραφή του λογαριασμού"}
              onChange={this.bindInput("with_content")}
              value={this.state.with_content}
            />
          </FormGroup>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-default"
            data-dismiss="modal"
          >
            {"Ακύρωση"}
          </button>

          <Button
            className="btn-danger"
            loading={this.state.isLoading}
            disabled={!this.state.confirm}
          >
            {this.getButtonLabel()}
          </Button>
        </div>
      </form>
    )
  }

  getDeletedBody() {
    return (
      <div className="modal-body">
        <div className="message-icon">
          <span className="material-icon">info_outline</span>
        </div>
        <div className="message-body">
          <p className="lead">{this.state.isDeleted}</p>
          <p>
            <a href={misago.get("USERS_LIST_URL")}>
              {"Επιστροφή στη λίστα χρηστών"}
            </a>
          </p>
        </div>
      </div>
    )
  }

  getModalBody() {
    if (this.state.error) {
      return (
        <ModalMessage icon="remove_circle_outline" message={this.state.error} />
      )
    } else if (this.state.isLoaded) {
      if (this.state.isDeleted) {
        return this.getDeletedBody()
      } else {
        return this.getForm()
      }
    } else {
      return <Loader />
    }
  }

  getClassName() {
    if (this.state.error || this.state.isDeleted) {
      return "modal-dialog modal-message modal-delete-account"
    } else {
      return "modal-dialog modal-delete-account"
    }
  }

  render() {
    return (
      <div className={this.getClassName()} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label={"Κλείσιμο"}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 className="modal-title">{"Διαγραφή λογαριασμού χρήστη"}</h4>
          </div>
          {this.getModalBody()}
        </div>
      </div>
    )
  }
}
