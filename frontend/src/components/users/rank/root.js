import React from "react";
import PageLead from "misago/components/page-lead";
import List from "misago/components/users/rank/list";
import ListLoading from "misago/components/users/rank/list-loading";
import misago from "misago/index";
import Form from "misago/components/form";
import FormGroup from "misago/components/form-group";
import Select from "misago/components/select";
import { hydrate } from "misago/reducers/users";
import polls from "misago/services/polls";
import store from "misago/services/store";
import title from "misago/services/page-title";

export default class extends Form {
  constructor(props) {
    super(props);

    this.REGION_CHOICES = [
      {
        value: "Όλοι",
        icon: "location_on",
        label: "Όλοι"
      },
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
    ];

    this.REGION_CHOICES.sort((a, b) => a.label.localeCompare(b.label));

    this.ENGINEER_SPECIALIZATION_CHOICES = [
      {
        value: "Όλες",
        icon: "location_on",
        label: "Όλες"
      },
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

    if (misago.has("USERS")) {
      this.initWithPreloadedData(misago.pop("USERS"));
    } else {
      this.initWithoutPreloadedData();
    }

    this.startPolling(props.params.page || 1);
  }

  initWithPreloadedData(data) {
    this.state = Object.assign(data, {
      isLoaded: true,
      region: "Όλοι",
      specialization: "Όλες"
    });
    store.dispatch(hydrate(data.results));
  }

  initWithoutPreloadedData() {
    this.state = {
      isLoaded: false,
      region: "Όλοι",
      specialization: "Όλες"
    };
  }

  startPolling(page) {
    polls.start({
      poll: "rank-users",
      url: misago.get("USERS_API"),
      data: {
        rank: this.props.route.rank.id,
        page: page
      },
      frequency: 90 * 1000,
      update: this.update
    });
  }

  update = data => {
    store.dispatch(hydrate(data.results))
    data.region = "Όλοι"
    data.specialization = "Όλες"
    data.isLoaded = true
    this.setState(data)
  }

  componentDidMount() {
    title.set({
      title: this.props.route.rank.name,
      page: this.props.params.page || null,
      parent: "Μηχανικοί"
    });
  }

  componentWillUnmount() {
    polls.stop("rank-users");
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.page !== nextProps.params.page) {
      title.set({
        title: this.props.route.rank.name,
        page: nextProps.params.page || null,
        parent: "Μηχανικοί"
      });

      this.setState({
        isLoaded: false
      });

      polls.stop("rank-users");
      this.startPolling(nextProps.params.page);
    }
  }

  getClassName() {
    if (this.props.route.rank.css_class) {
      return "rank-users-list rank-users-" + this.props.route.rank.css_class;
    } else {
      return "rank-users-list";
    }
  }

  getRankDescription() {
    if (this.props.route.rank.description) {
      return (
        <div className="rank-description">
          <PageLead copy={this.props.route.rank.description.html} />
        </div>
      )
    } else {
      return null
    }
  }

  getComponent() {
    if (this.state.isLoaded) {
      if (this.state.count > 0) {
        let baseUrl =
          misago.get("USERS_LIST_URL") + this.props.route.rank.slug + "/"

        return (
          <div>
            <div className="row first-row">
              <div className="col-xs-12 col-sm-4 col-md-3 xs-margin-top">
                <FormGroup
                  label={"Νομός"}
                  for="id_region"
                >
                  <Select
                    id="id_region"
                    disabled={!this.state.isLoaded}
                    onChange={this.bindInput("region")}
                    value={this.state.region}
                    choices={this.REGION_CHOICES}
                  />
                </FormGroup>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-3 xs-margin-top">
                <FormGroup
                  label={"Ειδικότητα"}
                  for="id_specialization"
                >
                  <Select
                    id="id_specialization"
                    disabled={!this.state.isLoaded}
                    onChange={this.bindInput("specialization")}
                    value={this.state.specialization}
                    choices={this.ENGINEER_SPECIALIZATION_CHOICES}
                  />
                </FormGroup>
              </div>
            </div>
            <br></br>
            <List baseUrl={baseUrl} users={this.props.users.filter(user => {
              let regionFilter = user.region === this.state.region
              if (this.state.region === "Όλοι") {
                regionFilter = true
              }
              let specializationFilter = user.specialization === this.state.specialization
              if (this.state.specialization === "Όλες") {
                specializationFilter = true
              }
              return regionFilter & specializationFilter;
              })} {...this.state} />
          </div>
        )
      } else {
        return (
          <p className="lead">
            {"Δεν υπάρχει κανένας χρήστης αυτού του είδους ακόμα..."}
          </p>
        )
      }
    } else {
      return <ListLoading />
    }
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <div className="container">
          {this.getRankDescription()}
          {this.getComponent()}
        </div>
      </div>
    )
  }
}
