import React from "react"

export default function(props) {
  return (
    <ul className="list-unstyled list-inline poll-help">
      <PollChoicesLeft choicesLeft={props.choicesLeft} />
      <PollAllowRevote poll={props.poll} />
    </ul>
  )
}

export function PollChoicesLeft({ choicesLeft }) {
  if (choicesLeft === 0) {
    return (
      <li className="poll-help-choices-left">
        {"Δεν μπορείς να διαλέξεις παραπάνω επιλογές"}
      </li>
    )
  }

  let message = "Μπορείς να διαλέξεις %(choices)s ακόμα επιλογές"
  if (choicesLeft === 1) {
    message = "Μπορείς να διαλέξεις %(choices)s ακόμα επιλογή"
  }

  const label = interpolate(
    message,
    {
      choices: choicesLeft
    },
    true
  )

  return <li className="poll-help-choices-left">{label}</li>
}

export function PollAllowRevote(props) {
  if (props.poll.allow_revotes) {
    return (
      <li className="poll-help-allow-revotes">
        {"Μπορείς να αλλάξεις την ψήφο σου αργότερα"}
      </li>
    )
  }

  return <li className="poll-help-no-revotes">{"Οι ψήφοι είναι τελικές"}</li>
}
