import React from "react"

export default class extends React.Component {
  render() {
    if (this.props.list.type === "all") {
      if (this.props.emptyMessage) {
        return (
          <li className="list-group-item empty-message">
            <p className="lead">{this.props.emptyMessage}</p>
            <p>{"Πόσταρε μια αγγελία ή κάνε προσφορά!"}</p>
          </li>
        )
      } else {
        return (
          <li className="list-group-item empty-message">
            <p className="lead">
              {this.props.category.special_role
                ? "Δεν υπάρχουν αγγελίες ακόμα..."
                : "Δεν υπάρχουν αγγελίες για αυτή την κατηγορία εργασιών ακόμα..."}
            </p>
            <p>{"Μπορείς να δημοσιεύσεις μία εύκολα και γρήγορα!"}</p>
          </li>
        )
      }
    } else {
      return (
        <li className="list-group-item empty-message">
          {"Δεν υπάρχουν αγγελίες για τη συγκεκριμένη επιλογή..."}
        </li>
      )
    }
  }
}
