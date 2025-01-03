import React from "react"
import ReactDOM from "react-dom"
import { PollForm } from "misago/components/poll"
import PostingComponent from "misago/components/posting"
import mount from "misago/utils/mount-component"

export class Posting {
  init(ajax, snackbar, placeholder) {
    this._ajax = ajax
    this._snackbar = snackbar
    this._placeholder = $(placeholder)

    this._mode = null
    this._submode = null

    this._isOpen = false
    this._isClosing = false
  }

  open(props) {
    if (this._isOpen === false) {
      this._mode = props.mode
      if(props.submode) {
        this._submode = props.submode
      }
      this._isOpen = props.submit
      this._realOpen(props)
    } else if (this._isOpen !== props.submit) {
      let message = "Δουλεύεις ήδη πάνω σε ένα μήνυμα! Θες να το ακυρώσεις;"
      if (this._mode == "POLL") {
        message = "Δουλεύεις ήδη πάνω σε μία ψηφοφορία! Θες να την ακυρώσεις;"
      }

      const changeForm = confirm(message)
      if (changeForm) {
        this._mode = props.mode
        this._isOpen = props.submit
        this._realOpen(props)
      }
    } else if (this._mode == "REPLY" && props.mode == "REPLY") {
      this._realOpen(props)
    }
  }

  _realOpen(props) {
    if (props.mode == "POLL") {
      mount(<PollForm {...props} />, "posting-mount")
    } else {
      mount(<PostingComponent {...props} />, "posting-mount")
    }

    this._placeholder.addClass("slide-in")

    $("html, body").animate(
      {
        scrollTop: this._placeholder.offset().top
      },
      1000
    )
  }

  close = () => {
    if (this._isOpen && !this._isClosing) {
      this._isClosing = true
      this._placeholder.removeClass("slide-in")

      window.setTimeout(() => {
        ReactDOM.unmountComponentAtNode(
          document.getElementById("posting-mount")
        )
        this._isClosing = false
        this._isOpen = false
      }, 300)
    }
  }
}

export default new Posting()
