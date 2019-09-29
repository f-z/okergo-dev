import React from "react"
import Action from "./action"

export default function(props) {
  return (
    <Action
      execAction={makeEmphasis}
      title={"Προσθήκη έμφασης"}
      {...props}
    >
      <span className="material-icon">format_italic</span>
    </Action>
  )
}

export function makeEmphasis(selection, replace) {
  if (selection.length) {
    replace("*" + selection + "*")
  }
}
