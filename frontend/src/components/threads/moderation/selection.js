import React from "react"
import * as select from "misago/reducers/selection"
import store from "misago/services/store"

export default class extends React.Component {
  selectAll = () => {
    store.dispatch(
      select.all(
        this.props.threads.map(function(thread) {
          return thread.id
        })
      )
    )
  }

  selectNone = () => {
    store.dispatch(select.none())
  }

  render() {
    return (
      <ul className={this.props.className}>
        <li>
          <button
            className="btn btn-link"
            type="button"
            onClick={this.selectAll}
          >
            <span className="material-icon">check_box</span>
            {"Επιλογή όλων"}
          </button>
        </li>
        <li>
          <button
            className="btn btn-link"
            type="button"
            onClick={this.selectNone}
          >
            <span className="material-icon">check_box_outline_blank</span>
            {"Αποεπιλογή όλων"}
          </button>
        </li>
      </ul>
    )
  }
}
