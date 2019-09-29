import React from "react"

export function FlagBestAnswer({ post, thread, user }) {
  if (!(isVisible(post) && post.id === thread.best_answer)) {
    return null
  }

  let message = null
  if (user.id && thread.best_answer_marked_by === user.id) {
    message = interpolate(
      "Επέλεξες ως καλύτερη προσφορά %(marked_on)s",
      {
        marked_on: thread.best_answer_marked_on.fromNow()
      },
      true
    )
  } else {
    message = interpolate(
      "Επιλέχθηκε ως καλύτερη προσφορά από %(marked_by)s %(marked_on)s",
      {
        marked_by: thread.best_answer_marked_by_name,
        marked_on: thread.best_answer_marked_on.fromNow()
      },
      true
    )
  }

  return (
    <div className="post-status-message post-status-best-answer">
      <span className="material-icon">check_box</span>
      <p>{message}</p>
    </div>
  )
}

export function FlagHidden(props) {
  if (!(isVisible(props.post) && props.post.is_hidden)) {
    return null
  }

  return (
    <div className="post-status-message post-status-hidden">
      <span className="material-icon">visibility_off</span>
      <p>
        {
          "Αυτή η προσφορά είναι κρυμμένη. Μόνο εξουσιοδοτημένοι χρήστες μπορούν να δουν τις λεπτομέρειές της."
        }
      </p>
    </div>
  )
}

export function FlagUnapproved(props) {
  if (!(isVisible(props.post) && props.post.is_unapproved)) {
    return null
  }

  return (
    <div className="post-status-message post-status-unapproved">
      <span className="material-icon">remove_circle_outline</span>
      <p>
        {
          "Αυτή η προσφορά δεν έχει εγκριθεί. Μόνο ο χρήστης που την έκανε και χρήστες με εξουσιοδότηση να εγκρίνουν προσφορές μπορούν να δουν τις λεπτομέρειές της."
        }
      </p>
    </div>
  )
}

export function FlagProtected(props) {
  if (!(isVisible(props.post) && props.post.is_protected)) {
    return null
  }

  return (
    <div className="post-status-message post-status-protected visible-xs-block">
      <span className="material-icon">lock_outline</span>
      <p>{"Αυτή η προσφορά είναι κλειδωμένη. Μόνο διαχειριστές μπορούν να την τροποποιήσουν."}</p>
    </div>
  )
}

export function isVisible(post) {
  return !post.is_hidden || post.acl.can_see_hidden
}
