import React from "react"
import Button from "misago/components/button"
import Search from "misago/components/quick-search"
import UsernameHistory from "misago/components/username-history/root"
import misago from "misago/index"
import { hydrate, append } from "misago/reducers/username-history"
import ajax from "misago/services/ajax"
import snackbar from "misago/services/snackbar"
import store from "misago/services/store"
import title from "misago/services/page-title"

export default class extends React.Component {
  constructor(props) {
    super(props)

    if (misago.has("PROFILE_NAME_HISTORY")) {
      this.initWithPreloadedData(misago.pop("PROFILE_NAME_HISTORY"))
    } else {
      this.initWithoutPreloadedData()
    }
  }

  initWithPreloadedData(data) {
    this.state = {
      isLoaded: true,
      isBusy: false,

      search: "",

      count: data.count,
      more: data.more,

      page: data.page,
      pages: data.pages
    }

    store.dispatch(hydrate(data.results))
  }

  initWithoutPreloadedData() {
    this.state = {
      isLoaded: false,
      isBusy: false,

      search: "",

      count: 0,
      more: 0,

      page: 1,
      pages: 1
    }

    this.loadChanges()
  }

  loadChanges(page = 1, search = null) {
    ajax
      .get(
        misago.get("USERNAME_CHANGES_API"),
        {
          user: this.props.profile.id,
          search: search,
          page: page || 1
        },
        "search-username-history"
      )
      .then(
        data => {
          if (page === 1) {
            store.dispatch(hydrate(data.results))
          } else {
            store.dispatch(append(data.results))
          }

          this.setState({
            isLoaded: true,
            isBusy: false,

            count: data.count,
            more: data.more,

            page: data.page,
            pages: data.pages
          })
        },
        rejection => {
          snackbar.apiError(rejection)
        }
      )
  }

  componentDidMount() {
    title.set({
      title: "Ιστορικό ονόματος χρήστη",
      parent: this.props.profile.username
    })
  }

  loadMore = () => {
    this.setState({
      isBusy: true
    })

    this.loadChanges(this.state.page + 1, this.state.search)
  }

  search = ev => {
    this.setState({
      isLoaded: false,
      isBusy: true,

      search: ev.target.value,

      count: 0,
      more: 0,

      page: 1,
      pages: 1
    })

    this.loadChanges(1, ev.target.value)
  }

  getLabel() {
    if (!this.state.isLoaded) {
      return "Φορτώνει..."
    } else if (this.state.search) {
      let message = "Βρέθηκαν %(changes)s αλλαγές ονόματος χρήστη"
      if (this.state.count === 1) {
        message = "Βρέθηκε %(changes)s αλλαγή ονόματος χρήστη"
      }
      

      return interpolate(
        message,
        {
          changes: this.state.count
        },
        true
      )
    } else if (this.props.profile.id === this.props.user.id) {
      let message = "Το όνομα χρήστη σου έχει αλλάξει %(changes)s φορές"
      if (this.state.count === 1) {
        message = "Το όνομα χρήστη σου έχει αλλάξει %(changes)s φορά"
      }

      return interpolate(
        message,
        {
          changes: this.state.count
        },
        true
      )
    } else {
      let message = "Το όνομα χρήστη του %(username)s έχει αλλάξει %(changes)s φορές"
      if (this.state.count === 1) {
        message = "Το όνομα χρήστη του %(username)s έχει αλλάξει %(changes)s φορά"
      }

      return interpolate(
        message,
        {
          username: this.props.profile.username,
          changes: this.state.count
        },
        true
      )
    }
  }

  getEmptyMessage() {
    if (this.state.search) {
      return "Η αναζήτηση δεν επέστρεψε καμία αλλαγή ονόματος χρήστη"
    } else if (this.props.user.id === this.props.profile.id) {
      return "Δεν έχεις αλλάξει ποτέ το όνομα χρήστη σου"
    } else {
      return interpolate("Το όνομα χρήστη του %(username)s δεν έχει αλλάξει ποτέ",
        {
          username: this.props.profile.username
        },
        true
      )
    }
  }

  getMoreButton() {
    if (!this.state.more) return null

    return (
      <div className="pager-more">
        <Button
          className="btn btn-default btn-outline"
          loading={this.state.isBusy}
          onClick={this.loadMore}
        >
          {interpolate(
            "Παλαιότερα (%(more)s)",
            {
              more: this.state.more
            },
            true
          )}
        </Button>
      </div>
    )
  }

  render() {
    return (
      <div className="profile-username-history">
        <nav className="toolbar">
          <h3 className="toolbar-left">{this.getLabel()}</h3>

          <Search
            className="toolbar-right"
            value={this.state.search}
            onChange={this.search}
            placeholder={"Αναζήτηση ιστορικού..."}
          />
        </nav>

        <UsernameHistory
          isLoaded={this.state.isLoaded}
          emptyMessage={this.getEmptyMessage()}
          changes={this.props["username-history"]}
        />

        {this.getMoreButton()}
      </div>
    )
  }
}
