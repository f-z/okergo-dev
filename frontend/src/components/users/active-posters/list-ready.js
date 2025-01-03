import React from "react"
import ListItem from "misago/components/users/active-posters/list-item"

export default class extends React.Component {
  getLeadMessage() {
    let message = "%(posters)s τοπ χρήστες τις τελευταίες %(days)s μέρες"

    if (this.props.count == 1) {
      message = "%(posters)s τοπ χρήστης τις τελευταίες %(days)s μέρες"
    }

    return interpolate(
      message,
      {
        posters: this.props.count,
        days: this.props.trackedPeriod
      },
      true
    )
  }

  render() {
    return (
      <div className="active-posters-list">
        <div className="container">
          <p className="lead">{this.getLeadMessage()}</p>

          <div className="active-posters ui-ready">
            <ul className="list-group">
              {this.props.users.map((user, i) => {
                return (
                  <ListItem
                    user={user}
                    rank={user.rank}
                    counter={i + 1}
                    key={user.id}
                  />
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
