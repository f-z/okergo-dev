import React from "react"
import Followers from "misago/components/profile/followers"

export default class extends Followers {
  setSpecialProps() {
    this.PRELOADED_DATA_KEY = "PROFILE_FOLLOWS"
    if (this.props.profile.id === this.props.user.id) {
      this.TITLE = "Ακολουθείς"
    } else {
      this.TITLE = "Ακολουθεί"
    }
    this.API_FILTER = "follows"
  }

  getLabel() {
    if (!this.state.isLoaded) {
      return "Φορτώνει..."
    } else if (this.state.search) {
      let message = "Βρέθηκαν %(users)s χρήστες"
      if (this.state.count === 1) {
        message = "Βρέθηκε %(users)s χρήστης"
      }

      return interpolate(
        message,
        {
          users: this.state.count
        },
        true
      )
    } else if (this.props.profile.id === this.props.user.id) {
      let message = "Ακολουθείς %(users)s χρήστες"
      if (this.state.count === 1) {
        message = "Ακολουθείς %(users)s χρήστη"
      }

      return interpolate(
        message,
        {
          users: this.state.count
        },
        true
      )
    } else {
      let message = "Ο χρήστης %(username)s ακολουθεί %(users)s χρήστες"
      if (this.state.count === 1) {
        message = "Ο χρήστης %(username)s ακολουθεί %(users)s χρήστη"
      }

      return interpolate(
        message,
        {
          username: this.props.profile.username,
          users: this.state.count
        },
        true
      )
    }
  }

  getEmptyMessage() {
    if (this.state.search) {
      return "Η αναζήτηση δεν επέστρεψε κανένα χρήστη..."
    } else if (this.props.user.id === this.props.profile.id) {
      return "Δεν ακολουθείς κανένα χρήστη"
    } else {
      return interpolate("Ο χρήστης %(username)s δεν ακολουθεί κανένα χρήστη",
        {
          username: this.props.profile.username
        },
        true
      )
    }
  }
}
