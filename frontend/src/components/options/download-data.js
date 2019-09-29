import React from "react"
import moment from "moment"
import Button from "misago/components/button"
import ajax from "misago/services/ajax"
import title from "misago/services/page-title"
import snackbar from "misago/services/snackbar"

export default class DownloadData extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      isSubmiting: false,
      downloads: []
    }
  }

  componentDidMount() {
    title.set({
      title: "Κατέβασμα των δεδομένων σου",
      parent: "Αλλαγή ρυθμίσεων"
    })

    this.handleLoadDownloads()
  }

  handleLoadDownloads = () => {
    ajax.get(this.props.user.api.data_downloads).then(
      data => {
        this.setState({
          isLoading: false,
          downloads: data
        })
      },
      rejection => {
        snackbar.apiError(rejection)
      }
    )
  }

  handleRequestDataDownload = () => {
    this.setState({ isSubmiting: true })
    ajax.post(this.props.user.api.request_data_download).then(
      () => {
        this.handleLoadDownloads()
        snackbar.success(
          "Η αίτηση σου για κατέβασμα των δεδομένων σου εστάλη επιτυχώς!"
        )
        this.setState({ isSubmiting: false })
      },
      rejection => {
        console.log(rejection)
        snackbar.apiError(rejection)
        this.setState({ isSubmiting: false })
      }
    )
  }

  render() {
    return (
      <div>
        <div className="panel panel-default panel-form">
          <div className="panel-heading">
            <h3 className="panel-title">{"Κατέβασμα των δεδομένων σου"}</h3>
          </div>
          <div className="panel-body">
            <p>
              {'Για να κατεβάσεις τα δεδομένα σου από αυτή τη σελίδα, κάνε κλικ στο "Αίτηση για κατέβασμα δεδομένων". Η επεξεργασία της αίτησης μπορεί να πάρει μέχρι και λίγες μέρες, ανάλογα το μέγεθος των αρχείων και τον αριθμό χρηστών που έχουν εκκρεμείς αιτήσεις. Όταν τα δεδομένα σου είναι έτοιμα για κατέβασμα, θα λάβεις ένα email ως ειδοποίηση.'}
            </p>

            <p>
              {"Θα είναι διαθέσιμα για κατέβασμα για περιορισμένο χρόνο."}
            </p>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>{"Αιτήθηκε"}</th>
                <th className="col-md-4">{"Κατέβασμα"}</th>
              </tr>
            </thead>
            <tbody>
              {this.state.downloads.map(item => {
                return (
                  <tr key={item.id}>
                    <td style={rowStyle}>
                      {moment(item.requested_on).fromNow()}
                    </td>
                    <td>
                      <DownloadButton
                        exportFile={item.file}
                        status={item.status}
                      />
                    </td>
                  </tr>
                )
              })}
              {this.state.downloads.length === 0 ? (
                <tr>
                  <td colSpan="2">{"Δεν έχεις αρχεία δεδομένων προς κατέβασμα"}</td>
                </tr>
              ) : null}
            </tbody>
          </table>
          <div className="panel-footer text-right">
            <Button
              className="btn-primary"
              loading={this.state.isSubmiting}
              type="button"
              onClick={this.handleRequestDataDownload}
            >
              {"Αίτηση για κατέβασμα δεδομένων"}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const rowStyle = {
  verticalAlign: "middle"
}

const STATUS_PENDING = 0
const STATUS_PROCESSING = 1

const DownloadButton = ({ exportFile, status }) => {
  if (status === STATUS_PENDING || status === STATUS_PROCESSING) {
    return (
      <Button
        className="btn-info btn-sm btn-block"
        disabled={true}
        type="button"
      >
        {"Η αίτηση για κατέβασμα είναι υπό επεξεργασία..."}
      </Button>
    )
  }

  if (exportFile) {
    return (
      <a className="btn btn-success btn-sm btn-block" href={exportFile}>
        {"Κατέβασμα των δεδομένων σου"}
      </a>
    )
  }

  return (
    <Button
      className="btn-default btn-sm btn-block"
      disabled={true}
      type="button"
    >
      {"Το αρχείο για κατέβασμα έχει λήξει..."}
    </Button>
  )
}
