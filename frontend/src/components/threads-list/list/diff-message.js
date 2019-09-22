import React from "react"

export default function(props) {
  const { applyDiff, diffSize } = props
  if (diffSize === 0) return null

  return (
    <li className="list-group-item threads-diff-message">
      <button
        type="button"
        className="btn btn-block btn-default"
        onClick={applyDiff}
      >
        <span className="material-icon">cached</span>
        <span className="diff-message">{getMessage(diffSize)}</span>
      </button>
    </li>
  )
}

export function getMessage(diffSize) {
  const message = "Υπάρχουν %(threads)s καινούριες αγγελίες. Κάνε κλικ σε αυτό το μήνυμα για να τις δεις."

  return interpolate(
    message,
    {
      threads: diffSize
    },
    true
  )
}
