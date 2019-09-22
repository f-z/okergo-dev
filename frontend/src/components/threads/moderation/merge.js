import React from "react"
import Button from "misago/components/button"
import Form from "misago/components/form"
import FormGroup from "misago/components/form-group"
import CategorySelect from "misago/components/category-select"
import Select from "misago/components/select"
import misago from "misago/index"
import { filterThreads } from "misago/reducers/threads"
import * as select from "misago/reducers/selection"
import ErrorsModal from "misago/components/threads/moderation/errors-list"
import MergeConflict from "misago/components/merge-conflict"
import ajax from "misago/services/ajax"
import modal from "misago/services/modal"
import snackbar from "misago/services/snackbar"
import store from "misago/services/store"
import * as validators from "misago/utils/validators"

export default class extends Form {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,

      title: "",
      category: null,
      weight: 0,
      is_hidden: 0,
      is_closed: false,

      validators: {
        title: [validators.required()]
      },

      errors: {}
    }

    this.acl = {}
    for (const i in props.user.acl.categories) {
      if (!props.user.acl.categories.hasOwnProperty(i)) {
        continue
      }

      const acl = props.user.acl.categories[i]
      this.acl[acl.id] = acl
    }

    this.categoryChoices = []
    props.categories.forEach(category => {
      if (category.level > 0) {
        const acl = this.acl[category.id]
        const disabled =
          !acl.can_start_threads ||
          (category.is_closed && !acl.can_close_threads)

        this.categoryChoices.push({
          value: category.id,
          disabled: disabled,
          level: category.level - 1,
          label: category.name
        })

        if (!disabled && !this.state.category) {
          this.state.category = category.id
        }
      }
    })

    this.isHiddenChoices = [
      {
        value: 0,
        icon: "visibility",
        label: "Όχι"
      },
      {
        value: 1,
        icon: "visibility_off",
        label: "Ναι"
      }
    ]

    this.isClosedChoices = [
      {
        value: false,
        icon: "lock_outline",
        label: "Όχι"
      },
      {
        value: true,
        icon: "lock",
        label: "Ναι"
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
    return ajax.post(misago.get("MERGE_THREADS_API"), this.getFormdata())
  }

  getFormdata = () => {
    return {
      threads: this.props.threads.map(thread => thread.id),
      title: this.state.title,
      category: this.state.category,
      weight: this.state.weight,
      is_hidden: this.state.is_hidden,
      is_closed: this.state.is_closed
    }
  }

  handleSuccess = apiResponse => {
    // unfreeze and remove merged threads
    this.props.threads.forEach(thread => {
      this.props.freezeThread(thread.id)
      this.props.deleteThread(thread)
    })

    // deselect all threads
    store.dispatch(select.none())

    // append merged thread, filter threads
    this.props.addThreads([apiResponse])
    store.dispatch(
      filterThreads(this.props.route.category, this.props.categoriesMap)
    )

    // hide modal
    modal.hide()
  }

  handleError = rejection => {
    if (rejection.status === 400) {
      if (rejection.best_answers || rejection.polls) {
        modal.show(
          <MergeConflict
            api={misago.get("MERGE_THREADS_API")}
            bestAnswers={rejection.best_answers}
            data={this.getFormdata()}
            polls={rejection.polls}
            onError={this.handleError}
            onSuccess={this.handleSuccess}
          />
        )
      } else {
        this.setState({
          errors: Object.assign({}, this.state.errors, rejection)
        })
        snackbar.error("Η φόρμα περιέχει λάθη!")
      }
    } else if (rejection.status === 403 && Array.isArray(rejection)) {
      modal.show(<ErrorsModal errors={rejection} />)
    } else if (rejection.best_answer) {
      snackbar.error(rejection.best_answer[0])
    } else if (rejection.poll) {
      snackbar.error(rejection.poll[0])
    } else {
      snackbar.apiError(rejection)
    }
  }

  onCategoryChange = ev => {
    const categoryId = ev.target.value
    const newState = {
      category: categoryId
    }

    if (this.acl[categoryId].can_pin_threads < newState.weight) {
      newState.weight = 0
    }

    if (!this.acl[categoryId].can_hide_threads) {
      newState.is_hidden = 0
    }

    if (!this.acl[categoryId].can_close_threads) {
      newState.is_closed = false
    }

    this.setState(newState)
  }

  getWeightChoices() {
    const choices = [
      {
        value: 0,
        icon: "remove",
        label: "Μη προωθημένο"
      },
      {
        value: 1,
        icon: "bookmark_border",
        label: "Προωθημένο σε αυτή την κατηγορία"
      }
    ]

    if (this.acl[this.state.category].can_pin_threads == 2) {
      choices.push({
        value: 2,
        icon: "bookmark",
        label: "Προωθημένο σε όλη τη σελίδα"
      })
    }

    return choices
  }

  renderWeightField() {
    if (this.acl[this.state.category].can_pin_threads) {
      return (
        <FormGroup label={"Προώθηση αγγελίας"} for="id_weight">
          <Select
            id="id_weight"
            onChange={this.bindInput("weight")}
            value={this.state.weight}
            choices={this.getWeightChoices()}
          />
        </FormGroup>
      )
    } else {
      return null
    }
  }

  renderHiddenField() {
    if (this.acl[this.state.category].can_hide_threads) {
      return (
        <FormGroup label={"Απόκρυψη αγγελίας"} for="id_is_hidden">
          <Select
            id="id_is_closed"
            onChange={this.bindInput("is_hidden")}
            value={this.state.is_hidden}
            choices={this.isHiddenChoices}
          />
        </FormGroup>
      )
    } else {
      return null
    }
  }

  renderClosedField() {
    if (this.acl[this.state.category].can_close_threads) {
      return (
        <FormGroup label={"Κλείσιμο αγγελίας"} for="id_is_closed">
          <Select
            id="id_is_closed"
            onChange={this.bindInput("is_closed")}
            value={this.state.is_closed}
            choices={this.isClosedChoices}
          />
        </FormGroup>
      )
    } else {
      return null
    }
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="modal-body">
          <FormGroup
            label={"Τίτλος Αγγελίας"}
            for="id_title"
            validation={this.state.errors.title}
          >
            <input
              id="id_title"
              className="form-control"
              type="text"
              onChange={this.bindInput("title")}
              value={this.state.title}
            />
          </FormGroup>
          <div className="clearfix" />

          <FormGroup
            label={"Κατηγορία"}
            for="id_category"
            validation={this.state.errors.category}
          >
            <CategorySelect
              id="id_category"
              onChange={this.onCategoryChange}
              value={this.state.category}
              choices={this.categoryChoices}
            />
          </FormGroup>
          <div className="clearfix" />

          {this.renderWeightField()}
          {this.renderHiddenField()}
          {this.renderClosedField()}
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
            {"Συγχώνευση αγγελιών"}
          </Button>
        </div>
      </form>
    )
  }

  renderCantMergeMessage() {
    return (
      <div className="modal-body">
        <div className="message-icon">
          <span className="material-icon">info_outline</span>
        </div>
        <div className="message-body">
          <p className="lead">
            {"Δεν μπορείς να μετακινήσεις τις αγγελίες, γιατί δεν υπάρχουν διαθέσιμες κατηγορίες."}
          </p>
          <p>
            {"Πρέπει να έχεις άδεια να δημιουργήσεις καινούριες αγγελίες σε μια κατηγορία για να μπορείς να συγχωνεύσεις αγγελίες εκεί."}
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
    )
  }

  getClassName() {
    if (!this.state.category) {
      return "modal-dialog modal-message"
    } else {
      return "modal-dialog"
    }
  }

  render() {
    return (
      <div className={this.getClassName()} role="document">
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
            <h4 className="modal-title">{"Συγχώνευση αγγελιών"}</h4>
          </div>
          {this.state.category
            ? this.renderForm()
            : this.renderCantMergeMessage()}
        </div>
      </div>
    )
  }
}
