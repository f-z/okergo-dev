import React from "react"
import misago from "misago/index"

const UnusablePasswordMessage = () => {
  return (
    <div className="panel panel-default panel-form">
      <div className="panel-heading">
        <h3 className="panel-title">{"Αλλαγή email ή κωδικού πρόσβασης"}</h3>
      </div>
      <div className="panel-body panel-message-body">
        <div className="message-icon">
          <span className="material-icon">info_outline</span>
        </div>
        <div className="message-body">
          <p className="lead">
            {"Πρέπει να ορίσεις έναν κωδικό πρόσβασής για το λογαριασμό σου για να μπορείς να αλλάξεις το όνομα χρήστη και το email σου"}
          </p>
          <p className="help-block">
            <a
              className="btn btn-primary"
              href={misago.get("FORGOTTEN_PASSWORD_URL")}
            >
              {"Ορισμός κωδικού πρόσβασης"}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UnusablePasswordMessage
