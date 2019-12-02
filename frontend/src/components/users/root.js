import React from "react";
import { connect } from "react-redux";
import Nav from "misago/components/users/nav";
import ActivePosters from "misago/components/users/active-posters/root";
import Rank from "misago/components/users/rank/root";
import WithDropdown from "misago/components/with-dropdown";
import misago from "misago/index";

export default class extends WithDropdown {
  render() {
    return (
      <div className="page page-users-lists">
        <div className="page-header-bg">
          <div className="page-header">
            <div className="container">
              <h1>{"Αναζήτηση Μηχανικού"}</h1>
              <br></br>
              <p>
                <h3>
                  <a href={misago.get("USERS_LIST_URL").concat("mixanikoi/", "eidikotita/politikos")}>
                    Πολιτικοί μηχανικοί
                  </a>, 
                  <a href={misago.get("USERS_LIST_URL").concat("mixanikoi/", "eidikotita/mixanologos")}>
                    &nbsp;μηχανολόγοι
                  </a>, 
                  <a href={misago.get("USERS_LIST_URL").concat("mixanikoi/", "eidikotita/ilektrologos")}>
                    &nbsp;ηλεκτρολόγοι
                  </a>, 
                  <a href={misago.get("USERS_LIST_URL").concat("mixanikoi/", "eidikotita/arxitektonas")}>
                    &nbsp;αρχιτέκτονες
                  </a>, 
                  <a href={misago.get("USERS_LIST_URL").concat("mixanikoi/", "eidikotita/topografos")}>
                    &nbsp;τοπογράφοι
                  </a> και άλλες ειδικότητες.
                </h3>
              </p>
              <br></br>
              <p>
                <h3>
                  Βρες μηχανικούς στην
                    <a href={misago.get("USERS_LIST_URL").concat("mixanikoi/", "perioxi/attiki")}>
                      &nbsp;Αθήνα
                    </a>, στη
                    <a href={misago.get("USERS_LIST_URL").concat("mixanikoi/", "perioxi/thessaloniki")}>
                      &nbsp;Θεσσαλονίκη
                    </a>, στην
                    <a href={misago.get("USERS_LIST_URL").concat("mixanikoi/", "perioxi/axaia")}>
                      &nbsp;Πάτρα
                    </a>, στο
                    <a href={misago.get("USERS_LIST_URL").concat("mixanikoi/", "perioxi/irakleio")}>
                      &nbsp;Ηράκλειο
                    </a>, στη
                    <a href={misago.get("USERS_LIST_URL").concat("mixanikoi/", "perioxi/larisa")}>
                      &nbsp;Λάρισα
                    </a> και σε όλη την υπόλοιπη Ελλάδα.
                </h3>
              </p>
            </div>
            <div className="page-tabs">
              <div className="container">
                <Nav
                  lists={misago.get("USERS_LISTS")}
                  baseUrl={misago.get("USERS_LIST_URL")}
                />
              </div>
            </div>
          </div>
        </div>

        {this.props.children}
      </div>
    )
  }
}

export function select(store) {
  return {
    tick: store.tick.tick,
    user: store.auth.user,
    users: store.users
  }
}

export function paths() {
  let paths = []

  misago.get("USERS_LISTS").forEach(function(item) {
    if (item.component === "rank") {
      paths.push({
        path: misago.get("USERS_LIST_URL") + item.slug + "/:page/",
        component: connect(select)(Rank),
        rank: item
      })
      paths.push({
        path: misago.get("USERS_LIST_URL") + item.slug + "/",
        component: connect(select)(Rank),
        rank: item
      })
      paths.push({
        path: misago.get("USERS_LIST_URL") + item.slug + "/eidikotita/:specialization/",
        component: connect(select)(Rank),
        rank: item
      })
      paths.push({
        path: misago.get("USERS_LIST_URL") + item.slug + "/eidikotita/:specialization/:page/",
        component: connect(select)(Rank),
        rank: item
      })
      paths.push({
        path: misago.get("USERS_LIST_URL") + item.slug + "/eidikotita/:specialization/perioxi/:region/",
        component: connect(select)(Rank),
        rank: item
      })
      paths.push({
        path: misago.get("USERS_LIST_URL") + item.slug + "/eidikotita/:specialization/perioxi/:region/:page/",
        component: connect(select)(Rank),
        rank: item
      })
      paths.push({
        path: misago.get("USERS_LIST_URL") + item.slug + "/perioxi/:region/eidikotita/:specialization/",
        component: connect(select)(Rank),
        rank: item
      })
      paths.push({
        path: misago.get("USERS_LIST_URL") + item.slug + "/perioxi/:region/eidikotita/:specialization/:page/",
        component: connect(select)(Rank),
        rank: item
      })
      paths.push({
        path: misago.get("USERS_LIST_URL") + item.slug + "/perioxi/:region/",
        component: connect(select)(Rank),
        rank: item
      })
      paths.push({
        path: misago.get("USERS_LIST_URL") + item.slug + "/perioxi/:region/:page/",
        component: connect(select)(Rank),
        rank: item
      })
    } else if (item.component === "active-posters") {
      paths.push({
        path: misago.get("USERS_LIST_URL") + item.component + "/",
        component: connect(select)(ActivePosters),
        extra: {
          name: item.name
        }
      })
    }
  })

  return paths
}
