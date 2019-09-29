import React from "react"

export default function({ isAuthenticated, profile }) {
  let message = null
  if (isAuthenticated) {
    message = "Δε μοιράζεσαι τα στοιχεία σου με άλλους χρήστες"
  } else {
    message = interpolate(
      "Ο χρήστης %(username)s δε μοιράζεται τα στοιχεία του με άλλους χρήστες",
      {
        username: profile.username
      },
      true
    )
  }

  return (
    <div className="panel panel-default">
      <div className="panel-body text-center lead">{message}</div>
    </div>
  )
}
