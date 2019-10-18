export function getParticipantsCopy(participants) {
  const count = participants.length
  let message = "Αυτή η συνομιλία έχει %(users)s μέλη"
  if (count === 1) {
    message = "Αυτή η συνομιλία έχει %(users)s μέλος"
  }

  return interpolate(
    message,
    {
      users: count
    },
    true
  )
}
