import React from "react"
import Action from "./action"

export default function(props) {
  return (
    <Action
      execAction={makeStrong}
      title={"Έντονη γραμματοσειρά"}
      {...props}
    >
      <span className="material-icon">format_bold</span>
    </Action>
  )
}

export function makeStrong(selection, replace) {
  if (selection.length) {
    replace("**" + selection + "**")
  }
}
