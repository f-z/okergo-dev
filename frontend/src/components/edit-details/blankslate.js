import React from "react"
import PanelMessage from "misago/components/panel-message"

export default function({ display }) {
  if (!display) return null

  return (
    <PanelMessage
      helpText={"Δεν μπορείς να αλλάξεις τα στοιχεία του προφίλ σου αυτή τη στιγμή"}
      message={"Αυτή η επιλογή δεν είναι τωρινά διαθέσιμη"}
    />
  )
}
