import React from "react"
import MergeModal from "./merge"
import MoveModal from "./move"
import * as thread from "misago/reducers/thread"
import ajax from "misago/services/ajax"
import modal from "misago/services/modal"
import snackbar from "misago/services/snackbar"
import store from "misago/services/store"

export default class extends React.Component {
  callApi = (ops, successMessage) => {
    store.dispatch(thread.busy())

    // by the chance update thread acl too
    ops.push({ op: "add", path: "acl", value: true })

    ajax.patch(this.props.thread.api.index, ops).then(
      data => {
        store.dispatch(thread.update(data))
        store.dispatch(thread.release())
        snackbar.success(successMessage)
      },
      rejection => {
        store.dispatch(thread.release())
        if (rejection.status === 400) {
          snackbar.error(rejection.detail[0])
        } else {
          snackbar.apiError(rejection)
        }
      }
    )
  }

  pinGlobally = () => {
    this.callApi(
      [
        {
          op: "replace",
          path: "weight",
          value: 2
        }
      ],
      "Η αγγελία προωθείται σε όλη τη σελίδα"
    )
  }

  pinLocally = () => {
    this.callApi(
      [
        {
          op: "replace",
          path: "weight",
          value: 1
        }
      ],
      "Η αγγελία προωθείται σε αυτή την κατηγορία"
    )
  }

  unpin = () => {
    this.callApi(
      [
        {
          op: "replace",
          path: "weight",
          value: 0
        }
      ],
      "Η αγγελία δεν προωθείται πλέον"
    )
  }

  approve = () => {
    this.callApi(
      [
        {
          op: "replace",
          path: "is-unapproved",
          value: false
        }
      ],
      "Η αγγελία εγκρίθηκε για δημοσίευση"
    )
  }

  open = () => {
    this.callApi(
      [
        {
          op: "replace",
          path: "is-closed",
          value: false
        }
      ],
      "Η αγγελία άνοιξε για καινούριες προσφορές"
    )
  }

  close = () => {
    this.callApi(
      [
        {
          op: "replace",
          path: "is-closed",
          value: true
        }
      ],
      "Η αγγελία έκλεισε για καινούριες προσφορές"
    )
  }

  unhide = () => {
    this.callApi(
      [
        {
          op: "replace",
          path: "is-hidden",
          value: false
        }
      ],
      "Η αγγελία θα εμφανίζεται τώρα"
    )
  }

  hide = () => {
    this.callApi(
      [
        {
          op: "replace",
          path: "is-hidden",
          value: true
        }
      ],
      "Η αγγελία θα είναι κρυμμένη από εδώ και πέρα"
    )
  }

  move = () => {
    modal.show(
      <MoveModal posts={this.props.posts} thread={this.props.thread} />
    )
  }

  merge = () => {
    modal.show(<MergeModal thread={this.props.thread} />)
  }

  delete = () => {
    if (!confirm("Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτή την αγγελία;")) {
      return
    }

    store.dispatch(thread.busy())

    ajax.delete(this.props.thread.api.index).then(
      data => {
        snackbar.success("Η αγγελία διαγράφηκε επιτυχώς")
        window.location = this.props.thread.category.url.index
      },
      rejection => {
        store.dispatch(thread.release())
        snackbar.apiError(rejection)
      }
    )
  }

  getPinGloballyButton() {
    if (this.props.thread.weight === 2) return null
    if (!this.props.thread.acl.can_pin_globally) return null

    return (
      <li>
        <button
          className="btn btn-link"
          onClick={this.pinGlobally}
          type="button"
        >
          <span className="material-icon">bookmark</span>
          {"Προώθηση σε όλη τη σελίδα"}
        </button>
      </li>
    )
  }

  getPinLocallyButton() {
    if (this.props.thread.weight === 1) return null
    if (!this.props.thread.acl.can_pin) return null

    return (
      <li>
        <button
          className="btn btn-link"
          onClick={this.pinLocally}
          type="button"
        >
          <span className="material-icon">bookmark_border</span>
          {"Προώθηση σε αυτή την κατηγορία"}
        </button>
      </li>
    )
  }

  getUnpinButton() {
    if (this.props.thread.weight === 0) return null
    if (!this.props.thread.acl.can_pin) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.unpin} type="button">
          <span className="material-icon">panorama_fish_eye</span>
          {"Τέλος προώθησης"}
        </button>
      </li>
    )
  }

  getMoveButton() {
    if (!this.props.thread.acl.can_move) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.move} type="button">
          <span className="material-icon">arrow_forward</span>
          {"Μετακίνηση"}
        </button>
      </li>
    )
  }

  getMergeButton() {
    if (!this.props.thread.acl.can_merge) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.merge} type="button">
          <span className="material-icon">call_merge</span>
          {"Συγχώνευση"}
        </button>
      </li>
    )
  }

  getApproveButton() {
    if (!this.props.thread.is_unapproved) return null
    if (!this.props.thread.acl.can_approve) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.approve} type="button">
          <span className="material-icon">done</span>
          {"Έγκριση"}
        </button>
      </li>
    )
  }

  getOpenButton() {
    if (!this.props.thread.is_closed) return null
    if (!this.props.thread.acl.can_close) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.open} type="button">
          <span className="material-icon">lock_open</span>
          {"Άνοιγμα για προσφορές"}
        </button>
      </li>
    )
  }

  getCloseButton() {
    if (this.props.thread.is_closed) return null
    if (!this.props.thread.acl.can_close) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.close} type="button">
          <span className="material-icon">lock_outline</span>
          {"Κλείσιμο για προσφορές"}
        </button>
      </li>
    )
  }

  getUnhideButton() {
    if (!this.props.thread.is_hidden) return null
    if (!this.props.thread.acl.can_unhide) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.unhide} type="button">
          <span className="material-icon">visibility</span>
          {"Εμφάνιση"}
        </button>
      </li>
    )
  }

  getHideButton() {
    if (this.props.thread.is_hidden) return null
    if (!this.props.thread.acl.can_hide) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.hide} type="button">
          <span className="material-icon">visibility_off</span>
          {"Κρύψιμο"}
        </button>
      </li>
    )
  }

  getDeleteButton() {
    if (!this.props.thread.acl.can_delete) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.delete} type="button">
          <span className="material-icon">clear</span>
          {"Διαγραφή"}
        </button>
      </li>
    )
  }

  render() {
    return (
      <ul className="dropdown-menu dropdown-menu-right stick-to-bottom">
        {this.getPinGloballyButton()}
        {this.getPinLocallyButton()}
        {this.getUnpinButton()}
        {this.getMoveButton()}
        {this.getMergeButton()}
        {this.getApproveButton()}
        {this.getOpenButton()}
        {this.getCloseButton()}
        {this.getUnhideButton()}
        {this.getHideButton()}
        {this.getDeleteButton()}
      </ul>
    )
  }
}
