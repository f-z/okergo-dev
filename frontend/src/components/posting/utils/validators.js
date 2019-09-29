import { maxLength, minLength } from "misago/utils/validators"
import misago from "misago"

export function getTitleValidators() {
  return [getTitleLengthMin(), getTitleLengthMax()]
}

export function getPostValidators() {
  if (misago.get("SETTINGS").post_length_max) {
    return [validatePostLengthMin(), validatePostLengthMax()]
  } else {
    return [validatePostLengthMin()]
  }
}

export function getTitleLengthMin() {
  return minLength(
    misago.get("SETTINGS").thread_title_length_min,
    (limitValue, length) => {
      let message = "Ο τίτλος πρέπει να έχει τουλάχιστον %(limit_value)s χαρακτήρες (έχει %(show_value)s)"
      if (limitValue === 1) {
        message = "Ο τίτλος πρέπει να έχει τουλάχιστον %(limit_value)s χαρακτήρα (έχει %(show_value)s)"
      }

      return interpolate(
        message,
        {
          limit_value: limitValue,
          show_value: length
        },
        true
      )
    }
  )
}

export function getTitleLengthMax() {
  return maxLength(
    misago.get("SETTINGS").thread_title_length_max,
    (limitValue, length) => {
      let message = "Ο τίτλος δεν μπορεί να έχει πάνω από %(limit_value)s χαρακτήρες (έχει %(show_value)s)"
      if (limitValue === 1) {
        message = "Ο τίτλος δεν μπορεί να έχει πάνω από %(limit_value)s χαρακτήρα (έχει %(show_value)s)"
      }

      return interpolate(
        message,
        {
          limit_value: limitValue,
          show_value: length
        },
        true
      )
    }
  )
}

export function validatePostLengthMin() {
  return minLength(
    misago.get("SETTINGS").post_length_min,
    (limitValue, length) => {
      let message = "Το περιεχόμενο πρέπει να έχει τουλάχιστον %(limit_value)s χαρακτήρες (έχει %(show_value)s)"
      if (limitValue === 1) {
        message = "Το περιεχόμενο πρέπει να έχει τουλάχιστον %(limit_value)s χαρακτήρα (έχει %(show_value)s)"
      }

      return interpolate(
        message,
        {
          limit_value: limitValue,
          show_value: length
        },
        true
      )
    }
  )
}

export function validatePostLengthMax() {
  return maxLength(
    misago.get("SETTINGS").post_length_max || 1000000,
    (limitValue, length) => {
      let message = "Το περιεχόμενο δεν μπορεί να έχει πάνω από %(limit_value)s χαρακτήρες (έχει %(show_value)s)"
      if (limitValue === 1) {
        message = "Το περιεχόμενο δεν μπορεί να έχει πάνω από %(limit_value)s χαρακτήρα (έχει %(show_value)s)"
      }

      return interpolate(
        message,
        {
          limit_value: limitValue,
          show_value: length
        },
        true
      )
    }
  )
}
