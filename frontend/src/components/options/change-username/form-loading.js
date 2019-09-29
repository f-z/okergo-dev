import React from "react"
import PanelLoader from "misago/components/panel-loader"

export default function() {
  return (
    <div className="panel panel-default panel-form">
      <div className="panel-heading">
        <h3 className="panel-title">{"Αλλαγή ονόματος χρήστη"}</h3>
      </div>
      <PanelLoader />
    </div>
  )
}
