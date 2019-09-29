import React from "react"

export default function(props) {
  return (
    <div className="categories-list">
      <ul className="list-group">
        <li className="list-group-item empty-message">
          <p className="lead">
            {"Δεν υπάρχουν διαθέσιμες κατηγορίες εργασιών..."}
          </p>
        </li>
      </ul>
    </div>
  )
}
