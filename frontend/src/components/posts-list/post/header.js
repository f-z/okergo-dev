import React from "react"
import Controls from "./controls"
import Select from "./select"
import PostChangelog from "misago/components/post-changelog"
import modal from "misago/services/modal"

export default function(props) {
  return (
    <div className="post-heading">
      <UnreadLabel {...props} />
      <UnreadCompact {...props} />
      <PostedOn {...props} />
      <PostedOnCompact {...props} />
      <PostEdits {...props} />
      <PostEditsCompacts {...props} />
      <ProtectedLabel {...props} />
      <Select {...props} />
      <Controls {...props} />
    </div>
  )
}

export function UnreadLabel(props) {
  if (props.post.is_read) return null

  return (
    <span className="label label-unread hidden-xs">{"Νέα προσφορά"}</span>
  )
}

export function UnreadCompact(props) {
  if (props.post.is_read) return null

  return (
    <span className="label label-unread visible-xs-inline-block">
      {"Νέα"}
    </span>
  )
}

export function PostedOn(props) {
  const tooltip = interpolate(
    "Δημοσιεύθηκε %(posted_on)s",
    {
      posted_on: props.post.posted_on.format("LL, LT")
    },
    true
  )

  return (
    <a
      href={props.post.url.index}
      className="btn btn-link posted-on hidden-xs"
      title={tooltip}
    >
      {props.post.posted_on.fromNow()}
    </a>
  )
}

export function PostedOnCompact(props) {
  return (
    <a
      href={props.post.url.index}
      className="btn btn-link posted-on visible-xs-inline-block"
    >
      {props.post.posted_on.fromNow(true)}
    </a>
  )
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

    let tooltip = "Αυτή η προσφορά τροποποιήθηκε %(edits)s φορές"
    if (this.props.post.edits === 1) {
      tooltip = "Αυτή η προσφορά τροποποιήθηκε %(edits)s φορά"
    }

    const title = interpolate(
      tooltip,
      {
        edits: this.props.post.edits
      },
      true
    )

    let label = "τροποποιήθηκε %(edits)s φορές"
    if (this.props.post.edits === 1) {
      label = "τροποποιήθηκε %(edits)s φορά"
    }

    return (
      <button
        className="btn btn-link btn-see-edits hidden-xs"
        onClick={this.onClick}
        title={title}
        type="button"
      >
        {interpolate(
          label,
          {
            edits: this.props.post.edits
          },
          true
        )}
      </button>
    )
  }
}

export class PostEditsCompacts extends PostEdits {
  render() {
    const isHidden =
      this.props.post.is_hidden && !this.props.post.acl.can_see_hidden
    const isUnedited = this.props.post.edits === 0
    if (isHidden || isUnedited) return null

    let label = "%(edits)s τροποποιήσεις"
    if (this.props.post.edits === 1) {
      label = "%(edits)s τροποποίηση"
    }

    return (
      <button
        className="btn btn-link btn-see-edits visible-xs-inline-block"
        onClick={this.onClick}
        type="button"
      >
        {interpolate(
          label,
          {
            edits: this.props.post.edits
          },
          true
        )}
      </button>
    )
  }
}

export function ProtectedLabel(props) {
  const postAuthor = props.post.poster && props.post.poster.id === props.user.id
  const hasAcl = props.post.acl.can_protect
  const isVisible =
    props.user.id && props.post.is_protected && (postAuthor || hasAcl)

  if (!isVisible) {
    return null
  }

  return (
    <span
      className="label label-protected hidden-xs"
      title={"Αυτή η προσφορά είναι προστατευμένη και δεν μπορεί να τροποποιηθεί"}
    >
      <span className="material-icon">lock_outline</span>
      {"προστατευμένη"}
    </span>
  )
}
