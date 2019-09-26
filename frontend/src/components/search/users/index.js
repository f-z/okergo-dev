import React from "react"
import SearchPage from "../page"
import UsersList from "misago/components/users-list"

export default function(props) {
  return (
    <SearchPage provider={props.route.provider} search={props.search}>
      <Blankslate query={props.search.query} users={props.users}>
        <UsersList cols={3} isReady={true} users={props.users} />
      </Blankslate>
    </SearchPage>
  )
}

export function Blankslate(props) {
  if (props.users.length) return props.children

  if (props.query.length) {
    return (
      <p className="lead">
        {"Κανένας χρήστης δε βρέθηκε..."}
      </p>
    )
  }

  return (
    <p className="lead">
      {"Βάλε τουλάχιστον δύο χαρακτήρες..."}
    </p>
  )
}
