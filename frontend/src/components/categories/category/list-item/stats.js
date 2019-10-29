import React from "react"

export default function({ category }) {
  return (
    <div className="col-md-2 hidden-xs hidden-sm">
      <ul className="list-unstyled category-stats">
        <Threads threads={category.threads} />
        <Posts posts={category.posts} />
      </ul>
    </div>
  )
}

export function Threads({ threads }) {
  let message = "%(threads)s αγγελίες"
  if (threads === 1) {
    message = "%(threads)s αγγελία"
  }

  return (
    <li className="category-stat-threads">
      {interpolate(
        message,
        {
          threads: threads
        },
        true
      )}
    </li>
  )
}

export function Posts({ posts }) {
  let message = "%(posts)s δημοσιεύσεις"
  if (posts === 1) {
    message = "%(posts)s δημοσίευση"
  }

  return (
    <li className="category-stat-posts">
      {interpolate(
        message,
        {
          posts: posts
        },
        true
      )}
    </li>
  )
}
