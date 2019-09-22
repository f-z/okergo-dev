import React from "react"
import { Link } from "react-router"

export default function(props) {
  return (
    <nav className="misago-pagination pull-left">
      <Pager {...props} />
      <More more={props.posts.more} />
    </nav>
  )
}

export function Pager(props) {
  return (
    <div className="row row-paginator">
      <div className="col-xs-3">
        <FirstPage {...props} />
      </div>
      <div className="col-xs-3">
        <PreviousPage {...props} />
      </div>
      <div className="col-xs-3">
        <NextPage {...props} />
      </div>
      <div className="col-xs-3">
        <LastPage {...props} />
      </div>
    </div>
  )
}

export function FirstPage(props) {
  if (props.posts.isLoaded && props.posts.first) {
    return (
      <Link
        className="btn btn-default btn-block btn-outline btn-icon"
        to={props.thread.url.index}
        title={"Πρώτη σελίδα"}
      >
        <span className="material-icon">first_page</span>
      </Link>
    )
  } else {
    return (
      <span
        className="btn btn-default btn-block btn-outline btn-icon disabled"
        title={"Πρώτη σελίδα"}
      >
        <span className="material-icon">first_page</span>
      </span>
    )
  }
}

export function PreviousPage(props) {
  if (props.posts.isLoaded && props.posts.page > 1) {
    let previousUrl = ""
    if (props.posts.previous) {
      previousUrl = props.posts.previous + "/"
    }

    return (
      <Link
        className="btn btn-default btn-block btn-outline btn-icon"
        to={props.thread.url.index + previousUrl}
        title={"Προηγούμενη σελίδα"}
      >
        <span className="material-icon">chevron_left</span>
      </Link>
    )
  } else {
    return (
      <span
        className="btn btn-default btn-block btn-outline btn-icon disabled"
        title={"Προηγούμενη σελίδα"}
      >
        <span className="material-icon">chevron_left</span>
      </span>
    )
  }
}

export function NextPage(props) {
  if (props.posts.isLoaded && props.posts.more) {
    let nextUrl = ""
    if (props.posts.next) {
      nextUrl = props.posts.next + "/"
    }

    return (
      <Link
        className="btn btn-default btn-block btn-outline btn-icon"
        to={props.thread.url.index + nextUrl}
        title={"Επόμενη σελίδα"}
      >
        <span className="material-icon">chevron_right</span>
      </Link>
    )
  } else {
    return (
      <span
        className="btn btn-default btn-block btn-outline btn-icon disabled"
        title={"Επόμενη σελίδα"}
      >
        <span className="material-icon">chevron_right</span>
      </span>
    )
  }
}

export function LastPage(props) {
  if (props.posts.isLoaded && props.posts.last) {
    return (
      <Link
        className="btn btn-default btn-block btn-outline btn-icon"
        to={props.thread.url.index + props.posts.last + "/"}
        title={"Τελευταία σελίδα"}
      >
        <span className="material-icon">last_page</span>
      </Link>
    )
  } else {
    return (
      <span
        className="btn btn-default btn-block btn-outline btn-icon disabled"
        title={"Τελευταία σελίδα"}
      >
        <span className="material-icon">last_page</span>
      </span>
    )
  }
}

export function More(props) {
  let message = null
  if (props.more) {
    message = "Υπάρχουν άλλες %(more)s προσφορές για αυτή την αγγελία."
    message = interpolate(message, { more: props.more }, true)
  } else {
    message = "Δεν υπάρχουν άλλες προσφορές για αυτή την αγγελία."
  }

  return <p>{message}</p>
}
