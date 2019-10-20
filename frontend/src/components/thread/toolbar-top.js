import React from "react"
import ReplyButton from "./reply-button"
import Subscription from "./subscription"
import posting from "misago/services/posting"

export default function(props) {
  const hiddenSpecialOption =
    !props.thread.acl.can_start_poll || props.thread.poll

  return (
    <div className="row row-toolbar row-toolbar-bottom-margin">
      <GotoMenu {...props} />
      <div className="col-xs-9 col-md-5 col-md-offset-2">
        <div className="row">
          <Spacer visible={!props.user.id} />
          <Spacer visible={hiddenSpecialOption} />
          <SubscriptionMenu {...props} />
          <StartPoll {...props} />
          <Reply {...props} />
        </div>
      </div>
    </div>
  )
}

export function GotoMenu(props) {
  const { user } = props

  let className = "col-xs-3 col-sm-3 col-md-5"
  if (user.is_anonymous) {
    className = "col-xs-12 col-sm-3 col-md-5"
  }

  return (
    <div className={className}>
      <div className="row hidden-xs hidden-sm">
        <GotoLast thread={props.thread} />
        <GotoNew thread={props.thread} />
        <GotoBestAnswer thread={props.thread} />
        <GotoUnapproved thread={props.thread} />
      </div>
      <CompactOptions {...props} />
    </div>
  )
}

export function GotoNew(props) {
  if (!props.thread.is_new) return null

  return (
    <div className="col-sm-4">
      <a
        href={props.thread.url.new_post}
        className="btn btn-default btn-block btn-outline"
        title={"Πρώτη νέα προσφορά"}
      >
        {"Νέα"}
      </a>
    </div>
  )
}

export function GotoBestAnswer(props) {
  if (!props.thread.best_answer) {
    return null
  }

  return (
    <div className="col-sm-4">
      <a
        href={props.thread.url.best_answer}
        className="btn btn-default btn-block btn-outline"
        title={"Επιλεγμένη προσφορά"}
      >
        {"Επιτυχής προσφορά"}
      </a>
    </div>
  )
}

export function GotoUnapproved(props) {
  if (!props.thread.has_unapproved_posts || !props.thread.acl.can_approve) {
    return null
  }

  return (
    <div className="col-sm-4">
      <a
        href={props.thread.url.unapproved_post}
        className="btn btn-default btn-block btn-outline"
        title={"Πρώτη μη εγκεκριμένη προσφορά"}
      >
        {"Μη εγκεκριμένη"}
      </a>
    </div>
  )
}

export function GotoLast(props) {
  return (
    <div className="col-sm-4">
      <a
        href={props.thread.url.last_post}
        className="btn btn-default btn-block btn-outline"
        title={"Τελευταία προσφορά"}
      >
        {"Τελευταία"}
      </a>
    </div>
  )
}

export function CompactOptions(props) {
  const { user } = props
  if (user.is_anonymous) {
    return (
      <div className="visible-xs-block visible-sm-block">
        <a
          href={props.thread.url.last_post}
          className="btn btn-default btn-block btn-outline"
        >
          {"Τελευταία προσφορά"}
        </a>
      </div>
    )
  }

  return (
    <div className="dropdown visible-xs-block visible-sm-block">
      <button
        aria-expanded="true"
        aria-haspopup="true"
        className="btn btn-default dropdown-toggle btn-block btn-outline"
        data-toggle="dropdown"
        type="button"
      >
        <span className="material-icon">expand_more</span>
        <span className="btn-text hidden-xs">{"Επιλογές"}</span>
      </button>
      <ul className="dropdown-menu">
        <StartPollCompact {...props} />
        <GotoNewCompact {...props} />
        <GotoUnapprovedCompact {...props} />
        <GotoLastCompact {...props} />
      </ul>
    </div>
  )
}

export function GotoNewCompact(props) {
  if (!props.thread.is_new) return null

  return (
    <li>
      <a href={props.thread.url.new_post} className="btn btn-link">
        {"Πρώτη νέα προσφορά"}
      </a>
    </li>
  )
}

export function GotoUnapprovedCompact(props) {
  if (!props.thread.has_unapproved_posts || !props.thread.acl.can_approve) {
    return null
  }

  return (
    <li>
      <a href={props.thread.url.unapproved_post} className="btn btn-link">
        {"Πρώτη μη εγκεκριμένη προσφορά"}
      </a>
    </li>
  )
}

export function GotoLastCompact(props) {
  return (
    <li>
      <a href={props.thread.url.last_post} className="btn btn-link">
        {"Τελευταία προσφορά"}
      </a>
    </li>
  )
}

export function Reply(props) {
  const canReply = props.thread.acl.can_reply
  const isPoster = props.thread.starter_name == props.user.username

  if (!canReply || isPoster) return null

  return (
    <div className="col-sm-4 hidden-xs">
      <ReplyButton
        className="btn btn-primary btn-block btn-outline"
        onClick={props.openReplyForm}
        thread={props.thread}
      />
    </div>
  )
}

export function SubscriptionMenu(props) {
  if (!props.user.id) return null

  return (
    <div className="col-xs-12 col-sm-4">
      <Subscription
        className="dropdown"
        dropdownClassName="dropdown-menu dropdown-menu-right stick-to-bottom"
        {...props}
      />
    </div>
  )
}

export class StartPoll extends React.Component {
  onClick = () => {
    posting.open({
      mode: "POLL",
      submit: this.props.thread.api.poll,

      thread: this.props.thread,
      poll: null
    })
  }

  render() {
    if (!this.props.thread.acl.can_start_poll || this.props.thread.poll) {
      return null
    }

    return (
      <div className="col-sm-4 hidden-xs">
        <button
          className="btn btn-default btn-block btn-outline"
          onClick={this.onClick}
          type="button"
        >
          <span className="material-icon">poll</span>
          {"Ψηφοφορία"}
        </button>
      </div>
    )
  }
}

export class StartPollCompact extends StartPoll {
  render() {
    if (!this.props.thread.acl.can_start_poll || this.props.thread.poll) {
      return null
    }

    return (
      <li>
        <button className="btn btn-link" onClick={this.onClick} type="button">
          {"Ψηφοφορία"}
        </button>
      </li>
    )
  }
}

export function Spacer(props) {
  if (!props.visible) return null

  return <div className="col-sm-4 hidden-xs" />
}
