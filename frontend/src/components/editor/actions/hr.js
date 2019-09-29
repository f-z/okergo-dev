import React from "react"
import Action from "./action"

export default function(props) {
  return (
    <Action
      execAction={insertHr}
      title={"Εισαγωγή οριζόντιου χάρακα"}
      {...props}
    >
      <span className="material-icon">remove</span>
    </Action>
  )
}

export function insertHr(selection, replace) {
  replace("\n\n- - - - -\n\n")
}
