import React from "react"

export default function({ provider, query }) {
  const url = provider.url + "?q=" + encodeURI(query)
  let label = 'Δες ολόκληρη τη σελίδα αποτελεσμάτων του χρήστη "%(provider)s" με %(count)s αποτελέσματα'
  if (provider.count === 1) {
    label = 'Δες ολόκληρη τη σελίδα αποτελεσμάτων του χρήστη "%(provider)s" με %(count)s αποτέλεσμα'
  }

  return (
    <li className="dropdown-search-footer">
      <a href={url}>
        {interpolate(
          label,
          {
            count: provider.count,
            provider: provider.name
          },
          true
        )}
      </a>
    </li>
  )
}
