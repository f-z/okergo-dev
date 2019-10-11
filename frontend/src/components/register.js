import React from "react"
import Button from "misago/components/button"
import Select from "misago/components/select"
import Form from "misago/components/form"
import FormGroup from "misago/components/form-group"
import PasswordStrength from "misago/components/password-strength"
import RegisterLegalFootnote from "misago/components/RegisterLegalFootnote"
import StartSocialAuth from "misago/components/StartSocialAuth"
import misago from "misago"
import ajax from "misago/services/ajax"
import auth from "misago/services/auth"
import captcha from "misago/services/captcha"
import modal from "misago/services/modal"
import snackbar from "misago/services/snackbar"
import showBannedPage from "misago/utils/banned-page"
import * as validators from "misago/utils/validators"

export class RegisterForm extends Form {
  constructor(props) {
    super(props)

    const { username, password } = this.props.criteria

    let passwordMinLength = 0
    password.forEach(item => {
      if (item.name === "MinimumLengthValidator") {
        passwordMinLength = item.min_length
      }
    })

    const formValidators = {
      username: [
        validators.usernameContent(),
        validators.usernameMinLength(username.min_length),
        validators.usernameMaxLength(username.max_length)
      ],
      password: [validators.passwordMinLength(passwordMinLength)],
      email: [validators.email()],
      phone: [validators.phone()],
      real_name: [validators.minLength(4)],
      region: [validators.minLength(2)],
      engineer_or_customer: [validators.engineer_or_customer()],
      specialization: [validators.minLength(4)],
      registry_number: [validators.registry_number(6)],
      captcha: captcha.validator()
    }

    if (!!misago.get("TERMS_OF_SERVICE_ID")) {
      formValidators.termsOfService = [validators.requiredTermsOfService()]
    }

    if (!!misago.get("PRIVACY_POLICY_ID")) {
      formValidators.privacyPolicy = [validators.requiredPrivacyPolicy()]
    }

    this.state = {
      isLoading: false,

      username: "",
      password: "",
      real_name: "",
      email: "",
      phone: "",
      region: "",
      engineer_or_customer: "customer",
      specialization: "",
      registry_number: 0,
      captcha: "",

      termsOfService: null,
      privacyPolicy: null,

      validators: formValidators,
      errors: {}
    }

    this.ENGINEER_OR_CUSTOMER_CHOICES = [
      {
        value: "engineer",
        icon: "business_center",
        label: "Μηχανικός"
      },
      {
        value: "customer",
        icon: "person",
        label: "Ιδιώτης"
      }
    ]
  }

  clean() {
    if (this.isValid()) {
      return true
    } else {
      snackbar.error("Η φόρμα περιέχει λάθη!")
      this.setState({
        errors: this.validate()
      })
      return false
    }
  }

  send() {
    return ajax.post(misago.get("USERS_API"), {
      username: this.state.username,
      password: this.state.password,
      real_name: this.state.real_name,
      email: this.state.email,
      phone: this.state.phone,
      region: this.state.region,
      engineer_or_customer: this.state.engineer_or_customer,
      specialization: this.state.specialization,
      registry_number: this.state.registry_number,
      captcha: this.state.captcha,
      terms_of_service: this.state.termsOfService,
      privacy_policy: this.state.privacyPolicy
    })
  }

  handleSuccess(apiResponse) {
    this.props.callback(apiResponse)
  }

  handleError(rejection) {
    if (rejection.status === 400) {
      this.setState({
        errors: Object.assign({}, this.state.errors, rejection)
      })

      if (rejection.__all__ && rejection.__all__.length > 0) {
        snackbar.error(rejection.__all__[0])
      } else {
        snackbar.error("Η φόρμα περιέχει λάθη!")
      }
    } else if (rejection.status === 403 && rejection.ban) {
      showBannedPage(rejection.ban)
      modal.hide()
    } else {
      snackbar.apiError(rejection)
    }
  }

  handlePrivacyPolicyChange = event => {
    const value = event.target.value
    this.handleToggleAgreement("privacyPolicy", value)
  }

