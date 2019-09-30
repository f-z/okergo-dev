import React from "react"
import UserStatus, { StatusLabel } from "misago/components/user-status"

export default function({ showStatus, user }) {
  return (
    <ul className="list-unstyled">
      <Status showStatus={showStatus} user={user} />
      <JoinDate user={user} />
      <li className="user-stat-divider" />
      <Posts user={user} />
      <Threads user={user} />
      <Followers user={user} />
    </ul>
  )
}

export function Status({ showStatus, user }) {
  if (!showStatus) return null

  return (
    <li className="user-stat-status">
      <UserStatus status={user.status}>
        <StatusLabel status={user.status} user={user} />
      </UserStatus>
    </li>
  )
}

export function JoinDate({ user }) {
  const { joined_on } = user

  let title = interpolate(
    "Έκανε εγγραφή %(joined_on)s",
    {
      joined_on: joined_on.format("LL, LT")
    },
    true
  )

  let message = interpolate(
    "Έκανε εγγραφή %(joined_on)s",
    {
      joined_on: joined_on.fromNow()
    },
    true
  )

  return (
    <li className="user-stat-join-date">
      <abbr title={title}>{message}</abbr>
    </li>
  )
}

export function Posts({ user }) {
  const className = getStatClassName("user-stat-posts", user.posts)
  let message = "%(posts)s δημοσιεύσεις"
  if (user.posts === 1) {
    message = "%(posts)s δημοσίευση"
  }

  return (
    <li className={className}>
      {interpolate(
        message,
        {
          posts: user.posts
        },
        true
      )}
    </li>
  )
}

export function Threads({ user }) {
  const className = getStatClassName("user-stat-threads", user.threads)
  let message = "%(threads)s αγγελίες"
  if (user.threads === 1) {
    message = "%(threads)s αγγελία"
  }

  return (
    <li className={className}>
      {interpolate(
        message,
        {
          threads: user.threads
        },
        true
      )}
    </li>
  )
}

export function Followers({ user }) {
  const className = getStatClassName("user-stat-followers", user.followers)
  let message = "%(followers)s ακολουθούν"
  if (user.followers === 1) {
    message = "%(followers)s ακολουθεί"
  }

  return (
    <li className={className}>
      {interpolate(
        message,
        {
          followers: user.followers
        },
        true
      )}
    </li>
  )
}

export function getStatClassName(className, stat) {
  if (stat === 0) {
    return className + " user-stat-empty"
  }
  return className
}
