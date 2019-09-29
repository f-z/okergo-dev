import React from "react"
import Form from "misago/components/edit-details"
import title from "misago/services/page-title"
import snackbar from "misago/services/snackbar"

export default class extends React.Component {
  componentDidMount() {
    title.set({
      title: "Αλλαγή ρυθμίσεων",
      parent: "Αλλαγή ρυθμίσεων"
    })
  }

  onSuccess = () => {
    snackbar.info("Οι ρυθμίσεις σου αποθηκεύτηκαν επιτυχώς!")
  }

  render() {
    return (
      <Form api={this.props.user.api.edit_details} onSuccess={this.onSuccess} />
    )
  }
}