  handleTermsOfServiceChange = event => {
    const value = event.target.value
    this.handleToggleAgreement("termsOfService", value)
  }

  handleToggleAgreement = (agreement, value) => {
    this.setState((prevState, props) => {
      if (prevState[agreement] === null) {
        const errors = { ...prevState.errors, [agreement]: null }
        return { errors, [agreement]: value }
      }

      const validator = this.state.validators[agreement][0]
      const errors = { ...prevState.errors, [agreement]: [validator(null)] }
      return { errors, [agreement]: null }
    })
  }

  render() {
    const is_engineer = this.state.engineer_or_customer === "engineer"

    return (
      <div className="modal-dialog modal-register" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label={"Κλείσιμο"}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 className="modal-title">{"Εγγραφή"}</h4>
          </div>
          <form onSubmit={this.handleSubmit}>
            <input type="type" style={{ display: "none" }} />
            <input type="password" style={{ display: "none" }} />
            <div className="modal-body">
              <StartSocialAuth
                buttonClassName="col-xs-12 col-sm-6"
                buttonLabel={"Σύνδεση μέσω %(site)s"}
                formLabel={"Δημιουργία λογαριασμού:"}
              />

              <FormGroup
                label={"Όνομα χρήστη"}
                for="id_username"
                validation={this.state.errors.username}
              >
                <input
                  type="text"
                  id="id_username"
                  className="form-control"
                  aria-describedby="id_username_status"
                  disabled={this.state.isLoading}
                  onChange={this.bindInput("username")}
                  value={this.state.username}
                />
              </FormGroup>

              <FormGroup
                label={"Κωδικός πρόσβασης"}
                for="id_password"
                validation={this.state.errors.password}
                extra={
                  <PasswordStrength
                    password={this.state.password}
                    inputs={[this.state.username, this.state.email]}
                  />
                }
              >
                <input
                  type="password"
                  id="id_password"
                  className="form-control"
                  aria-describedby="id_password_status"
                  disabled={this.state.isLoading}
                  onChange={this.bindInput("password")}
                  value={this.state.password}
                />
              </FormGroup>

              <FormGroup
                label={"Ονοματεπώνυμο"}
                for="id_real_name"
                validation={this.state.errors.real_name}
              >
                <input
                  type="text"
                  id="id_real_name"
                  className="form-control"
                  aria-describedby="id_real_name_status"
                  disabled={this.state.isLoading}
                  onChange={this.bindInput("real_name")}
                  value={this.state.real_name}
                />
              </FormGroup>

              <FormGroup
                label={"Email"}
                for="id_email"
                validation={this.state.errors.email}
              >
                <input
                  type="email"
                  id="id_email"
                  className="form-control"
                  aria-describedby="id_email_status"
                  disabled={this.state.isLoading}
                  onChange={this.bindInput("email")}
                  value={this.state.email}
                />
              </FormGroup>

              <FormGroup
                label={"Τηλέφωνο"}
                for="id_phone"
                validation={this.state.errors.phone}
              >
                <input
                  type="tel"
                  id="id_phone"
                  className="form-control"
                  aria-describedby="id_phone_status"
                  disabled={this.state.isLoading}
                  onChange={this.bindInput("phone")}
                  value={this.state.phone}
                />
              </FormGroup>

              <FormGroup
                label={"Νομός"}
                for="id_region"
                validation={this.state.errors.region}
              >
                <input
                  type="text"
                  id="id_region"
                  className="form-control"
                  aria-describedby="id_region_status"
                  disabled={this.state.isLoading}
                  onChange={this.bindInput("region")}
                  value={this.state.region}
                />
              </FormGroup>

              <FormGroup
                label={"Είσαι μηχανικός ή ιδιώτης;"}
                for="id_engineer_or_customer"
                validation={this.state.errors.engineer_or_customer}
              >
                <Select
                  id="id_engineer_or_customer"
                  disabled={this.state.isLoading}
                  onChange={this.bindInput("engineer_or_customer")}
                  value={this.state.engineer_or_customer}
                  choices={this.ENGINEER_OR_CUSTOMER_CHOICES}
                />
              </FormGroup>

              {
                is_engineer ? ( 
                  <FormGroup
                  label={"Ειδικότητα"}
                  for="id_specialization"
                  validation={this.state.errors.specialization}
                  >
                    <input
                      type="text"
                      id="id_specialization"
                      className="form-control"
                      aria-describedby="id_specialization_status"
                      disabled={this.state.isLoading}
                      onChange={this.bindInput("specialization")}
                      value={this.state.specialization}
                    />
                  </FormGroup>
                ) : ( 
                  null
                )
              }

              {
                is_engineer ? ( 
                  <FormGroup
                  label={"Αριθμός μητρώου ΤΕΕ"}
                  for="id_registry_number"
                  validation={this.state.errors.registry_number}
                  >
                    <input
                      type="number"
                      id="id_registry_number"
                      className="form-control"
                      aria-describedby="id_registry_number_status"
                      disabled={this.state.isLoading}
                      onChange={this.bindInput("registry_number")}
                      value={this.state.registry_number}
                    />
                  </FormGroup>
                ) : ( 
                  null
                )
              }

              {captcha.component({
                form: this
              })}

              <RegisterLegalFootnote
                errors={this.state.errors}
                privacyPolicy={this.state.privacyPolicy}
                termsOfService={this.state.termsOfService}
                onPrivacyPolicyChange={this.handlePrivacyPolicyChange}
                onTermsOfServiceChange={this.handleTermsOfServiceChange}
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-default"
                data-dismiss="modal"
                disabled={this.state.isLoading}
                type="button"
              >
                {"Ακύρωση"}
              </button>
              <Button className="btn-primary" loading={this.state.isLoading}>
                {"Εγγραφή λογαριασμού"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export class RegisterComplete extends React.Component {
  getLead() {
    if (this.props.activation === "user") {
      return "%(username)s, ο λογαριασμός σου έχει δημιουργηθεί, αλλά πρέπει να τον ενεργοποιήσεις μέσω email πριν συνδεθείς!"
    } else if (this.props.activation === "admin") {
      return "%(username)s, ο λογαριασμός σου έχει δημιουργηθεί, αλλά πρέπει να γίνει επαλήθευση των στοιχείων σου πριν συνδεθείς!"
    }
  }

  getSubscript() {
    if (this.props.activation === "user") {
      return "Έχουμε στείλει ένα email στο %(email)s με ένα σύνδεσμο που πρέπει να κάνεις κλικ για να ενεργοποιήσεις το λογαριασμό σου."
    } else if (this.props.activation === "admin") {
      return "Θα στείλουμε ένα email στο %(email)s, όταν ολοκληρωθεί η διαδικασία και εγκριθεί ο λογαριασμός."
    }
  }

  render() {
    return (
      <div
        className="modal-dialog modal-message modal-register"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label={"Κλείσιμο"}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 className="modal-title">{"Ολοκλήρωση εγγραφής"}</h4>
          </div>
          <div className="modal-body">
            <div className="message-icon">
              <span className="material-icon">info_outline</span>
            </div>
            <div className="message-body">
              <p className="lead">
                {interpolate(
                  this.getLead(),
                  { username: this.props.username },
                  true
                )}
              </p>
              <p>
                {interpolate(
                  this.getSubscript(),
                  { email: this.props.email },
                  true
                )}
              </p>
              <button
                className="btn btn-default"
                data-dismiss="modal"
                type="button"
              >
                {"ΟΚ"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      complete: false
    }
  }

  completeRegistration = apiResponse => {
    if (apiResponse.activation === "active") {
      modal.hide()
      auth.signIn(apiResponse)
    } else {
      this.setState({
        complete: apiResponse
      })
    }
  }

  render() {
    if (this.state.complete) {
      return (
        <RegisterComplete
          activation={this.state.complete.activation}
          email={this.state.complete.email}
          username={this.state.complete.username}
        />
      )
    }

    return <RegisterForm callback={this.completeRegistration} {...this.props} />
  }
}
