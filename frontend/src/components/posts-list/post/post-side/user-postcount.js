import React from "react"
import hasVisibleTitle from "./has-visible-title"

export default function({ poster }) {
  let message = "%(posts)s προσφορές"
  if (poster.posts === 1) {
    message = "%(posts)s προσφορά"
  }

  let className = "user-postcount"
  if (hasVisibleTitle(poster)) {
    className += " hidden-xs hidden-sm"
  }

  return (
    <span className={className}>
      {interpolate(
        message,
        {
          posts: poster.posts
        },
        true
      )}
    </span>
  )
}
