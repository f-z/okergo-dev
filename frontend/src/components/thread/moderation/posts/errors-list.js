import React from "react"

export default function({ errors, posts }) {
  return (
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <button
            aria-label={"Κλείσιμο"}
            className="close"
            data-dismiss="modal"
            type="button"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 className="modal-title">{"Διαχείριση"}</h4>
        </div>
        <div className="modal-body">
          <p className="lead">
            {"Μία ή περισσότερες αγγελίες δεν ήταν δυνατόν να αλλαχθούν:"}
          </p>

          <ul className="list-unstyled list-errored-items">
            {errors.map(post => {
              return (
                <PostErrors
                  errors={post.detail}
                  key={post.id}
                  post={posts[post.id]}
                />
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export function PostErrors({ errors, post }) {
  const heading = interpolate(
    "%(username)s στις %(posted_on)s",
    {
      posted_on: post.posted_on.format("LL, LT"),
      username: post.poster_name
    },
    true
  )

  return (
    <li>
      <h5>{heading}:</h5>
      {errors.map((error, i) => {
        return <p key={i}>{error}</p>
      })}
    </li>
  )
}
