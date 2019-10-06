import React from "react"

export default function({ category }) {
  return (
    <div className={getClassName(category)} title={getTitle(category)}>
      <span className="material-icon">{getIcon(category)}</span>
    </div>
  )
}

export function getClassName(category) {
  if (category.is_read) {
    return "read-status item-read"
  }

  return "read-status item-new"
}

export function getTitle(category) {
  if (category.is_closed) {
    if (category.is_read) {
      return "Αυτή η κατηγορία εργασιών είναι κλειστή τώρα και δεν έχει καινούριες προσφορές"
    }

    return "Αυτή η κατηγορία εργασιών είναι κλειστή τώρα, αλλά έχει καινούριες προσφορές"
  }

  if (category.is_read) {
    return "Αυτή η κατηγορία εργασιών δεν έχει καινούριες προσφορές"
  }

  return "Υπάρχουν καινούριες προσφορές για αγγελίες για αυτή την κατηγορία εργασιών"
}

export function getIcon(category) {
  if (category.is_closed) {
    if (category.is_read) {
      return "lock_outline"
    }

    return "lock"
  }

  if (category.is_read) {
    return "chat_bubble_outline"
  }

  return "chat_bubble"
}
