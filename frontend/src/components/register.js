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
    super(props);

    const { username, password } = this.props.criteria;

    let passwordMinLength = 0;
    password.forEach(item => {
      if (item.name === "MinimumLengthValidator") {
        passwordMinLength = item.min_length;
      }
    });

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
      specialization: [validators.specialization(4)],
      registry_number: [validators.registry_number(6)],
      captcha: captcha.validator()
    };

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
      region: "Αττικής",
      engineer_or_customer: "customer",
      specialization: "Ιδιώτης",
      registry_number: 0,
      captcha: "",

      termsOfService: null,
      privacyPolicy: null,

      validators: formValidators,
      errors: {}
    };

    this.REGION_CHOICES = [
      {
        value: "Αττικής",
        icon: "location_on",
        label: "Αττικής"
      }, {
        value: "Θεσσαλονίκης",
        icon: "location_on",
        label: "Θεσσαλονίκης"
      }, {
        value: "Αχαΐας",
        icon: "location_on",
        label: "Αχαΐας"
      }, {
        value: "Ηρακλείου",
        icon: "location_on",
        label: "Ηρακλείου"
      }, {
        value: "Λάρισας",
        icon: "location_on",
        label: "Λάρισας"
      }, {
        value: "Αιτωλοακαρνανίας",
        icon: "location_on",
        label: "Αιτωλοακαρνανίας"
      }, {
        value: "Εύβοιας",
        icon: "location_on",
        label: "Εύβοιας"
      }, {
        value: "Μαγνησίας",
        icon: "location_on",
        label: "Μαγνησίας"
      }, {
        value: "Σερρών",
        icon: "location_on",
        label: "Σερρών"
      }, {
        value: "Ηλείας",
        icon: "location_on",
        label: "Ηλείας"
      }, {
        value: "Δωδεκανήσου",
        icon: "location_on",
        label: "Δωδεκανήσου"
      }, {
        value: "Φθιώτιδας",
        icon: "location_on",
        label: "Φθιώτιδας"
      }, {
        value: "Μεσσηνίας",
        icon: "location_on",
        label: "Μεσσηνίας"
      }, {
        value: "Ιωαννίνων",
        icon: "location_on",
        label: "Ιωαννίνων"
      }, {
        value: "Κοζάνης",
        icon: "location_on",
        label: "Κοζάνης"
      }, {
        value: "Κορινθίας",
        icon: "location_on",
        label: "Κορινθίας"
      }, {
        value: "Χανίων",
        icon: "location_on",
        label: "Χανίων"
      }, {
        value: "Έβρου",
        icon: "location_on",
        label: "Έβρου"
      }, {
        value: "Πέλλας",
        icon: "location_on",
        label: "Πέλλας"
      }, {
        value: "Καβάλας",
        icon: "location_on",
        label: "Καβάλας"
      }, {
        value: "Ημαθίας",
        icon: "location_on",
        label: "Ημαθίας"
      }, {
        value: "Τρικάλων",
        icon: "location_on",
        label: "Τρικάλων"
      }, {
        value: "Βοιωτίας",
        icon: "location_on",
        label: "Βοιωτίας"
      }, {
        value: "Πιερίας",
        icon: "location_on",
        label: "Πιερίας"
      }, {
        value: "Καρδίτσας",
        icon: "location_on",
        label: "Καρδίτσας"
      }, {
        value: "Κυκλάδων",
        icon: "location_on",
        label: "Κυκλάδων"
      }, {
        value: "Κέρκυρας",
        icon: "location_on",
        label: "Κέρκυρας"
      }, {
        value: "Ροδόπης",
        icon: "location_on",
        label: "Ροδόπης"
      }, {
        value: "Λέσβου",
        icon: "location_on",
        label: "Λέσβου"
      }, {
        value: "Αργολίδας",
        icon: "location_on",
        label: "Αργολίδας"
      }, {
        value: "Χαλκιδικής",
        icon: "location_on",
        label: "Χαλκιδικής"
      }, {
        value: "Δράμας",
        icon: "location_on",
        label: "Δράμας"
      }, {
        value: "Αρκαδίας",
        icon: "location_on",
        label: "Αρκαδίας"
      }, {
        value: "Ξάνθης",
        icon: "location_on",
        label: "Ξάνθης"
      }, {
        value: "Λακωνίας",
        icon: "location_on",
        label: "Λακωνίας"
      }, {
        value: "Κιλκίς",
        icon: "location_on",
        label: "Κιλκίς"
      }, {
        value: "Ρεθύμνου",
        icon: "location_on",
        label: "Ρεθύμνου"
      }, {
        value: "Άρτας",
        icon: "location_on",
        label: "Άρτας"
      }, {
        value: "Λασιθίου",
        icon: "location_on",
        label: "Λασιθίου"
      }, {
        value: "Πρέβεζας",
        icon: "location_on",
        label: "Πρέβεζας"
      }, {
        value: "Φλώρινας",
        icon: "location_on",
        label: "Φλώρινας"
      }, {
        value: "Καστοριάς",
        icon: "location_on",
        label: "Καστοριάς"
      }, {
        value: "Χίου",
        icon: "location_on",
        label: "Χίου"
      }, {
        value: "Φωκίδας",
        icon: "location_on",
        label: "Φωκίδας"
      }, {
        value: "Θεσπρωτίας",
        icon: "location_on",
        label: "Θεσπρωτίας"
      }, {
        value: "Σάμου",
        icon: "location_on",
        label: "Σάμου"
      }, {
        value: "Κεφαλληνίας",
        icon: "location_on",
        label: "Κεφαλληνίας"
      }, {
        value: "Ζακύνθου",
        icon: "location_on",
        label: "Ζακύνθου"
      }, {
        value: "Γρεβενών",
        icon: "location_on",
        label: "Γρεβενών"
      }, {
        value: "Ευρυτανίας",
        icon: "location_on",
        label: "Ευρυτανίας"
      }, {
        value: "Λευκάδας",
        icon: "location_on",
        label: "Λευκάδας"
      }
    ]

    this.REGION_CHOICES.sort((a, b) => a.label.localeCompare(b.label))

    this.ENGINEER_OR_CUSTOMER_CHOICES = [
      {
        value: "engineer",
        icon: "business_center",
        label: "Μηχανικός"
      },
      {
        value: "engineer_te",
        icon: "business_center",
        label: "Μηχανικός Τ.Ε."
      },
      {
        value: "customer",
        icon: "person",
        label: "Ιδιώτης"
      }
    ]

    this.ENGINEER_SPECIALIZATION_CHOICES = [
      {
        value: "Αγρονόμος Τοπογράφος Μηχανικός",
        icon: "lens",
        label: "Αγρονόμος Τοπογράφος Μηχανικός"
      },
      {
        value: "Αρχιτέκτων Μηχανικός",
        icon: "location_city",
        label: "Αρχιτέκτων Μηχανικός"
      },
      {
        value: "Ηλεκτρολόγος Μηχανικός",
        icon: "ev_station",
        label: "Ηλεκτρολόγος Μηχανικός"
      },
      {
        value: "Ηλεκτρονικός Μηχανικός",
        icon: "lens",
        label: "Ηλεκτρονικός Μηχανικός"
      },
      {
        value: "Μηχανολόγος Μηχανικός",
        icon: "drive_eta",
        label: "Μηχανολόγος Μηχανικός"
      },
      {
        value: "Μηχανολόγος Ηλεκτρολόγος Μηχανικός",
        icon: "drive_eta",
        label: "Μηχανολόγος Ηλεκτρολόγος Μηχανικός"
      },
      {
        value: "Πολιτικός Μηχανικός",
        icon: "business",
        label: "Πολιτικός Μηχανικός"
      }
    ];

    this.ENGINEER_SPECIALIZATION_CHOICES.sort((a, b) => a.label.localeCompare(b.label));

    this.ENGINEER_TE_SPECIALIZATION_CHOICES = [
      {
        value: "Ηλεκτρολόγος Μηχανικός Τ.Ε.",
        icon: "grade",
        label: "Ηλεκτρολόγος Μηχανικός Τ.Ε."
      },
      {
        value: "Μηχανικός Ανακαίνισης και Αποκατάστασης Κτιρίων Τ.Ε.",
        icon: "grade",
        label: "Μηχανικός Ανακαίνισης και Αποκατάστασης Κτιρίων Τ.Ε."
      },
      {
        value: "Μηχανικός Γεωπληροφορικής και Τοπογραφίας Τ.Ε.",
        icon: "grade",
        label: "Μηχανικός Γεωπληροφορικής και Τοπογραφίας Τ.Ε."
      },
      {
        value: "Μηχανικός Περιβάλλοντος Τ.Ε.",
        icon: "grade",
        label: "Μηχανικός Περιβάλλοντος Τ.Ε."
      },
      {
        value: "Μηχανικός Φυσικών Πόρων & Περιβάλλοντος Τ.Ε.",
        icon: "grade",
        label: "Μηχανικός Φυσικών Πόρων & Περιβάλλοντος Τ.Ε."
      },
      {
        value: "Μηχανολόγος Μηχανικός Τ.Ε.",
        icon: "grade",
        label: "Μηχανολόγος Μηχανικός Τ.Ε."
      }, 
      {
        value: "Πολιτικός Μηχανικός Δομικών Έργων Τ.Ε.",
        icon: "grade",
        label: "Πολιτικός Μηχανικός Δομικών Έργων Τ.Ε."
      },
      {
        value: "Πολιτικός Μηχανικός Έργων Υποδομής Τ.Ε.",
        icon: "grade",
        label: "Πολιτικός Μηχανικός Έργων Υποδομής Τ.Ε."
      },
      {
        value: "Τοπογράφος Μηχανικός Τ.Ε.",
        icon: "grade",
        label: "Τοπογράφος Μηχανικός Τ.Ε."
      },
      {
        value: "Μηχανικός Τεχνολογίας Περιβάλλοντος και Οικολογίας Τ.Ε.",
        icon: "grade",
        label: "Μηχανικός Τεχνολογίας Περιβάλλοντος και Οικολογίας Τ.Ε."
      }
    ];

    this.ENGINEER_TE_SPECIALIZATION_CHOICES.sort((a, b) => a.label.localeCompare(b.label));
  }

  clean() {
    if (this.isValid()) {
      return true;
    } else {
      snackbar.error("Η φόρμα περιέχει λάθη!");
      this.setState({
        errors: this.validate()
      });
      return false;
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

  handleEngineerOrCustomer = (e) => {
    this.setState({
      engineer_or_customer: e.target.value,
    })

    if (e.target.value == "engineer") {
      this.setState({
        specialization: "Αρχιτέκτων Μηχανικός"
      })
    } else if (e.target.value == "engineer_te") {
      this.setState({
        specialization: "Ηλεκτρολόγος Μηχανικός Τ.Ε."
      })
    } else {
      this.setState({
        specialization: "Ιδιώτης"
      })
    }
  }

  render() {
    const is_engineer = this.state.engineer_or_customer === "engineer"
    const is_engineer_te = this.state.engineer_or_customer === "engineer_te"

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
                <Select
                  id="id_region"
                  disabled={this.state.isLoading}
                  onChange={this.bindInput("region")}
                  value={this.state.region}
                  choices={this.REGION_CHOICES}
                />
              </FormGroup>

              <FormGroup
                label={"Είσαι μηχανικός ή ιδιώτης"}
                for="id_engineer_or_customer"
                validation={this.state.errors.engineer_or_customer}
              >
                <Select
                  id="id_engineer_or_customer"
                  disabled={this.state.isLoading}
                  onChange={this.handleEngineerOrCustomer}
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
                    <Select
                      id="id_specialization"
                      disabled={this.state.isLoading}
                      onChange={this.bindInput("specialization")}
                      value={this.state.specialization}
                      choices={this.ENGINEER_SPECIALIZATION_CHOICES}
                    />
                  </FormGroup>
                ) : ( 
                  null
                )
              }

              {
                is_engineer_te ? ( 
                  <FormGroup
                  label={"Ειδικότητα"}
                  for="id_specialization"
                  validation={this.state.errors.specialization}
                  >
                    <Select
                      id="id_specialization"
                      disabled={this.state.isLoading}
                      onChange={this.bindInput("specialization")}
                      value={this.state.specialization}
                      choices={this.ENGINEER_TE_SPECIALIZATION_CHOICES}
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

              {
                is_engineer_te ? ( 
                  <FormGroup
                  label={"Αριθμός μητρώου Ε.Ε.Τ.Ε.Μ."}
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

              {/*
              {
                (is_engineer || is_engineer_te) ? ( 
                  <FormGroup
                  label={"Αν είσαι φοιτητής"}
                  >
                    Στείλε email με όνομα χρήστη και βεβαίωση σπουδών στο okergo.gr@gmail.com
                  </FormGroup>
                ) : ( 
                  null
                )
              }
              */}

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
