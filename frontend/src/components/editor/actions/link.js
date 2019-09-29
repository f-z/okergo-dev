import React from "react"
import Action from "./action"
import isUrl from "misago/utils/is-url"

export default function(props) {
  return (
    <Action execAction={insertLink} title={"Εισαγωγή συνδέσμου"} {...props}>
      <span className="material-icon">insert_link</span>
    </Action>
  )
}

export function insertLink(selection, replace) {
  let url = ""
  let label = ""

  if (selection.length) {
    if (isUrl(selection)) {
      url = selection
    } else {
      label = selection
    }
  }

  url = $.trim(prompt(`Εισαγωγή διεύθυνσης συνδέσμου:{url}`) || "")
  if (url.length === 0) return false
  label = $.trim(prompt(`Εισαγωγή ονόματος συνδέσμου (προαιρετικά):{label}`))

  if (url.length) {
    if (label.length > 0) {
      replace("[" + label + "](" + url + ")")
    } else {
      replace(url)
    }
  }
}
