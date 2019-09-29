import React from "react"
import Action from "./action"

export default function(props) {
  return (
    <Action execAction={insertQuote} title={"Εισαγωγή quote"} {...props}>
      <span className="material-icon">format_quote</span>
    </Action>
  )
}

export function insertQuote(selection, replace) {
  let title = $.trim(
    prompt(`Βάλε το συγγραφέα του quote με @ πριν το όνομα χρήστη:{title}`)
  )

  if (title) {
    replace('\n\n[quote="' + title + '"]\n' + selection + "\n[/quote]\n\n")
  } else {
    replace("\n\n[quote]\n" + selection + "\n[/quote]\n\n")
  }
}
