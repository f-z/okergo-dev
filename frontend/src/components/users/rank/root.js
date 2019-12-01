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
        label: "Όλοι",
        slug: "oles"
      },
      {
        value: "Αττικής",
        icon: "location_on",
        label: "Αττικής",
        slug: "attiki"
      }, {
        value: "Θεσσαλονίκης",
        icon: "location_on",
        label: "Θεσσαλονίκης",
        slug: "thessaloniki"
      }, {
        value: "Αχαΐας",
        icon: "location_on",
        label: "Αχαΐας",
        slug: "axaia"
      }, {
        value: "Ηρακλείου",
        icon: "location_on",
        label: "Ηρακλείου",
        slug: "irakleio"
      }, {
        value: "Λάρισας",
        icon: "location_on",
        label: "Λάρισας",
        slug: "larisa"
      }, {
        value: "Αιτωλοακαρνανίας",
        icon: "location_on",
        label: "Αιτωλοακαρνανίας",
        slug: "aitoloakarnania"
      }, {
        value: "Εύβοιας",
        icon: "location_on",
        label: "Εύβοιας",
        slug: "euvoia"
      }, {
        value: "Μαγνησίας",
        icon: "location_on",
        label: "Μαγνησίας",
        slug: "magnisia"
      }, {
        value: "Σερρών",
        icon: "location_on",
        label: "Σερρών",
        slug: "serres"
      }, {
        value: "Ηλείας",
        icon: "location_on",
        label: "Ηλείας",
        slug: "ileia"
      }, {
        value: "Δωδεκανήσου",
        icon: "location_on",
        label: "Δωδεκανήσου",
        slug: "dodekanisa"
      }, {
        value: "Φθιώτιδας",
        icon: "location_on",
        label: "Φθιώτιδας",
        slug: "fthiotida"
      }, {
        value: "Μεσσηνίας",
        icon: "location_on",
        label: "Μεσσηνίας",
        slug: "messinia"
      }, {
        value: "Ιωαννίνων",
        icon: "location_on",
        label: "Ιωαννίνων",
        slug: "ioannina"
      }, {
        value: "Κοζάνης",
        icon: "location_on",
        label: "Κοζάνης",
        slug: "kozani"
      }, {
        value: "Κορινθίας",
        icon: "location_on",
        label: "Κορινθίας",
        slug: "korinthia"
      }, {
        value: "Χανίων",
        icon: "location_on",
        label: "Χανίων",
        slug: "xania"
      }, {
        value: "Έβρου",
        icon: "location_on",
        label: "Έβρου",
        slug: "evros"
      }, {
        value: "Πέλλας",
        icon: "location_on",
        label: "Πέλλας",
        slug: "pella"
      }, {
        value: "Καβάλας",
        icon: "location_on",
        label: "Καβάλας",
        slug: "kavala"
      }, {
        value: "Ημαθίας",
        icon: "location_on",
        label: "Ημαθίας",
        slug: "imathia"
      }, {
        value: "Τρικάλων",
        icon: "location_on",
        label: "Τρικάλων",
        slug: "trikala"
      }, {
        value: "Βοιωτίας",
        icon: "location_on",
        label: "Βοιωτίας",
        slug: "voiotia"
      }, {
        value: "Πιερίας",
        icon: "location_on",
        label: "Πιερίας",
        slug: "pieria"
      }, {
        value: "Καρδίτσας",
        icon: "location_on",
        label: "Καρδίτσας",
        slug: "karditsa"
      }, {
        value: "Κυκλάδων",
        icon: "location_on",
        label: "Κυκλάδων",
        slug: "kiklades"
      }, {
        value: "Κέρκυρας",
        icon: "location_on",
        label: "Κέρκυρας",
        slug: "kerkira"
      }, {
        value: "Ροδόπης",
        icon: "location_on",
        label: "Ροδόπης",
        slug: "rodopi"
      }, {
        value: "Λέσβου",
        icon: "location_on",
        label: "Λέσβου",
        slug: "lesvos"
      }, {
        value: "Αργολίδας",
        icon: "location_on",
        label: "Αργολίδας",
        slug: "argolida"
      }, {
        value: "Χαλκιδικής",
        icon: "location_on",
        label: "Χαλκιδικής",
        slug: "xalkidiki"
      }, {
        value: "Δράμας",
        icon: "location_on",
        label: "Δράμας",
        slug: "drama"
      }, {
        value: "Αρκαδίας",
        icon: "location_on",
        label: "Αρκαδίας",
        slug: "arkadia"
      }, {
        value: "Ξάνθης",
        icon: "location_on",
        label: "Ξάνθης",
        slug: "ksanthi"
      }, {
        value: "Λακωνίας",
        icon: "location_on",
        label: "Λακωνίας",
        slug: "lakonia"
      }, {
        value: "Κιλκίς",
        icon: "location_on",
        label: "Κιλκίς",
        slug: "kilkis"
      }, {
        value: "Ρεθύμνου",
        icon: "location_on",
        label: "Ρεθύμνου",
        slug: "rethimno"
      }, {
        value: "Άρτας",
        icon: "location_on",
        label: "Άρτας",
        slug: "arta"
      }, {
        value: "Λασιθίου",
        icon: "location_on",
        label: "Λασιθίου",
        slug: "lasithi"
      }, {
        value: "Πρέβεζας",
        icon: "location_on",
        label: "Πρέβεζας",
        slug: "preveza"
      }, {
        value: "Φλώρινας",
        icon: "location_on",
        label: "Φλώρινας",
        slug: "florina"
      }, {
        value: "Καστοριάς",
        icon: "location_on",
        label: "Καστοριάς",
        slug: "kastoria"
      }, {
        value: "Χίου",
        icon: "location_on",
        label: "Χίου",
        slug: "xios"
      }, {
        value: "Φωκίδας",
        icon: "location_on",
        label: "Φωκίδας",
        slug: "fokida"
      }, {
        value: "Θεσπρωτίας",
        icon: "location_on",
        label: "Θεσπρωτίας",
        slug: "thesprotia"
      }, {
        value: "Σάμου",
        icon: "location_on",
        label: "Σάμου",
        slug: "samos"
      }, {
        value: "Κεφαλληνίας",
        icon: "location_on",
        label: "Κεφαλληνίας",
        slug: "kefallinia"
      }, {
        value: "Ζακύνθου",
        icon: "location_on",
        label: "Ζακύνθου",
        slug: "zakinthos"
      }, {
        value: "Γρεβενών",
        icon: "location_on",
        label: "Γρεβενών",
        slug: "grevena"
      }, {
        value: "Ευρυτανίας",
        icon: "location_on",
        label: "Ευρυτανίας",
        slug: "evritania"
      }, {
        value: "Λευκάδας",
        icon: "location_on",
        label: "Λευκάδας",
        slug: "lefkada"
      }
    ];

    this.REGION_CHOICES.sort((a, b) => a.label.localeCompare(b.label));

    this.ENGINEER_SPECIALIZATION_CHOICES = [
      {
        value: "Αγρονόμος Τοπογράφος Μηχανικός",
        icon: "grade",
        label: "Αγρονόμος Τοπογράφος Μηχανικός",
        slug:"topografos"
      },
      {
        value: "Αρχιτέκτων Μηχανικός",
        icon: "grade",
        label: "Αρχιτέκτων Μηχανικός",
        slug: "arxitektonas"
      },
      {
        value: "Ηλεκτρολόγος Μηχανικός",
        icon: "grade",
        label: "Ηλεκτρολόγος Μηχανικός",
        slug: "ilektrologos"
      },
      {
        value: "Ηλεκτρονικός Μηχανικός",
        icon: "grade",
        label: "Ηλεκτρονικός Μηχανικός",
        slug: "ilektronikos"
      },
      {
        value: "Μηχανολόγος Μηχανικός",
        icon: "grade",
        label: "Μηχανολόγος Μηχανικός",
        slug: "mixanologos"
      },
      {
        value: "Μηχανολόγος-Ηλεκτρολόγος Μηχανικός",
        icon: "grade",
        label: "Μηχανολόγος-Ηλεκτρολόγος Μηχανικός",
        slug: "mixanologos-ilektrologos"
      },
      {
        value: "Πολιτικός Μηχανικός",
        icon: "grade",
        label: "Πολιτικός Μηχανικός",
        slug: "politikos"
      },
      {
        value: "Ηλεκτρολόγος Μηχανικός Τ.Ε.",
        icon: "grade",
        label: "Ηλεκτρολόγος Μηχανικός Τ.Ε.",
        slug: "ilektrologos-te"
      },
      {
        value: "Ηλεκτρονικός Μηχανικός Τ.Ε.",
        icon: "grade",
        label: "Ηλεκτρονικός Μηχανικός Τ.Ε.",
        slug: "ilektronikos-te"
      },
      {
        value: "Μηχανικός Ανακαίνισης και Αποκατάστασης Κτιρίων Τ.Ε.",
        icon: "grade",
        label: "Μηχανικός Ανακαίνισης και Αποκατάστασης Κτιρίων Τ.Ε.",
        slug: "anakainisis-ktirion"
      },
      {
        value: "Μηχανικός Γεωπληροφορικής και Τοπογραφίας Τ.Ε.",
        icon: "grade",
        label: "Μηχανικός Γεωπληροφορικής και Τοπογραφίας Τ.Ε.",
        slug: "topografos-te"
      },
      {
        value: "Μηχανικός Περιβάλλοντος Τ.Ε.",
        icon: "grade",
        label: "Μηχανικός Περιβάλλοντος Τ.Ε.",
        slug: "perivallontos-te"
      },
      {
        value: "Μηχανικός Φυσικών Πόρων & Περιβάλλοντος Τ.Ε.",
        icon: "grade",
        label: "Μηχανικός Φυσικών Πόρων & Περιβάλλοντος Τ.Ε.",
        slug: "fisikon-poron"
      },
      {
        value: "Μηχανολόγος Μηχανικός Τ.Ε.",
        icon: "grade",
        label: "Μηχανολόγος Μηχανικός Τ.Ε.",
        slug: "mixanollogos-te"
      },
      {
        value: "Πολιτικός Μηχανικός Τ.Ε.",
        icon: "grade",
        label: "Πολιτικός Μηχανικός Τ.Ε.",
        slug: "politikos-domikon-ergon-te"
      },
      {
        value: "Τοπογράφος Μηχανικός Τ.Ε.",
        icon: "grade",
        label: "Τοπογράφος Μηχανικός Τ.Ε.",
        slug: "topografos-te"
      },
      {
        value: "Χημικός Μηχανικός",
        icon: "grade",
        label: "Χημικός Μηχανικός",
        slug: "ximikos-mixanikos"
      }
    ];

    if (this.ENGINEER_SPECIALIZATION_CHOICES.findIndex(element => element.value === 'Όλοι') === -1) {
      this.ENGINEER_SPECIALIZATION_CHOICES.push({
        value: "Όλοι",
        icon: "grade",
        label: "Όλοι",
        slug: "oles"
      });
    }

    this.ENGINEER_SPECIALIZATION_CHOICES.sort((a, b) => a.label.localeCompare(b.label));

    this.regionObject = this.REGION_CHOICES.find(obj => {
      return obj.slug === this.props.routeParams.region;
    });

    if (typeof this.regionObject === 'undefined') {
      this.regionObject = {
        value: "Όλοι",
        icon: "location_on",
        label: "Όλοι",
        slug: "oles"
      };
    }

    this.specializationObject = this.ENGINEER_SPECIALIZATION_CHOICES.find(obj => {
      return obj.slug === this.props.routeParams.specialization;
    });

    if (typeof this.specializationObject === 'undefined') {
      this.specializationObject = {
        value: "Όλοι",
        icon: "grade",
        label: "Όλοι",
        slug: "oles"
      };
    }

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
      region: this.regionObject.value,
      specialization: this.specializationObject.value
    });
    store.dispatch(hydrate(data.results));
  }

  initWithoutPreloadedData() {
    this.state = {
      isLoaded: false,
      region: "Όλοι",
      specialization: "Όλοι"
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
    data.region = this.regionObject.value
    data.specialization = this.specializationObject.value
    data.isLoaded = true
    this.setState(data)
  }

  componentDidMount() {
    title.set({
      parent: "Μηχανικοί",
      title: this.regionObject.label || this.props.route.rank.name,
      page: this.props.params.page || null
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
              if (this.state.specialization === "Όλοι") {
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
