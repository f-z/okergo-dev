import React from "react"
import modal from "misago/services/modal"
import posting from "misago/services/posting"
import * as moderation from "./actions"
import MoveModal from "./move"
import PostChangelog from "misago/components/post-changelog"
import SplitModal from "./split"

export default function(props) {
  return (
    <ul className="dropdown-menu dropdown-menu-right stick-to-bottom">
      <Permalink {...props} />
      <Edit {...props} />
      <MarkAsBestAnswer {...props} />
      <UnmarkMarkBestAnswer {...props} />
      <PostEdits {...props} />
      <Approve {...props} />
      <Move {...props} />
      <Split {...props} />
      <Protect {...props} />
      <Unprotect {...props} />
      <Hide {...props} />
      <Unhide {...props} />
      <Delete {...props} />
    </ul>
  )
}

export class Permalink extends React.Component {
  onClick = () => {
    let permaUrl = window.location.protocol + "//"
    permaUrl += window.location.host
    permaUrl += this.props.post.url.index

    prompt("Μόνιμος σύνδεσμος για αυτή την προσφορά:", permaUrl)
  }

  render() {
    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick} type="button">
          <span className="material-icon">link</span>
          {"Μόνιμος σύνδεσμος"}
        </button>
      </li>
    )
  }
}

export class Edit extends React.Component {
  onClick = () => {
    posting.open({
      mode: "EDIT",

      config: this.props.post.api.editor,
      submit: this.props.post.api.index
    })
  }

  render() {
    if (!this.props.post.acl.can_edit) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick} type="button">
          <span className="material-icon">edit</span>
          {"Επεξεργασία"}
        </button>
      </li>
    )
  }
}

export class MarkAsBestAnswer extends React.Component {
  onClick = () => {
    moderation.markAsBestAnswer(this.props)
  }

  render() {
    const { post, thread } = this.props

    if (!thread.acl.can_mark_best_answer) return null
    if (!post.acl.can_mark_as_best_answer) return null
    if (post.id === thread.best_answer) return null
    if (thread.best_answer && !thread.acl.can_change_best_answer) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick} type="button">
          <span className="material-icon">check_box</span>
          {"Επιλογή προσφοράς"}
        </button>
      </li>
    )
  }
}

export class UnmarkMarkBestAnswer extends React.Component {
  onClick = () => {
    moderation.unmarkBestAnswer(this.props)
  }

  render() {
    const { post, thread } = this.props

    if (post.id !== thread.best_answer) return null
    if (!thread.acl.can_unmark_best_answer) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick} type="button">
          <span className="material-icon">check_box_outline_blank</span>
          {"Αποεπιλογή προσφοράς"}
        </button>
      </li>
    )
  }
}

export class PostEdits extends React.Component {
  onClick = () => {
    modal.show(<PostChangelog post={this.props.post} />)
  }

  render() {
    const isHidden =
      this.props.post.is_hidden && !this.props.post.acl.can_see_hidden
    const isUnedited = this.props.post.edits === 0
    if (isHidden || isUnedited) return null

    let message = "Αυτή η προσφορά έχει τροποποιηθεί %(edits)s φορές"
    if (this.props.post.edits === 1) {
      message = "Αυτή η προσφορά έχει τροποποιηθεί %(edits)s φορά"
    }

    const title = interpolate(
      message,
      {
        edits: this.props.post.edits
      },
      true
    )

    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick} type="button">
          <span className="material-icon">edit</span>
          {"Ιστορικό αλλαγών"}
        </button>
      </li>
    )
  }
}

export class Approve extends React.Component {
  onClick = () => {
    moderation.approve(this.props)
  }

  render() {
    if (!this.props.post.acl.can_approve) return null
    if (!this.props.post.is_unapproved) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick} type="button">
          <span className="material-icon">done</span>
          {"Έγκριση"}
        </button>
      </li>
    )
  }
}

export class Move extends React.Component {
  onClick = () => {
    modal.show(<MoveModal {...this.props} />)
  }

  render() {
    if (!this.props.post.acl.can_move) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick} type="button">
          <span className="material-icon">arrow_forward</span>
          {"Μετακίνηση"}
        </button>
      </li>
    )
  }
}

export class Split extends React.Component {
  onClick = () => {
    modal.show(<SplitModal {...this.props} />)
  }

  render() {
    if (!this.props.post.acl.can_move) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick} type="button">
          <span className="material-icon">call_split</span>
          {"Διαχωρισμός"}
        </button>
      </li>
    )
  }
}

export class Protect extends React.Component {
  onClick = () => {
    moderation.protect(this.props)
  }

  render() {
    if (!this.props.post.acl.can_protect) return null
    if (this.props.post.is_protected) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick} type="button">
          <span className="material-icon">lock_outline</span>
          {"Κλείδωμα"}
        </button>
      </li>
    )
  }
}

export class Unprotect extends React.Component {
  onClick = () => {
    moderation.unprotect(this.props)
  }

  render() {
    if (!this.props.post.acl.can_protect) return null
    if (!this.props.post.is_protected) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick} type="button">
          <span className="material-icon">lock_open</span>
          {"Ξεκλείδωμα"}
        </button>
      </li>
    )
  }
}

export class Hide extends React.Component {
  onClick = () => {
    moderation.hide(this.props)
  }

  render() {
    const { post, thread } = this.props

    if (post.id === thread.best_answer) return null
    if (!post.acl.can_hide) return null
    if (post.is_hidden) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick} type="button">
          <span className="material-icon">visibility_off</span>
          {"Κρύψιμο"}
        </button>
      </li>
    )
  }
}

export class Unhide extends React.Component {
  onClick = () => {
    moderation.unhide(this.props)
  }

  render() {
    if (!this.props.post.acl.can_unhide) return null
    if (!this.props.post.is_hidden) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick} type="button">
          <span className="material-icon">visibility</span>
          {"Εμφάνιση"}
        </button>
      </li>
    )
  }
}

export class Delete extends React.Component {
  onClick = () => {
    moderation.remove(this.props)
  }

  render() {
    const { post, thread } = this.props

    if (post.id === thread.best_answer) return null
    if (!post.acl.can_delete) return null

    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick} type="button">
          <span className="material-icon">clear</span>
          {"Διαγραφή"}
        </button>
      </li>
    )
  }
}
