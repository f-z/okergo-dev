import React from "react"
import CategorySelect from "misago/components/category-select"
import Editor from "misago/components/editor"
import Form from "misago/components/form"
import Container from "./utils/container"
import Loader from "./utils/loader"
import Message from "./utils/message"
import Options from "./utils/options"
import * as attachments from "./utils/attachments"
import { getPostValidators, getTitleValidators } from "./utils/validators"
import ajax from "misago/services/ajax"
import posting from "misago/services/posting"
import snackbar from "misago/services/snackbar"

export default class extends Form {
  constructor(props) {
    super(props)

    this.state = {
      isReady: false,
      isLoading: false,
      isErrored: false,

      showOptions: false,
      categoryOptions: null,

      title: "",
      category: props.category || null,
      categories: [],
      squareMeters: "",
      post: "Περιοχή: \n" + "\nΠεριγραφή έργου: \n" + "\nΑρχεία: \n" + "\nΠροθεσμία παράδοσης: \n",
      attachments: [],
      close: false,
      hide: false,
      pin: 0,

      validators: {
        title: getTitleValidators(),
        post: getPostValidators()
      },
      errors: {}
    }
  }

  componentDidMount() {
    ajax.get(this.props.config).then(this.loadSuccess, this.loadError)
  }

  loadSuccess = data => {
    let category = null
    let showOptions = false
    let categoryOptions = null

    // hydrate categories, extract posting options
    const categories = data.map(item => {
      // pick first category that allows posting and if it may, override it with initial one
      if (
        item.post !== false &&
        (!category || item.id === this.state.category)
      ) {
        category = item.id
        categoryOptions = item.post
      }

      if (item.post && (item.post.close || item.post.hide || item.post.pin)) {
        showOptions = true
      }

      return Object.assign(item, {
        disabled: item.post === false,
        label: item.name,
        value: item.id
      })
    })

    this.setState({
      isReady: true,
      showOptions,

      categories,
      category,
      categoryOptions
    })

    if (this.props.submode == "ENERGY") {
      this.setState({
        title: "ΠΕΑ Εξοικονομώ "
      })
    }
  }

  loadError = rejection => {
    this.setState({
      isErrored: rejection.detail
    })
  }

  onCancel = () => {
    const cancel = confirm("Είσαι σίγουρος ότι δε θέλεις να δημοσιεύσεις αυτή την αγγελία;")
    if (cancel) {
      posting.close()
    }
  }

  onTitleChange = event => {
    this.changeValue("title", event.target.value)
  }

  onCategoryChange = event => {
    const category = this.state.categories.find(item => {
      return event.target.value == item.value
    })

    // if selected pin is greater than allowed, reduce it
    let pin = this.state.pin
    if (category.post.pin && category.post.pin < pin) {
      pin = category.post.pin
    }

    this.setState({
      category: category.id,
      categoryOptions: category.post,

      pin
    })
  }

  onSquareMetersChange = event => {
    this.changeValue("squareMeters", event.target.value)
  }

  calculateProposedPriceEnergy(squareMeters) {
    return ((62 + 1.86 * squareMeters) / 1.24).toFixed(0)
  }

  onPostChange = event => {
    this.changeValue("post", event.target.value)
  }

  onAttachmentsChange = attachments => {
    this.setState({
      attachments
    })
  }

  onClose = () => {
    this.changeValue("close", true)
  }

  onOpen = () => {
    this.changeValue("close", false)
  }

  onPinGlobally = () => {
    this.changeValue("pin", 2)
  }

  onPinLocally = () => {
    this.changeValue("pin", 1)
  }

  onUnpin = () => {
    this.changeValue("pin", 0)
  }

  onHide = () => {
    this.changeValue("hide", true)
  }

  onUnhide = () => {
    this.changeValue("hide", false)
  }

  clean() {
    if (!this.state.title.trim().length) {
      snackbar.error("Πρέπει να βάλεις τίτλο στην αγγελία!")
      return false
    }

    if (this.props.submode == "ENERGY" && this.state.squareMeters <= 0) {
      snackbar.error("Πρέπει να βάλεις τετραγωνικά μέτρα στην αγγελία!")
      return false
    }

    if (!this.state.post.trim().length) {
      snackbar.error("Πρέπει να βάλεις μήνυμα στην αγγελία!")
      return false
    }

    const errors = this.validate()

    if (errors.title) {
      snackbar.error(errors.title[0])
      return false
    }

    if (errors.post) {
      snackbar.error(errors.post[0])
      return false
    }

    return true
  }

