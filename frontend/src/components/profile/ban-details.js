import moment from "moment"
import React from "react"
import PanelLoader from "misago/components/panel-loader"
import PanelMessage from "misago/components/panel-message"
import misago from "misago/index"
import polls from "misago/services/polls"
import title from "misago/services/page-title"

export default class extends React.Component {
  constructor(props) {
    super(props)

    if (misago.has("PROFILE_BAN")) {
      this.initWithPreloadedData(misago.pop("PROFILE_BAN"))
    } else {
      this.initWithoutPreloadedData()
    }

    this.startPolling(props.profile.api.ban)
  }

  initWithPreloadedData(ban) {
    if (ban.expires_on) {
      ban.expires_on = moment(ban.expires_on)
    }

    this.setState({
      isLoaded: true,
      ban
    })
  }

  initWithoutPreloadedData() {
    this.setState({
      isLoaded: false
    })
  }

  startPolling(api) {
    polls.start({
      poll: "ban-details",
      url: api,
      frequency: 90 * 1000,
      update: this.update,
      error: this.error
    })
  }

  update = ban => {
    if (ban.expires_on) {
      ban.expires_on = moment(ban.expires_on)
    }

    this.setState({
      isLoaded: true,
      error: null,

      ban
    })
  }

  error = error => {
    this.setState({
      isLoaded: true,
      error: error.detail,
      ban: null
    })
  }

  componentDidMount() {
    title.set({
      title: "Πληροφορίες σχετικά με τον αποκλεισμό",
      parent: this.props.profile.username
    })
  }

  componentWillUnmount() {
    polls.stop("ban-details")
  }

  getUserMessage() {
    if (this.state.ban.user_message) {
      return (
        <div className="panel-body ban-message ban-user-message">
          <h4>{"Μήνυμα που βλέπει ο χρήστης"}</h4>
          <div
            className="lead"
            dangerouslySetInnerHTML={{
              __html: this.state.ban.user_message.html
            }}
          />
        </div>
      )
    } else {
      return null
    }
  }

  getStaffMessage() {
    if (this.state.ban.staff_message) {
      return (
        <div className="panel-body ban-message ban-staff-message">
          <h4>{"Μήνυμα που βλέπουν οι διαχειριστές"}</h4>
          <div
            className="lead"
            dangerouslySetInnerHTML={{
              __html: this.state.ban.staff_message.html
            }}
          />
        </div>
      )
    } else {
      return null
    }
  }

  getExpirationMessage() {
    if (this.state.ban.expires_on) {
      if (this.state.ban.expires_on.isAfter(moment())) {
        let title = interpolate(
          "Ο αποκλεισμός λήγει στις %(expires_on)s",
          {
            expires_on: this.state.ban.expires_on.format("LL, LT")
          },
          true
        )

        let message = interpolate(
          "Ο αποκλεισμός λήγει %(expires_on)s",
          {
            expires_on: this.state.ban.expires_on.fromNow()
          },
          true
        )

        return <abbr title={title}>{message}</abbr>
      } else {
        return "Ο αποκλεισμός έχει λήξει"
      }
    } else {
      return interpolate(
        "Ο αποκλεισμός του χρήστη %(username)s είναι μόνιμος",
        {
          username: this.props.profile.username
        },
        true
      )
    }
  }

  getPanelBody() {
    if (this.state.ban) {
      if (Object.keys(this.state.ban).length) {
        return (
          <div>
            {this.getUserMessage()}
            {this.getStaffMessage()}

            <div className="panel-body ban-expires">
              <h4>{"Τέλος αποκλεισμού"}</h4>
              <p className="lead">{this.getExpirationMessage()}</p>
            </div>
          </div>
        )
      } else {
        return (
          <div>
            <PanelMessage
              message={"Ο χρήστης δεν έχει αποκλειστεί"}
            />
          </div>
        )
      }
    } else if (this.state.error) {
      return (
        <div>
          <PanelMessage icon="error_outline" message={this.state.error} />
        </div>
      )
    } else {
      return (
        <div>
          <PanelLoader />
        </div>
      )
    }
  }

  render() {
    return (
      <div className="profile-ban-details">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">{"Πληροφορίες σχετικά με τον αποκλεισμό"}</h3>
          </div>

          {this.getPanelBody()}
        </div>
      </div>
    )
  }
}
