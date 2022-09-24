import AxiosError from "../AxiosError/AxiosError";
import { useState, useEffect } from "react";
import { getShaclReport } from "src/utils/AxiosRequestsHandlers";
import ProgressBarContent from "../ProgressBar/ProgressBar";
import LoadingBlock from "../LoadingBlock/LoadingBlock";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../component.css';

const DatacrateContentStatistics = (datacrate_uuid) => {

  const [loading, setLoading] = useState(true);
  const [all_annotations, setAnnotations] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getShaclReport(datacrate_uuid)
      .then(res => {
        console.log(res.data)
        setAnnotations(res.data);
        setLoading(false);
      }
      )
      .catch(err => {
        console.log(err);
        setErrorMessage(err.response);
        setLoading(false);
        setError(true);
      }
      )
  }, [])

  if (loading) {
    return (
      LoadingBlock("Content Statistics")
    )
  }
  if(error) {
    return(AxiosError(errorMessage))
  }
  else{
    return (
      <div className="component">
        <div className="title">Content Statistics</div>
        <ProgressBarContent content={all_annotations.summary} />
        <br></br>
        <table className="table">
          <thead>
            <tr>
              <th style={{backgroundColor: "#5cb85c30"}}>Good</th>
              <th style={{backgroundColor: "#f0ad4e30"}}>Warning</th>
              <th style={{backgroundColor: "#d9534f30"}}>Need Annotations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{Math.ceil((all_annotations.shacl_requirements.length/100)*all_annotations.summary.green)} items</td>
              <td>{Math.ceil((all_annotations.shacl_requirements.length/100)*all_annotations.summary.orange)} items</td>
              <td>{Math.ceil((all_annotations.shacl_requirements.length/100)*all_annotations.summary.red)} items</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default DatacrateContentStatistics
