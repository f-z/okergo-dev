import React from "react"
import escapeHtml from "misago/utils/escape-html"

const MESSAGE = {
  pinned_globally: "Η αγγελία προωθείται σε όλη τη σελίδα",
  pinned_locally: "Η αγγελία προωθείται σε αυτή την κατηγορία",
  unpinned: "Η αγγελία δεν προωθείται πλέον",

  approved: "Η αγγελία εγκρίθηκε",

  opened: "Η αγγελία άνοιξε για νέες προσφορές",
  closed: "Η αγγελία έκλεισε για νέες προσφορές",

  unhid: "Η αγγελία θα εμφανίζεται από τώρα",
  hid: "Η αγγελία θα είναι κρυμμένη από τώρα",

  tookover: "Πήρες έλεγχο της αγγελίας",

  owner_left: "Ο ιδιοκτήτης της αγγελίας έφυγε, οπότε θα κλείσει",
  participant_left: "Ένας χρήστης που έκανε προσφορά έφυγε"
}

const ITEM_LINK = '<a href="%(url)s" class="item-title">%(name)s</a>'
const ITEM_SPAN = '<span class="item-title">%(name)s</span>'

export default function(props) {
  if (MESSAGE[props.post.event_type]) {
    return <p className="event-message">{MESSAGE[props.post.event_type]}</p>
  } else if (props.post.event_type === "changed_title") {
    return <ChangedTitle {...props} />
  } else if (props.post.event_type === "moved") {
    return <Moved {...props} />
  } else if (props.post.event_type === "merged") {
    return <Merged {...props} />
  } else if (props.post.event_type === "changed_owner") {
    return <ChangedOwner {...props} />
  } else if (props.post.event_type === "added_participant") {
    return <AddedParticipant {...props} />
  } else if (props.post.event_type === "removed_participant") {
    return <RemovedParticipant {...props} />
  } else {
    return null
  }
}

export function ChangedTitle(props) {
  const msgstring = escapeHtml(
    "Ο τίτλος της αγγελίας άλλαξε από %(old_title)s"
  )
  const oldTitle = interpolate(
    ITEM_SPAN,
    {
      name: escapeHtml(props.post.event_context.old_title)
    },
    true
  )
  const message = interpolate(
    msgstring,
    {
      old_title: oldTitle
    },
    true
  )

  return (
    <p
      className="event-message"
      dangerouslySetInnerHTML={{ __html: message }}
    />
  )
}

export function Moved(props) {
  const msgstring = escapeHtml(
    "Η αγγελία μετακινήθηκε από %(from_category)s"
  )
  const fromCategory = interpolate(
    ITEM_LINK,
    {
      url: escapeHtml(props.post.event_context.from_category.url),
      name: escapeHtml(props.post.event_context.from_category.name)
    },
    true
  )

  const message = interpolate(
    msgstring,
    {
      from_category: fromCategory
    },
    true
  )

  return (
    <p
      className="event-message"
      dangerouslySetInnerHTML={{ __html: message }}
    />
  )
}

export function Merged(props) {
  const msgstring = escapeHtml(
    "Η αγγελία %(merged_thread)s συγχωνεύθηκε με αυτή εδώ"
  )
  const mergedThread = interpolate(
    ITEM_SPAN,
    {
      name: escapeHtml(props.post.event_context.merged_thread)
    },
    true
  )

  const message = interpolate(
    msgstring,
    {
      merged_thread: mergedThread
    },
    true
  )

  return (
    <p
      className="event-message"
      dangerouslySetInnerHTML={{ __html: message }}
    />
  )
}

export function ChangedOwner(props) {
  const msgstring = escapeHtml("Ο νέος ιδιοκτήτης είναι ο χρήστης %(user)s")
  const newOwner = interpolate(
    ITEM_LINK,
    {
      url: escapeHtml(props.post.event_context.user.url),
      name: escapeHtml(props.post.event_context.user.username)
    },
    true
  )

  const message = interpolate(
    msgstring,
    {
      user: newOwner
    },
    true
  )

  return (
    <p
      className="event-message"
      dangerouslySetInnerHTML={{ __html: message }}
    />
  )
}

export function AddedParticipant(props) {
  const msgstring = escapeHtml("Προστέθηκε ο χρήστης %(user)s")
  const newOwner = interpolate(
    ITEM_LINK,
    {
      url: escapeHtml(props.post.event_context.user.url),
      name: escapeHtml(props.post.event_context.user.username)
    },
    true
  )

  const message = interpolate(
    msgstring,
    {
      user: newOwner
    },
    true
  )

  return (
    <p
      className="event-message"
      dangerouslySetInnerHTML={{ __html: message }}
    />
  )
}

export function RemovedParticipant(props) {
  const msgstring = escapeHtml("Αφαιρέθηκε ο χρήστης %(user)s")
  const newOwner = interpolate(
    ITEM_LINK,
    {
      url: escapeHtml(props.post.event_context.user.url),
      name: escapeHtml(props.post.event_context.user.username)
    },
    true
  )

  const message = interpolate(
    msgstring,
    {
      user: newOwner
    },
    true
  )

  return (
    <p
      className="event-message"
      dangerouslySetInnerHTML={{ __html: message }}
    />
  )
}
