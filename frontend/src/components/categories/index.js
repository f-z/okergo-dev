import moment from "moment"
import React from "react"
import Blankslate from "./blankslate"
import Button from "misago/components/button"
import CategoriesList from "./categories-list"
import misago from "misago/index"
import posting from "misago/services/posting"
import polls from "misago/services/polls"

const hydrate = function(category) {
  return Object.assign({}, category, {
    last_post_on: category.last_post_on ? moment(category.last_post_on) : null,
    subcategories: category.subcategories.map(hydrate)
  });
};

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: misago.get("CATEGORIES").map(hydrate),
      isBusy: false      
    };

    this.startPolling(misago.get("CATEGORIES_API"));
  }

  startThread = (e) => {
    let category = 3, submode = null
    if(e.target.textContent.includes("ΠΕΑ")) {
      category = 8
      submode = "ENERGY"
    }

    posting.open(
      this.props.startThread || {
        mode: "START",
        submode: submode,

        config: misago.get("THREAD_EDITOR_API"),
        submit: misago.get("THREADS_API"),

        category: category
      }
    )
  }

  getStartThreadButton() {    
    return (
      <Button
        className="btn-primary btn-outline"
        onClick={this.startThread}
        disabled={this.props.disabled}
      >
        <span className="material-icon">chat</span>
        {"Νέα αγγελία"}
      </Button>
    )
  }

  goToInstructions() {
    window.location = 'instructions'
  }

  getInstructionsButton() {
    return (
      <Button
        className="btn-primary btn-outline"
        onClick={this.goToInstructions}
        disabled={this.props.disabled}
      >
        <span className="material-icon">info</span>
        {"Οδηγίες"}
      </Button>
    )
  }

  getQuickEnergyPostButton() {
    return (
      <Button
        className="btn-primary btn-outline"
        onClick={this.startThread}
        disabled={this.props.disabled}
      >
        <span className="material-icon">info</span>
        {"Γρήγορη καταχώρηση ΠΕΑ"}
      </Button>
    )
  }

  startPolling(api) {
    polls.start({
      poll: "categories",
      url: api,
      frequency: 180 * 1000,
      update: this.update
    })
  }

  update = data => {
    this.setState({
      categories: data.map(hydrate)
    })
  }

  render() {
    const { categories } = this.state

    if (categories.length === 0) {
      return <Blankslate />
    }

    return (
      <div>
        <div className="row first-row">
          <div className="col-xs-12 col-sm-4 col-md-3 xs-margin-top">
            {this.getStartThreadButton()}
          </div>
          <div className="col-xs-12 col-sm-4 col-md-3 xs-margin-top">
            {this.getInstructionsButton()}
          </div>
          <div className="col-xs-12 col-sm-4 col-md-3 xs-margin-top">
            {this.getQuickEnergyPostButton()}
          </div>
        </div>
        <div className="page-header">
          <CategoriesList categories={categories} />
        </div>
      </div>
    )
  }
}

export function select(store) {
  return {
    tick: store.tick.tick
  }
}
