import React from "react"
import MisagoMarkup from "misago/components/misago-markup"

export default function(props) {
  if (props.post.content) {
    return <Default {...props} />
  } else {
    return <Invalid {...props} />
  }
}

export function Default(props) {
  return (
    <div className="post-body">
      <MisagoMarkup markup={props.post.content} />
    </div>
  )
}

export function Invalid(props) {
  return (
    <div className="post-body post-body-invalid">
      <p className="lead">
        {"Οι λεπτομέρεις αυτής της προσφοράς δεν μπορούν να εμφανιστούν"}
      </p>
      <p className="text-muted">
        {"Αυτό το λάθος προκαλέστηκε από μη έγκυρη τροποποίηση της προσφοράς"}
      </p>
    </div>
  )
}