  send() {
    return ajax.post(this.props.submit, {
      title: this.state.title,
      category: this.state.category,
      post: this.state.post + '\nΠροτεινόμενη νόμιμη τιμή από Εξοικονομώ: ' + this.calculateProposedPriceEnergy(this.state.squareMeters) + " ευρώ (χωρίς ΦΠΑ)",
      attachments: attachments.clean(this.state.attachments),
      close: this.state.close,
      hide: this.state.hide,
      pin: this.state.pin
    })
  }

  handleSuccess(success) {
    snackbar.success("Η αγγελία σου δημοσιεύθηκε επιτυχώς!")
    window.location = success.url

    // keep form loading
    this.setState({
      isLoading: true
    })
  }

  handleError(rejection) {
    if (rejection.status === 400) {
      const errors = [].concat(
        rejection.non_field_errors || [],
        rejection.category || [],
        rejection.title || [],
        rejection.post || [],
        rejection.attachments || []
      )

      snackbar.error(errors[0])
    } else {
      snackbar.apiError(rejection)
    }
  }

  render() {
    if (this.state.isErrored) {
      return <Message message={this.state.isErrored} />
    }

    if (!this.state.isReady) {
      return <Loader />
    }

    let columns = 0
    if (this.state.categoryOptions.close) columns += 1
    if (this.state.categoryOptions.hide) columns += 1
    if (this.state.categoryOptions.pin) columns += 1

    let titleStyle = null

    if (columns === 1) {
      titleStyle = "col-sm-6"
    } else {
      titleStyle = "col-sm-8"
    }

    if (columns === 3) {
      titleStyle += " col-md-6"
    } else if (columns) {
      titleStyle += " col-md-7"
    } else {
      titleStyle += " col-md-9"
    }

    const isEnergyModeOn = this.props.submode === "ENERGY"

    return (
      <Container className="posting-form" withFirstRow={true}>
        <form onSubmit={this.handleSubmit}>
          <div className="row first-row">
            <div className={titleStyle}>
              <input
                className="form-control"
                disabled={this.state.isLoading}
                onChange={this.onTitleChange}
                placeholder={"Τίτλος αγγελίας"}
                type="text"
                value={this.state.title}
              />
            </div>
            <div className="col-xs-12 col-sm-4 col-md-3 xs-margin-top">
              <CategorySelect
                choices={this.state.categories}
                disabled={this.state.isLoading}
                onChange={this.onCategoryChange}
                value={this.state.category}
              />
            </div>
            <Options
              close={this.state.close}
              columns={columns}
              disabled={this.state.isLoading}
              hide={this.state.hide}
              onClose={this.onClose}
              onHide={this.onHide}
              onOpen={this.onOpen}
              onPinGlobally={this.onPinGlobally}
              onPinLocally={this.onPinLocally}
              onUnhide={this.onUnhide}
              onUnpin={this.onUnpin}
              options={this.state.categoryOptions}
              pin={this.state.pin}
              showOptions={this.state.showOptions}
            />
          </div>

          {
            isEnergyModeOn ? ( 
              <div className="row first-row">
                <div className="col-xs-12 col-sm-4 col-md-3 xs-margin-top">
                  <label className="h4" htmlFor="squareMeters">Επιφάνεια κατοικίας</label>
                  <input
                    id="squareMeters"
                    className="form-control"
                    disabled={this.state.isLoading}
                    onChange={this.onSquareMetersChange}
                    placeholder={"Τετραγωνικά μέτρα"}
                    type="number"
                    value={this.state.squareMeters}
                  />
                </div>
                <div className="h4 col-xs-12 col-sm-4 col-md-4 xs-margin-top">
                  <br></br>
                  Προτεινόμενη νόμιμη αμοιβή για την έκδοση ΠΕΑ από Εξοικονομώ: <strong>{this.calculateProposedPriceEnergy(this.state.squareMeters)} ευρώ</strong> (χωρίς ΦΠΑ)
                </div>
              </div>
            ) : ( 
              null
            )
          }

          <div className="row">
            <div className="col-md-12">
              <Editor
                attachments={this.state.attachments}
                loading={this.state.isLoading}
                onAttachmentsChange={this.onAttachmentsChange}
                onCancel={this.onCancel}
                onChange={this.onPostChange}
                submitLabel={"Δημοσίευση αγγελίας"}
                value={this.state.post}
              />
            </div>
          </div>
        </form>
      </Container>
    )
  }
}
