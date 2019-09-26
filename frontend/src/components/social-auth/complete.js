import React from "react"
import Header from "./header"
import misago from "misago"

const Complete = ({ activation, backend_name, username }) => {
  let icon = ""
  let message = ""
  if (activation === "user") {
    message = "%(username)s, ο λογαριασμός σου έχει δημιουργηθεί, αλλά πρέπει να τον ενεργοποιήσεις"
  } else if (activation === "admin") {
    message = "%(username)s, ο λογαριασμός σου έχει δημιουργηθεί, αλλά ο διαχειριστής πρέπει να κάνει επιβεβαίωση των στοιχείων και να τον ενεργοποιήσει"
  } else {
    message = "%(username)s, ο λογαριασμός σου έχει ενεργοποιηθεί και έχεις συνδεθεί"
  }

  if (activation === "active") {
    icon = "check"
  } else {
    icon = "info_outline"
  }

  return (
    <div className="page page-social-auth page-social-sauth-register">
      <Header backendName={backend_name} />
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <div className="panel panel-default panel-form">
              <div className="panel-heading">
                <h3 className="panel-title">
                  {"Επιτυχής εγγραφή!"}
                </h3>
              </div>
              <div className="panel-body panel-message-body">
                <div className="message-icon">
                  <span className="material-icon">{icon}</span>
                </div>
                <div className="message-body">
                  <p className="lead">
                    {interpolate(message, { username }, true)}
                  </p>
                  <p className="help-block">
                    <a
                      className="btn btn-default"
                      href={misago.get("MISAGO_PATH")}
                    >
                      {"Επιστροφή στην αρχική σελίδα"}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Complete
