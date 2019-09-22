import React from "react"
import Avatar from "misago/components/avatar"
import NavbarSearch from "misago/components/navbar-search"
import RegisterButton from "misago/components/register-button"
import SignInModal from "misago/components/sign-in.js"
import misago from "misago"
import dropdown from "misago/services/mobile-navbar-dropdown"
import modal from "misago/services/modal"

export class GuestMenu extends React.Component {
  showSignInModal() {
    modal.show(SignInModal)
  }

  render() {
    return (
      <ul
        className="dropdown-menu user-dropdown dropdown-menu-right"
        role="menu"
      >
        <li className="guest-preview">
          <h4>{"Βλέπεις τη σελίδα ως επισκέπτης"}</h4>
          <p>
            {"Συνδέσου ή κάνε εγγραφή για να δημοσιέυσεις ή να αναλάβεις έργα!"}
          </p>
          <div className="row">
            {misago.get("SETTINGS").enable_sso ? (
              <div className="col-xs-12">
                <a
                  className="btn btn-primary btn-register btn-block"
                  href={misago.get("SETTINGS").SSO_LOGIN_URL}
                >
                  {"Σύνδεση"}
                </a>
              </div>
            ) : (
              <div className="col-xs-6">
                <button
                  className="btn btn-default btn-sign-in btn-block"
                  onClick={this.showSignInModal}
                  type="button"
                >
                  {"Σύνδεση"}
                </button>
              </div>
            )}
            {!misago.get("SETTINGS").enable_sso && (
              <div className="col-xs-6">
                <RegisterButton className="btn-primary btn-register btn-block">
                  {"Εγγραφή"}
                </RegisterButton>
              </div>
            )}
          </div>
        </li>
      </ul>
    )
  }
}

export class GuestNav extends GuestMenu {
  render() {
    return (
      <div className="nav nav-guest">
        {misago.get("SETTINGS").enable_sso ? (
          <a
            className="btn navbar-btn btn-primary btn-register"
            href={misago.get("SETTINGS").SSO_LOGIN_URL}
          >
            {"Σύνδεση"}
          </a>
        ) : (
          <button
            className="btn navbar-btn btn-default btn-sign-in"
            onClick={this.showSignInModal}
            type="button"
          >
            {"Σύνδεση"}
          </button>
        )}
        {!misago.get("SETTINGS").enable_sso && (
          <RegisterButton className="navbar-btn btn-primary btn-register">
            {"Εγγραφή"}
          </RegisterButton>
        )}
        <div className="navbar-left">
          <NavbarSearch />
        </div>
      </div>
    )
  }
}

export class CompactGuestNav extends React.Component {
  showGuestMenu() {
    dropdown.show(GuestMenu)
  }

  render() {
    return (
      <button type="button" onClick={this.showGuestMenu}>
        <Avatar size="64" />
      </button>
    )
  }
}
