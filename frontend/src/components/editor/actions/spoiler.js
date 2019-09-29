import React from "react"
import Action from "./action"

export default function(props) {
  return (
    <Action execAction={insertSpoiler} title={"Εισαγωγή spoiler"} {...props}>
      <span className="material-icon">not_interested</span>
    </Action>
  )
}

export function insertSpoiler(selection, replace) {
  replace("\n\n[spoiler]\n" + selection + "\n[/spoiler]\n\n")
}
