import React from "react"
import Action from "./action"
import isUrl from "misago/utils/is-url"

export default function(props) {
  return (
    <Action execAction={insertImage} title={"Εισαγωγή εικόνας"} {...props}>
      <span className="material-icon">insert_photo</span>
    </Action>
  )
}

export function insertImage(selection, replace) {
  let url = ""
  let label = ""

  if (selection.length) {
    if (isUrl(selection)) {
      url = selection
    } else {
      label = selection
    }
  }

  url = $.trim(prompt(`Εισαγωγή συνδέσμου εικόνας:{url}`))
  label = $.trim(prompt(`Εισαγωγή ονόματος εικόνας (προαιρετικά):{label}`))

  if (url.length) {
    if (label.length > 0) {
      replace("![" + label + "](" + url + ")")
    } else {
      replace("!(" + url + ")")
    }
  }
}
