import React from "react"

export default class extends React.Component {
  getClass() {
    return getStatusClassName(this.props.status)
  }

  render() {
    return <span className={this.getClass()}>{this.props.children}</span>
  }
}

export class StatusIcon extends React.Component {
  getIcon() {
    if (this.props.status.is_banned) {
      return "remove_circle_outline"
    } else if (this.props.status.is_hidden) {
      return "help_outline"
    } else if (this.props.status.is_online_hidden) {
      return "label"
    } else if (this.props.status.is_offline_hidden) {
      return "label_outline"
    } else if (this.props.status.is_online) {
      return "lens"
    } else if (this.props.status.is_offline) {
      return "panorama_fish_eye"
    }
  }

  render() {
    return <span className="material-icon status-icon">{this.getIcon()}</span>
  }
}

export class StatusLabel extends React.Component {
  getHelp() {
    return getStatusDescription(this.props.user, this.props.status)
  }

  getLabel() {
    if (this.props.status.is_banned) {
      return "Απεκλεισμένος"
    } else if (this.props.status.is_hidden) {
      return "Κρυμμένος"
    } else if (this.props.status.is_online_hidden) {
      return "Συνδεδεμένος (κρυμμένος)"
    } else if (this.props.status.is_offline_hidden) {
      return "Εκτός σύνδεσης (κρυμμένός)"
    } else if (this.props.status.is_online) {
      return "Συνδεδεμένος"
    } else if (this.props.status.is_offline) {
      return "Εκτός σύνδεσης"
    }
  }

  render() {
    return (
      <span
        className={this.props.className || "status-label"}
        title={this.getHelp()}
      >
        {this.getLabel()}
      </span>
    )
  }
}

export function getStatusClassName(status) {
  let className = ""
  if (status.is_banned) {
    className = "banned"
  } else if (status.is_hidden) {
    className = "offline"
  } else if (status.is_online_hidden) {
    className = "online"
  } else if (status.is_offline_hidden) {
    className = "offline"
  } else if (status.is_online) {
    className = "online"
  } else if (status.is_offline) {
    className = "offline"
  }

  return "user-status user-" + className
}

export function getStatusDescription(user, status) {
  if (status.is_banned) {
    if (status.banned_until) {
      return interpolate(
        "Ο χρήστης %(username)s είναι απεκλεισμένος μέχρι %(ban_expires)s",
        {
          username: user.username,
          ban_expires: status.banned_until.format("LL, LT")
        },
        true
      )
    } else {
      return interpolate(
        "Ο χρήστης %(username)s είναι απεκλεισμένος",
        {
          username: user.username
        },
        true
      )
    }
  } else if (status.is_hidden) {
    return interpolate(
      "Ο χρήστης %(username)s είναι κρυμμένος",
      {
        username: user.username
      },
      true
    )
  } else if (status.is_online_hidden) {
    return interpolate(
      "Ο χρήστης %(username)s είναι συνδεδεμένος (κρυμμένος)",
      {
        username: user.username
      },
      true
    )
  } else if (status.is_offline_hidden) {
    return interpolate(
      "Ο χρήστης %(username)s συνδέθηκε τελευταία φορά στις %(last_click)s (κρυμμένος)",
      {
        username: user.username,
        last_click: status.last_click.fromNow()
      },
      true
    )
  } else if (status.is_online) {
    return interpolate(
      "Ο χρήστης %(username)s είναι συνδεδεμένος",
      {
        username: user.username
      },
      true
    )
  } else if (status.is_offline) {
    return interpolate(
      "Ο χρήστης %(username)s συνδέθηκε τελευταία φορά στις %(last_click)s",
      {
        username: user.username,
        last_click: status.last_click.fromNow()
      },
      true
    )
  }
}
