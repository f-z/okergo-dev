import React from "react"
import Route from "./route"

export function Threads(props) {
  let emptyMessage = null
  if (props.user.id === props.profile.id) {
    emptyMessage = "Δεν έχεις δημοσιεύσει καμία αγγελία"
  } else {
    emptyMessage = interpolate(
      "Ο χρήστης %(username)s δεν έχει δημοσιεύσει καμία αγγελία",
      {
        username: props.profile.username
      },
      true
    )
  }

  let header = null
  if (!props.posts.isLoaded) {
    header = "Φορτώνει..."
  } else if (props.profile.id === props.user.id) {
    let message = "Έχεις δημοσιεύσει %(threads)s αγγελίες"
    if (props.profile.threads === 1) {
      message = "Έχεις δημοσιεύσει %(threads)s αγγελία"
    }

    header = interpolate(
      message,
      {
        threads: props.profile.threads
      },
      true
    )
  } else {
    let message = "Ο χρήστης %(username)s έχει δημοσιεύσει %(threads)s αγγελίες"
    if (props.profile.threads === 1) {
      message = "Ο χρήστης %(username)s έχει δημοσιεύσει %(threads)s αγγελία"
    }

    header = interpolate(
      message,
      {
        username: props.profile.username,
        threads: props.profile.threads
      },
      true
    )
  }

  return (
    <Route
      api={props.profile.api.threads}
      emptyMessage={emptyMessage}
      header={header}
      title={"Αγγελίες"}
      {...props}
    />
  )
}

export function Posts(props) {
  let emptyMessage = null
  if (props.user.id === props.profile.id) {
    emptyMessage = "Δεν έχεις κάνει καμία προσφορά"
  } else {
    emptyMessage = interpolate(
      "Ο χρήστης %(username)s δεν έχει κάνει καμία προσφορά",
      {
        username: props.profile.username
      },
      true
    )
  }

  let header = null
  if (!props.posts.isLoaded) {
    header = "Φορτώνει..."
  } else if (props.profile.id === props.user.id) {
    let message = "Έχεις κάνει %(posts)s προσφορές"
    if (props.profile.posts === 1) {
      message = "Έχεις κάνει %(posts)s προσφορά"
    }

    header = interpolate(
      message,
      {
        posts: props.profile.posts
      },
      true
    )
  } else {
    let message = "Ο χρήστης %(username)s έχει κάνει %(posts)s προσφορές"
    if (props.profile.posts === 1) {
      message = "Ο χρήστης %(username)s έχει κάνει %(posts)s προσφορά"
    }

    header = interpolate(
      message,
      {
        username: props.profile.username,
        posts: props.profile.posts
      },
      true
    )
  }

  return (
    <Route
      api={props.profile.api.posts}
      emptyMessage={emptyMessage}
      header={header}
      title={"Προσφορές"}
      {...props}
    />
  )
}
