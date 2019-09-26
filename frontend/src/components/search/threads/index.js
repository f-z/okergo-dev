import React from "react"
import SearchPage from "../page"
import Results from "./results"

export default function(props) {
  return (
    <SearchPage provider={props.route.provider} search={props.search}>
      <Blankslate query={props.search.query} posts={props.posts}>
        <Results
          provider={props.route.provider}
          query={props.search.query}
          {...props.posts}
        />
      </Blankslate>
    </SearchPage>
  )
}

export function Blankslate(props) {
  if (props.posts && props.posts.count) return props.children

  if (props.query.length) {
    return (
      <p className="lead">
        {"Καμία αγγελία δε βρέθηκε..."}
      </p>
    )
  }

  return (
    <p className="lead">
      {"Βάλε τουλάχιστον δύο χαρακτήρες..."}
    </p>
  )
}
