import React from "react"

export default class extends React.Component {
  getEmptyMessage() {
    return interpolate(
        "Κανένας χρήστης δεν έχει δημοσιποιήσει καινούρια αγγελία τις τελευταίες %(days)s μέρες.",
      { days: this.props.trackedPeriod },
      true
    )
  }

  render() {
    return (
      <div className="active-posters-list">
        <div className="container">
          <p className="lead">{this.getEmptyMessage()}</p>
        </div>
      </div>
    )
  }
}
