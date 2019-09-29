import React from "react"
import Action from "./action"

export default function(props) {
  return (
    <Action execAction={insertCode} title={"Εισαγωγή κώδικα"} {...props}>
      <span className="material-icon">functions</span>
    </Action>
  )
}

export function insertCode(selection, replace) {
  const syntax = $.trim(
    prompt("Εισαγωγή ονόματος συντακτικής του κώδικα (προαιρετικά):")
  )
  replace("\n\n```" + syntax + "\n" + selection + "\n```\n\n")
}
