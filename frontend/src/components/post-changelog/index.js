import React from "react"
import Diff from "./diff"
import Footer from "./footer"
import Toolbar from "./toolbar"
import { hydrateEdit } from "./utils"
import Message from "misago/components/modal-message"
import Loader from "misago/components/modal-loader"
import * as post from "misago/reducers/post"
import ajax from "misago/services/ajax"
import modal from "misago/services/modal"
import snackbar from "misago/services/snackbar"
import store from "misago/services/store"

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isReady: false,
      isBusy: true,

      canRevert: props.post.acl.can_edit,

      error: null,
      edit: null
    }
  }

  componentDidMount() {
    this.goToEdit()
  }

  goToEdit = (edit = null) => {
    this.setState({
      isBusy: true
    })

    let url = this.props.post.api.edits
    if (edit !== null) {
      url += "?edit=" + edit
    }

    ajax.get(url).then(
      data => {
        this.setState({
          isReady: true,
          isBusy: false,
          edit: hydrateEdit(data)
        })
      },
      rejection => {
        this.setState({
          isReady: true,
          isBusy: false,
          error: rejection.detail
        })
      }
    )
  }

  revertEdit = edit => {
    if (this.state.isBusy) return

    const confirmation = confirm(
      "Είσαι σίγουρος ότι θες να επαναφέρεις την προσφορά στην προηγούμενη κατάσταση;"
    )
    if (!confirmation) return

    this.setState({
      isBusy: true
    })

    const url = this.props.post.api.edits + "?edit=" + edit
    ajax.post(url).then(
      data => {
        const hydratedPost = post.hydrate(data)
        store.dispatch(post.patch(data, hydratedPost))

        snackbar.success("Η προσφορά επαναφέρθηκε στην προηγούμενη κατάσταση επιτυχώς!")
        modal.hide()
      },
      rejection => {
        snackbar.apiError(rejection)

        this.setState({
          isBusy: false
        })
      }
    )
  }

  render() {
    if (this.state.error) {
      return (
        <ModalDialog className="modal-dialog modal-message">
          <Message message={this.state.error} />
        </ModalDialog>
      )
    } else if (this.state.isReady) {
      return (
        <ModalDialog>
          <Toolbar
            canRevert={this.state.canRevert}
            disabled={this.state.isBusy}
            edit={this.state.edit}
            goToEdit={this.goToEdit}
            revertEdit={this.revertEdit}
          />
          <Diff diff={this.state.edit.diff} />
          <Footer
            canRevert={this.state.canRevert}
            disabled={this.state.isBusy}
            edit={this.state.edit}
            revertEdit={this.revertEdit}
          />
        </ModalDialog>
      )
    }

    return (
      <ModalDialog>
        <Loader />
      </ModalDialog>
    )
  }
}

export function ModalDialog(props) {
  return (
    <div className={props.className || "modal-dialog"} role="document">
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
          <h4 className="modal-title">{"Ιστορικό τροποποιήσεων προσφοράς"}</h4>
        </div>
        {props.children}
      </div>
    </div>
  )
}
