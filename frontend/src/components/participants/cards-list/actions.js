import * as participants from "misago/reducers/participants"
import { updateAcl } from "misago/reducers/thread"
import misago from "misago"
import ajax from "misago/services/ajax"
import snackbar from "misago/services/snackbar"
import store from "misago/services/store"

export function leave(thread, participant) {
  ajax
    .patch(thread.api.index, [
      { op: "remove", path: "participants", value: participant.id }
    ])
    .then(
      () => {
        snackbar.success("Εγκατέλειψες αυτή τη συνομιλία επιτυχώς!")
        window.setTimeout(() => {
          window.location = misago.get("PRIVATE_THREADS_URL")
        }, 3 * 1000)
      },
      rejection => {
        snackbar.apiError(rejection)
      }
    )
}

export function remove(thread, participant) {
  ajax
    .patch(thread.api.index, [
      { op: "remove", path: "participants", value: participant.id },
      { op: "add", path: "acl", value: 1 }
    ])
    .then(
      data => {
        store.dispatch(updateAcl(data))
        store.dispatch(participants.replace(data.participants))

        const message = "Ο χρήστης %(user)s αφαιρέθηκε από τη συνομιλία επιτυχώς!"
        snackbar.success(
          interpolate(
            message,
            {
              user: participant.username
            },
            true
          )
        )
      },
      rejection => {
        snackbar.apiError(rejection)
      }
    )
}

export function changeOwner(thread, participant) {
  ajax
    .patch(thread.api.index, [
      { op: "replace", path: "owner", value: participant.id },
      { op: "add", path: "acl", value: 1 }
    ])
    .then(
      data => {
        store.dispatch(updateAcl(data))
        store.dispatch(participants.replace(data.participants))

        const message = "Ο χρήστης %(user)s έχει τώρα έλεγχο της συνομιλίας!"
        snackbar.success(
          interpolate(
            message,
            {
              user: participant.username
            },
            true
          )
        )
      },
      rejection => {
        snackbar.apiError(rejection)
      }
    )
}
