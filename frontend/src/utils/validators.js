const EMAIL = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
const USERNAME = new RegExp("^[0-9a-z]+$", "i")

export function required(message) {
  return function(value) {
    if (value === false || value === null || $.trim(value).length === 0) {
      return message || "Αυτό το πεδίο είναι απαραίτητο!"
    }
  }
}

export function requiredTermsOfService(message) {
  const error = "Πρέπει να αποδεχτείς τους όρους χρήσης!"
  return required(message || error)
}

export function requiredPrivacyPolicy(message) {
  const error = "Πρέπει να αποδεχτείς την πολιτική προστασίας δεδομένων!"
  return required(message || error)
}

export function email(message) {
  return function(value) {
    if (!EMAIL.test(value)) {
      return message || "Βάλε μια σωστή διεύθυνη email!"
    }
  }
}

export function minLength(limitValue, message) {
  return function(value) {
    var returnMessage = ""
    var length = $.trim(value).length

    if (length < limitValue) {
      if (message) {
        returnMessage = message(limitValue, length)
      } else {
        returnMessage = "Σιγουρέψου ότι έχει τουλάχιστον %(limit_value)s χαρακτήρες (έχει %(show_value)s)!"
      }
      return interpolate(
        returnMessage,
        {
          limit_value: limitValue,
          show_value: length
        },
        true
      )
    }
  }
}

export function maxLength(limitValue, message) {
  return function(value) {
    var returnMessage = ""
    var length = $.trim(value).length

    if (length > limitValue) {
      if (message) {
        returnMessage = message(limitValue, length)
      } else {
        returnMessage = "Σιγουρέψου ότι έχει το πολύ %(limit_value)s χαρακτήρες (έχει %(show_value)s)!"
      }
      return interpolate(
        returnMessage,
        {
          limit_value: limitValue,
          show_value: length
        },
        true
      )
    }
  }
}

export function usernameMinLength(lengthMin) {
  var message = function(lengthMin) {
    return "Το όνομα χρήστη πρέπει να έχει τουλάχιστον %(limit_value)s χαρακτήρες!"
  }
  return minLength(lengthMin, message)
}

export function usernameMaxLength(lengthMax) {
  var message = function(lengthMax) {
    return "Το όνομα χρήστη δεν μπορεί να είναι μεγαλύτερο από %(limit_value)s χαρακτήρες!"
  }
  return maxLength(lengthMax, message)
}

export function usernameContent() {
  return function(value) {
    if (!USERNAME.test($.trim(value))) {
      return "Το όνομα χρήστη πρέπει να περιέχει μόνο λατινικούς χαρακτήρες και νούμερα!"
    }
  }
}

export function passwordMinLength(limitValue) {
  return function(value) {
    const length = value.length

    if (length < limitValue) {
      const returnMessage = "Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον %(limit_value)s χαρακτήρες!"

      return interpolate(
        returnMessage,
        {
          limit_value: limitValue,
          show_value: length
        },
        true
      )
    }
  }
}
