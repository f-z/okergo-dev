/* eslint-disable no-useless-escape */
const EMAIL = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
const USERNAME = new RegExp("^[0-9a-z]+$", "i")
const PHONE = new RegExp("^\s*(?:[0-9]{10})\s*$", "i")

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
      return message || "Βάλε τη σωστή διεύθυνη email σου!"
    }
  }
}

export function phone(message) {
  return function (value) {
    if (!PHONE.test(value)) {
      return message || "Βάλε το σωστό αριθμό τηλεφώνου σου!"
    }
  }
}

export function engineer_or_customer(message) {
  return function (value) {
    if (value !== "engineer" && value !== "engineer_te" && value !== "customer") {
      return message || "Είσαι μηχανικός ή ιδιώτης;"
    }
  }
}

export function specialization(lengthMin) {
  return function (value) {
    if (value === false || value === null || $.trim(value).length >= lengthMin) {
      return false
    } else {
      return "Επέλεξε τη σωστή ειδικότητά σου!"
    }
  }
}

export function registry_number(lengthMax) {
  return function(value) {
    if (value === false || value === null || $.trim(value).length <= lengthMax) {
      return false
    } else {
        return "Βάλε το σωστό αριθμό μητρώου σου!"
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
        returnMessage = "Σιγουρέψου ότι έχεις συμπληρώσει σωστά το πεδίο!"
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
        returnMessage = "Σιγουρέψου ότι έχεις συμπληρώσει σωστά το πεδίο!"
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
